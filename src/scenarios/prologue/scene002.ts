import type { Scene } from '../../engine/types'
import { say, narrate, show, hide, bg, choice, affinity, adapt, flag, jump, transition, wait, se } from '../helpers'

/** プロローグ - 橙叶との出会い */
export const scene002: Scene = {
  id: 'prologue_002',
  label: 'プロローグ - 燈叶との出会い',
  commands: [
    bg('pleiades_entrance', 'dissolve'),
    narrate('空港を出ると、潮風が頬を撫でた。'),
    narrate('2月の四国は、東京よりずっと暖かい。'),
    narrate('海沿いの遊歩道。整然と並ぶ街灯。\n計算された間隔——まるで舞台セットのようだ。'),
    narrate('パンフレットの地図を見るが、オリエンテーション会場がどこにあるのかさっぱりわからない。'),
    narrate('……Wi-Fiも繋がらない。特区内は専用回線らしい。'),
    wait(300),
    se('footstep_outdoor'),
    narrate('「あの、すみません」'),
    narrate('——背後から、静かな声。'),

    show('aaa', 'center', 'worried'),
    say('aaa', 'あの……入国者の方ですか？', 'worried'),
    say('aaa', 'もしかして、迷ってます？', 'normal'),
    narrate('藤色の髪を、ゆるく編み下ろした女性。\n琥珀がかった灰色の瞳が、こちらを見ている。\n——心配そうな、柔らかい声だった。'),
    say('aaa', 'オリエンテーション会場、あちらの建物なんですけど……\nちょっとわかりにくいですよね、ここ。', 'normal'),

    choice([
      {
        text: 'ありがとうございます。あなたも入植者ですか？',
        commands: [
          say('aaa', 'はい、3週間前に来ました。', 'normal'),
          say('aaa', '私も最初、全然わからなくて。\n30分くらいうろうろしちゃって……。', 'embarrassed'),
          narrate('少し笑いながら言う。\n——親しみやすい人だな、と思った。'),
          say('aaa', 'よかったら、案内しますね。\nこの辺りは覚えたので！', 'happy'),
          narrate('断る理由もない。\n彼女の後について歩き出す。'),
          affinity('aaa', 3),
          adapt(1),
          flag('aaa_guided', true),
        ],
      },
      {
        text: 'あ、どうも……',
        commands: [
          narrate('つい素っ気なく返してしまった。\nコミュニケーション能力の低さを早速発揮している。'),
          say('aaa', 'あ……そうですか。', 'worried'),
          narrate('彼女は少し残念そうに——でも軽く会釈して、先に歩いていった。'),
          hide('aaa'),
          narrate('しまった、と思ったが——もう遅い。\n一人でオリエンテーション会場を探すことになった。'),
          flag('aaa_guided', false),
        ],
      },
      {
        text: '（スマホの地図を見せる）この辺り、ですかね？',
        commands: [
          say('aaa', 'あっ、それ、たぶんまだオフラインマップしか入ってないです。', 'confused'),
          say('aaa', 'Wi-Fiの設定、オリエンテーションで教えてもらえますよ。\n私も最初それで困ったんです。', 'thinking'),
          narrate('画面を覗き込む彼女の髪から、かすかに石鹸の香りがした。'),
          say('aaa', '一緒に行きましょうか？ すぐそこなので。', 'happy'),
          affinity('aaa', 2),
          flag('aaa_guided', true),
        ],
      },
    ]),

    flag('met_aaa', true),
    hide('aaa'),
    transition('fade_black', 800),
    jump('prologue_003'),
  ],
}
