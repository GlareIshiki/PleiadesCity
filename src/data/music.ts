export interface MusicTrack {
  id: string
  label: string
  path: string
}

export const MUSIC: Record<string, MusicTrack> = {
  title: {
    id: 'title',
    label: 'メインテーマ',
    path: '/assets/music/メインテーマ（タイトル画面）.mp3',
  },
  daily: {
    id: 'daily',
    label: '日常・昼',
    path: '/assets/music/プレアデスの朝（日常・昼）.mp3',
  },
  beach: {
    id: 'beach',
    label: '休日の海沿い',
    path: '/assets/music/休日の海沿い.mp3',
  },
  romance: {
    id: 'romance',
    label: '夜の海沿い',
    path: '/assets/music/夜の海沿い（ロマンス）.mp3',
  },
  intimate: {
    id: 'intimate',
    label: '二人きりの会話',
    path: '/assets/music/二人きりの会話（親密）.mp3',
  },
  library: {
    id: 'library',
    label: '読書会・図書館',
    path: '/assets/music/読書会・図書館.mp3',
  },
  boardgame: {
    id: 'boardgame',
    label: 'ボドゲカフェ',
    path: '/assets/music/ボドゲカフェ.mp3',
  },
  coworking: {
    id: 'coworking',
    label: 'コワーキング',
    path: '/assets/music/コワーキング（仕事中）.mp3',
  },
  comedy: {
    id: 'comedy',
    label: 'コメディ',
    path: '/assets/music/日常のちょっとしたコメディ.mp3',
  },
  anxiety: {
    id: 'anxiety',
    label: '不安・葛藤',
    path: '/assets/music/不安・葛藤.mp3',
  },
  sadness: {
    id: 'sadness',
    label: '悲しみ・喪失',
    path: '/assets/music/悲しみ・喪失.mp3',
  },
  resolve: {
    id: 'resolve',
    label: '決意・覚悟',
    path: '/assets/music/決意・覚悟.mp3',
  },
  nostalgia: {
    id: 'nostalgia',
    label: '回想・ノスタルジア',
    path: '/assets/music/回想・ノスタルジア.mp3',
  },
  true_end: {
    id: 'true_end',
    label: 'トゥルーエンド',
    path: '/assets/music/トゥルーエンド（夜明け）.mp3',
  },
  bitter_end: {
    id: 'bitter_end',
    label: '退去エンド',
    path: '/assets/music/退去エンド（ビターエンド）.mp3',
  },
}
