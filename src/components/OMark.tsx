/**
 * O Mark Component
 * One ring in the sagebrush primary, drawn in on placement
 */

import { memo } from 'react'
import { cn } from '@/lib/utils'

interface OMarkProps {
  isAnimating?: boolean
  className?: string
}

const RADIUS = 33
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export const OMark = memo(function OMark({ isAnimating = false, className }: OMarkProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn('h-full w-full text-primary', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="9"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle
        cx="50"
        cy="50"
        r={RADIUS}
        style={{
          strokeDasharray: isAnimating ? CIRCUMFERENCE : 'none',
          strokeDashoffset: isAnimating ? CIRCUMFERENCE : 0,
          animation: isAnimating ? 'draw-o 0.4s ease-out forwards' : 'none',
          transformOrigin: 'center',
          transform: 'rotate(-90deg)',
        }}
      />
    </svg>
  )
})
