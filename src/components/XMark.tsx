/**
 * X Mark Component
 * Animated SVG X mark for Tic-Tac-Toe with enhanced visuals
 */

import { memo } from 'react'
import { cn } from '@/lib/utils'

interface XMarkProps {
  isWinning?: boolean
  isAnimating?: boolean
  className?: string
}

export const XMark = memo(function XMark({ isWinning = false, isAnimating = false, className }: XMarkProps) {
  // Line length for dash animation (approximately the diagonal length)
  const lineLength = 85

  return (
    <svg
      viewBox="0 0 100 100"
      className={cn(
        'w-full h-full',
        isAnimating && 'animate-drop-in',
        isWinning && 'animate-win-pulse animate-win-glow',
        className
      )}
      aria-hidden="true"
    >
      <defs>
        {/* Gradient for X mark */}
        <linearGradient id="xGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        {/* Winning gradient */}
        <linearGradient id="xWinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#fcd34d" />
        </linearGradient>
        {/* Glow filter */}
        <filter id="xGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Shadow filter */}
        <filter id="xShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.3)" />
        </filter>
      </defs>

      {/* Shadow layer */}
      <g filter="url(#xShadow)" opacity="0.6">
        <line
          x1="22"
          y1="22"
          x2="78"
          y2="78"
          stroke="#1e3a5f"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <line
          x1="78"
          y1="22"
          x2="22"
          y2="78"
          stroke="#1e3a5f"
          strokeWidth="10"
          strokeLinecap="round"
        />
      </g>

      {/* Main X with gradient and glow */}
      <g filter={isWinning ? 'url(#xGlow)' : undefined}>
        {/* First line of X (top-left to bottom-right) */}
        <line
          x1="20"
          y1="20"
          x2="80"
          y2="80"
          stroke={isWinning ? 'url(#xWinGradient)' : 'url(#xGradient)'}
          strokeWidth="12"
          strokeLinecap="round"
          style={{
            strokeDasharray: isAnimating ? lineLength : 'none',
            strokeDashoffset: isAnimating ? lineLength : 0,
            animation: isAnimating ? 'draw-x-line1 0.25s ease-out forwards' : 'none',
          }}
        />
        {/* Second line of X (top-right to bottom-left) */}
        <line
          x1="80"
          y1="20"
          x2="20"
          y2="80"
          stroke={isWinning ? 'url(#xWinGradient)' : 'url(#xGradient)'}
          strokeWidth="12"
          strokeLinecap="round"
          style={{
            strokeDasharray: isAnimating ? lineLength : 'none',
            strokeDashoffset: isAnimating ? lineLength : 0,
            animation: isAnimating ? 'draw-x-line2 0.25s ease-out 0.15s forwards' : 'none',
          }}
        />
      </g>

      {/* Highlight/shine effect */}
      <line
        x1="22"
        y1="18"
        x2="42"
        y2="38"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="4"
        strokeLinecap="round"
        style={{
          opacity: isAnimating ? 0 : 1,
          transition: 'opacity 0.3s ease-out 0.4s',
        }}
      />
    </svg>
  )
})
