/**
 * Tic-Tac-Toe Board Component
 * A 3x3 grid of matte cells on the slate table, with a sagebrush winning line
 */

import { memo } from 'react'
import type { Board as BoardType, Position } from '@/types/tictactoe.types'
import { BOARD_SIZE } from '@/types/tictactoe.types'
import { Cell } from './Cell'

interface BoardProps {
  board: BoardType
  onCellClick: (row: number, col: number) => void
  isLastPlaced: (row: number, col: number) => boolean
  isWinningPosition: (row: number, col: number) => boolean
  disabled?: boolean
  winningLine?: Position[] | null
}

// Centre-to-centre coordinates of the winning line, as a percentage of the grid
function getWinningLineCoords(winningLine: Position[] | null | undefined) {
  if (!winningLine || winningLine.length !== 3) return null

  const [start, , end] = winningLine
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
}: BoardProps) {
  const lineCoords = getWinningLineCoords(winningLine)

  return (
    <div
      className="arcade-board relative bg-secondary p-2"
      style={{ maxWidth: 'min(420px, calc(100dvw - 2rem))' }}
    >
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))` }}
        role="grid"
        aria-label="Tic-tac-toe board, 3 by 3 grid"
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              row={rowIndex}
              col={colIndex}
              value={cell}
              onClick={onCellClick}
              isLastPlaced={isLastPlaced(rowIndex, colIndex)}
              isWinning={isWinningPosition(rowIndex, colIndex)}
              disabled={disabled}
            />
          ))
        )}
      </div>

      {lineCoords && (
        <svg
          className="pointer-events-none absolute inset-2 h-[calc(100%-1rem)] w-[calc(100%-1rem)]"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <line
            x1={lineCoords.x1}
            y1={lineCoords.y1}
            x2={lineCoords.x2}
            y2={lineCoords.y2}
            pathLength={1}
            stroke="hsl(var(--primary))"
            strokeWidth={5}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            style={{
              strokeDasharray: 1,
              strokeDashoffset: 1,
              animation: 'winning-line 0.5s ease-out 0.25s forwards',
            }}
          />
        </svg>
      )}
    </div>
  )
})
