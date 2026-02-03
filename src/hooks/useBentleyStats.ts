/**
 * Bentley Stats Hook
 * Track special stats when playing against Bentley (hard difficulty)
 * Note: Beating Bentley is impossible with perfect play, but ties are possible!
 */

import { useState, useCallback, useEffect } from 'react'
import { STORAGE_KEY_BENTLEY_STATS } from '@/lib/storageKeys'

export interface BentleyStats {
  gamesPlayed: number
  gamesWon: number // Should always be 0 against perfect Bentley
  gamesLost: number
  gamesTied: number // Ties are the best outcome against perfect play
  currentTieStreak: number
  longestTieStreak: number
  totalMoves: number
}

/**
 * Type guard to validate BentleyStats structure
 * Protects against corrupted or malicious localStorage data
 */
function isValidBentleyStats(data: unknown): data is BentleyStats {
  if (!data || typeof data !== 'object') {
    return false
  }

  const stats = data as Partial<BentleyStats>

  return (
    typeof stats.gamesPlayed === 'number' &&
    stats.gamesPlayed >= 0 &&
    typeof stats.gamesWon === 'number' &&
    stats.gamesWon >= 0 &&
    typeof stats.gamesLost === 'number' &&
    stats.gamesLost >= 0 &&
    typeof stats.gamesTied === 'number' &&
    stats.gamesTied >= 0 &&
    typeof stats.currentTieStreak === 'number' &&
    stats.currentTieStreak >= 0 &&
    typeof stats.longestTieStreak === 'number' &&
    stats.longestTieStreak >= 0 &&
    typeof stats.totalMoves === 'number' &&
    stats.totalMoves >= 0
  )
}

function loadStats(): BentleyStats {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_BENTLEY_STATS)
    if (stored) {
      const data = JSON.parse(stored)

      // Validate data structure before using it
      if (isValidBentleyStats(data)) {
        return data
      } else {
        // Invalid Bentley stats data in localStorage - reset to defaults
        localStorage.removeItem(STORAGE_KEY_BENTLEY_STATS)
      }
    }
  } catch {
    // Failed to load Bentley stats - clear corrupted data and use defaults
    try {
      localStorage.removeItem(STORAGE_KEY_BENTLEY_STATS)
    } catch {
      // Ignore errors when trying to clear
    }
  }

  return {
    gamesPlayed: 0,
    gamesWon: 0,
    gamesLost: 0,
    gamesTied: 0,
    currentTieStreak: 0,
    longestTieStreak: 0,
    totalMoves: 0,
  }
}

function saveStats(stats: BentleyStats): void {
  try {
    localStorage.setItem(STORAGE_KEY_BENTLEY_STATS, JSON.stringify(stats))
  } catch {
    // Failed to save Bentley stats to localStorage
  }
}

export function useBentleyStats() {
  const [stats, setStats] = useState<BentleyStats>(loadStats)

  // Save to localStorage whenever stats change
  useEffect(() => {
    saveStats(stats)
  }, [stats])

  const recordBentleyWin = useCallback((totalMoves: number) => {
    // This should theoretically never happen against perfect minimax
    setStats((prev) => ({
      ...prev,
      gamesPlayed: prev.gamesPlayed + 1,
      gamesWon: prev.gamesWon + 1,
      currentTieStreak: 0,
      totalMoves: prev.totalMoves + totalMoves,
    }))
  }, [])

  const recordBentleyLoss = useCallback((totalMoves: number) => {
    setStats((prev) => ({
      ...prev,
      gamesPlayed: prev.gamesPlayed + 1,
      gamesLost: prev.gamesLost + 1,
      currentTieStreak: 0,
      totalMoves: prev.totalMoves + totalMoves,
    }))
  }, [])

  const recordBentleyTie = useCallback((totalMoves: number) => {
    setStats((prev) => {
      const newTieStreak = prev.currentTieStreak + 1
      return {
        ...prev,
        gamesPlayed: prev.gamesPlayed + 1,
        gamesTied: prev.gamesTied + 1,
        currentTieStreak: newTieStreak,
        longestTieStreak: Math.max(newTieStreak, prev.longestTieStreak),
        totalMoves: prev.totalMoves + totalMoves,
      }
    })
  }, [])

  const resetBentleyStats = useCallback(() => {
    const emptyStats: BentleyStats = {
      gamesPlayed: 0,
      gamesWon: 0,
      gamesLost: 0,
      gamesTied: 0,
      currentTieStreak: 0,
      longestTieStreak: 0,
      totalMoves: 0,
    }
    setStats(emptyStats)
  }, [])

  return {
    bentleyStats: stats,
    recordBentleyWin,
    recordBentleyLoss,
    recordBentleyTie,
    resetBentleyStats,
  }
}
