/**
 * X Mark Component
 * Animated SVG X mark for Tic-Tac-Toe
 */

import { cn } from '@/lib/utils'

interface XMarkProps {
  isWinning?: boolean
  isAnimating?: boolean
  className?: string
}

export function XMark({ isWinning = false, isAnimating = false, className }: XMarkProps) {
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
      {/* First line of X (top-left to bottom-right) */}
      <line
        x1="20"
        y1="20"
        x2="80"
        y2="80"
        stroke="currentColor"
        strokeWidth="12"
        strokeLinecap="round"
        className={cn(
          'text-blue-500',
          isWinning && 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]'
        )}
        style={{
          strokeDasharray: isAnimating ? 100 : 'none',
          strokeDashoffset: isAnimating ? 100 : 0,
          animation: isAnimating ? 'mark-draw 0.3s ease-out forwards' : 'none',
        }}
      />
      {/* Second line of X (top-right to bottom-left) */}
      <line
        x1="80"
        y1="20"
        x2="20"
        y2="80"
        stroke="currentColor"
        strokeWidth="12"
        strokeLinecap="round"
        className={cn(
          'text-blue-500',
          isWinning && 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]'
        )}
        style={{
          strokeDasharray: isAnimating ? 100 : 'none',
          strokeDashoffset: isAnimating ? 100 : 0,
          animation: isAnimating ? 'mark-draw 0.3s ease-out 0.1s forwards' : 'none',
        }}
      />
    </svg>
  )
}
