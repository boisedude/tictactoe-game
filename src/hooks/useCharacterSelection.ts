/**
 * Character Selection Hook
 * Maps difficulty levels to characters and manages character state
 */

import { useState, useCallback } from 'react'
import { getCharacterById } from '@shared/characters'
import type { Character, CharacterId } from '@shared/characters'
import type { Difficulty } from '@/types/tictactoe.types'

// Map difficulty to character IDs
const difficultyToCharacter: Record<Difficulty, CharacterId> = {
  easy: 'bella',
  medium: 'coop',
  hard: 'bentley',
}

export function useCharacterSelection(initialDifficulty: Difficulty = 'medium') {
  const [character, setCharacter] = useState<Character>(() =>
    getCharacterById(difficultyToCharacter[initialDifficulty])
  )

  const changeCharacter = useCallback((newDifficulty: Difficulty) => {
    const characterId = difficultyToCharacter[newDifficulty]
    setCharacter(getCharacterById(characterId))
  }, [])

  const getCharacterForDifficulty = useCallback((diff: Difficulty): Character => {
    const characterId = difficultyToCharacter[diff]
    return getCharacterById(characterId)
  }, [])

  return {
    character,
    changeCharacter,
    getCharacterForDifficulty,
  }
}
