/**
 * Tic-Tac-Toe Cell Component
 * Represents a single cell on the board
 */

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

export function Cell({
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

  // Generate accessible label for the cell
  const colLetter = String.fromCharCode(65 + col) // A, B, C
  const rowNumber = row + 1 // 1, 2, 3
  const cellNotation = `${colLetter}${rowNumber}`
  const cellState = value === null ? 'empty' : value === 1 ? 'X' : 'O'
  const ariaLabel = `Cell ${cellNotation}, ${cellState}${isLastPlaced ? ', last move' : ''}${isWinning ? ', winning position' : ''}`

  // Border classes to create the grid lines
  const borderClasses = cn(
    'border-gray-700',
    col < 2 && 'border-r-4',
    row < 2 && 'border-b-4'
  )

  return (
    <button
      type="button"
      className={cn(
        'aspect-square w-full',
        'flex items-center justify-center',
        'bg-gradient-to-br from-slate-100 to-slate-200',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset',
        borderClasses,
        value === null && !disabled && 'cursor-pointer hover:bg-slate-300',
        value !== null && 'cursor-default',
        disabled && value === null && 'cursor-not-allowed opacity-70',
        isWinning && 'bg-gradient-to-br from-yellow-100 to-yellow-200',
        isLastPlaced && !isWinning && 'bg-gradient-to-br from-blue-50 to-blue-100'
      )}
      onClick={handleClick}
      disabled={disabled || value !== null}
      aria-label={ariaLabel}
      aria-pressed={value !== null}
      data-row={row}
      data-col={col}
    >
      <div className="w-3/4 h-3/4 p-1">
        {value === 1 && <XMark isWinning={isWinning} isAnimating={isLastPlaced} />}
        {value === 2 && <OMark isWinning={isWinning} isAnimating={isLastPlaced} />}
      </div>
    </button>
  )
}
