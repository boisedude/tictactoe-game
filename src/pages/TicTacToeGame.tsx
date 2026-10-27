/**
 * Tic-Tac-Toe Game Page
 * Main game interface for Tic-Tac-Toe
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { Board } from '@/components/Board'
import { GameControls } from '@/components/GameControls'
import { VictoryDialog } from '@/components/VictoryDialog'
import { LeaderboardDialog } from '@/components/LeaderboardDialog'
import { Tutorial } from '@/components/Tutorial'
import { OpponentChip } from '@/components/OpponentChip'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { getCharacterById } from '@shared/characters'
import { useTicTacToeGame } from '@/hooks/useTicTacToeGame'
import { useLeaderboard } from '@/hooks/useLeaderboard'
import { useGameAudio } from '@/hooks/useGameAudio'
import { useCharacterSelection, getInitialDifficulty, hasCharacterParam } from '@/hooks/useCharacterSelection'
import { useBentleyStats } from '@/hooks/useBentleyStats'
import { recordPlayerBeatBentley, recordBentleyBeatPlayer } from '@shared/arcadeRecord'
import { countThreats } from '@/lib/tictactoeRules'
import { ArrowLeftIcon, VolumeIcon, VolumeOffIcon, HelpIcon } from '@shared/icons'
import { STORAGE_KEY_TUTORIAL_COMPLETED } from '@/lib/storageKeys'
import type { Difficulty } from '@/types/tictactoe.types'

const DIFFICULTY_TO_ID = { easy: 'bella', medium: 'coop', hard: 'bentley' } as const

export function TicTacToeGame() {
  const {
    gameState,
    isAnimating,
    handleCellClick,
    startNewGame,
    undoMove,
    canUndo,
    isLastPlaced,
    isWinningPosition,
  } = useTicTacToeGame(getInitialDifficulty())

  const { character, changeCharacter } = useCharacterSelection(gameState.difficulty)
  const { stats, recordWin, recordLoss, recordDraw, updatePlayerName, resetStats } = useLeaderboard()
  const { playMarkPlace, playVictory, playDefeat, playDraw, isMuted, toggleMute } = useGameAudio()
  const { recordBentleyWin, recordBentleyLoss, recordBentleyTie } = useBentleyStats()

  const [showVictoryDialog, setShowVictoryDialog] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  // Initialize tutorial completed state from localStorage (state value not used, but setter is)
  const [, setTutorialCompleted] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_TUTORIAL_COMPLETED) === 'true'
    } catch {
      return false
    }
  })
  // Show tutorial only on the first visit, and never when arriving from the arcade with ?character=
  const [showTutorial, setShowTutorial] = useState(() => {
    if (hasCharacterParam()) return false
    try {
      return localStorage.getItem(STORAGE_KEY_TUTORIAL_COMPLETED) !== 'true'
    } catch {
      return false
    }
  })
  // Guards the arcade record so a finished game posts exactly once
  const recordedRef = useRef(false)
  const [prevStatus, setPrevStatus] = useState(gameState.status)
  // Detect game end - setState in effect is intentional here as we're responding to game status changes
  useEffect(() => {
    if (gameState.status === 'playing') {
      recordedRef.current = false
    }
    if (prevStatus === 'playing' && gameState.status !== 'playing') {
      const totalMoves = gameState.moveHistory.length
      const isAgainstBentley = gameState.difficulty === 'hard'

      // Check if it was a perfect game (AI never had 2 in a row)
      const isPerfect = countThreats(gameState.board, 2) === 0

      if (gameState.status === 'won') {
        if (gameState.winner === 1) {
          // Player wins
          playVictory()
          recordWin(totalMoves, isPerfect)
          if (isAgainstBentley) {
            recordBentleyWin(totalMoves)
            if (!recordedRef.current) {
              recordedRef.current = true
              void recordPlayerBeatBentley()
            }
          }
        } else if (gameState.winner === 2) {
          // AI wins
          playDefeat()
          recordLoss()
          if (isAgainstBentley) {
            recordBentleyLoss(totalMoves)
            if (!recordedRef.current) {
              recordedRef.current = true
              void recordBentleyBeatPlayer()
            }
          }
        }
      } else if (gameState.status === 'draw') {
        playDraw()
        recordDraw()
        if (isAgainstBentley) {
          recordBentleyTie(totalMoves)
        }
      }

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowVictoryDialog(true)
    }

     
    setPrevStatus(gameState.status)
  }, [
    gameState.status,
    gameState.winner,
    gameState.moveHistory.length,
    gameState.board,
    gameState.difficulty,
    prevStatus,
    playVictory,
    playDefeat,
    playDraw,
    recordWin,
    recordLoss,
    recordDraw,
    recordBentleyWin,
    recordBentleyLoss,
    recordBentleyTie,
  ])

  // Play sound when moves are made
  useEffect(() => {
    if (gameState.lastMove) {
      playMarkPlace()
    }
  }, [gameState.lastMove, playMarkPlace])

  // Keyboard shortcut for undo (U key)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger if typing in an input field
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      // Handle 'U' key for undo
      if ((event.key === 'u' || event.key === 'U') && canUndo) {
        event.preventDefault()
        undoMove()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [canUndo, undoMove])

  const handleNewGame = useCallback(() => {
    setShowVictoryDialog(false)
    startNewGame()
  }, [startNewGame])

  // Changing opponent always starts a fresh game, so a game cannot be
  // finished against a different opponent than it began with.
  const [pendingDifficulty, setPendingDifficulty] = useState<Difficulty | null>(null)
  const switchOpponent = useCallback(
    (difficulty: Difficulty) => {
      setShowVictoryDialog(false)
      changeCharacter(difficulty)
      startNewGame(difficulty)
    },
    [changeCharacter, startNewGame]
  )
  const gameInProgress = gameState.status === 'playing' && gameState.moveHistory.length > 0
  const handleDifficultyChange = useCallback(
    (difficulty: Difficulty) => {
      if (difficulty === gameState.difficulty) return
      if (gameInProgress) {
        setPendingDifficulty(difficulty)
        return
      }
      switchOpponent(difficulty)
    },
    [gameState.difficulty, gameInProgress, switchOpponent]
  )

  const handleTutorialComplete = useCallback(() => {
    setTutorialCompleted(true)
    try {
      localStorage.setItem(STORAGE_KEY_TUTORIAL_COMPLETED, 'true')
    } catch {
      // storage unavailable; the tutorial may show again next visit
    }
  }, [])

  const handleShowTutorial = useCallback(() => {
    setShowTutorial(true)
  }, [])

  const opponent = character.name
  const turnText =
    gameState.status === 'won'
      ? gameState.winner === 1
        ? 'You won'
        : `${opponent} won`
      : gameState.status === 'draw'
        ? 'Draw'
        : gameState.currentPlayer === 1
          ? 'Your turn'
          : `${opponent} is thinking`
  const turnActive =
    gameState.status !== 'playing' ? 'over' : gameState.currentPlayer === 1 ? 'you' : 'opponent'

  return (
    <div className="arcade-page">
      <a
        href="#game-board"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:text-foreground"
      >
        Skip to game board
      </a>

      <header className="arcade-topbar">
        <div className="flex flex-1 items-center">
          <a
            href="https://www.mcooper.com/arcade/"
            className="inline-flex min-h-11 items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeftIcon size={18} />
            Arcade
          </a>
        </div>
        <h1 className="arcade-display sr-only text-xl sm:not-sr-only">Tic-tac-toe</h1>
        <div className="flex flex-1 items-center justify-end gap-1">
          <OpponentChip
            character={character}
            difficulty={gameState.difficulty}
            onDifficultyChange={handleDifficultyChange}
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11 shrink-0"
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute sound effects' : 'Mute sound effects'}
          >
            {isMuted ? <VolumeOffIcon /> : <VolumeIcon />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11 shrink-0"
            onClick={handleShowTutorial}
            aria-label="How to play"
          >
            <HelpIcon />
          </Button>
        </div>
      </header>

      <main className="arcade-stage">
        <div className="arcade-score" aria-live="polite">
          <div>
            <strong>{stats.wins}</strong>
            You
          </div>
          <div className="arcade-turn" data-active={turnActive}>
            {turnText}
          </div>
          <div>
            <strong>{stats.losses}</strong>
            {opponent}
          </div>
        </div>

        <div id="game-board" className="flex w-full justify-center">
          <Board
            board={gameState.board}
            onCellClick={handleCellClick}
            isLastPlaced={isLastPlaced}
            isWinningPosition={isWinningPosition}
            disabled={isAnimating || gameState.status !== 'playing' || gameState.currentPlayer !== 1}
            winningLine={gameState.winningLine}
          />
        </div>

        <GameControls
          onNewGame={handleNewGame}
          onShowLeaderboard={() => setShowLeaderboard(true)}
          onShowTutorial={handleShowTutorial}
          onUndo={undoMove}
          canUndo={canUndo}
          disabled={isAnimating}
        />
      </main>

      {pendingDifficulty && (
        <Dialog open onOpenChange={(o) => !o && setPendingDifficulty(null)}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>
                Play {getCharacterById(DIFFICULTY_TO_ID[pendingDifficulty]).name} instead?
              </DialogTitle>
              <DialogDescription>
                This ends the current game and starts a new one. It will not count toward any record.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:justify-end">
              <Button
                className="h-11"
                onClick={() => {
                  const d = pendingDifficulty
                  setPendingDifficulty(null)
                  switchOpponent(d)
                }}
              >
                New game
              </Button>
              <Button className="h-11" variant="ghost" onClick={() => setPendingDifficulty(null)}>
                Keep playing
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {showVictoryDialog && (
        <VictoryDialog
          open={showVictoryDialog}
          winner={gameState.winner}
          character={character}
          stats={stats}
          onPlayAgain={handleNewGame}
          onClose={() => setShowVictoryDialog(false)}
        />
      )}

      {showLeaderboard && (
        <LeaderboardDialog
          open={showLeaderboard}
          stats={stats}
          onClose={() => setShowLeaderboard(false)}
          onUpdatePlayerName={updatePlayerName}
          onResetStats={resetStats}
        />
      )}

      {showTutorial && (
        <Tutorial
          open={showTutorial}
          opponentName={opponent}
          onClose={() => setShowTutorial(false)}
          onComplete={handleTutorialComplete}
        />
      )}
    </div>
  )
}
