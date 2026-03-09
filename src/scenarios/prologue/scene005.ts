import type { Scene } from '../../engine/types'
import { say, narrate, show, hide, bg, choice, affinity, adapt, flag, jump, transition, when, wait, bgm } from '../helpers'

/** プロローグ - 初日の夜（居住スペース） → Week1スケジュールへ */
export const scene005: Scene = {
  id: 'prologue_005',
  label: 'プロローグ - 初日の夜',
  commands: [
    bgm('nostalgia'),
    bg('residence', 'dissolve'),
    narrate('滞在先のワンルーム。'),
    narrate('シンプルだが、必要なものは揃っている。\nベッド、デスク、小さなキッチン。\n窓からは海が見える——らしいが、今は真っ暗だ。'),
    narrate('スーツケースを開けて、最低限の荷物だけ出す。\nノートPC、充電器、着替え。'),
    narrate('デスクに座り、ノートPCを開く。\n……仕事のメールが溜まっている。'),

    choice([
      {
        text: '仕事を片付ける',
        commands: [
          narrate('まずは仕事。\nリモートワーカーの本分は、ちゃんとこなす。'),
          narrate('1時間ほどメールを処理し、明日の作業計画を立てた。'),
          adapt(2),
        ],
      },
      {
        text: '今日はもう休む',
        commands: [
          narrate('移動疲れもある。\n仕事は明日からでいい。'),
          narrate('ベッドに横になると、天井が見える。\n知らない天井。知らない街。'),
        ],
      },
    ]),

    narrate('——ふと、今日出会った人たちのことを考える。'),

    when(
      { type: 'flag', flag: 'met_aaa', value: true },
      [
        narrate('藤色の髪の彼女。\n穏やかで、自然にこちらを気遣ってくれる人だった。'),
        narrate('名前、聞いてなかったな。'),
      ],
    ),

    when(
      { type: 'flag', flag: 'met_bbb', value: true },
      [
        narrate('シーシャバーの彼女。\n自分のことを「リュミエル」と呼ぶ、不思議な子。'),
        narrate('「3ヶ月って、長いようで短いよ」——か。'),
      ],
    ),

    narrate('設計された出会い。\nAIによるマッチング。\nコミュニティ活動への参加義務。'),
    narrate('この街の全ては、恋愛のために設計されている。'),

    choice([
      {
        text: '……まあ、やってみるか',
        commands: [
          narrate('乗り気ではない。\nだが、来てしまったものは仕方ない。'),
          narrate('3ヶ月。\n——その間に何が起こるかなんて、今の俺にはわからない。'),
          adapt(2),
        ],
      },
      {
        text: '設計された出会いは「本物」なのか？',
        commands: [
          narrate('この街で出会った人と——仮に恋をしたとして。'),
          narrate('それは「自然な出会い」なのか。\nそれとも、都市設計者の掌の上なのか。'),
          narrate('……考えても答えは出ない。\n少なくとも、今夜は。'),
        ],
      },
    ]),

    transition('fade_black', 1200),
    narrate('——こうして、プレアデス市国での生活が始まった。'),
    wait(500),
    narrate('翌朝。\nスマホに通知が入っていた。'),
    narrate('『プレアデスAI: 今週のコミュニティ活動をお選びください。\n　以下のおすすめ活動をご提案します。』'),
    narrate('……さっそく来たか。'),
    wait(300),

    // Advance to Week 1 and show schedule
    flag('prologue_complete', true),
    // This will be handled by the schedule system
    flag('goto_schedule', true),
  ],
}
