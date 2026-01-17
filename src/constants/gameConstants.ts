/**
 * Game Constants
 * Centralized constants for Tic-Tac-Toe game configuration
 */

// =============================================================================
// AI Configuration
// =============================================================================

/** Delay before AI makes a move (ms) */
export const AI_MOVE_DELAY_MS = 500

/** Delay for move animation (ms) */
export const MOVE_ANIMATION_DELAY_MS = 150

// =============================================================================
// Scoring Values for Minimax AI
// =============================================================================

/** Score for AI winning */
export const SCORE_AI_WIN = 10

/** Score for player winning (negative for AI) */
export const SCORE_PLAYER_WIN = -10

/** Score for a draw */
export const SCORE_DRAW = 0

// =============================================================================
// Medium AI Configuration
// =============================================================================

/** Probability that medium AI makes the optimal move */
export const MEDIUM_AI_OPTIMAL_CHANCE = 0.7

/** Probability that medium AI makes a random move */
export const MEDIUM_AI_RANDOM_CHANCE = 0.3

// =============================================================================
// Board Configuration
// =============================================================================

/** Standard Tic-Tac-Toe board size */
export const TICTACTOE_BOARD_SIZE = 3

/** Number of marks in a row needed to win */
export const WIN_LENGTH = 3

/** Total cells on the board */
export const TOTAL_CELLS = 9

/** Center position (strategic advantage) */
export const CENTER_POSITION = { row: 1, col: 1 }

/** Corner positions (strategic advantage) */
export const CORNER_POSITIONS = [
  { row: 0, col: 0 },
  { row: 0, col: 2 },
  { row: 2, col: 0 },
  { row: 2, col: 2 },
]

/** Edge positions (least strategic) */
export const EDGE_POSITIONS = [
  { row: 0, col: 1 },
  { row: 1, col: 0 },
  { row: 1, col: 2 },
  { row: 2, col: 1 },
]
