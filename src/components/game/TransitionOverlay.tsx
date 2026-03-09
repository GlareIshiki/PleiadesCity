import { AnimatePresence, motion } from 'framer-motion'
import { useGameStore } from '../../stores/gameStore'

export function TransitionOverlay() {
  const transition = useGameStore((s) => s.display.transition)

  const getColor = () => {
    if (!transition) return 'black'
    if (transition.effect === 'fade_white') return 'white'
    return 'black'
  }

  return (
    <AnimatePresence>
      {transition?.active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 z-50 pointer-events-none"
          style={{ backgroundColor: getColor() }}
        />
      )}
    </AnimatePresence>
  )
}
