import { useState, useEffect } from 'react'
import { useGameStore } from './stores/gameStore'
import { useAuthStore } from './stores/authStore'
import { GameScreen } from './components/game/GameScreen'
import { TitleScreen } from './components/system/TitleScreen'
import { ScheduleScreen } from './components/schedule/ScheduleScreen'
import { SaveLoadScreen } from './components/system/SaveLoadScreen'
import { DebugPanel } from './components/debug/DebugPanel'

export default function App() {
  const screen = useGameStore((s) => s.screen)
  const initAuth = useAuthStore((s) => s.initialize)
  const [debugOpen, setDebugOpen] = useState(false)

  useEffect(() => {
    initAuth()
  }, [initAuth])

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
      {screen === 'save' && <SaveLoadScreen mode="save" />}
      {screen === 'load' && <SaveLoadScreen mode="load" />}
      {debugOpen && <DebugPanel onClose={() => setDebugOpen(false)} />}
    </>
  )
}
