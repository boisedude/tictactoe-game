/**
 * O Mark Component
 * Animated SVG O mark for Tic-Tac-Toe with enhanced visuals
 */

import { memo } from 'react'
import { cn } from '@/lib/utils'

interface OMarkProps {
  isWinning?: boolean
  isAnimating?: boolean
  className?: string
}

export const OMark = memo(function OMark({ isWinning = false, isAnimating = false, className }: OMarkProps) {
  // Circle circumference for animation (2 * PI * radius)
  const circumference = 2 * Math.PI * 35

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
        {/* Gradient for O mark */}
        <linearGradient id="oGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="50%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
        {/* Winning gradient */}
        <linearGradient id="oWinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#fcd34d" />
        </linearGradient>
        {/* Inner shine gradient */}
        <radialGradient id="oShine" cx="30%" cy="30%" r="50%" fx="30%" fy="30%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        {/* Glow filter */}
        <filter id="oGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Shadow filter */}
        <filter id="oShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.3)" />
        </filter>
      </defs>

      {/* Shadow layer */}
      <circle
        cx="52"
        cy="52"
        r="35"
        fill="none"
        stroke="#5c1a1a"
        strokeWidth="10"
        filter="url(#oShadow)"
        opacity="0.4"
      />

      {/* Main O with gradient and glow */}
      <g filter={isWinning ? 'url(#oGlow)' : undefined}>
        <circle
          cx="50"
          cy="50"
          r="35"
          fill="none"
          stroke={isWinning ? 'url(#oWinGradient)' : 'url(#oGradient)'}
          strokeWidth="12"
          strokeLinecap="round"
          style={{
            strokeDasharray: isAnimating ? circumference : 'none',
            strokeDashoffset: isAnimating ? circumference : 0,
            animation: isAnimating ? 'draw-o 0.4s ease-out forwards' : 'none',
            transformOrigin: 'center',
            transform: 'rotate(-90deg)',
          }}
        />
      </g>

      {/* Inner highlight/shine effect */}
      <circle
        cx="50"
        cy="50"
        r="28"
        fill="none"
        stroke="url(#oShine)"
        strokeWidth="6"
        opacity={isAnimating ? 0 : 0.5}
        style={{
          transition: 'opacity 0.3s ease-out 0.4s',
        }}
      />

      {/* Outer subtle glow ring */}
      <circle
        cx="50"
        cy="50"
        r="38"
        fill="none"
        stroke={isWinning ? 'rgba(250, 204, 21, 0.3)' : 'rgba(239, 68, 68, 0.2)'}
        strokeWidth="2"
        opacity={isAnimating ? 0 : 1}
        style={{
          transition: 'opacity 0.3s ease-out 0.5s',
        }}
      />
    </svg>
  )
})
