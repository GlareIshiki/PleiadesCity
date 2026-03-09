import { AnimatePresence, motion } from 'framer-motion'
import { useGameStore } from '../../stores/gameStore'
import { CHARACTERS } from '../../data/characters'
import { PlaceholderImage } from '../ui/PlaceholderImage'
import type { CharacterOnScreen } from '../../engine/types'

const positionStyles: Record<string, React.CSSProperties> = {
  left: { left: '10%', transform: 'translateX(-50%)' },
  center: { left: '50%', transform: 'translateX(-50%)' },
  right: { left: '90%', transform: 'translateX(-50%)' },
}

function CharacterSpriteItem({ char }: { char: CharacterOnScreen }) {
  const def = CHARACTERS[char.id]
  if (!def) return null

  const imagePath = def.expressions[char.expression] ?? def.expressions[def.defaultExpression] ?? ''
  const posStyle = positionStyles[char.position] ?? positionStyles.center

  return (
    <motion.div
      key={char.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="absolute"
      style={{
        ...posStyle,
        bottom: '-35%',
        width: '800px',
        height: '130%',
      }}
    >
      <PlaceholderImage
        src={imagePath}
        fallbackGradient={`linear-gradient(180deg, ${def.nameColor}40 0%, ${def.nameColor}20 100%)`}
        label={def.name}
        type="character"
        className="w-full h-full object-contain object-bottom"
      />
    </motion.div>
  )
}

export function CharacterSprites() {
  const characters = useGameStore((s) => s.display.characters)

  return (
    <div className="absolute inset-0 pointer-events-none">
      <AnimatePresence>
        {characters.map((char) => (
          <CharacterSpriteItem key={char.id} char={char} />
        ))}
      </AnimatePresence>
    </div>
  )
}
