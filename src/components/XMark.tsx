/**
 * X Mark Component
 * Two strokes in the foreground colour, drawn in on placement
 */

import { memo } from 'react'
import { cn } from '@/lib/utils'

interface XMarkProps {
  isAnimating?: boolean
  className?: string
}

// Stroke length for the dash animation (diagonal of the mark)
const LINE_LENGTH = 85

export const XMark = memo(function XMark({ isAnimating = false, className }: XMarkProps) {
  const dash = (animation: string) => ({
    strokeDasharray: isAnimating ? LINE_LENGTH : 'none',
    strokeDashoffset: isAnimating ? LINE_LENGTH : 0,
    animation: isAnimating ? animation : 'none',
  })

  return (
    <svg
      viewBox="0 0 100 100"
      className={cn('h-full w-full text-foreground', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="9"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="20" y1="20" x2="80" y2="80" style={dash('draw-x-line1 0.25s ease-out forwards')} />
      <line x1="80" y1="20" x2="20" y2="80" style={dash('draw-x-line2 0.25s ease-out 0.15s forwards')} />
    </svg>
  )
})
