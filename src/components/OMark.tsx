/**
 * O Mark Component
 * Animated SVG O mark for Tic-Tac-Toe
 */

import { cn } from '@/lib/utils'

interface OMarkProps {
  isWinning?: boolean
  isAnimating?: boolean
  className?: string
}

export function OMark({ isWinning = false, isAnimating = false, className }: OMarkProps) {
  // Circle circumference for animation (2 * PI * radius)
  const circumference = 2 * Math.PI * 35

  return (
    <svg
      viewBox="0 0 100 100"
      className={cn(
        'w-full h-full',
        isAnimating && 'animate-mark-pop',
        isWinning && 'animate-win-pulse',
        className
      )}
      aria-hidden="true"
    >
      <circle
        cx="50"
        cy="50"
        r="35"
        fill="none"
        stroke="currentColor"
        strokeWidth="12"
        strokeLinecap="round"
        className={cn(
          'text-red-500',
          isWinning && 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]'
        )}
        style={{
          strokeDasharray: isAnimating ? circumference : 'none',
          strokeDashoffset: isAnimating ? circumference : 0,
          animation: isAnimating ? 'mark-draw 0.4s ease-out forwards' : 'none',
          transformOrigin: 'center',
          transform: 'rotate(-90deg)',
        }}
      />
    </svg>
  )
}
