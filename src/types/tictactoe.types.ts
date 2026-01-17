/**
 * Tic-Tac-Toe Game Type Definitions
 */

// Player identifiers: 1 = X (Human), 2 = O (AI)
export type Player = 1 | 2

// Cell value can be a player's mark or null (empty)
export type CellValue = Player | null

// Game board: 3x3 grid
export const BOARD_SIZE = 3

// Board state (3x3 grid)
export type Board = CellValue[][]

// Game status
export type GameStatus = 'playing' | 'won' | 'draw'

// Game mode
export type GameMode = 'pvp' | 'pvc' // Player vs Player or Player vs Computer

// AI difficulty levels with personality
export type Difficulty = 'easy' | 'medium' | 'hard'

// Position on the board
export interface Position {
  row: number
  col: number
}

// Move representation
export interface Move {
  position: Position
  player: Player
}

// Complete game state
export interface GameState {
  board: Board
  currentPlayer: Player
  status: GameStatus
  winner: Player | null
  mode: GameMode
  difficulty: Difficulty
  moveHistory: Move[]
  lastMove?: Move
  winningLine?: Position[] // Positions that form the winning line
}

// Leaderboard entry
export interface LeaderboardEntry {
  playerName: string
  wins: number
  losses: number
  draws: number
  winStreak: number
  longestWinStreak: number
  totalGames: number
  fastestWin: number | null // Minimum moves to win
  perfectGames: number // Games won without AI getting 2 in a row
}

// Saved game state
export interface SavedGame extends GameState {
  savedAt: number
}

// Win patterns - all possible winning combinations
export const WIN_PATTERNS: Position[][] = [
  // Rows
  [
    { row: 0, col: 0 },
    { row: 0, col: 1 },
    { row: 0, col: 2 },
  ],
  [
    { row: 1, col: 0 },
    { row: 1, col: 1 },
    { row: 1, col: 2 },
  ],
  [
    { row: 2, col: 0 },
    { row: 2, col: 1 },
    { row: 2, col: 2 },
  ],
  // Columns
  [
    { row: 0, col: 0 },
    { row: 1, col: 0 },
    { row: 2, col: 0 },
  ],
  [
    { row: 0, col: 1 },
    { row: 1, col: 1 },
    { row: 2, col: 1 },
  ],
  [
    { row: 0, col: 2 },
    { row: 1, col: 2 },
    { row: 2, col: 2 },
  ],
  // Diagonals
  [
    { row: 0, col: 0 },
    { row: 1, col: 1 },
    { row: 2, col: 2 },
  ],
  [
    { row: 0, col: 2 },
    { row: 1, col: 1 },
    { row: 2, col: 0 },
  ],
]
