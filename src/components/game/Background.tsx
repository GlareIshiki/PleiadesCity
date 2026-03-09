import { AnimatePresence, motion } from 'framer-motion'
import { useGameStore } from '../../stores/gameStore'
import { BACKGROUNDS } from '../../data/backgrounds'
import { PlaceholderImage } from '../ui/PlaceholderImage'

export function Background() {
  const bgId = useGameStore((s) => s.display.background)
  const bg = bgId ? BACKGROUNDS[bgId] : null

  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatePresence mode="wait">
        {bg ? (
          <motion.div
            key={bg.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <PlaceholderImage
              src={bg.imagePath}
              fallbackGradient={bg.fallbackColor}
              label={bg.label}
              type="background"
              className="w-full h-full object-cover"
              style={{ position: 'absolute', inset: 0 }}
            />
          </motion.div>
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, #0a0a1a 0%, #1a1a2e 100%)',
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
