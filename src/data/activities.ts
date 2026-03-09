import type { Activity, WeekSchedule } from '../engine/types'

export const ACTIVITIES: Record<string, Activity> = {
  cooking_basic: {
    id: 'cooking_basic',
    name: '料理教室（イタリアン）',
    description: 'パスタやリゾットを作りながら、隣の人と自然に会話が生まれる。',
    icon: '🍳',
    characterEncounters: ['aaa'],
    adaptationDelta: 2,
    sceneId: 'week01_cooking',
    aiRecommendWeight: 3,
  },
  boardgame_night: {
    id: 'boardgame_night',
    name: 'ボードゲーム会',
    description: '「ゲームをやる」という口実が、初対面の会話のハードルを下げてくれる。',
    icon: '🎲',
    characterEncounters: ['bbb'],
    adaptationDelta: 1,
    sceneId: 'week01_boardgame',
    aiRecommendWeight: 2,
  },
  library_reading: {
    id: 'library_reading',
    name: '読書会',
    description: '静かな図書館で、好きな本について語り合う。内省的な時間。',
    icon: '📖',
    characterEncounters: ['aaa'],
    adaptationDelta: 1,
    sceneId: 'week01_library',
    aiRecommendWeight: 1,
  },
}

export const WEEK_SCHEDULES: Record<number, WeekSchedule> = {
  1: {
    weekNumber: 1,
    availableActivities: ['cooking_basic', 'boardgame_night', 'library_reading'],
    aiRecommendation: 'cooking_basic',
    aiReason: '入植初週は料理教室がおすすめです。日常的なスキルが身につき、自然な会話が生まれやすい環境です。',
  },
}
