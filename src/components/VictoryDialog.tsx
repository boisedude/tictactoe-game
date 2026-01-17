/**
 * Victory Dialog Component
 * Shows game result with Tic-Tac-Toe themed personality messages
 */

import { useState, useEffect } from 'react'
import type React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Button } from './ui/button'
import type { Player } from '@/types/tictactoe.types'
import type { Character } from '@shared/characters'

interface VictoryDialogProps {
  open: boolean
  winner: Player | null
  onPlayAgain: () => void
  onClose: () => void
  character: Character
}

export function VictoryDialog({
  open,
  winner,
  onPlayAgain,
  onClose,
  character,
}: VictoryDialogProps) {
  const isDraw = winner === null
  const [victoryMessage, setVictoryMessage] = useState('')

  // Select random message when dialog opens (in effect to comply with React 19 purity rules)
  // Math.random() must be called in effect, not during render, to maintain purity
  // setState in effect is intentional here - we're responding to dialog opening
  useEffect(() => {
    if (open) {
      if (isDraw) {
        const drawMessages = [
          `A tie! ${character.name} couldn't beat you, but you couldn't beat them either!`,
          'Perfect play from both sides - nobody wins!',
          `${character.name} matched your every move. Try again!`,
          "Cat's game! Neither X nor O takes the day!",
          'A draw! Great minds think alike!',
        ]
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setVictoryMessage(drawMessages[Math.floor(Math.random() * drawMessages.length)])
      } else if (winner === 1) {
        // Player won - use character's playerWins catchphrases
        const messages = character.catchphrases.playerWins
         
        setVictoryMessage(messages[Math.floor(Math.random() * messages.length)])
      } else {
        // Character won - use character's characterWins catchphrases
        const messages = character.catchphrases.characterWins
         
        setVictoryMessage(messages[Math.floor(Math.random() * messages.length)])
      }
    }
  }, [open, isDraw, winner, character])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            {isDraw ? 'Draw!' : winner === 1 ? `You Beat ${character.name}!` : `${character.name} Wins!`}
          </DialogTitle>
          <DialogDescription className="text-center text-base">{victoryMessage}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          {/* Character Avatar */}
          <div className="flex items-center justify-center py-2">
            {winner === 1 ? (
              <img
                src={character.loseImage}
                alt={`${character.name} loses`}
                className="max-h-40 w-auto object-contain"
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.src = character.avatar
                }}
              />
            ) : winner === 2 ? (
              <img
                src={character.winImage}
                alt={`${character.name} wins`}
                className="max-h-40 w-auto object-contain"
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.src = character.avatar
                }}
              />
            ) : (
              <img
                src={character.playAgainImage}
                alt={`${character.name}`}
                className="max-h-40 w-auto object-contain"
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.src = character.avatar
                }}
              />
            )}
          </div>

          {/* Visual Result Representation */}
          <div className="flex items-center justify-center gap-6 py-4">
            {winner === 1 ? (
              <>
                <div className="relative">
                  <div className="h-20 w-20 rounded-xl bg-blue-100 flex items-center justify-center shadow-lg ring-4 ring-yellow-400 animate-pulse">
                    <span className="text-5xl font-bold text-blue-500">X</span>
                  </div>
                  <div className="absolute -right-2 -top-2 text-3xl">&#128081;</div>
                </div>
                <div className="text-4xl">&#127942;</div>
              </>
            ) : winner === 2 ? (
              <>
                <div className="text-4xl opacity-50">&#128532;</div>
                <div className="relative">
                  <div className="h-20 w-20 rounded-xl bg-red-100 flex items-center justify-center shadow-lg ring-4 ring-yellow-400 animate-pulse">
                    <span className="text-5xl font-bold text-red-500">O</span>
                  </div>
                  <div className="absolute -right-2 -top-2 text-3xl">&#128081;</div>
                </div>
              </>
            ) : (
              <>
                <div className="h-16 w-16 rounded-xl bg-blue-100 flex items-center justify-center shadow-lg">
                  <span className="text-4xl font-bold text-blue-500">X</span>
                </div>
                <div className="text-3xl">&#129309;</div>
                <div className="h-16 w-16 rounded-xl bg-red-100 flex items-center justify-center shadow-lg">
                  <span className="text-4xl font-bold text-red-500">O</span>
                </div>
              </>
            )}
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button onClick={onPlayAgain} className="w-full sm:w-auto" aria-label="Start a new game">
            Play Again
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full sm:w-auto"
            aria-label="Close victory dialog"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
