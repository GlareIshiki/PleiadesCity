import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../../stores/gameStore'
import { AudioManager } from '../../systems/AudioManager'

export function TitleScreen() {
  const [showNameInput, setShowNameInput] = useState(false)
  const [playerName, setPlayerName] = useState('')
  const startNewGame = useGameStore((s) => s.startNewGame)
  const loadFromSlot = useGameStore((s) => s.loadFromSlot)

  // Play title BGM
  useEffect(() => {
    AudioManager.play('title', 2000)
  }, [])

  const handleStart = () => {
    if (showNameInput) {
      const name = playerName.trim() || '主人公'
      AudioManager.stop(800)
      startNewGame(name)
    } else {
      // Resume audio on first user interaction (autoplay policy)
      AudioManager.resume()
      setShowNameInput(true)
    }
  }

  const handleContinue = () => {
    // Try auto-save first, then slot 0
    const result = loadFromSlot(-1) ?? loadFromSlot(0)
    if (!result) {
      alert('セーブデータがありません')
    }
  }

  const hasSaveData = localStorage.getItem('pleiades_save_-1') || localStorage.getItem('pleiades_save_0')

  return (
    <div
      className="relative w-full h-full max-w-[1280px] max-h-[720px] overflow-hidden flex flex-col items-center justify-center"
      style={{
        aspectRatio: '16 / 9',
        background: 'linear-gradient(180deg, #0a0a1a 0%, #16213e 40%, #0f3460 70%, #1a1a2e 100%)',
        boxShadow: '0 0 60px rgba(0, 0, 0, 0.8)',
      }}
    >
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 40 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
            }}
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Ocean shimmer at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1/4"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(70, 130, 180, 0.15) 100%)',
        }}
      />

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
        className="text-center mb-16 z-10"
      >
        <h1
          className="text-5xl font-bold mb-3 tracking-[0.2em]"
          style={{
            fontFamily: 'var(--font-serif)',
            color: '#e8d5b7',
            textShadow: '0 0 40px rgba(232, 213, 183, 0.3)',
          }}
        >
          プレアデス市国
        </h1>
        <p
          className="text-sm tracking-[0.5em] opacity-50"
          style={{ color: '#87CEEB' }}
        >
          PLEIADES CITY-STATE
        </p>
      </motion.div>

      {/* Menu */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="flex flex-col items-center gap-4 z-10"
      >
        {showNameInput ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4"
          >
            <p className="text-sm opacity-60">名前を入力してください</p>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleStart()}
              placeholder="主人公"
              autoFocus
              className="px-4 py-2 bg-white/10 border border-pleiades-sky/30 rounded
                         text-center text-pleiades-sand outline-none focus:border-pleiades-sky/60
                         w-48 placeholder:text-white/20"
            />
            <button
              onClick={handleStart}
              className="px-8 py-2 text-sm tracking-wider cursor-pointer
                         border border-pleiades-sky/30 rounded
                         hover:bg-pleiades-sky/10 hover:border-pleiades-sky/50
                         transition-all duration-300"
              style={{ color: '#e8d5b7' }}
            >
              はじめる
            </button>
          </motion.div>
        ) : (
          <>
            <button
              onClick={handleStart}
              className="px-10 py-3 text-base tracking-[0.3em] cursor-pointer
                         border border-pleiades-sky/30 rounded-lg
                         hover:bg-pleiades-sky/10 hover:border-pleiades-sky/50
                         transition-all duration-300"
              style={{ color: '#e8d5b7' }}
            >
              NEW GAME
            </button>
            {hasSaveData && (
              <button
                onClick={handleContinue}
                className="px-10 py-3 text-base tracking-[0.3em] cursor-pointer
                           border border-pleiades-sky/20 rounded-lg
                           hover:bg-pleiades-sky/10 hover:border-pleiades-sky/40
                           transition-all duration-300 opacity-70 hover:opacity-100"
                style={{ color: '#87CEEB' }}
              >
                CONTINUE
              </button>
            )}
          </>
        )}
      </motion.div>

      {/* Footer */}
      <div className="absolute bottom-4 text-xs opacity-20 tracking-wider">
        Gounod Dale
      </div>
    </div>
  )
}
