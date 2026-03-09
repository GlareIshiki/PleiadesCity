import { useState, useEffect } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { useAuthStore } from '../../stores/authStore'
import type { SaveSlot } from '../../engine/types'
import { SAVE_SLOT_COUNT } from '../../data/constants'

interface Props {
  mode: 'save' | 'load'
}

function formatDate(timestamp: number): string {
  const d = new Date(timestamp)
  return d.toLocaleDateString('ja-JP', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function SaveLoadScreen({ mode }: Props) {
  const [slots, setSlots] = useState<(SaveSlot | null)[]>(Array(SAVE_SLOT_COUNT).fill(null))
  const [loading, setLoading] = useState(true)
  const fetchSaveSlots = useGameStore((s) => s.fetchSaveSlots)
  const saveToSlot = useGameStore((s) => s.saveToSlot)
  const loadFromSlot = useGameStore((s) => s.loadFromSlot)
  const deleteSave = useGameStore((s) => s.deleteSave)
  const setScreen = useGameStore((s) => s.setScreen)
  const screen = useGameStore((s) => s.screen)
  const user = useAuthStore((s) => s.user)

  // Where to go back
  const previousScreen = useGameStore((s) => s.gameState.currentSceneId) ? 'game' : 'title'

  useEffect(() => {
    fetchSaveSlots().then((s) => {
      setSlots(s)
      setLoading(false)
    })
  }, [fetchSaveSlots])

  const handleSlotClick = (index: number) => {
    if (mode === 'save') {
      if (slots[index] && !confirm(`スロット ${index + 1} を上書きしますか？`)) return
      saveToSlot(index)
      // Refresh
      fetchSaveSlots().then(setSlots)
    } else {
      const slot = slots[index]
      if (!slot) return
      loadFromSlot(slot.id)
    }
  }

  const handleDelete = (e: React.MouseEvent, index: number) => {
    e.stopPropagation()
    if (!confirm(`スロット ${index + 1} を削除しますか？`)) return
    deleteSave(index)
    setSlots((prev) => {
      const next = [...prev]
      next[index] = null
      return next
    })
  }

  const handleBack = () => {
    setScreen(previousScreen as 'game' | 'title')
  }

  return (
    <div
      className="relative w-full h-full overflow-hidden flex flex-col"
      style={{
        background: 'linear-gradient(180deg, #0a0a1a 0%, #16213e 50%, #0f3460 100%)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-6">
        <h1
          className="text-2xl tracking-[0.2em]"
          style={{ color: '#e8d5b7', fontFamily: 'var(--font-serif)' }}
        >
          {mode === 'save' ? 'SAVE' : 'LOAD'}
        </h1>
        <div className="flex items-center gap-4">
          {user && (
            <span className="text-xs opacity-40" style={{ color: '#87CEEB' }}>
              Cloud Save ON
            </span>
          )}
          <button
            onClick={handleBack}
            className="px-4 py-2 text-sm tracking-wider cursor-pointer
                       border border-pleiades-sky/30 rounded
                       hover:bg-pleiades-sky/10 hover:border-pleiades-sky/50
                       transition-all duration-300"
            style={{ color: '#87CEEB' }}
          >
            BACK
          </button>
        </div>
      </div>

      {/* Slots grid */}
      <div className="flex-1 px-8 pb-8 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full opacity-50">
            Loading...
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto">
            {slots.map((slot, i) => (
              <button
                key={i}
                onClick={() => handleSlotClick(i)}
                className={`relative text-left p-5 rounded-lg border cursor-pointer
                  transition-all duration-200 group
                  ${slot
                    ? 'border-pleiades-sky/30 hover:border-pleiades-sky/60 hover:bg-pleiades-sky/5'
                    : mode === 'save'
                      ? 'border-white/10 hover:border-pleiades-sky/30 hover:bg-pleiades-sky/5'
                      : 'border-white/5 opacity-30 cursor-default'
                  }`}
                style={{ backgroundColor: 'rgba(10, 10, 30, 0.6)' }}
                disabled={mode === 'load' && !slot}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-sm font-bold tracking-wider"
                    style={{ color: '#e8d5b7' }}
                  >
                    Slot {i + 1}
                  </span>
                  {slot && (
                    <span
                      className="text-xs opacity-50 cursor-pointer hover:opacity-80 hover:text-red-400 transition-all"
                      onClick={(e) => handleDelete(e, i)}
                    >
                      DELETE
                    </span>
                  )}
                </div>

                {slot ? (
                  <div className="space-y-1">
                    <div className="text-sm" style={{ color: '#87CEEB' }}>
                      {slot.gameState.playerName} - Week {slot.week}/12
                    </div>
                    <div className="text-xs opacity-40">
                      {formatDate(slot.timestamp)}
                    </div>
                    <div className="text-xs opacity-30">
                      Scene: {slot.gameState.currentSceneId}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm opacity-30 py-2">
                    Empty
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
