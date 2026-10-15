import { render, act } from '@testing-library/react'
import { TicTacToeGame } from '@/pages/TicTacToeGame'
import { getInitialDifficulty } from '@/hooks/useCharacterSelection'
import { createInitialGameState } from '@/lib/tictactoeRules'
import { useTicTacToeGame } from '@/hooks/useTicTacToeGame'
import { recordPlayerBeatBentley, recordBentleyBeatPlayer } from '@shared/arcadeRecord'
import type { GameState } from '@/types/tictactoe.types'

jest.mock('@shared/arcadeRecord', () => ({
  recordPlayerBeatBentley: jest.fn(() => Promise.resolve()),
  recordBentleyBeatPlayer: jest.fn(() => Promise.resolve()),
}))
jest.mock('@/hooks/useTicTacToeGame')
jest.mock('@/hooks/useGameAudio', () => ({
  useGameAudio: () => ({
    playMarkPlace: jest.fn(),
    playVictory: jest.fn(),
    playDefeat: jest.fn(),
    playDraw: jest.fn(),
    isMuted: false,
    toggleMute: jest.fn(),
  }),
}))

const mockHook = useTicTacToeGame as jest.Mock

function hookValue(state: GameState) {
  return {
    gameState: state,
    isAnimating: false,
    handleCellClick: jest.fn(),
    startNewGame: jest.fn(),
    changeDifficulty: jest.fn(),
    undoMove: jest.fn(),
    canUndo: false,
    isLastPlaced: () => false,
    isWinningPosition: () => false,
  }
}

function finished(difficulty: 'easy' | 'hard', status: 'won' | 'draw', winner: 1 | 2 | null): GameState {
  return {
    ...createInitialGameState('pvc', difficulty),
    status,
    winner,
    moveHistory: [{ position: { row: 0, col: 0 }, player: 1 }],
  }
}

function play(difficulty: 'easy' | 'hard', status: 'won' | 'draw', winner: 1 | 2 | null) {
  mockHook.mockReturnValue(hookValue(createInitialGameState('pvc', difficulty)))
  const { rerender } = render(<TicTacToeGame />)
  mockHook.mockReturnValue(hookValue(finished(difficulty, status, winner)))
  act(() => rerender(<TicTacToeGame />))
  // extra re-render must not post again
  act(() => rerender(<TicTacToeGame />))
}

describe('arcade record', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  it('posts a Bentley win once when Bentley beats the player', () => {
    play('hard', 'won', 2)
    expect(recordBentleyBeatPlayer).toHaveBeenCalledTimes(1)
    expect(recordPlayerBeatBentley).not.toHaveBeenCalled()
  })

  it('posts a player win once when the player beats Bentley', () => {
    play('hard', 'won', 1)
    expect(recordPlayerBeatBentley).toHaveBeenCalledTimes(1)
    expect(recordBentleyBeatPlayer).not.toHaveBeenCalled()
  })

  it('posts nothing for a tie against Bentley', () => {
    play('hard', 'draw', null)
    expect(recordPlayerBeatBentley).not.toHaveBeenCalled()
    expect(recordBentleyBeatPlayer).not.toHaveBeenCalled()
  })

  it('posts nothing against Bella', () => {
    play('easy', 'won', 2)
    expect(recordPlayerBeatBentley).not.toHaveBeenCalled()
    expect(recordBentleyBeatPlayer).not.toHaveBeenCalled()
  })
})

describe('?character= sets difficulty', () => {
  function setSearch(search: string) {
    window.history.pushState({}, '', `/${search}`)
  }

  afterEach(() => {
    window.history.pushState({}, '', '/')
  })

  it.each([
    ['?character=bentley', 'hard'],
    ['?character=bella', 'easy'],
    ['?character=coop', 'medium'],
    ['?character=nope', 'medium'],
    ['', 'medium'],
  ])('%s -> %s', (search, expected) => {
    setSearch(search)
    expect(getInitialDifficulty()).toBe(expected)
  })
})
