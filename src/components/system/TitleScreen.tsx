import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../../stores/gameStore'
import { useAuthStore } from '../../stores/authStore'
import { AudioManager } from '../../systems/AudioManager'
import { preloadAllImages } from '../../systems/ImagePreloader'

type TitlePhase = 'auth' | 'menu' | 'name'

export function TitleScreen() {
  const user = useAuthStore((s) => s.user)
  const authLoading = useAuthStore((s) => s.loading)
  const signInWithGoogle = useAuthStore((s) => s.signInWithGoogle)
  const signOut = useAuthStore((s) => s.signOut)

  // Skip auth selection if already logged in
  const [phase, setPhase] = useState<TitlePhase>(user ? 'menu' : 'auth')
  const [playerName, setPlayerName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)
  const startNewGame = useGameStore((s) => s.startNewGame)
  const loadFromSlot = useGameStore((s) => s.loadFromSlot)
  const setScreen = useGameStore((s) => s.setScreen)

  // When auth finishes loading, go to menu if already logged in
  useEffect(() => {
    if (!authLoading && user && phase === 'auth') {
      setPhase('menu')
    }
  }, [authLoading, user, phase])

  // Play title BGM
  useEffect(() => {
    AudioManager.play('title', 2000)
  }, [])

  // Preload images on mount (background)
  useEffect(() => {
    preloadAllImages()
  }, [])

  const handleSkipAuth = () => {
    AudioManager.resume()
    setPhase('menu')
  }

  const handleNewGame = () => {
    AudioManager.resume()
    setPhase('name')
  }

  const handleStartGame = async () => {
    const name = playerName.trim() || '主人公'
    setIsLoading(true)
    await preloadAllImages((loaded, total) => {
      setLoadProgress(Math.round((loaded / total) * 100))
    })
    AudioManager.stop(800)
    startNewGame(name)
  }

  const handleContinue = () => {
    AudioManager.resume()
    const result = loadFromSlot(-1) ?? loadFromSlot(0)
    if (!result) {
      alert('セーブデータがありません')
    }
  }

  const hasSaveData = localStorage.getItem('pleiades_save_-1') || localStorage.getItem('pleiades_save_0')

  return (
    <div
      className="relative w-full h-full overflow-hidden flex flex-col items-center justify-center"
      style={{
        background: 'linear-gradient(180deg, #0a0a1a 0%, #16213e 40%, #0f3460 70%, #1a1a2e 100%)',
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
        {phase === 'auth' && !authLoading && (
          <>
            <button
              onClick={signInWithGoogle}
              className="px-10 py-3 text-base tracking-[0.3em] cursor-pointer
                         border border-pleiades-sky/30 rounded-lg
                         hover:bg-pleiades-sky/10 hover:border-pleiades-sky/50
                         transition-all duration-300"
              style={{ color: '#e8d5b7' }}
            >
              Google でログイン
            </button>
            <button
              onClick={handleSkipAuth}
              className="px-10 py-3 text-base tracking-[0.3em] cursor-pointer
                         border border-pleiades-sky/20 rounded-lg
                         hover:bg-pleiades-sky/10 hover:border-pleiades-sky/40
                         transition-all duration-300 opacity-60 hover:opacity-90"
              style={{ color: '#87CEEB' }}
            >
              ログインせずに始める
            </button>
            <p className="text-xs opacity-30 mt-2" style={{ color: '#87CEEB' }}>
              ログインするとセーブデータがクラウドに保存されます
            </p>
          </>
        )}

        {phase === 'menu' && (
          <>
            <button
              onClick={handleNewGame}
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
            <button
              onClick={() => { AudioManager.resume(); setScreen('load') }}
              className="px-10 py-3 text-base tracking-[0.3em] cursor-pointer
                         border border-pleiades-sky/20 rounded-lg
                         hover:bg-pleiades-sky/10 hover:border-pleiades-sky/40
                         transition-all duration-300 opacity-50 hover:opacity-80"
              style={{ color: '#87CEEB' }}
            >
              LOAD
            </button>
          </>
        )}

        {phase === 'name' && (
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
              onKeyDown={(e) => e.key === 'Enter' && handleStartGame()}
              placeholder="主人公"
              autoFocus
              className="px-4 py-2 bg-white/10 border border-pleiades-sky/30 rounded
                         text-center text-pleiades-sand outline-none focus:border-pleiades-sky/60
                         w-48 placeholder:text-white/20"
            />
            <button
              onClick={handleStartGame}
              disabled={isLoading}
              className="px-8 py-2 text-sm tracking-wider cursor-pointer
                         border border-pleiades-sky/30 rounded
                         hover:bg-pleiades-sky/10 hover:border-pleiades-sky/50
                         transition-all duration-300 disabled:opacity-50 disabled:cursor-wait"
              style={{ color: '#e8d5b7' }}
            >
              {isLoading ? `Loading... ${loadProgress}%` : 'はじめる'}
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* User info (when logged in, shown on menu/name phase) */}
      {user && phase !== 'auth' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-12 z-10"
        >
          <div className="flex items-center gap-2 text-xs opacity-50">
            {user.user_metadata?.avatar_url && (
              <img
                src={user.user_metadata.avatar_url}
                alt=""
                className="w-5 h-5 rounded-full"
              />
            )}
            <span style={{ color: '#87CEEB' }}>
              {user.user_metadata?.full_name ?? user.email}
            </span>
            <button
              onClick={signOut}
              className="underline ml-1 cursor-pointer hover:opacity-80"
              style={{ color: '#87CEEB' }}
            >
              Logout
            </button>
          </div>
        </motion.div>
      )}

      {/* Footer */}
      <div className="absolute bottom-4 text-xs opacity-20 tracking-wider">
        Gounod Dale
      </div>
    </div>
  )
}
