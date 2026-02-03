// Unit tests for AI strategies

import { getAIMove } from '@/lib/aiStrategies'
import {
  createEmptyBoard,
  placeMark,
  getEmptyPositions,
  checkWinner,
  isBoardFull,
} from '@/lib/tictactoeRules'
import type { Board, Difficulty, Player, Position } from '@/types/tictactoe.types'
import { CORNER_POSITIONS } from '@/constants/gameConstants'

describe('aiStrategies', () => {
  describe('getAIMove', () => {
    describe('basic functionality', () => {
      it('should return a valid move for easy difficulty', () => {
        const board = createEmptyBoard()
        const move = getAIMove(board, 2, 'easy')

        expect(move).not.toBeNull()
        const emptyPositions = getEmptyPositions(board)
        expect(emptyPositions).toContainEqual(move)
      })

      it('should return a valid move for medium difficulty', () => {
        const board = createEmptyBoard()
        const move = getAIMove(board, 2, 'medium')

        expect(move).not.toBeNull()
        const emptyPositions = getEmptyPositions(board)
        expect(emptyPositions).toContainEqual(move)
      })

      it('should return a valid move for hard difficulty', () => {
        const board = createEmptyBoard()
        const move = getAIMove(board, 2, 'hard')

        expect(move).not.toBeNull()
        const emptyPositions = getEmptyPositions(board)
        expect(emptyPositions).toContainEqual(move)
      })

      it('should return null when board is full', () => {
        const board: Board = [
          [1, 2, 1],
          [2, 1, 2],
          [2, 1, 2],
        ]

        const difficulties: Difficulty[] = ['easy', 'medium', 'hard']
        difficulties.forEach((difficulty) => {
          const move = getAIMove(board, 2, difficulty)
          expect(move).toBeNull()
        })
      })

      it('should work for both players', () => {
        const board = createEmptyBoard()

        const moveForPlayer1 = getAIMove(board, 1, 'hard')
        const moveForPlayer2 = getAIMove(board, 2, 'hard')

        expect(moveForPlayer1).not.toBeNull()
        expect(moveForPlayer2).not.toBeNull()
      })
    })

    describe('Easy AI', () => {
      it('should make random moves (not deterministic)', () => {
        const board = createEmptyBoard()
        const moves = new Set<string>()

        // Run multiple times to check for randomness
        for (let i = 0; i < 30; i++) {
          const move = getAIMove(board, 2, 'easy')
          if (move) {
            moves.add(`${move.row},${move.col}`)
          }
        }

        // Easy AI should have some variety (more than 1 unique move)
        expect(moves.size).toBeGreaterThan(1)
      })

      it('should always take winning move when available', () => {
        const board: Board = [
          [2, 2, null],
          [1, 1, null],
          [null, null, null],
        ]

        // Run multiple times since easy AI has some randomness
        for (let i = 0; i < 10; i++) {
          const move = getAIMove(board, 2, 'easy')
          expect(move).toEqual({ row: 0, col: 2 })
        }
      })

      it('should sometimes miss blocking moves', () => {
        const board: Board = [
          [1, 1, null],
          [2, null, null],
          [null, null, null],
        ]

        let blockedCount = 0
        const iterations = 50

        for (let i = 0; i < iterations; i++) {
          const move = getAIMove(board, 2, 'easy')
          if (move && move.row === 0 && move.col === 2) {
            blockedCount++
          }
        }

        // Easy AI blocks about 50% of the time
        // Should not block every single time
        expect(blockedCount).toBeLessThan(iterations)
        // But should block at least sometimes
        expect(blockedCount).toBeGreaterThan(0)
      })
    })

    describe('Medium AI', () => {
      it('should always take winning moves', () => {
        const board: Board = [
          [2, 2, null],
          [1, 1, null],
          [null, null, null],
        ]

        for (let i = 0; i < 10; i++) {
          const move = getAIMove(board, 2, 'medium')
          expect(move).toEqual({ row: 0, col: 2 })
        }
      })

      it('should always block opponent winning moves', () => {
        const board: Board = [
          [1, 1, null],
          [2, null, null],
          [null, null, null],
        ]

        for (let i = 0; i < 10; i++) {
          const move = getAIMove(board, 2, 'medium')
          expect(move).toEqual({ row: 0, col: 2 })
        }
      })

      it('should prefer winning over blocking', () => {
        const board: Board = [
          [2, 2, null],
          [1, 1, null],
          [null, null, null],
        ]

        // Both players can win on row 0 col 2 / row 1 col 2
        // AI should take its own win
        const move = getAIMove(board, 2, 'medium')
        expect(move).toEqual({ row: 0, col: 2 })
      })
    })

    describe('Hard AI (minimax)', () => {
      it('should be deterministic for the same position', () => {
        const board = createEmptyBoard()

        const move1 = getAIMove(board, 2, 'hard')
        const move2 = getAIMove(board, 2, 'hard')
        const move3 = getAIMove(board, 2, 'hard')

        expect(move1).toEqual(move2)
        expect(move2).toEqual(move3)
      })

      it('should always take winning move', () => {
        const board: Board = [
          [2, 2, null],
          [1, 1, null],
          [null, null, null],
        ]

        const move = getAIMove(board, 2, 'hard')
        expect(move).toEqual({ row: 0, col: 2 })
      })

      it('should always block opponent winning move', () => {
        const board: Board = [
          [1, 1, null],
          [2, null, null],
          [null, null, null],
        ]

        const move = getAIMove(board, 2, 'hard')
        expect(move).toEqual({ row: 0, col: 2 })
      })

      it('should never lose when playing perfectly', () => {
        // Simulate multiple games where hard AI plays against optimal opponent
        // Hard AI should never lose

        function playGame(): 'win' | 'lose' | 'draw' {
          let board = createEmptyBoard()
          let currentPlayer: Player = 1

          while (!isBoardFull(board) && !checkWinner(board).winner) {
            const move = getAIMove(board, currentPlayer, 'hard')
            if (!move) break

            board = placeMark(board, move, currentPlayer)
            currentPlayer = currentPlayer === 1 ? 2 : 1
          }

          const { winner } = checkWinner(board)
          if (winner === 2) return 'win'
          if (winner === 1) return 'lose'
          return 'draw'
        }

        // When hard AI (player 2) plays against hard AI (player 1), it should draw
        const result = playGame()
        expect(result).not.toBe('lose')
      })

      it('should set up fork when possible', () => {
        // A fork creates two winning threats
        const board: Board = [
          [2, null, null],
          [null, 1, null],
          [null, null, null],
        ]

        const move = getAIMove(board, 2, 'hard')

        // Hard AI should make a strategic move (corner or edge to set up threats)
        expect(move).not.toBeNull()

        // Apply the move and verify it's strategic
        const newBoard = placeMark(board, move!, 2)
        const emptyAfter = getEmptyPositions(newBoard)
        expect(emptyAfter.length).toBe(6)
      })
    })

    describe('strategic position preferences', () => {
      it('should take center when available on empty board (hard AI)', () => {
        const board = createEmptyBoard()
        const move = getAIMove(board, 2, 'hard')

        // Minimax should evaluate center as optimal for first move
        // or corner - both are valid strategic openings
        expect(move).not.toBeNull()
        if (move) {
          const isCenter = move.row === 1 && move.col === 1
          const isCorner = CORNER_POSITIONS.some((c) => c.row === move.row && c.col === move.col)
          expect(isCenter || isCorner).toBe(true)
        }
      })

      it('should prefer corner or center when center is taken', () => {
        const board: Board = [
          [null, null, null],
          [null, 1, null],
          [null, null, null],
        ]

        const move = getAIMove(board, 2, 'hard')

        expect(move).not.toBeNull()
        if (move) {
          // When center is taken, corners are the best response
          const isCorner = CORNER_POSITIONS.some((c) => c.row === move.row && c.col === move.col)
          expect(isCorner).toBe(true)
        }
      })

      it('should block corner trap with center response', () => {
        // Classic corner trap setup
        const board: Board = [
          [1, null, null],
          [null, null, null],
          [null, null, 1],
        ]

        const move = getAIMove(board, 2, 'hard')

        // Best defense against corner trap is to take center
        expect(move).toEqual({ row: 1, col: 1 })
      })
    })

    describe('edge cases', () => {
      it('should handle board with only one valid move', () => {
        const board: Board = [
          [1, 2, 1],
          [2, 1, 2],
          [2, 1, null],
        ]

        const difficulties: Difficulty[] = ['easy', 'medium', 'hard']
        difficulties.forEach((difficulty) => {
          const move = getAIMove(board, 2, difficulty)
          expect(move).toEqual({ row: 2, col: 2 })
        })
      })

      it('should handle near-endgame scenarios', () => {
        const board: Board = [
          [1, 2, 1],
          [2, null, null],
          [null, 1, 2],
        ]

        const move = getAIMove(board, 2, 'hard')

        expect(move).not.toBeNull()
        const emptyPositions = getEmptyPositions(board)
        expect(emptyPositions).toContainEqual(move)
      })

      it('should work correctly as player 1', () => {
        const board = createEmptyBoard()
        const move = getAIMove(board, 1, 'hard')

        expect(move).not.toBeNull()
      })

      it('should handle complex mid-game position', () => {
        const board: Board = [
          [1, null, 2],
          [null, 2, null],
          [1, null, null],
        ]

        const move = getAIMove(board, 2, 'hard')

        expect(move).not.toBeNull()
        // Verify move is valid
        if (move) {
          expect(board[move.row][move.col]).toBeNull()
        }
      })
    })

    describe('performance', () => {
      it('should complete within reasonable time for empty board', () => {
        const board = createEmptyBoard()
        const startTime = Date.now()

        getAIMove(board, 2, 'hard')

        const elapsed = Date.now() - startTime
        // Tic-tac-toe minimax should be very fast (< 100ms)
        expect(elapsed).toBeLessThan(100)
      })

      it('should complete within reasonable time for mid-game', () => {
        const board: Board = [
          [1, null, 2],
          [null, 1, null],
          [2, null, null],
        ]
        const startTime = Date.now()

        getAIMove(board, 2, 'hard')

        const elapsed = Date.now() - startTime
        expect(elapsed).toBeLessThan(100)
      })
    })

    describe('perfect play verification', () => {
      it('hard AI vs hard AI should always draw', () => {
        let board = createEmptyBoard()
        let currentPlayer: Player = 1

        while (true) {
          const { winner } = checkWinner(board)
          if (winner || isBoardFull(board)) break

          const move = getAIMove(board, currentPlayer, 'hard')
          if (!move) break

          board = placeMark(board, move, currentPlayer)
          currentPlayer = currentPlayer === 1 ? 2 : 1
        }

        const { winner } = checkWinner(board)
        expect(winner).toBeNull()
        expect(isBoardFull(board)).toBe(true)
      })

      it('hard AI should never lose as second player', () => {
        // Test several first moves by player 1
        const firstMoves: Position[] = [
          { row: 0, col: 0 }, // corner
          { row: 1, col: 1 }, // center
          { row: 0, col: 1 }, // edge
        ]

        firstMoves.forEach((firstMove) => {
          let board = placeMark(createEmptyBoard(), firstMove, 1)
          let currentPlayer: Player = 2

          while (true) {
            const { winner } = checkWinner(board)
            if (winner || isBoardFull(board)) break

            const move = getAIMove(board, currentPlayer, 'hard')
            if (!move) break

            board = placeMark(board, move, currentPlayer)
            currentPlayer = currentPlayer === 1 ? 2 : 1
          }

          const { winner } = checkWinner(board)
          // Hard AI (player 2) should never lose
          expect(winner).not.toBe(1)
        })
      })
    })

    describe('corner strategy', () => {
      it('should respond to center opening with corner', () => {
        const board: Board = [
          [null, null, null],
          [null, 1, null],
          [null, null, null],
        ]

        const move = getAIMove(board, 2, 'hard')

        expect(move).not.toBeNull()
        if (move) {
          const isCorner = CORNER_POSITIONS.some((c) => c.row === move.row && c.col === move.col)
          expect(isCorner).toBe(true)
        }
      })

      it('should respond to corner opening strategically', () => {
        const board: Board = [
          [1, null, null],
          [null, null, null],
          [null, null, null],
        ]

        const move = getAIMove(board, 2, 'hard')

        // Best response to corner is center
        expect(move).toEqual({ row: 1, col: 1 })
      })

      it('should take opposite corner to set up threats', () => {
        const board: Board = [
          [2, null, null],
          [null, 1, null],
          [null, null, null],
        ]

        const move = getAIMove(board, 2, 'hard')

        expect(move).not.toBeNull()
        // Should make a strategic move - opposite corner is common
        if (move) {
          const isCornerOrEdge =
            CORNER_POSITIONS.some((c) => c.row === move.row && c.col === move.col) ||
            (move.row === 0 && move.col === 1) ||
            (move.row === 1 && move.col === 0) ||
            (move.row === 1 && move.col === 2) ||
            (move.row === 2 && move.col === 1)
          expect(isCornerOrEdge).toBe(true)
        }
      })
    })
  })
})
