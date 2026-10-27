import { renderHook, act } from '@testing-library/react'
import { useTicTacToeGame } from '@/hooks/useTicTacToeGame'

describe('switching opponent', () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => jest.useRealTimers())

  it('startNewGame(difficulty) clears the board and applies the new opponent', () => {
    const { result } = renderHook(() => useTicTacToeGame('easy'))
    act(() => result.current.handleCellClick(0, 0))
    act(() => {
      jest.advanceTimersByTime(200)
    })
    expect(result.current.gameState.moveHistory.length).toBe(1)

    act(() => result.current.startNewGame('hard'))
    expect(result.current.gameState.difficulty).toBe('hard')
    expect(result.current.gameState.moveHistory).toHaveLength(0)
    expect(result.current.gameState.status).toBe('playing')

    // no stale AI move from the abandoned game lands on the new board
    act(() => {
      jest.advanceTimersByTime(2000)
    })
    expect(result.current.gameState.moveHistory).toHaveLength(0)
  })
})
