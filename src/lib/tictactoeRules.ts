/**
 * Tic-Tac-Toe Game Rules and Logic
 * Implements standard Tic-Tac-Toe rules on a 3x3 board
 */

import type { Board, Player, Position, GameState } from '@/types/tictactoe.types'
import { BOARD_SIZE, WIN_PATTERNS } from '@/types/tictactoe.types'

/**
 * Creates an empty 3x3 board
 */
export function createEmptyBoard(): Board {
  return Array(BOARD_SIZE)
    .fill(null)
    .map(() => Array(BOARD_SIZE).fill(null))
}

/**
 * Checks if a position is on the board
 */
export function isValidPosition(row: number, col: number): boolean {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE
}

/**
 * Checks if a position is empty
 */
export function isEmpty(board: Board, position: Position): boolean {
  return board[position.row][position.col] === null
}

/**
 * Gets all empty positions on the board
 */
export function getEmptyPositions(board: Board): Position[] {
  const positions: Position[] = []
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] === null) {
        positions.push({ row, col })
      }
    }
  }
  return positions
}

/**
 * Places a mark on the board
 */
export function placeMark(board: Board, position: Position, player: Player): Board {
  const newBoard = board.map((row) => [...row])
  newBoard[position.row][position.col] = player
  return newBoard
}

/**
 * Checks for a winner
 * Returns the winner and winning positions if found
 */
export function checkWinner(board: Board): {
  winner: Player | null
  winningLine: Position[] | undefined
} {
  for (const pattern of WIN_PATTERNS) {
    const [a, b, c] = pattern
    const cellA = board[a.row][a.col]
    const cellB = board[b.row][b.col]
    const cellC = board[c.row][c.col]

    if (cellA !== null && cellA === cellB && cellB === cellC) {
      return { winner: cellA, winningLine: pattern }
    }
  }

  return { winner: null, winningLine: undefined }
}

/**
 * Checks if the board is full (draw condition if no winner)
 */
export function isBoardFull(board: Board): boolean {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (board[row][col] === null) {
        return false
      }
    }
  }
  return true
}

/**
 * Checks if the game is over
 */
export function checkGameOver(board: Board): {
  isOver: boolean
  winner: Player | null
  isDraw: boolean
  winningLine?: Position[]
} {
  const { winner, winningLine } = checkWinner(board)

  if (winner !== null) {
    return {
      isOver: true,
      winner,
      isDraw: false,
      winningLine,
    }
  }

  if (isBoardFull(board)) {
    return { isOver: true, winner: null, isDraw: true }
  }

  return { isOver: false, winner: null, isDraw: false }
}

/**
 * Creates initial game state
 */
export function createInitialGameState(
  mode: 'pvp' | 'pvc' = 'pvc',
  difficulty: 'easy' | 'medium' | 'hard' = 'medium'
): GameState {
  const board = createEmptyBoard()

  return {
    board,
    currentPlayer: 1, // X (player) goes first
    status: 'playing',
    winner: null,
    mode,
    difficulty,
    moveHistory: [],
    undoHistory: [], // Initialize empty undo history
  }
}

/**
 * Gets the other player
 */
export function getOpponent(player: Player): Player {
  return player === 1 ? 2 : 1
}

/**
 * Checks if a player can win in one move
 * Returns the winning position if found
 */
export function findWinningMove(board: Board, player: Player): Position | null {
  const emptyPositions = getEmptyPositions(board)

  for (const pos of emptyPositions) {
    const testBoard = placeMark(board, pos, player)
    const { winner } = checkWinner(testBoard)
    if (winner === player) {
      return pos
    }
  }

  return null
}

/**
 * Checks if the opponent has 2 in a row (potential threat)
 */
export function countThreats(board: Board, player: Player): number {
  let threats = 0

  for (const pattern of WIN_PATTERNS) {
    const values = pattern.map((pos) => board[pos.row][pos.col])
    const playerCount = values.filter((v) => v === player).length
    const emptyCount = values.filter((v) => v === null).length

    // A threat is 2 marks with 1 empty space
    if (playerCount === 2 && emptyCount === 1) {
      threats++
    }
  }

  return threats
}
