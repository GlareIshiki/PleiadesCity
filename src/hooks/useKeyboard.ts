import { useEffect } from 'react'
import { useGameStore } from '../stores/gameStore'

export function useKeyboard(onAdvance: () => void) {
  const screen = useGameStore((s) => s.screen)

  useEffect(() => {
    if (screen !== 'game') return

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ':
        case 'Enter':
          e.preventDefault()
          onAdvance()
          break
        case 'Escape':
          // Could toggle menu later
          break
        case 'a':
          useGameStore.getState().setAutoMode(!useGameStore.getState().autoMode)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [screen, onAdvance])
}
