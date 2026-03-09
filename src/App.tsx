import { useState, useEffect } from 'react'
import { useGameStore } from './stores/gameStore'
import { GameScreen } from './components/game/GameScreen'
import { TitleScreen } from './components/system/TitleScreen'
import { ScheduleScreen } from './components/schedule/ScheduleScreen'
import { DebugPanel } from './components/debug/DebugPanel'

export default function App() {
  const screen = useGameStore((s) => s.screen)
  const [debugOpen, setDebugOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F3') {
        e.preventDefault()
        setDebugOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      {screen === 'title' && <TitleScreen />}
      {screen === 'game' && <GameScreen />}
      {screen === 'schedule' && <ScheduleScreen />}
      {debugOpen && <DebugPanel onClose={() => setDebugOpen(false)} />}
    </>
  )
}
