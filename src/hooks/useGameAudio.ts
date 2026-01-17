/**
 * useGameAudio Hook
 * Manages game sound effects using Web Audio API for Tic-Tac-Toe
 * Designed by M. Cooper for www.mcooper.com
 */

import { useCallback, useEffect, useRef, useState } from 'react'

type SoundEffect = 'markPlace' | 'victory' | 'defeat' | 'draw' | 'click' | 'hover'

// Type declaration for webkit compatibility
type WebkitWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext
  }

export function useGameAudio() {
  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem('tictactoe-audio-muted') === 'true'
  })

  const audioContextRef = useRef<AudioContext | null>(null)

  // Initialize Audio Context
  useEffect(() => {
    if (typeof window !== 'undefined' && !audioContextRef.current) {
      try {
        const AudioContextClass =
          window.AudioContext || (window as WebkitWindow).webkitAudioContext
        if (AudioContextClass) {
          audioContextRef.current = new AudioContextClass()
        }
      } catch {
        // Web Audio API not supported - audio features will be disabled
      }
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  // Toggle mute
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const newValue = !prev
      localStorage.setItem('tictactoe-audio-muted', String(newValue))
      return newValue
    })
  }, [])

  // Play mark place sound (satisfying click/pop)
  const playMarkPlace = useCallback(() => {
    if (isMuted || !audioContextRef.current) return

    const ctx = audioContextRef.current
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gainNode = ctx.createGain()

    osc.connect(gainNode)
    gainNode.connect(ctx.destination)

    // Pleasant pop sound
    osc.frequency.setValueAtTime(600, now)
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.1)

    gainNode.gain.setValueAtTime(0, now)
    gainNode.gain.linearRampToValueAtTime(0.2, now + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1)

    osc.type = 'sine'
    osc.start(now)
    osc.stop(now + 0.1)
  }, [isMuted])

  // Play victory sound (triumphant fanfare)
  const playVictory = useCallback(() => {
    if (isMuted || !audioContextRef.current) return

    const ctx = audioContextRef.current
    const now = ctx.currentTime

    // Play a sequence of ascending notes
    const notes = [262, 330, 392, 523] // C, E, G, C (major chord)
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gainNode = ctx.createGain()

      osc.connect(gainNode)
      gainNode.connect(ctx.destination)

      const startTime = now + i * 0.12
      osc.frequency.setValueAtTime(freq, startTime)

      gainNode.gain.setValueAtTime(0, startTime)
      gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.03)
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.25)

      osc.type = 'triangle'
      osc.start(startTime)
      osc.stop(startTime + 0.25)
    })
  }, [isMuted])

  // Play defeat sound (sad descending tone)
  const playDefeat = useCallback(() => {
    if (isMuted || !audioContextRef.current) return

    const ctx = audioContextRef.current
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gainNode = ctx.createGain()

    osc.connect(gainNode)
    gainNode.connect(ctx.destination)

    // Descending frequency (sad trombone effect)
    osc.frequency.setValueAtTime(300, now)
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.4)

    // Fade in and out
    gainNode.gain.setValueAtTime(0, now)
    gainNode.gain.linearRampToValueAtTime(0.15, now + 0.03)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4)

    osc.type = 'sawtooth'
    osc.start(now)
    osc.stop(now + 0.4)
  }, [isMuted])

  // Play draw sound (neutral tone)
  const playDraw = useCallback(() => {
    if (isMuted || !audioContextRef.current) return

    const ctx = audioContextRef.current
    const now = ctx.currentTime

    // Play two tones simultaneously
    ;[220, 330].forEach((freq) => {
      const osc = ctx.createOscillator()
      const gainNode = ctx.createGain()

      osc.connect(gainNode)
      gainNode.connect(ctx.destination)

      osc.frequency.setValueAtTime(freq, now)

      gainNode.gain.setValueAtTime(0, now)
      gainNode.gain.linearRampToValueAtTime(0.12, now + 0.03)
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.25)

      osc.type = 'sine'
      osc.start(now)
      osc.stop(now + 0.25)
    })
  }, [isMuted])

  // Play click sound (UI feedback)
  const playClick = useCallback(() => {
    if (isMuted || !audioContextRef.current) return

    const ctx = audioContextRef.current
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gainNode = ctx.createGain()

    osc.connect(gainNode)
    gainNode.connect(ctx.destination)

    osc.frequency.setValueAtTime(800, now)
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.04)

    gainNode.gain.setValueAtTime(0.08, now)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.04)

    osc.type = 'square'
    osc.start(now)
    osc.stop(now + 0.04)
  }, [isMuted])

  // Play hover sound (subtle UI feedback)
  const playHover = useCallback(() => {
    if (isMuted || !audioContextRef.current) return

    const ctx = audioContextRef.current
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gainNode = ctx.createGain()

    osc.connect(gainNode)
    gainNode.connect(ctx.destination)

    osc.frequency.setValueAtTime(600, now)

    gainNode.gain.setValueAtTime(0.03, now)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.02)

    osc.type = 'sine'
    osc.start(now)
    osc.stop(now + 0.02)
  }, [isMuted])

  // Play any sound effect
  const playSound = useCallback(
    (effect: SoundEffect) => {
      switch (effect) {
        case 'markPlace':
          playMarkPlace()
          break
        case 'victory':
          playVictory()
          break
        case 'defeat':
          playDefeat()
          break
        case 'draw':
          playDraw()
          break
        case 'click':
          playClick()
          break
        case 'hover':
          playHover()
          break
      }
    },
    [playMarkPlace, playVictory, playDefeat, playDraw, playClick, playHover]
  )

  return {
    isMuted,
    toggleMute,
    playSound,
    playMarkPlace,
    playVictory,
    playDefeat,
    playDraw,
    playClick,
    playHover,
  }
}
