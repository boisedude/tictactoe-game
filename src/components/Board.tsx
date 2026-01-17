/**
 * Tic-Tac-Toe Board Component
 * Renders the 3x3 game board
 */

import type { Board as BoardType } from '@/types/tictactoe.types'
import { BOARD_SIZE } from '@/types/tictactoe.types'
import { Cell } from './Cell'

interface BoardProps {
  board: BoardType
  onCellClick: (row: number, col: number) => void
  isLastPlaced: (row: number, col: number) => boolean
  isWinningPosition: (row: number, col: number) => boolean
  disabled?: boolean
}

export function Board({
  board,
  onCellClick,
  isLastPlaced,
  isWinningPosition,
  disabled = false,
}: BoardProps) {
  return (
    <div className="w-full max-w-sm mx-auto">
      <div
        className="grid rounded-xl overflow-hidden shadow-2xl bg-gray-700 p-1"
        style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))` }}
        role="grid"
        aria-label="Tic-Tac-Toe game board, 3 by 3 grid"
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
    </div>
  )
}
