/**
 * Victory Dialog Component
 * Character art, a one-line result, one catchphrase, and the session record
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
import type { LeaderboardEntry, Player } from '@/types/tictactoe.types'
import type { Character } from '@shared/characters'

interface VictoryDialogProps {
  open: boolean
  winner: Player | null
  onPlayAgain: () => void
  onClose: () => void
  character: Character
  stats: LeaderboardEntry
}

const DRAW_LINES = [
  'A tie. Nobody gets the last word.',
  'Nobody wins this one. Try again?',
  'Dead even. One more?',
]

export function VictoryDialog({
  open,
  winner,
  onPlayAgain,
  onClose,
  character,
  stats,
}: VictoryDialogProps) {
  const isDraw = winner === null
  const [catchphrase, setCatchphrase] = useState('')

  // Math.random() runs in an effect, not during render, to keep render pure
  useEffect(() => {
    if (!open) return
    const lines = isDraw
      ? DRAW_LINES
      : winner === 1
        ? character.catchphrases.playerWins
        : character.catchphrases.characterWins
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCatchphrase(lines[Math.floor(Math.random() * lines.length)])
  }, [open, isDraw, winner, character])

  const art = winner === 1 ? character.loseImage : winner === 2 ? character.winImage : character.playAgainImage

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm" hideClose>
        <DialogHeader className="items-center text-center sm:text-center">
          <img
            src={art}
            alt={character.name}
            className="mb-2 max-h-44 w-auto object-contain"
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              e.currentTarget.src = character.avatar
            }}
          />
          <DialogTitle className="text-xl">
            {isDraw ? 'Draw' : winner === 1 ? `You beat ${character.name}` : `${character.name} won`}
          </DialogTitle>
          <DialogDescription>{catchphrase}</DialogDescription>
        </DialogHeader>

        <p className="text-center text-sm text-muted-foreground">
          {stats.wins} {stats.wins === 1 ? 'win' : 'wins'}, {stats.losses}{' '}
          {stats.losses === 1 ? 'loss' : 'losses'}, {stats.draws} {stats.draws === 1 ? 'draw' : 'draws'}
        </p>

        <DialogFooter className="gap-2 sm:justify-center sm:space-x-0">
          <Button onClick={onPlayAgain} className="h-11">
            Play again
          </Button>
          <Button onClick={onClose} variant="ghost" className="h-11">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
