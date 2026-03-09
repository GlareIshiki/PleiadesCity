import { useState } from 'react'
import { useGameStore } from '../../stores/gameStore'
import { SCENE_REGISTRY } from '../../scenarios'
import { CHARACTERS } from '../../data/characters'

export function DebugPanel({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<'scenes' | 'state' | 'flags'>('scenes')
  const store = useGameStore()
  const { gameState, display } = store

  const scenes = Object.entries(SCENE_REGISTRY).map(([id, scene]) => ({
    id,
    label: scene.label ?? id,
  }))

  const jumpToScene = (sceneId: string) => {
    // Ensure we're in game mode with a valid player name
    if (!gameState.playerName) {
      store.startNewGame('主人公')
    } else {
      store.setScreen('game')
    }
    // Clear display state and load scene
    store.loadScene(sceneId)
    onClose()
  }

  const tabs = [
    { key: 'scenes' as const, label: 'Scenes' },
    { key: 'state' as const, label: 'State' },
    { key: 'flags' as const, label: 'Flags' },
  ]

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
      onClick={onClose}
    >
      <div
        className="bg-gray-900 border border-gray-600 rounded-lg shadow-2xl w-[700px] max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 font-mono text-sm font-bold">DEBUG</span>
            <span className="text-gray-400 text-xs">F3 to close</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-lg leading-none"
          >
            x
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 text-sm font-mono transition-colors ${
                tab === t.key
                  ? 'text-yellow-400 border-b-2 border-yellow-400 bg-gray-800'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {tab === 'scenes' && (
            <div className="space-y-1">
              {scenes.map((scene) => (
                <button
                  key={scene.id}
                  onClick={() => jumpToScene(scene.id)}
                  className={`w-full text-left px-3 py-2 rounded text-sm font-mono transition-colors ${
                    gameState.currentSceneId === scene.id
                      ? 'bg-yellow-400/20 text-yellow-300'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <span className="text-gray-500 mr-2">{scene.id}</span>
                  <span>{scene.label}</span>
                </button>
              ))}
            </div>
          )}

          {tab === 'state' && (
            <div className="space-y-4 text-sm font-mono">
              {/* Basic Info */}
              <Section title="Basic">
                <Row label="Screen" value={store.screen} />
                <Row label="Scene" value={gameState.currentSceneId || '(none)'} />
                <Row label="Week" value={String(gameState.week)} />
                <Row label="Player" value={gameState.playerName || '(none)'} />
                <Row label="Adaptation" value={String(gameState.adaptation)} />
                <Row label="Queue" value={`${store.commandQueue.length} commands`} />
              </Section>

              {/* Affinity */}
              <Section title="Affinity">
                {Object.entries(gameState.affinity).map(([charId, val]) => (
                  <div key={charId} className="flex items-center justify-between py-1">
                    <span className="text-gray-400">
                      {CHARACTERS[charId]?.name ?? charId}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => store.modifyAffinity(charId, -5)}
                        className="text-red-400 hover:text-red-300 px-1"
                      >
                        -5
                      </button>
                      <span className="text-white w-8 text-center">{val}</span>
                      <button
                        onClick={() => store.modifyAffinity(charId, 5)}
                        className="text-green-400 hover:text-green-300 px-1"
                      >
                        +5
                      </button>
                    </div>
                  </div>
                ))}
              </Section>

              {/* Display */}
              <Section title="Display">
                <Row label="Background" value={display.background ?? '(none)'} />
                <Row
                  label="Characters"
                  value={
                    display.characters.length > 0
                      ? display.characters
                          .map((c) => `${c.id}(${c.expression})`)
                          .join(', ')
                      : '(none)'
                  }
                />
                <Row label="Waiting" value={store.waitingForInput ? 'Yes' : 'No'} />
                <Row label="Transitioning" value={store.isTransitioning ? 'Yes' : 'No'} />
              </Section>
            </div>
          )}

          {tab === 'flags' && (
            <div className="space-y-1 text-sm font-mono">
              {Object.keys(gameState.flags).length === 0 ? (
                <p className="text-gray-500">No flags set</p>
              ) : (
                Object.entries(gameState.flags).map(([key, val]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between py-1 px-2 rounded hover:bg-gray-800"
                  >
                    <span className="text-gray-300">{key}</span>
                    <span
                      className={
                        val === true
                          ? 'text-green-400'
                          : val === false
                            ? 'text-red-400'
                            : 'text-yellow-400'
                      }
                    >
                      {String(val)}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-yellow-400 text-xs uppercase tracking-wider mb-2">{title}</h3>
      <div className="bg-gray-800 rounded p-2 space-y-1">{children}</div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-0.5">
      <span className="text-gray-400">{label}</span>
      <span className="text-gray-200">{value}</span>
    </div>
  )
}
