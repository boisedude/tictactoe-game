/**
 * Tic-Tac-Toe Board Component
 * Renders the 3x3 game board with enhanced visual design
 */

import { memo } from 'react'
import type { Board as BoardType, Position } from '@/types/tictactoe.types'
import { BOARD_SIZE } from '@/types/tictactoe.types'
import { Cell } from './Cell'
import { cn } from '@/lib/utils'

interface BoardProps {
  board: BoardType
  onCellClick: (row: number, col: number) => void
  isLastPlaced: (row: number, col: number) => boolean
  isWinningPosition: (row: number, col: number) => boolean
  disabled?: boolean
  winningLine?: Position[] | null
  isVictory?: boolean
}

// Calculate winning line coordinates for SVG overlay
function getWinningLineCoords(winningLine: Position[] | null | undefined): { x1: number; y1: number; x2: number; y2: number } | null {
  if (!winningLine || winningLine.length !== 3) return null

  const [start, , end] = winningLine
  // Each cell is ~33.33% of the board, center points
  const cellSize = 100 / 3
  const offset = cellSize / 2

  return {
    x1: start.col * cellSize + offset,
    y1: start.row * cellSize + offset,
    x2: end.col * cellSize + offset,
    y2: end.row * cellSize + offset,
  }
}

export const Board = memo(function Board({
  board,
  onCellClick,
  isLastPlaced,
  isWinningPosition,
  disabled = false,
  winningLine,
  isVictory = false,
}: BoardProps) {
  const lineCoords = getWinningLineCoords(winningLine)
  const hasWinner = winningLine && winningLine.length > 0

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Board container with enhanced styling */}
      <div
        className={cn(
          'relative rounded-2xl overflow-hidden',
          'shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]',
          'board-texture',
          // Victory shake animation
          isVictory && 'animate-victory-shake'
        )}
      >
        {/* Outer glow ring */}
        <div
          className={cn(
            'absolute -inset-1 rounded-2xl opacity-50 blur-sm',
            'bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400',
            hasWinner && 'from-amber-400 via-yellow-400 to-orange-400'
          )}
        />

        {/* Main board area */}
        <div className="relative p-3 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 rounded-2xl">
          {/* Decorative corner elements */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-indigo-400/40 rounded-tl-lg" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-indigo-400/40 rounded-tr-lg" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-indigo-400/40 rounded-bl-lg" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-indigo-400/40 rounded-br-lg" />

          {/* Grid container */}
          <div
            className={cn(
              'grid gap-2 rounded-xl overflow-hidden',
              'bg-gradient-to-br from-slate-600/50 to-slate-700/50',
              'p-2'
            )}
            style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(80px, 1fr))` }}
            role="grid"
            aria-label="Tic-Tac-Toe game board, 3 by 3 grid"
          >
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className="rounded-lg overflow-hidden shadow-inner"
                >
                  <Cell
                    row={rowIndex}
                    col={colIndex}
                    value={cell}
                    onClick={onCellClick}
                    isLastPlaced={isLastPlaced(rowIndex, colIndex)}
                    isWinning={isWinningPosition(rowIndex, colIndex)}
                    disabled={disabled}
                  />
                </div>
              ))
            )}
          </div>

          {/* Winning line overlay */}
          {lineCoords && (
            <svg
              className="absolute inset-0 pointer-events-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              style={{
                top: '0.75rem',
                left: '0.75rem',
                right: '0.75rem',
                bottom: '0.75rem',
                width: 'calc(100% - 1.5rem)',
                height: 'calc(100% - 1.5rem)',
              }}
            >
              <defs>
                <linearGradient id="winLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>
                <filter id="winLineGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {/* Shadow line */}
              <line
                x1={lineCoords.x1 + 1}
                y1={lineCoords.y1 + 1}
                x2={lineCoords.x2 + 1}
                y2={lineCoords.y2 + 1}
                stroke="rgba(0,0,0,0.3)"
                strokeWidth="6"
                strokeLinecap="round"
              />
              {/* Main winning line */}
              <line
                x1={lineCoords.x1}
                y1={lineCoords.y1}
                x2={lineCoords.x2}
                y2={lineCoords.y2}
                stroke="url(#winLineGradient)"
                strokeWidth="5"
                strokeLinecap="round"
                filter="url(#winLineGlow)"
                style={{
                  strokeDasharray: 150,
                  strokeDashoffset: 150,
                  animation: 'winning-line 0.6s ease-out 0.3s forwards',
                }}
              />
            </svg>
          )}
        </div>

        {/* Subtle ambient light effect */}
        <div
          className={cn(
            'absolute inset-0 pointer-events-none rounded-2xl',
            'bg-gradient-to-t from-transparent via-transparent to-white/5'
          )}
        />
      </div>
    </div>
  )
})
