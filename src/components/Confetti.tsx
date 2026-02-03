/**
 * Confetti Component
 * Victory celebration effect with falling confetti particles
 */

import { useMemo } from 'react'

interface ConfettiPiece {
  id: number
  x: number
  delay: number
  duration: number
  color: string
  size: number
  rotation: number
  isCircle: boolean
}

interface ConfettiProps {
  isActive: boolean
  particleCount?: number
  /** Unique key to regenerate confetti (change this to trigger new confetti) */
  animationKey?: number
}

const CONFETTI_COLORS = [
  '#fbbf24', // amber
  '#f59e0b', // orange
  '#ef4444', // red
  '#ec4899', // pink
  '#8b5cf6', // violet
  '#6366f1', // indigo
  '#3b82f6', // blue
  '#10b981', // emerald
]

// Generate confetti pieces with seeded random for deterministic generation
function generatePieces(count: number, seed: number): ConfettiPiece[] {
  let s = seed || 1
  const seededRandom = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }

  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: seededRandom() * 100,
    delay: seededRandom() * 0.5,
    duration: 1 + seededRandom() * 1.5,
    color: CONFETTI_COLORS[Math.floor(seededRandom() * CONFETTI_COLORS.length)],
    size: 6 + seededRandom() * 8,
    rotation: seededRandom() * 360,
    isCircle: seededRandom() > 0.5,
  }))
}

export function Confetti({ isActive, particleCount = 50, animationKey = 0 }: ConfettiProps) {
  // Generate pieces based on animation key for variety
  const pieces = useMemo(() => {
    if (!isActive) return []
    return generatePieces(particleCount, animationKey)
  }, [isActive, particleCount, animationKey])

  if (!isActive || pieces.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute"
          style={{
            left: `${piece.x}%`,
            top: '-20px',
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            borderRadius: piece.isCircle ? '50%' : '2px',
            transform: `rotate(${piece.rotation}deg)`,
            animation: `confetti-fall ${piece.duration}s ease-out ${piece.delay}s forwards`,
          }}
        />
      ))}
    </div>
  )
}
