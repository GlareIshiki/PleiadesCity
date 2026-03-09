import type { CharacterDefinition } from '../engine/types'

export const CHARACTERS: Record<string, CharacterDefinition> = {
  aaa: {
    id: 'aaa',
    name: '燈叶',
    nameColor: '#9370DB',
    textColor: '#e8e0f0',
    expressions: {
      normal: '/assets/characters/aaa/normal.png',
      happy: '/assets/characters/aaa/happy.png',
      sad: '/assets/characters/aaa/sad.png',
      thinking: '/assets/characters/aaa/thinking.png',
      embarrassed: '/assets/characters/aaa/embarrassed.png',
      worried: '/assets/characters/aaa/worried.png',
      excited: '/assets/characters/aaa/excited.png',
      confused: '/assets/characters/aaa/confused.png',
      confused_light: '/assets/characters/aaa/confused_light.png',
    },
    defaultExpression: 'normal',
    description: '藤色の髪、琥珀がかった灰色の瞳。静かで知的。',
  },
  bbb: {
    id: 'bbb',
    name: 'BBB',
    nameColor: '#DAA520',
    textColor: '#fff8e7',
    expressions: {
      normal: '/assets/characters/bbb/normal.png',
      happy: '/assets/characters/bbb/happy.png',
      playful: '/assets/characters/bbb/playful.png',
      serious: '/assets/characters/bbb/serious.png',
      teasing: '/assets/characters/bbb/teasing.png',
      embarrassed: '/assets/characters/bbb/embarrassed.png',
    },
    defaultExpression: 'normal',
    description: '蜂蜜色の巻き髪、オッドアイ。自由奔放。',
  },
  staff: {
    id: 'staff',
    name: 'スタッフ',
    nameColor: '#5B8FA8',
    textColor: '#d0e8f0',
    expressions: {
      normal: '/assets/characters/staff/normal.png',
    },
    defaultExpression: 'normal',
    description: 'プレアデス市国の案内スタッフ。30代、チャコールのスーツ。',
  },
  master: {
    id: 'master',
    name: 'マスター',
    nameColor: '#C0855C',
    textColor: '#f0e0d0',
    expressions: {
      normal: '/assets/characters/master/normal.png',
    },
    defaultExpression: 'normal',
    description: 'シーシャバーのマスター。落ち着いた中年男性、整えた髭。',
  },
  instructor: {
    id: 'instructor',
    name: '講師',
    nameColor: '#8B7355',
    textColor: '#f0e8d8',
    expressions: {
      normal: '/assets/characters/instructor/normal.png',
    },
    defaultExpression: 'normal',
    description: '料理教室の講師。エプロン姿の気さくな青年。',
  },
}
