/**
 * Tutorial Component
 * Interactive walkthrough for first-time Tic-Tac-Toe players
 */

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Button } from './ui/button'
import { XMark } from './XMark'
import { OMark } from './OMark'

interface TutorialProps {
  open: boolean
  opponentName: string
  onClose: () => void
  onComplete: () => void
}

interface TutorialStep {
  title: string
  description: string
  tip?: string
  image?: React.ReactNode
}

const tile = 'flex h-10 w-10 items-center justify-center rounded-md border bg-card'

function MiniBoard({ cells }: { cells: React.ReactNode[] }) {
  return (
    <div className="mx-auto grid w-32 grid-cols-3 gap-1">
      {cells.map((cell, i) => (
        <div key={i} className={tile}>
          {cell}
        </div>
      ))}
    </div>
  )
}

function getSteps(opponent: string): TutorialStep[] {
  return [
    {
      title: 'Welcome to tic-tac-toe',
      description:
        "The classic game of X's and O's. It is simple to learn but has more depth than it looks.",
      image: (
        <div className="flex items-center justify-center gap-2">
          <div className={`${tile} h-16 w-16`}>
            <XMark className="h-10 w-10" />
          </div>
          <div className={`${tile} h-16 w-16`}>
            <OMark className="h-10 w-10" />
          </div>
        </div>
      ),
    },
    {
      title: 'The goal',
      description:
        'Get three of your marks in a row. You can win horizontally, vertically, or diagonally.',
      tip: 'The game is a draw if all nine squares fill up with no winner.',
      image: (
        <MiniBoard
          cells={[
            <XMark key="a" className="h-6 w-6" />,
            <XMark key="b" className="h-6 w-6" />,
            <XMark key="c" className="h-6 w-6" />,
            <OMark key="d" className="h-6 w-6" />,
            <OMark key="e" className="h-6 w-6" />,
            null,
            null,
            null,
            null,
          ]}
        />
      ),
    },
    {
      title: 'You play as X',
      description: `You are X and ${opponent} plays O. X always goes first, which gives you a slight advantage.`,
      image: (
        <div className="flex items-center justify-center gap-6">
          <div className="text-center">
            <div className={`${tile} mx-auto h-16 w-16`}>
              <XMark className="h-10 w-10" />
            </div>
            <div className="mt-2 text-sm font-semibold">You</div>
          </div>
          <div className="text-muted-foreground">vs</div>
          <div className="text-center">
            <div className={`${tile} mx-auto h-16 w-16`}>
              <OMark className="h-10 w-10" />
            </div>
            <div className="mt-2 text-sm font-semibold">{opponent}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'How a turn works',
      description: `Click any empty cell on the 3x3 grid to place your X. ${opponent} then places an O. Keep alternating until someone wins or the grid is full.`,
      tip: `Think ahead. Consider where ${opponent} might play after your move.`,
    },
    {
      title: 'Strategy',
      description:
        'The centre square is the strongest: it sits on four winning lines. Corners are next, with three lines each. Edges have only two.',
      tip: 'Start in the centre or a corner, then try to create two ways to win at once.',
      image: (
        <MiniBoard
          cells={[3, 2, 3, 2, 4, 2, 3, 2, 3].map((n, i) => (
            <span key={i} className={n > 2 ? 'font-bold text-primary' : 'text-muted-foreground'}>
              {n}
            </span>
          ))}
        />
      ),
    },
    {
      title: 'Choose your opponent',
      description:
        'Start with Bella to learn the basics. Coop plays a tougher game, and Bentley plays perfectly. Can you force a draw?',
      tip: 'Click the opponent chip at the top to switch at any time. With perfect play from both sides, tic-tac-toe always ends in a draw.',
    },
    {
      title: 'Ready to play',
      description:
        "Take the centre, watch for winning chances, and block your opponent's threats.",
      tip: 'Click "How to play" any time to see this again.',
    },
  ]
}

export function Tutorial({ open, opponentName, onClose, onComplete }: TutorialProps) {
  const tutorialSteps = getSteps(opponentName)
  const [currentStep, setCurrentStep] = useState(0)
  const [dontShowAgain, setDontShowAgain] = useState(false)
  const step = tutorialSteps[currentStep]
  const isLastStep = currentStep === tutorialSteps.length - 1

  const handleNext = () => {
    if (isLastStep) {
      onComplete()
      onClose()
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSkip = () => {
    onComplete()
    onClose()
  }

  const handleDontShowAgainChange = (checked: boolean) => {
    setDontShowAgain(checked)
    if (checked) {
      onComplete() // Mark as completed so it won't show again
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">{step.title}</DialogTitle>
          <DialogDescription>
            Step {currentStep + 1} of {tutorialSteps.length}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Visual */}
          {step.image && <div className="py-2">{step.image}</div>}

          {/* Description */}
          <p className="text-center text-muted-foreground">{step.description}</p>

          {/* Tip */}
          {step.tip && (
            <p className="rounded-md border bg-secondary p-3 text-sm text-muted-foreground">
              {step.tip}
            </p>
          )}

          {/* Progress dots */}
          <div className="flex justify-center gap-2 pt-2">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'w-6 bg-primary'
                    : index < currentStep
                      ? 'bg-primary/50'
                      : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Don't show again checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="dontShowAgain"
            checked={dontShowAgain}
            onChange={(e) => handleDontShowAgainChange(e.target.checked)}
            className="h-4 w-4 accent-[hsl(var(--primary))]"
          />
          <label htmlFor="dontShowAgain" className="flex min-h-11 flex-1 items-center text-sm text-muted-foreground">
            Don't show this again
          </label>
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:space-x-0">
          <Button variant="ghost" onClick={handleSkip} className="h-11 sm:w-auto">
            Skip
          </Button>
          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button variant="outline" onClick={handleBack} className="h-11">
                Back
              </Button>
            )}
            <Button onClick={handleNext} className="h-11">{isLastStep ? 'Play' : 'Next'}</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
