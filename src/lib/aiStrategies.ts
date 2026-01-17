/**
 * Tic-Tac-Toe AI Strategies
 * Implements different difficulty levels:
 * - Easy (Bella): Random moves with occasional smart plays
 * - Medium (Coop): Strategic but beatable
 * - Hard (Bentley): Perfect minimax - unbeatable
 */

import type { Board, Player, Position, Difficulty } from '@/types/tictactoe.types'
import {
  getEmptyPositions,
  placeMark,
  checkWinner,
  isBoardFull,
  findWinningMove,
  getOpponent,
} from '@/lib/tictactoeRules'
import {
  SCORE_AI_WIN,
  SCORE_PLAYER_WIN,
  SCORE_DRAW,
  MEDIUM_AI_OPTIMAL_CHANCE,
  CENTER_POSITION,
  CORNER_POSITIONS,
} from '@/constants/gameConstants'

// =============================================================================
// Minimax Algorithm (Hard AI - Unbeatable)
// =============================================================================

/**
 * Minimax algorithm with alpha-beta pruning
 * Returns the best score for the current player
 */
function minimax(
  board: Board,
  depth: number,
  isMaximizing: boolean,
  alpha: number,
  beta: number,
  aiPlayer: Player
): number {
  const humanPlayer = getOpponent(aiPlayer)
  const { winner } = checkWinner(board)

  // Terminal states
  if (winner === aiPlayer) {
    return SCORE_AI_WIN - depth // Prefer faster wins
  }
  if (winner === humanPlayer) {
    return SCORE_PLAYER_WIN + depth // Prefer slower losses
  }
  if (isBoardFull(board)) {
    return SCORE_DRAW
  }

  const emptyPositions = getEmptyPositions(board)

  if (isMaximizing) {
    // AI's turn - maximize score
    let maxEval = -Infinity

    for (const pos of emptyPositions) {
      const newBoard = placeMark(board, pos, aiPlayer)
      const evalScore = minimax(newBoard, depth + 1, false, alpha, beta, aiPlayer)
      maxEval = Math.max(maxEval, evalScore)
      alpha = Math.max(alpha, evalScore)
      if (beta <= alpha) break // Alpha-beta pruning
    }

    return maxEval
  } else {
    // Human's turn - minimize score
    let minEval = Infinity

    for (const pos of emptyPositions) {
      const newBoard = placeMark(board, pos, humanPlayer)
      const evalScore = minimax(newBoard, depth + 1, true, alpha, beta, aiPlayer)
      minEval = Math.min(minEval, evalScore)
      beta = Math.min(beta, evalScore)
      if (beta <= alpha) break // Alpha-beta pruning
    }

    return minEval
  }
}

/**
 * Hard AI: Perfect minimax - completely unbeatable
 * Uses the minimax algorithm to find the optimal move
 */
function getHardMove(board: Board, aiPlayer: Player): Position | null {
  const emptyPositions = getEmptyPositions(board)
  if (emptyPositions.length === 0) return null

  let bestScore = -Infinity
  let bestMove: Position | null = null

  for (const pos of emptyPositions) {
    const newBoard = placeMark(board, pos, aiPlayer)
    const score = minimax(newBoard, 0, false, -Infinity, Infinity, aiPlayer)

    if (score > bestScore) {
      bestScore = score
      bestMove = pos
    }
  }

  return bestMove
}

// =============================================================================
// Medium AI (Strategic but beatable)
// =============================================================================

/**
 * Medium AI: Makes good moves but occasionally makes mistakes
 * - 70% chance of optimal move
 * - 30% chance of strategic but suboptimal move
 */
function getMediumMove(board: Board, aiPlayer: Player): Position | null {
  const emptyPositions = getEmptyPositions(board)
  if (emptyPositions.length === 0) return null

  const humanPlayer = getOpponent(aiPlayer)

  // Always take a winning move if available
  const winningMove = findWinningMove(board, aiPlayer)
  if (winningMove) return winningMove

  // Always block opponent's winning move
  const blockingMove = findWinningMove(board, humanPlayer)
  if (blockingMove) return blockingMove

  // 70% chance of optimal play, 30% chance of suboptimal
  if (Math.random() < MEDIUM_AI_OPTIMAL_CHANCE) {
    // Use minimax for optimal move
    return getHardMove(board, aiPlayer)
  }

  // Suboptimal but strategic moves
  // Take center if available
  if (isEmpty(board, CENTER_POSITION)) {
    return CENTER_POSITION
  }

  // Take a corner if available
  const availableCorners = CORNER_POSITIONS.filter((pos) => isEmpty(board, pos))
  if (availableCorners.length > 0) {
    return availableCorners[Math.floor(Math.random() * availableCorners.length)]
  }

  // Take any available position
  return emptyPositions[Math.floor(Math.random() * emptyPositions.length)]
}

function isEmpty(board: Board, pos: Position): boolean {
  return board[pos.row][pos.col] === null
}

// =============================================================================
// Easy AI (Random with basic awareness)
// =============================================================================

/**
 * Easy AI: Mostly random moves with basic awareness
 * - Will take obvious winning moves
 * - Will sometimes block (50% chance)
 * - Otherwise random
 */
function getEasyMove(board: Board, aiPlayer: Player): Position | null {
  const emptyPositions = getEmptyPositions(board)
  if (emptyPositions.length === 0) return null

  const humanPlayer = getOpponent(aiPlayer)

  // Always take a winning move (even Bella can see that!)
  const winningMove = findWinningMove(board, aiPlayer)
  if (winningMove) return winningMove

  // 50% chance to block opponent's winning move (sometimes distracted)
  if (Math.random() < 0.5) {
    const blockingMove = findWinningMove(board, humanPlayer)
    if (blockingMove) return blockingMove
  }

  // Otherwise, random move
  return emptyPositions[Math.floor(Math.random() * emptyPositions.length)]
}

// =============================================================================
// Main AI Move Function
// =============================================================================

/**
 * Gets the next AI move based on difficulty
 */
export function getAIMove(board: Board, aiPlayer: Player, difficulty: Difficulty): Position | null {
  switch (difficulty) {
    case 'easy':
      return getEasyMove(board, aiPlayer)
    case 'medium':
      return getMediumMove(board, aiPlayer)
    case 'hard':
      return getHardMove(board, aiPlayer)
    default:
      return getMediumMove(board, aiPlayer)
  }
}

/**
 * Evaluates the current board state for a player
 * Returns a score indicating how favorable the position is
 */
export function evaluateBoard(board: Board, player: Player): number {
  const { winner } = checkWinner(board)

  if (winner === player) return SCORE_AI_WIN
  if (winner === getOpponent(player)) return SCORE_PLAYER_WIN
  if (isBoardFull(board)) return SCORE_DRAW

  // Heuristic evaluation for non-terminal states
  let score = 0

  // Center control is valuable
  if (board[1][1] === player) score += 3
  else if (board[1][1] === getOpponent(player)) score -= 3

  // Corner control is valuable
  const corners: Position[] = [
    { row: 0, col: 0 },
    { row: 0, col: 2 },
    { row: 2, col: 0 },
    { row: 2, col: 2 },
  ]

  for (const corner of corners) {
    if (board[corner.row][corner.col] === player) score += 2
    else if (board[corner.row][corner.col] === getOpponent(player)) score -= 2
  }

  return score
}
