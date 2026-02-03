// Unit tests for Tic-Tac-Toe game rules engine

import {
  createEmptyBoard,
  isValidPosition,
  isEmpty,
  getEmptyPositions,
  placeMark,
  checkWinner,
  isBoardFull,
  checkGameOver,
  createInitialGameState,
  getOpponent,
  findWinningMove,
  countThreats,
} from '@/lib/tictactoeRules'
import type { Board } from '@/types/tictactoe.types'
import { BOARD_SIZE, WIN_PATTERNS } from '@/types/tictactoe.types'

describe('tictactoeRules', () => {
  describe('createEmptyBoard', () => {
    it('should create a 3x3 empty grid', () => {
      const board = createEmptyBoard()

      expect(board.length).toBe(BOARD_SIZE)
      expect(board[0].length).toBe(BOARD_SIZE)
      expect(board[1].length).toBe(BOARD_SIZE)
      expect(board[2].length).toBe(BOARD_SIZE)
    })

    it('should have all cells as null (empty)', () => {
      const board = createEmptyBoard()

      for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
          expect(board[row][col]).toBeNull()
        }
      }
    })

    it('should create independent row arrays', () => {
      const board = createEmptyBoard()

      // Modify one row
      board[0][0] = 1

      // Other rows should not be affected
      expect(board[1][0]).toBeNull()
      expect(board[2][0]).toBeNull()
    })
  })

  describe('isValidPosition', () => {
    it('should return true for valid positions', () => {
      expect(isValidPosition(0, 0)).toBe(true)
      expect(isValidPosition(1, 1)).toBe(true)
      expect(isValidPosition(2, 2)).toBe(true)
      expect(isValidPosition(0, 2)).toBe(true)
      expect(isValidPosition(2, 0)).toBe(true)
    })

    it('should return false for negative positions', () => {
      expect(isValidPosition(-1, 0)).toBe(false)
      expect(isValidPosition(0, -1)).toBe(false)
      expect(isValidPosition(-1, -1)).toBe(false)
    })

    it('should return false for positions outside the board', () => {
      expect(isValidPosition(3, 0)).toBe(false)
      expect(isValidPosition(0, 3)).toBe(false)
      expect(isValidPosition(3, 3)).toBe(false)
    })
  })

  describe('isEmpty', () => {
    it('should return true for empty cells', () => {
      const board = createEmptyBoard()

      expect(isEmpty(board, { row: 0, col: 0 })).toBe(true)
      expect(isEmpty(board, { row: 1, col: 1 })).toBe(true)
      expect(isEmpty(board, { row: 2, col: 2 })).toBe(true)
    })

    it('should return false for occupied cells', () => {
      const board = createEmptyBoard()
      board[0][0] = 1
      board[1][1] = 2

      expect(isEmpty(board, { row: 0, col: 0 })).toBe(false)
      expect(isEmpty(board, { row: 1, col: 1 })).toBe(false)
    })
  })

  describe('getEmptyPositions', () => {
    it('should return all 9 positions for empty board', () => {
      const board = createEmptyBoard()
      const emptyPositions = getEmptyPositions(board)

      expect(emptyPositions.length).toBe(9)
    })

    it('should return correct empty positions after moves', () => {
      const board = createEmptyBoard()
      board[0][0] = 1
      board[1][1] = 2
      board[2][2] = 1

      const emptyPositions = getEmptyPositions(board)

      expect(emptyPositions.length).toBe(6)
      expect(emptyPositions).not.toContainEqual({ row: 0, col: 0 })
      expect(emptyPositions).not.toContainEqual({ row: 1, col: 1 })
      expect(emptyPositions).not.toContainEqual({ row: 2, col: 2 })
      expect(emptyPositions).toContainEqual({ row: 0, col: 1 })
      expect(emptyPositions).toContainEqual({ row: 0, col: 2 })
    })

    it('should return empty array for full board', () => {
      const board: Board = [
        [1, 2, 1],
        [2, 1, 2],
        [2, 1, 2],
      ]

      const emptyPositions = getEmptyPositions(board)

      expect(emptyPositions.length).toBe(0)
    })
  })

  describe('placeMark', () => {
    it('should place mark correctly', () => {
      const board = createEmptyBoard()
      const newBoard = placeMark(board, { row: 0, col: 0 }, 1)

      expect(newBoard[0][0]).toBe(1)
    })

    it('should not modify the original board (immutability)', () => {
      const board = createEmptyBoard()
      placeMark(board, { row: 0, col: 0 }, 1)

      expect(board[0][0]).toBeNull()
    })

    it('should place different players correctly', () => {
      let board = createEmptyBoard()
      board = placeMark(board, { row: 0, col: 0 }, 1)
      board = placeMark(board, { row: 1, col: 1 }, 2)

      expect(board[0][0]).toBe(1)
      expect(board[1][1]).toBe(2)
    })

    it('should preserve other marks when placing new mark', () => {
      let board = createEmptyBoard()
      board = placeMark(board, { row: 0, col: 0 }, 1)
      board = placeMark(board, { row: 2, col: 2 }, 2)

      expect(board[0][0]).toBe(1)
      expect(board[2][2]).toBe(2)
    })
  })

  describe('checkWinner', () => {
    describe('row wins', () => {
      it('should detect win in first row', () => {
        const board: Board = [
          [1, 1, 1],
          [2, 2, null],
          [null, null, null],
        ]

        const result = checkWinner(board)

        expect(result.winner).toBe(1)
        expect(result.winningLine).toEqual([
          { row: 0, col: 0 },
          { row: 0, col: 1 },
          { row: 0, col: 2 },
        ])
      })

      it('should detect win in second row', () => {
        const board: Board = [
          [1, 2, null],
          [2, 2, 2],
          [1, null, 1],
        ]

        const result = checkWinner(board)

        expect(result.winner).toBe(2)
        expect(result.winningLine).toEqual([
          { row: 1, col: 0 },
          { row: 1, col: 1 },
          { row: 1, col: 2 },
        ])
      })

      it('should detect win in third row', () => {
        const board: Board = [
          [2, 1, null],
          [2, null, 1],
          [1, 1, 1],
        ]

        const result = checkWinner(board)

        expect(result.winner).toBe(1)
        expect(result.winningLine).toEqual([
          { row: 2, col: 0 },
          { row: 2, col: 1 },
          { row: 2, col: 2 },
        ])
      })
    })

    describe('column wins', () => {
      it('should detect win in first column', () => {
        const board: Board = [
          [1, 2, null],
          [1, 2, null],
          [1, null, null],
        ]

        const result = checkWinner(board)

        expect(result.winner).toBe(1)
        expect(result.winningLine).toEqual([
          { row: 0, col: 0 },
          { row: 1, col: 0 },
          { row: 2, col: 0 },
        ])
      })

      it('should detect win in second column', () => {
        const board: Board = [
          [1, 2, 1],
          [null, 2, null],
          [1, 2, null],
        ]

        const result = checkWinner(board)

        expect(result.winner).toBe(2)
        expect(result.winningLine).toEqual([
          { row: 0, col: 1 },
          { row: 1, col: 1 },
          { row: 2, col: 1 },
        ])
      })

      it('should detect win in third column', () => {
        const board: Board = [
          [2, null, 1],
          [2, null, 1],
          [null, null, 1],
        ]

        const result = checkWinner(board)

        expect(result.winner).toBe(1)
        expect(result.winningLine).toEqual([
          { row: 0, col: 2 },
          { row: 1, col: 2 },
          { row: 2, col: 2 },
        ])
      })
    })

    describe('diagonal wins', () => {
      it('should detect win in main diagonal (top-left to bottom-right)', () => {
        const board: Board = [
          [1, 2, null],
          [2, 1, null],
          [null, null, 1],
        ]

        const result = checkWinner(board)

        expect(result.winner).toBe(1)
        expect(result.winningLine).toEqual([
          { row: 0, col: 0 },
          { row: 1, col: 1 },
          { row: 2, col: 2 },
        ])
      })

      it('should detect win in anti-diagonal (top-right to bottom-left)', () => {
        const board: Board = [
          [1, 2, 2],
          [1, 2, null],
          [2, null, 1],
        ]

        const result = checkWinner(board)

        expect(result.winner).toBe(2)
        expect(result.winningLine).toEqual([
          { row: 0, col: 2 },
          { row: 1, col: 1 },
          { row: 2, col: 0 },
        ])
      })
    })

    describe('no winner', () => {
      it('should return null winner for empty board', () => {
        const board = createEmptyBoard()
        const result = checkWinner(board)

        expect(result.winner).toBeNull()
        expect(result.winningLine).toBeUndefined()
      })

      it('should return null winner for game in progress', () => {
        const board: Board = [
          [1, 2, null],
          [null, 1, null],
          [null, null, 2],
        ]

        const result = checkWinner(board)

        expect(result.winner).toBeNull()
        expect(result.winningLine).toBeUndefined()
      })

      it('should return null winner for draw (full board, no winner)', () => {
        const board: Board = [
          [1, 2, 1],
          [1, 2, 2],
          [2, 1, 1],
        ]

        const result = checkWinner(board)

        expect(result.winner).toBeNull()
      })
    })
  })

  describe('isBoardFull', () => {
    it('should return false for empty board', () => {
      const board = createEmptyBoard()

      expect(isBoardFull(board)).toBe(false)
    })

    it('should return false for partially filled board', () => {
      const board: Board = [
        [1, 2, null],
        [null, 1, null],
        [2, null, null],
      ]

      expect(isBoardFull(board)).toBe(false)
    })

    it('should return true for completely filled board', () => {
      const board: Board = [
        [1, 2, 1],
        [2, 1, 2],
        [2, 1, 2],
      ]

      expect(isBoardFull(board)).toBe(true)
    })

    it('should return false when only one cell is empty', () => {
      const board: Board = [
        [1, 2, 1],
        [2, 1, 2],
        [2, 1, null],
      ]

      expect(isBoardFull(board)).toBe(false)
    })
  })

  describe('checkGameOver', () => {
    it('should detect win correctly', () => {
      const board: Board = [
        [1, 1, 1],
        [2, 2, null],
        [null, null, null],
      ]

      const result = checkGameOver(board)

      expect(result.isOver).toBe(true)
      expect(result.winner).toBe(1)
      expect(result.isDraw).toBe(false)
      expect(result.winningLine).toBeDefined()
    })

    it('should detect draw correctly', () => {
      const board: Board = [
        [1, 2, 1],
        [1, 2, 2],
        [2, 1, 1],
      ]

      const result = checkGameOver(board)

      expect(result.isOver).toBe(true)
      expect(result.winner).toBeNull()
      expect(result.isDraw).toBe(true)
    })

    it('should detect game in progress', () => {
      const board: Board = [
        [1, 2, null],
        [null, 1, null],
        [null, null, null],
      ]

      const result = checkGameOver(board)

      expect(result.isOver).toBe(false)
      expect(result.winner).toBeNull()
      expect(result.isDraw).toBe(false)
    })

    it('should prioritize win over full board check', () => {
      // Board is full and player 1 wins
      const board: Board = [
        [1, 1, 1],
        [2, 2, 1],
        [2, 1, 2],
      ]

      const result = checkGameOver(board)

      expect(result.isOver).toBe(true)
      expect(result.winner).toBe(1)
      expect(result.isDraw).toBe(false)
    })
  })

  describe('createInitialGameState', () => {
    it('should create initial game state with default values', () => {
      const state = createInitialGameState()

      expect(state.board.length).toBe(BOARD_SIZE)
      expect(state.currentPlayer).toBe(1)
      expect(state.status).toBe('playing')
      expect(state.winner).toBeNull()
      expect(state.mode).toBe('pvc')
      expect(state.difficulty).toBe('medium')
      expect(state.moveHistory).toEqual([])
    })

    it('should create game state with custom mode and difficulty', () => {
      const state = createInitialGameState('pvp', 'hard')

      expect(state.mode).toBe('pvp')
      expect(state.difficulty).toBe('hard')
    })

    it('should create empty board', () => {
      const state = createInitialGameState()

      for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
          expect(state.board[row][col]).toBeNull()
        }
      }
    })
  })

  describe('getOpponent', () => {
    it('should return player 2 for player 1', () => {
      expect(getOpponent(1)).toBe(2)
    })

    it('should return player 1 for player 2', () => {
      expect(getOpponent(2)).toBe(1)
    })
  })

  describe('findWinningMove', () => {
    it('should find winning move in a row', () => {
      const board: Board = [
        [1, 1, null],
        [2, 2, null],
        [null, null, null],
      ]

      const winningMove = findWinningMove(board, 1)

      expect(winningMove).toEqual({ row: 0, col: 2 })
    })

    it('should find winning move in a column', () => {
      const board: Board = [
        [1, 2, null],
        [1, 2, null],
        [null, null, null],
      ]

      const winningMove = findWinningMove(board, 1)

      expect(winningMove).toEqual({ row: 2, col: 0 })
    })

    it('should find winning move in a diagonal', () => {
      const board: Board = [
        [1, 2, null],
        [2, 1, null],
        [null, null, null],
      ]

      const winningMove = findWinningMove(board, 1)

      expect(winningMove).toEqual({ row: 2, col: 2 })
    })

    it('should return null when no winning move exists', () => {
      const board: Board = [
        [1, 2, null],
        [null, null, null],
        [null, null, null],
      ]

      const winningMove = findWinningMove(board, 1)

      expect(winningMove).toBeNull()
    })

    it('should find blocking move for opponent', () => {
      const board: Board = [
        [2, 2, null],
        [1, 1, null],
        [null, null, null],
      ]

      // Player 1 can block player 2's win
      const opponentWinningMove = findWinningMove(board, 2)

      expect(opponentWinningMove).toEqual({ row: 0, col: 2 })
    })
  })

  describe('countThreats', () => {
    it('should count threats correctly', () => {
      const board: Board = [
        [1, 1, null],
        [null, null, null],
        [null, null, null],
      ]

      const threats = countThreats(board, 1)

      expect(threats).toBe(1)
    })

    it('should count multiple threats', () => {
      const board: Board = [
        [1, 1, null],
        [1, null, null],
        [null, null, null],
      ]

      const threats = countThreats(board, 1)

      // Row threat and column threat
      expect(threats).toBe(2)
    })

    it('should return 0 when no threats exist', () => {
      const board: Board = [
        [1, null, null],
        [null, null, null],
        [null, null, null],
      ]

      const threats = countThreats(board, 1)

      expect(threats).toBe(0)
    })

    it('should not count lines with opponent marks as threats', () => {
      const board: Board = [
        [1, 1, 2],
        [null, null, null],
        [null, null, null],
      ]

      const threats = countThreats(board, 1)

      expect(threats).toBe(0)
    })
  })

  describe('edge cases', () => {
    it('should handle immediate win scenario on first row', () => {
      const board: Board = [
        [1, 1, null],
        [2, 2, null],
        [null, null, null],
      ]

      // Player 1 can win immediately
      const winningMove = findWinningMove(board, 1)
      expect(winningMove).toEqual({ row: 0, col: 2 })

      // Verify the win
      const newBoard = placeMark(board, winningMove!, 1)
      const result = checkWinner(newBoard)
      expect(result.winner).toBe(1)
    })

    it('should handle draw scenario correctly', () => {
      // Classic draw board
      const board: Board = [
        [1, 2, 1],
        [1, 2, 2],
        [2, 1, 1],
      ]

      expect(isBoardFull(board)).toBe(true)
      expect(checkWinner(board).winner).toBeNull()
      expect(checkGameOver(board).isDraw).toBe(true)
    })

    it('should validate all win patterns are correctly defined', () => {
      expect(WIN_PATTERNS.length).toBe(8) // 3 rows + 3 cols + 2 diagonals

      // Each pattern should have exactly 3 positions
      WIN_PATTERNS.forEach((pattern) => {
        expect(pattern.length).toBe(3)
      })
    })
  })

  describe('getWinningLine scenarios', () => {
    it('should return winning positions for horizontal win', () => {
      const board: Board = [
        [2, 2, 2],
        [1, 1, null],
        [null, null, 1],
      ]

      const result = checkWinner(board)

      expect(result.winningLine).toEqual([
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 2 },
      ])
    })

    it('should return winning positions for vertical win', () => {
      const board: Board = [
        [1, 2, null],
        [1, 2, null],
        [null, 2, 1],
      ]

      const result = checkWinner(board)

      expect(result.winningLine).toEqual([
        { row: 0, col: 1 },
        { row: 1, col: 1 },
        { row: 2, col: 1 },
      ])
    })

    it('should return winning positions for diagonal win', () => {
      const board: Board = [
        [null, 2, 1],
        [null, 1, 2],
        [1, null, null],
      ]

      const result = checkWinner(board)

      expect(result.winningLine).toEqual([
        { row: 0, col: 2 },
        { row: 1, col: 1 },
        { row: 2, col: 0 },
      ])
    })
  })
})
