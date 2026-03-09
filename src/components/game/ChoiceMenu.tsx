import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../stores/gameStore'

interface ChoiceMenuProps {
  onChoice: (index: number) => void
}

export function ChoiceMenu({ onChoice }: ChoiceMenuProps) {
  const choices = useGameStore((s) => s.display.choices)

  if (!choices) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 flex items-center justify-center"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
      >
        <div className="flex flex-col gap-3 w-full max-w-lg px-8">
          {choices.map((choice, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => onChoice(i)}
              className="group relative px-6 py-4 text-left rounded-lg cursor-pointer
                         transition-all duration-200 hover:scale-[1.02]"
              style={{
                backgroundColor: 'rgba(10, 10, 30, 0.9)',
                border: '1px solid rgba(135, 206, 235, 0.25)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(135, 206, 235, 0.6)'
                e.currentTarget.style.backgroundColor = 'rgba(15, 52, 96, 0.9)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(135, 206, 235, 0.25)'
                e.currentTarget.style.backgroundColor = 'rgba(10, 10, 30, 0.9)'
              }}
            >
              <span className="text-sm text-pleiades-sky/40 mr-3">
                {i + 1}.
              </span>
              <span className="text-base" style={{ fontFamily: 'var(--font-serif)' }}>
                {choice.text}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
