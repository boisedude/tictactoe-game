/**
 * Tutorial Component
 * Interactive walkthrough for first-time Tic-Tac-Toe players
 * Designed by M. Cooper for www.mcooper.com
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
  onClose: () => void
  onComplete: () => void
}

interface TutorialStep {
  title: string
  description: string
  tip?: string
  image?: React.ReactNode
}

const tutorialSteps: TutorialStep[] = [
  {
    title: 'Welcome to Tic-Tac-Toe!',
    description:
      "The classic game of X's and O's! It's simple to learn but has surprising depth. Let me show you how to play.",
    image: (
      <div className="flex items-center justify-center gap-2">
        <div className="h-16 w-16 rounded-lg bg-blue-100 flex items-center justify-center">
          <XMark className="h-10 w-10" />
        </div>
        <div className="h-16 w-16 rounded-lg bg-red-100 flex items-center justify-center">
          <OMark className="h-10 w-10" />
        </div>
      </div>
    ),
  },
  {
    title: 'The Goal',
    description:
      'Your objective is to get THREE of your marks in a row. You can win horizontally, vertically, or diagonally. Simple, right?',
    tip: 'The game can also end in a draw if all 9 squares are filled with no winner!',
    image: (
      <div className="grid grid-cols-3 gap-1 w-32 mx-auto">
        <div className="h-10 w-10 bg-green-100 border border-green-300 rounded flex items-center justify-center">
          <XMark className="h-6 w-6" />
        </div>
        <div className="h-10 w-10 bg-green-100 border border-green-300 rounded flex items-center justify-center">
          <XMark className="h-6 w-6" />
        </div>
        <div className="h-10 w-10 bg-green-100 border border-green-300 rounded flex items-center justify-center">
          <XMark className="h-6 w-6" />
        </div>
        <div className="h-10 w-10 bg-gray-100 border border-gray-300 rounded flex items-center justify-center">
          <OMark className="h-6 w-6" />
        </div>
        <div className="h-10 w-10 bg-gray-100 border border-gray-300 rounded flex items-center justify-center">
          <OMark className="h-6 w-6" />
        </div>
        <div className="h-10 w-10 bg-gray-100 border border-gray-300 rounded"></div>
        <div className="h-10 w-10 bg-gray-100 border border-gray-300 rounded"></div>
        <div className="h-10 w-10 bg-gray-100 border border-gray-300 rounded"></div>
        <div className="h-10 w-10 bg-gray-100 border border-gray-300 rounded"></div>
      </div>
    ),
  },
  {
    title: 'You Play as X',
    description:
      'You are X (blue) and the AI plays as O (red). X always goes first, giving you a slight advantage!',
    image: (
      <div className="flex items-center justify-center gap-6">
        <div className="text-center">
          <div className="h-16 w-16 rounded-lg bg-blue-100 flex items-center justify-center mx-auto">
            <XMark className="h-10 w-10" />
          </div>
          <div className="mt-2 text-sm font-semibold">You (X)</div>
        </div>
        <div className="text-2xl font-bold text-gray-400">vs</div>
        <div className="text-center">
          <div className="h-16 w-16 rounded-lg bg-red-100 flex items-center justify-center mx-auto">
            <OMark className="h-10 w-10" />
          </div>
          <div className="mt-2 text-sm font-semibold">AI (O)</div>
        </div>
      </div>
    ),
  },
  {
    title: 'How to Play',
    description:
      'Click any empty cell on the 3x3 grid to place your X. Then the AI automatically places its O. Keep alternating until someone wins or all cells are filled.',
    tip: 'Think ahead! Consider where the AI might play after your move.',
  },
  {
    title: 'Strategy Tips',
    description:
      'The CENTER square is the most powerful position - it connects to all winning lines. CORNERS are the next best - they connect to 3 winning lines each.',
    tip: 'Pro move: Start in the center or a corner, then create two ways to win at once!',
    image: (
      <div className="grid grid-cols-3 gap-1 w-32 mx-auto">
        <div className="h-10 w-10 bg-amber-100 border-2 border-amber-400 rounded flex items-center justify-center text-xs font-bold text-amber-700">
          3
        </div>
        <div className="h-10 w-10 bg-gray-100 border border-gray-300 rounded flex items-center justify-center text-xs font-bold text-gray-400">
          2
        </div>
        <div className="h-10 w-10 bg-amber-100 border-2 border-amber-400 rounded flex items-center justify-center text-xs font-bold text-amber-700">
          3
        </div>
        <div className="h-10 w-10 bg-gray-100 border border-gray-300 rounded flex items-center justify-center text-xs font-bold text-gray-400">
          2
        </div>
        <div className="h-10 w-10 bg-green-100 border-2 border-green-400 rounded flex items-center justify-center text-xs font-bold text-green-700">
          4
        </div>
        <div className="h-10 w-10 bg-gray-100 border border-gray-300 rounded flex items-center justify-center text-xs font-bold text-gray-400">
          2
        </div>
        <div className="h-10 w-10 bg-amber-100 border-2 border-amber-400 rounded flex items-center justify-center text-xs font-bold text-amber-700">
          3
        </div>
        <div className="h-10 w-10 bg-gray-100 border border-gray-300 rounded flex items-center justify-center text-xs font-bold text-gray-400">
          2
        </div>
        <div className="h-10 w-10 bg-amber-100 border-2 border-amber-400 rounded flex items-center justify-center text-xs font-bold text-amber-700">
          3
        </div>
      </div>
    ),
  },
  {
    title: 'Choose Your Challenge',
    description:
      "Start on Easy mode to learn the basics. Medium provides more challenge, while Hard mode uses perfect strategy - can you force a draw?",
    tip: 'Fun fact: With perfect play from both sides, Tic-Tac-Toe always ends in a draw!',
  },
  {
    title: 'Ready to Play!',
    description:
      "You're all set! Remember: control the center, watch for winning opportunities, and block your opponent's threats. Good luck!",
    tip: 'Click "How to Play" anytime to review these instructions.',
  },
]

export function Tutorial({ open, onClose, onComplete }: TutorialProps) {
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

        <div className="space-y-4 py-6">
          {/* Visual */}
          {step.image && <div className="py-4">{step.image}</div>}

          {/* Description */}
          <p className="text-center text-muted-foreground">{step.description}</p>

          {/* Tip */}
          {step.tip && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950">
              <div className="mb-1 text-sm font-semibold text-blue-900 dark:text-blue-100">
                Tip
              </div>
              <p className="text-sm text-blue-800 dark:text-blue-200">{step.tip}</p>
            </div>
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
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor="dontShowAgain" className="text-sm text-muted-foreground">
            Don't show this again
          </label>
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
          <Button variant="ghost" onClick={handleSkip} className="sm:w-auto">
            Skip Tutorial
          </Button>
          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            )}
            <Button onClick={handleNext}>{isLastStep ? "Let's Play!" : 'Next'}</Button>
          </div>
        </DialogFooter>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground">
          Tutorial by M. Cooper
        </div>
      </DialogContent>
    </Dialog>
  )
}
