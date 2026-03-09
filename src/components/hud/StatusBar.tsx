import { useGameStore } from '../../stores/gameStore'
import { CHARACTERS } from '../../data/characters'

export function StatusBar() {
  const week = useGameStore((s) => s.gameState.week)
  const affinity = useGameStore((s) => s.gameState.affinity)
  const adaptation = useGameStore((s) => s.gameState.adaptation)

  if (week === 0) return null // Don't show during prologue

  const hearts = (score: number) => {
    const filled = Math.floor(score / 20)
    return Array.from({ length: 5 }, (_, i) =>
      i < filled ? '♥' : '♡',
    ).join('')
  }

  return (
    <div
      className="absolute top-0 left-0 right-0 px-4 py-2 flex items-center justify-between text-xs z-10"
      style={{
        backgroundColor: 'rgba(10, 10, 30, 0.7)',
        borderBottom: '1px solid rgba(135, 206, 235, 0.15)',
      }}
    >
      <div className="flex items-center gap-4">
        <span className="text-pleiades-sky/70 font-bold">
          Week {week}/12
        </span>

        {Object.entries(affinity).map(([charId, score]) => {
          const char = CHARACTERS[charId]
          if (!char || score === 0) return null
          return (
            <span key={charId} className="flex items-center gap-1">
              <span style={{ color: char.nameColor }}>{char.name}</span>
              <span style={{ color: char.nameColor }}>{hearts(score)}</span>
            </span>
          )
        })}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-pleiades-sky/50">適応度</span>
        <div className="w-20 h-2 rounded-full overflow-hidden bg-white/10">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${adaptation}%`,
              background:
                adaptation > 80
                  ? 'linear-gradient(90deg, #e94560, #ff6b6b)'
                  : adaptation > 60
                    ? 'linear-gradient(90deg, #2ecc71, #27ae60)'
                    : adaptation < 20
                      ? 'linear-gradient(90deg, #e74c3c, #c0392b)'
                      : 'linear-gradient(90deg, #3498db, #2980b9)',
            }}
          />
        </div>
        <span className="text-pleiades-sky/50 w-6 text-right">{adaptation}</span>
      </div>
    </div>
  )
}
