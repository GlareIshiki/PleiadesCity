import { useState } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../../stores/gameStore'
import { ACTIVITIES, WEEK_SCHEDULES } from '../../data/activities'
import { CHARACTERS } from '../../data/characters'

export function ScheduleScreen() {
  const week = useGameStore((s) => s.gameState.week)
  const setScreen = useGameStore((s) => s.setScreen)
  const loadScene = useGameStore((s) => s.loadScene)
  const setChosenActivity = useGameStore((s) => s.setChosenActivity)
  const modifyAdaptation = useGameStore((s) => s.modifyAdaptation)

  const [selected, setSelected] = useState<string | null>(null)

  const schedule = WEEK_SCHEDULES[week]
  if (!schedule) {
    // No schedule for this week, skip
    return null
  }

  const handleConfirm = () => {
    if (!selected) return
    const activity = ACTIVITIES[selected]
    if (!activity) return

    setChosenActivity(selected)
    modifyAdaptation(activity.adaptationDelta)
    setScreen('game')
    loadScene(activity.sceneId)
  }

  return (
    <div
      className="relative w-full h-full max-w-[1280px] max-h-[720px] overflow-hidden flex flex-col"
      style={{
        aspectRatio: '16 / 9',
        background: 'linear-gradient(180deg, #0a0a1a 0%, #16213e 50%, #0f3460 100%)',
        boxShadow: '0 0 60px rgba(0, 0, 0, 0.8)',
      }}
    >
      {/* Header */}
      <div className="text-center pt-8 pb-4">
        <h2
          className="text-2xl font-bold tracking-wider mb-1"
          style={{ color: '#e8d5b7', fontFamily: 'var(--font-serif)' }}
        >
          第{week}週 スケジュール
        </h2>
        <p className="text-xs opacity-40 tracking-wider">
          コミュニティ活動を選択してください
        </p>
      </div>

      {/* AI Recommendation */}
      <div className="mx-auto w-full max-w-2xl px-6 mb-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-3 rounded-lg"
          style={{
            backgroundColor: 'rgba(15, 52, 96, 0.6)',
            border: '1px solid rgba(135, 206, 235, 0.2)',
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2 py-0.5 rounded bg-pleiades-sky/20 text-pleiades-sky">
              AI
            </span>
            <span className="text-xs opacity-50">おすすめ</span>
          </div>
          <p className="text-sm opacity-70 leading-relaxed">
            {schedule.aiReason}
          </p>
        </motion.div>
      </div>

      {/* Activity Cards */}
      <div className="flex-1 mx-auto w-full max-w-2xl px-6 overflow-y-auto">
        <div className="grid grid-cols-1 gap-3">
          {schedule.availableActivities.map((actId, i) => {
            const activity = ACTIVITIES[actId]
            if (!activity) return null
            const isSelected = selected === actId
            const isRecommended = schedule.aiRecommendation === actId

            return (
              <motion.button
                key={actId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setSelected(actId)}
                className="relative px-5 py-4 rounded-lg text-left transition-all duration-200 cursor-pointer"
                style={{
                  backgroundColor: isSelected
                    ? 'rgba(15, 52, 96, 0.8)'
                    : 'rgba(10, 10, 30, 0.6)',
                  border: isSelected
                    ? '2px solid rgba(135, 206, 235, 0.6)'
                    : '1px solid rgba(135, 206, 235, 0.15)',
                  transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{activity.icon}</span>
                    <div>
                      <div className="font-bold text-sm flex items-center gap-2">
                        {activity.name}
                        {isRecommended && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-pleiades-sky/20 text-pleiades-sky">
                            AI推薦
                          </span>
                        )}
                      </div>
                      <p className="text-xs opacity-50 mt-1">
                        {activity.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-xs opacity-50 flex flex-col gap-1 ml-4 shrink-0">
                    <span>適応 +{activity.adaptationDelta}</span>
                    {activity.characterEncounters.map((charId) => {
                      const char = CHARACTERS[charId]
                      return char ? (
                        <span key={charId} style={{ color: char.nameColor }}>
                          {char.name} 出現
                        </span>
                      ) : null
                    })}
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Confirm button */}
      <div className="px-6 py-6 flex justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleConfirm}
          disabled={!selected}
          className="px-12 py-3 rounded-lg text-base tracking-wider cursor-pointer
                     transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            backgroundColor: selected ? 'rgba(15, 52, 96, 0.8)' : 'rgba(10, 10, 30, 0.4)',
            border: selected
              ? '2px solid rgba(135, 206, 235, 0.5)'
              : '1px solid rgba(135, 206, 235, 0.1)',
            color: '#e8d5b7',
          }}
        >
          決定
        </motion.button>
      </div>
    </div>
  )
}
