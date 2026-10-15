/**
 * Tic-Tac-Toe Cell Component
 * A matte card-coloured square with a hairline border
 */

import { memo } from 'react'
import type { CellValue } from '@/types/tictactoe.types'
import { XMark } from './XMark'
import { OMark } from './OMark'
import { cn } from '@/lib/utils'

interface CellProps {
  row: number
  col: number
  value: CellValue
  onClick: (row: number, col: number) => void
  isLastPlaced: boolean
  isWinning: boolean
  disabled?: boolean
}

export const Cell = memo(function Cell({
  row,
  col,
  value,
  onClick,
  isLastPlaced,
  isWinning,
  disabled = false,
}: CellProps) {
  const handleClick = () => {
    if (!disabled && value === null) {
      onClick(row, col)
    }
  }

  // Accessible label for the cell
  const colLetter = String.fromCharCode(65 + col) // A, B, C
  const rowNumber = row + 1 // 1, 2, 3
  const cellState = value === null ? 'empty' : value === 1 ? 'X' : 'O'
  const ariaLabel = `Cell ${colLetter}${rowNumber}, ${cellState}${isLastPlaced ? ', last move' : ''}${isWinning ? ', winning position' : ''}`

  const canInteract = !disabled && value === null

  return (
    <button
      type="button"
      className={cn(
        'flex aspect-square w-full items-center justify-center rounded-md border bg-card p-[18%]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        canInteract ? 'cursor-pointer hover:bg-accent' : 'cursor-default',
        isWinning && 'border-primary'
      )}
      onClick={handleClick}
      disabled={disabled || value !== null}
      aria-label={ariaLabel}
      aria-pressed={value !== null}
      data-row={row}
      data-col={col}
    >
      {value === 1 && <XMark isAnimating={isLastPlaced} />}
      {value === 2 && <OMark isAnimating={isLastPlaced} />}
    </button>
  )
})
