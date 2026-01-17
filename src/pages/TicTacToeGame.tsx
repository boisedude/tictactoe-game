/**
 * Tic-Tac-Toe Game Page
 * Main game interface for Tic-Tac-Toe
 */

import { useState, useEffect, useCallback } from 'react'
import { Board } from '@/components/Board'
import { GameControls } from '@/components/GameControls'
import { VictoryDialog } from '@/components/VictoryDialog'
import { LeaderboardDialog } from '@/components/LeaderboardDialog'
import { useTicTacToeGame } from '@/hooks/useTicTacToeGame'
import { useLeaderboard } from '@/hooks/useLeaderboard'
import { useGameAudio } from '@/hooks/useGameAudio'
import { useCharacterSelection } from '@/hooks/useCharacterSelection'
import { useBentleyStats } from '@/hooks/useBentleyStats'
import { countThreats } from '@/lib/tictactoeRules'
import type { Difficulty } from '@/types/tictactoe.types'

export function TicTacToeGame() {
  const {
    gameState,
    isAnimating,
    handleCellClick,
    startNewGame,
    changeDifficulty,
    isLastPlaced,
    isWinningPosition,
  } = useTicTacToeGame()

  const { character, changeCharacter } = useCharacterSelection(gameState.difficulty)
  const { stats, recordWin, recordLoss, recordDraw, updatePlayerName, resetStats } = useLeaderboard()
  const { playMarkPlace, playVictory, playDefeat, playDraw, isMuted, toggleMute } = useGameAudio()
  const { recordBentleyWin, recordBentleyLoss, recordBentleyTie } = useBentleyStats()

  const [showVictoryDialog, setShowVictoryDialog] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [prevStatus, setPrevStatus] = useState(gameState.status)

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

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="mb-2 text-4xl font-bold text-gray-800">Tic-Tac-Toe</h1>
        <p className="text-lg text-gray-600">Challenge {character.name} {character.emoji}</p>
      </div>

      {/* Character Info */}
      <div className="mb-6 flex items-center gap-4 rounded-xl bg-white p-4 shadow-lg">
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
          <p className="text-sm text-gray-600">{character.playingStyle}</p>
        </div>
      </div>

      {/* Audio Toggle */}
      <button
        onClick={toggleMute}
        className="mb-4 flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow hover:bg-gray-50 transition-colors"
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
      <div className="mb-8">
        <Board
          board={gameState.board}
          onCellClick={handleCellClick}
          isLastPlaced={isLastPlaced}
          isWinningPosition={isWinningPosition}
          disabled={isAnimating || gameState.status !== 'playing' || gameState.currentPlayer !== 1}
        />
      </div>

      {/* Game Controls */}
      <GameControls
        difficulty={gameState.difficulty}
        onDifficultyChange={handleDifficultyChange}
        onNewGame={handleNewGame}
        onShowLeaderboard={() => setShowLeaderboard(true)}
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

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
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
