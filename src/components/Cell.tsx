/**
 * Tic-Tac-Toe Cell Component
 * Represents a single cell on the board with enhanced visuals
 */

import { useState, memo } from 'react'
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
  const [isHovered, setIsHovered] = useState(false)

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

  const canInteract = !disabled && value === null

  return (
    <button
      type="button"
      className={cn(
        'aspect-square w-full min-w-[80px] min-h-[80px] sm:min-w-[100px] sm:min-h-[100px] relative overflow-hidden',
        'flex items-center justify-center',
        'transition-all duration-300 ease-out',
        'focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-inset focus:z-10',
        // Base background with subtle texture
        value === null ? 'cell-empty-pattern' : 'cell-filled-pattern',
        // Empty cell styling
        value === null && !disabled && 'cursor-pointer',
        value === null && !disabled && 'bg-gradient-to-br from-slate-50 via-white to-slate-100',
        // Filled cell styling
        value !== null && 'cursor-default',
        value !== null && 'bg-gradient-to-br from-white via-slate-50 to-slate-100',
        // Disabled styling
        disabled && value === null && 'cursor-not-allowed opacity-60',
        // Winning cell - golden glow effect
        isWinning && 'winning-cell-glow bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100',
        // Last placed cell - subtle highlight
        isLastPlaced && !isWinning && 'bg-gradient-to-br from-indigo-50 via-blue-50 to-indigo-100',
        // Hover effects for interactive empty cells
        canInteract && isHovered && 'cell-hover-glow scale-[1.02] bg-gradient-to-br from-indigo-50 via-white to-indigo-100'
      )}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={disabled || value !== null}
      aria-label={ariaLabel}
      aria-pressed={value !== null}
      data-row={row}
      data-col={col}
    >
      {/* Subtle inner border/inset effect */}
      <div
        className={cn(
          'absolute inset-0 pointer-events-none',
          'border border-slate-200/50',
          isWinning && 'border-amber-300/50'
        )}
      />

      {/* Corner accents for visual interest */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-slate-300/30 rounded-tl" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-slate-300/30 rounded-tr" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-slate-300/30 rounded-bl" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-slate-300/30 rounded-br" />

      {/* Hover indicator for empty cells */}
      {canInteract && (
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center',
            'transition-opacity duration-200',
            isHovered ? 'opacity-30' : 'opacity-0'
          )}
        >
          <div className="w-1/2 h-1/2 rounded-full bg-gradient-to-br from-indigo-300 to-purple-300 blur-md" />
        </div>
      )}

      {/* Mark container */}
      <div className={cn(
        'w-3/4 h-3/4 p-1 relative z-10',
        value !== null && 'drop-shadow-md'
      )}>
        {value === 1 && <XMark isWinning={isWinning} isAnimating={isLastPlaced} />}
        {value === 2 && <OMark isWinning={isWinning} isAnimating={isLastPlaced} />}
      </div>

      {/* Winning sparkle effect */}
      {isWinning && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-yellow-300 rounded-full animate-pulse" />
          <div className="absolute top-1/3 right-1/3 w-0.5 h-0.5 bg-amber-200 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
          <div className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-yellow-200 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
        </div>
      )}
    </button>
  )
})
