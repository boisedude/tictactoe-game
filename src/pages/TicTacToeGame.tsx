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
import { Confetti } from '@/components/Confetti'
import { useTicTacToeGame } from '@/hooks/useTicTacToeGame'
import { useLeaderboard } from '@/hooks/useLeaderboard'
import { useGameAudio } from '@/hooks/useGameAudio'
import { useCharacterSelection } from '@/hooks/useCharacterSelection'
import { useBentleyStats } from '@/hooks/useBentleyStats'
import { countThreats } from '@/lib/tictactoeRules'
import { CONFETTI_DURATION_MS } from '@/constants/gameConstants'
import { STORAGE_KEY_TUTORIAL_COMPLETED } from '@/lib/storageKeys'
import type { Difficulty } from '@/types/tictactoe.types'

export function TicTacToeGame() {
  const {
    gameState,
    isAnimating,
    handleCellClick,
    startNewGame,
    changeDifficulty,
    undoMove,
    canUndo,
    isLastPlaced,
    isWinningPosition,
  } = useTicTacToeGame()

  const { character, changeCharacter } = useCharacterSelection(gameState.difficulty)
  const { stats, recordWin, recordLoss, recordDraw, updatePlayerName, resetStats } = useLeaderboard()
  const { playMarkPlace, playVictory, playDefeat, playDraw, isMuted, toggleMute } = useGameAudio()
  const { recordBentleyWin, recordBentleyLoss, recordBentleyTie } = useBentleyStats()

  const [showVictoryDialog, setShowVictoryDialog] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  // Initialize tutorial completed state from localStorage (state value not used, but setter is)
  const [, setTutorialCompleted] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_TUTORIAL_COMPLETED) === 'true'
  })
  // Show tutorial on first visit (if not previously completed)
  const [showTutorial, setShowTutorial] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_TUTORIAL_COMPLETED) !== 'true'
  })
  const [prevStatus, setPrevStatus] = useState(gameState.status)
  const [showConfetti, setShowConfetti] = useState(false)
  const [confettiKey, setConfettiKey] = useState(0)
  const confettiTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Show confetti when player wins
  const isPlayerVictory = gameState.status === 'won' && gameState.winner === 1

  // Cleanup confetti timeout on unmount
  useEffect(() => {
    return () => {
      if (confettiTimeoutRef.current) {
        clearTimeout(confettiTimeoutRef.current)
      }
    }
  }, [])

  // Detect game end - setState in effect is intentional here as we're responding to game status changes
  useEffect(() => {
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
          }
        } else if (gameState.winner === 2) {
          // AI wins
          playDefeat()
          recordLoss()
          if (isAgainstBentley) {
            recordBentleyLoss(totalMoves)
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

      // Show confetti for player victory
      if (gameState.winner === 1) {
        setConfettiKey(prev => prev + 1)
        setShowConfetti(true)
        // Clear any existing timeout before setting a new one
        if (confettiTimeoutRef.current) {
          clearTimeout(confettiTimeoutRef.current)
        }
        confettiTimeoutRef.current = setTimeout(() => setShowConfetti(false), CONFETTI_DURATION_MS)
      }
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

  const handleDifficultyChange = useCallback(
    (difficulty: Difficulty) => {
      changeDifficulty(difficulty)
      changeCharacter(difficulty)
    },
    [changeDifficulty, changeCharacter]
  )

  const handleTutorialComplete = useCallback(() => {
    setTutorialCompleted(true)
    localStorage.setItem(STORAGE_KEY_TUTORIAL_COMPLETED, 'true')
  }, [])

  const handleShowTutorial = useCallback(() => {
    setShowTutorial(true)
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-gradient-to-br from-blue-50 to-indigo-100 p-2 sm:p-4 sm:justify-center">
      {/* Skip to main content link for keyboard users */}
      <a
        href="#game-board"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-gray-800 focus:shadow-lg focus:ring-2 focus:ring-blue-500"
      >
        Skip to game board
      </a>
      {/* Return to Arcade Button */}
      <div className="w-full max-w-md mb-3 sm:mb-4">
        <a href="https://www.mcooper.com/arcade/" className="block">
          <button
            className="w-full sm:w-auto h-10 sm:h-11 px-4 text-sm sm:text-base font-semibold border-2 border-gray-300 rounded-lg bg-white hover:bg-blue-50 hover:border-blue-400 transition-colors"
          >
            ← Return to Arcade
          </button>
        </a>
      </div>

      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="mb-2 text-4xl font-bold text-gray-800">Tic-Tac-Toe</h1>
        <p className="text-lg text-gray-700">Challenge {character.name} {character.emoji}</p>
      </div>

      {/* Character Info */}
      <div className="mb-6 flex items-center gap-4 rounded-xl bg-white p-4 shadow-lg hover:shadow-xl transition-shadow">
        <img
          src={character.avatar}
          alt={character.name}
          className="h-16 w-16 rounded-full border-2 border-blue-300 object-cover"
          onError={(e) => {
            e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%23ddd"/></svg>'
          }}
        />
        <div>
          <h3 className="text-xl font-bold text-gray-800">
            {character.name}
          </h3>
          <p className="text-sm text-gray-700">{character.playingStyle}</p>
        </div>
      </div>

      {/* Audio Toggle */}
      <button
        onClick={toggleMute}
        className="mb-4 flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow hover:bg-gray-50 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
        aria-label={isMuted ? 'Unmute sound effects' : 'Mute sound effects'}
      >
        {isMuted ? (
          <>
            <span>&#128263;</span> Sound Off
          </>
        ) : (
          <>
            <span>&#128266;</span> Sound On
          </>
        )}
      </button>

      {/* Game Status - Screen Reader Announcement */}
      <div aria-live="polite" className="sr-only">
        {gameState.status === 'playing' && (
          gameState.currentPlayer === 1
            ? "Your turn"
            : `${character.name}'s turn`
        )}
        {gameState.status === 'won' && gameState.winner === 1 && "You win!"}
        {gameState.status === 'won' && gameState.winner === 2 && `${character.name} wins!`}
        {gameState.status === 'draw' && "It's a draw!"}
      </div>

      {/* Board */}
      <div id="game-board" className="mb-8">
        <Board
          board={gameState.board}
          onCellClick={handleCellClick}
          isLastPlaced={isLastPlaced}
          isWinningPosition={isWinningPosition}
          disabled={isAnimating || gameState.status !== 'playing' || gameState.currentPlayer !== 1}
          winningLine={gameState.winningLine}
          isVictory={isPlayerVictory}
        />
      </div>

      {/* Victory Confetti */}
      <Confetti isActive={showConfetti} particleCount={60} animationKey={confettiKey} />

      {/* Game Controls */}
      <GameControls
        difficulty={gameState.difficulty}
        onDifficultyChange={handleDifficultyChange}
        onNewGame={handleNewGame}
        onShowLeaderboard={() => setShowLeaderboard(true)}
        onShowTutorial={handleShowTutorial}
        onUndo={undoMove}
        canUndo={canUndo}
        gameMode={gameState.mode}
        currentPlayer={gameState.currentPlayer}
        character={character}
        disabled={isAnimating}
      />

      {/* Victory Dialog */}
      {showVictoryDialog && (
        <VictoryDialog
          open={showVictoryDialog}
          winner={gameState.winner}
          character={character}
          onPlayAgain={handleNewGame}
          onClose={() => setShowVictoryDialog(false)}
        />
      )}

      {/* Leaderboard Dialog */}
      {showLeaderboard && (
        <LeaderboardDialog
          open={showLeaderboard}
          stats={stats}
          onClose={() => setShowLeaderboard(false)}
          onUpdatePlayerName={updatePlayerName}
          onResetStats={resetStats}
        />
      )}

      {/* Tutorial Dialog */}
      {showTutorial && (
        <Tutorial
          open={showTutorial}
          onClose={() => setShowTutorial(false)}
          onComplete={handleTutorialComplete}
        />
      )}

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-600">
        <p>
          Designed by{' '}
          <a
            href="https://www.mcooper.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            M. Cooper
          </a>
        </p>
      </div>
    </div>
  )
}
