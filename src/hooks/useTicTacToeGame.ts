/**
 * Tic-Tac-Toe Game Hook
 * Main game state management for Tic-Tac-Toe
 */

import { useState, useCallback, useRef, useEffect } from 'react'
import type { GameState, Difficulty, Position, Move, UndoSnapshot } from '@/types/tictactoe.types'
import { createInitialGameState, placeMark, checkGameOver, isEmpty } from '@/lib/tictactoeRules'
import { getAIMove } from '@/lib/aiStrategies'
import { AI_MOVE_DELAY_MS, MOVE_ANIMATION_DELAY_MS } from '@/constants/gameConstants'

export function useTicTacToeGame(initialDifficulty: Difficulty = 'medium') {
  const [gameState, setGameState] = useState<GameState>(() =>
    createInitialGameState('pvc', initialDifficulty)
  )
  const [lastPlacedPosition, setLastPlacedPosition] = useState<Position | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const aiMoveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const aiMoveScheduledRef = useRef(false)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (aiMoveTimeoutRef.current) {
        clearTimeout(aiMoveTimeoutRef.current)
      }
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current)
      }
    }
  }, [])

  // Handle AI move when it's AI's turn (Player 2 = O)
  useEffect(() => {
    if (
      gameState.currentPlayer === 2 &&
      gameState.status === 'playing' &&
      gameState.mode === 'pvc' &&
      !isAnimating &&
      !aiMoveScheduledRef.current
    ) {
      aiMoveScheduledRef.current = true

      aiMoveTimeoutRef.current = setTimeout(() => {
        try {
          const aiPosition = getAIMove(gameState.board, 2, gameState.difficulty)

          if (aiPosition) {
            setIsAnimating(true)
            setLastPlacedPosition(aiPosition)

            animationTimeoutRef.current = setTimeout(() => {
              setGameState((prevState) => {
                try {
                  const newBoard = placeMark(prevState.board, aiPosition, 2)

                  const move: Move = {
                    position: aiPosition,
                    player: 2,
                  }

                  const gameOver = checkGameOver(newBoard)
                  const nextPlayer = prevState.currentPlayer === 1 ? 2 : 1

                  return {
                    ...prevState,
                    board: newBoard,
                    currentPlayer: nextPlayer,
                    status: gameOver.isOver ? (gameOver.isDraw ? 'draw' : 'won') : 'playing',
                    winner: gameOver.winner,
                    winningLine: gameOver.winningLine,
                    moveHistory: [...prevState.moveHistory, move],
                    lastMove: move,
                  }
                } catch {
                  // AI move execution failed - return previous state
                  return prevState
                }
              })
              setIsAnimating(false)
              animationTimeoutRef.current = null
            }, MOVE_ANIMATION_DELAY_MS)
          }
          aiMoveScheduledRef.current = false
        } catch {
          // AI move calculation failed - reset animation state
          setIsAnimating(false)
          aiMoveScheduledRef.current = false
        }
      }, AI_MOVE_DELAY_MS)
    }

    return () => {
      if (aiMoveTimeoutRef.current) {
        clearTimeout(aiMoveTimeoutRef.current)
        aiMoveTimeoutRef.current = null
      }
    }
  }, [
    gameState.currentPlayer,
    gameState.status,
    gameState.mode,
    gameState.board,
    gameState.difficulty,
    isAnimating,
  ])

  /**
   * Handles clicking on a cell to place a mark
   */
  const handleCellClick = useCallback(
    (row: number, col: number) => {
      // Can't place mark if not player's turn, game over, or animating
      if (isAnimating || gameState.status !== 'playing' || gameState.currentPlayer !== 1) {
        return
      }

      const position = { row, col }

      // Can't place mark on occupied cell
      if (!isEmpty(gameState.board, position)) {
        return
      }

      // Place the mark
      setIsAnimating(true)
      setLastPlacedPosition(position)

      animationTimeoutRef.current = setTimeout(() => {
        setGameState((prevState) => {
          try {
            // Save undo snapshot before player move (deep copy board)
            const undoSnapshot: UndoSnapshot = {
              board: prevState.board.map(row => [...row]),
              currentPlayer: prevState.currentPlayer,
              moveHistory: [...prevState.moveHistory],
              lastMove: prevState.lastMove,
            }

            const newBoard = placeMark(prevState.board, position, 1)

            const move: Move = {
              position,
              player: 1,
            }

            const gameOver = checkGameOver(newBoard)
            const nextPlayer = prevState.currentPlayer === 1 ? 2 : 1

            return {
              ...prevState,
              board: newBoard,
              currentPlayer: nextPlayer,
              status: gameOver.isOver ? (gameOver.isDraw ? 'draw' : 'won') : 'playing',
              winner: gameOver.winner,
              winningLine: gameOver.winningLine,
              moveHistory: [...prevState.moveHistory, move],
              lastMove: move,
              undoHistory: [...prevState.undoHistory, undoSnapshot],
            }
          } catch {
            // Move execution failed - return previous state
            return prevState
          }
        })
        setIsAnimating(false)
        animationTimeoutRef.current = null
      }, MOVE_ANIMATION_DELAY_MS)
    },
    [gameState.board, gameState.status, gameState.currentPlayer, isAnimating]
  )

  /**
   * Starts a new game, optionally against a different opponent
   */
  const startNewGame = useCallback((difficulty?: Difficulty) => {
    // Clear any pending timeouts
    if (aiMoveTimeoutRef.current) {
      clearTimeout(aiMoveTimeoutRef.current)
      aiMoveTimeoutRef.current = null
    }
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current)
      animationTimeoutRef.current = null
    }
    aiMoveScheduledRef.current = false

    setGameState(createInitialGameState('pvc', difficulty ?? gameState.difficulty))
    setLastPlacedPosition(null)
    setIsAnimating(false)
  }, [gameState.difficulty])

  /**
   * Changes difficulty level
   */
  const changeDifficulty = useCallback((newDifficulty: Difficulty) => {
    setGameState((prevState) => ({
      ...prevState,
      difficulty: newDifficulty,
    }))
  }, [])

  /**
   * Undo the last move(s)
   * In VS AI mode: Undo both player's move AND AI's response
   * In PvP mode: Undo single move
   */
  const undoMove = useCallback(() => {
    // Don't allow undo during animation or AI thinking
    if (isAnimating || aiMoveScheduledRef.current) {
      return
    }

    // Cancel any pending AI move
    if (aiMoveTimeoutRef.current) {
      clearTimeout(aiMoveTimeoutRef.current)
      aiMoveTimeoutRef.current = null
    }
    aiMoveScheduledRef.current = false

    setGameState((prevState) => {
      // Can't undo if no history or game not playing
      if (prevState.undoHistory.length === 0 || prevState.status !== 'playing') {
        return prevState
      }

      // Get the last undo snapshot
      const newUndoHistory = [...prevState.undoHistory]
      const snapshot = newUndoHistory.pop()!

      // Restore the state from snapshot
      return {
        ...prevState,
        board: snapshot.board,
        currentPlayer: snapshot.currentPlayer,
        moveHistory: snapshot.moveHistory,
        lastMove: snapshot.lastMove,
        undoHistory: newUndoHistory,
        // Clear any game-over state (shouldn't happen, but just in case)
        status: 'playing',
        winner: null,
        winningLine: undefined,
      }
    })

    // Clear last placed position visual
    setLastPlacedPosition(null)
  }, [isAnimating])

  /**
   * Checks if a position is the last placed mark
   */
  const isLastPlaced = useCallback(
    (row: number, col: number): boolean => {
      return (
        lastPlacedPosition !== null &&
        lastPlacedPosition.row === row &&
        lastPlacedPosition.col === col
      )
    },
    [lastPlacedPosition]
  )

  /**
   * Checks if a position is part of the winning line
   */
  const isWinningPosition = useCallback(
    (row: number, col: number): boolean => {
      return gameState.winningLine?.some((pos) => pos.row === row && pos.col === col) || false
    },
    [gameState.winningLine]
  )

  /**
   * Check if undo is available
   * In VS AI mode: Can only undo when it's player's turn (after AI responded)
   * In PvP mode: Can undo whenever there's history
   * Note: We don't check aiMoveScheduledRef here to avoid ref access during render;
   * the undoMove function handles that check internally.
   */
  const canUndo =
    gameState.status === 'playing' &&
    gameState.undoHistory.length > 0 &&
    !isAnimating &&
    (gameState.mode === 'pvp' || gameState.currentPlayer === 1)

  return {
    gameState,
    isAnimating,
    handleCellClick,
    startNewGame,
    changeDifficulty,
    undoMove,
    canUndo,
    isLastPlaced,
    isWinningPosition,
  }
}
