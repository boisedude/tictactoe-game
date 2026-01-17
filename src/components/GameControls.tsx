/**
 * Game Controls Component
 * Controls for difficulty selection, new game, leaderboard, etc.
 */

import { Button } from './ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import type { Difficulty, GameMode } from '@/types/tictactoe.types'
import type { Character } from '@shared/characters'

interface GameControlsProps {
  difficulty: Difficulty
  onDifficultyChange: (difficulty: Difficulty) => void
  onNewGame: () => void
  onShowLeaderboard: () => void
  disabled?: boolean
  gameMode: GameMode
  currentPlayer: 1 | 2
  character: Character
}

export function GameControls({
  difficulty,
  onDifficultyChange,
  onNewGame,
  onShowLeaderboard,
  disabled = false,
  gameMode,
  currentPlayer,
  character,
}: GameControlsProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Top Row: Difficulty and Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        {gameMode === 'pvc' && (
          <div className="flex items-center gap-2">
            <label htmlFor="difficulty" className="text-sm font-medium text-gray-700">
              Opponent:
            </label>
            <Select
              value={difficulty}
              onValueChange={(value) => onDifficultyChange(value as Difficulty)}
            >
              <SelectTrigger id="difficulty" className="w-52">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Bella - Playful Pup</SelectItem>
                <SelectItem value="medium">Coop - Casual Challenger</SelectItem>
                <SelectItem value="hard">Bentley - The Mastermind</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <Button
          onClick={onNewGame}
          disabled={disabled}
          variant="default"
          aria-label="Start a new game"
        >
          New Game
        </Button>

        <Button
          onClick={onShowLeaderboard}
          disabled={disabled}
          variant="outline"
          aria-label="View game statistics"
        >
          Stats
        </Button>
      </div>

      {/* Bottom Row: Turn Indicator */}
      <div className="flex flex-wrap items-center justify-center gap-6">
        {/* Turn Indicator */}
        <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-2 shadow">
          <span className="text-sm font-medium text-gray-700">
            {currentPlayer === 1 ? 'Your Turn' : `${character.name}'s Turn`}
          </span>
          <div
            className={`h-8 w-8 rounded-md flex items-center justify-center transition-all ${
              currentPlayer === 1
                ? 'bg-blue-100 text-blue-500 ring-2 ring-blue-300'
                : 'bg-red-100 text-red-500 ring-2 ring-red-300'
            }`}
          >
            <span className="text-lg font-bold">{currentPlayer === 1 ? 'X' : 'O'}</span>
          </div>
        </div>

        {/* Player Legend */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded flex items-center justify-center bg-blue-100 text-blue-500">
              <span className="text-xs font-bold">X</span>
            </div>
            <span className="text-gray-600">You</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded flex items-center justify-center bg-red-100 text-red-500">
              <span className="text-xs font-bold">O</span>
            </div>
            <span className="text-gray-600">{character.name}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
