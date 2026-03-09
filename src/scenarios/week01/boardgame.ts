import type { Scene } from '../../engine/types'
import { say, narrate, show, hide, bg, choice, affinity, adapt, flag, transition, wait, bgm, se } from '../helpers'

/** Week 1 - ボードゲーム会 */
export const week01Boardgame: Scene = {
  id: 'week01_boardgame',
  label: 'Week 1 - ボードゲーム会',
  commands: [
    bgm('boardgame'),
    bg('boardgame_cafe', 'dissolve'),
    narrate('ボードゲームカフェ。\n木目調の内装に、壁一面の棚にゲームが並んでいる。'),
    narrate('15人ほどの参加者が、4〜5人のグループに分かれてテーブルについた。'),
    narrate('俺が座ったテーブルに——'),

    show('bbb', 'center', 'playful'),
    say('bbb', 'お、シーシャバーの！', 'happy'),
    say('bbb', 'やっぱ来たね。こっちに来る気がしてたんだよね。', 'playful'),

    choice([
      {
        text: '……なぜそう思ったんですか',
        commands: [
          say('bbb', 'カン。', 'playful'),
          say('bbb', 'アタシのカン、まあまあ当たるんだよね。', 'teasing'),
          affinity('bbb', 2),
        ],
      },
      {
        text: '奇遇ですね',
        commands: [
          say('bbb', '奇遇って言うかさ、\nこの街だと「設計された偶然」って感じじゃない？', 'normal'),
          say('bbb', '——あ、ごめん。深い話は後にしよ。\nまずはゲーム！', 'playful'),
          affinity('bbb', 3),
        ],
      },
    ]),

    se('card'),
    narrate('今日のゲームは「カタン」——資源を集めて開拓地を建てる定番ゲームだ。'),
    say('bbb', 'リュミエルね、カタンは無敗なの。', 'teasing'),
    say('bbb', '——嘘。3回やって2回負けた。\nでも今日は勝つ。', 'playful'),
    se('dice'),
    narrate('サイコロが転がる。カードが飛び交う。\n交渉と駆け引き。'),
    narrate('彼女は——ゲームになると、目の色が変わる。'),
    say('bbb', 'ねえねえ、小麦と羊毛交換しない？\nレート2:1でいいよ。お得でしょ？', 'playful'),

    choice([
      {
        text: '……それ、こっちが損してません？',
        commands: [
          say('bbb', 'あれ、バレた？', 'teasing'),
          say('bbb', 'やっぱ頭いいね。\n——じゃあ1:1で。これはガチ。', 'serious'),
          narrate('目が据わっている。\n……こういう顔もするんだな。'),
          affinity('bbb', 3),
        ],
      },
      {
        text: 'いいですよ、交換しましょう',
        commands: [
          say('bbb', 'やった！ ありがと！', 'happy'),
          narrate('……後で気づいたが、見事に出し抜かれていた。\n彼女はそのターンで最長交易路を取った。'),
          say('bbb', 'えへへ。ビジネスは非情なのだ。', 'teasing'),
          affinity('bbb', 2),
        ],
      },
    ]),

    narrate('ゲームは白熱した。\n結局、彼女が勝った。'),
    say('bbb', 'いやー、いい勝負だった！', 'happy'),
    say('bbb', '……ね、もう1ゲームやらない？', 'playful'),

    narrate('断る理由は、特になかった。'),
    narrate('気づけば、2時間が過ぎていた。'),

    say('bbb', 'ああ、そういえば。', 'normal'),
    say('bbb', 'アタシの名前、言ったっけ？\nBBB。——リュミエルでもいいけど。', 'playful'),
    say('bbb', 'まあ、呼びたい方で呼んで。', 'normal'),

    flag('bbb_name_known', true),
    hide('bbb'),
    transition('fade_black', 800),
    narrate('帰り道。\n遊歩道の街灯が、等間隔に光っている。'),
    narrate('「設計された偶然」——か。'),
    narrate('彼女の言葉が、頭に残った。'),
    narrate('——第1週、終了。'),
    flag('week1_complete', true),
  ],
}
