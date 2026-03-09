import type { Scene } from '../../engine/types'
import { say, narrate, show, hide, bg, choice, affinity, adapt, flag, transition, wait, bgm, se } from '../helpers'

/** Week 1 - 読書会 */
export const week01Library: Scene = {
  id: 'week01_library',
  label: 'Week 1 - 読書会',
  commands: [
    bgm('library'),
    bg('library', 'dissolve'),
    narrate('図書館。'),
    se('page_turn'),
    narrate('高い天井、木の匂い、かすかに聞こえるページをめくる音。'),
    narrate('読書会の参加者は8人。\n他の活動と比べて、少なめだ。'),
    narrate('各自が好きな本を持ち寄り、お互いに紹介する——という緩い形式。'),

    show('aaa', 'center', 'normal'),
    narrate('——彼女がいた。\n昨日の、藤色の髪の。'),
    narrate('窓際の席で、文庫本を読んでいる。\n周囲の音が聞こえていないかのように、集中している。'),
    say('aaa', 'あ。', 'surprised'),
    narrate('視線に気づいて、ぱっと顔を上げた。'),
    say('aaa', 'こんにちは！ 読書会、参加ですか？', 'happy'),
    narrate('思ったより明るい反応だった。\n——知り合いがいて安心した、という顔。'),

    choice([
      {
        text: '何を読んでいるんですか？',
        commands: [
          say('aaa', 'これですか？', 'normal'),
          narrate('彼女が見せてくれたのは、都市計画に関するノンフィクション。'),
          say('aaa', 'この街の設計思想が気になって……。\n図書館に関連書籍がたくさんあるんですよ！', 'excited'),
          say('aaa', '偶発的な出会いが生まれやすい動線設計とか、\nこの席の配置にも意味があるのかな、って。', 'excited'),
          say('aaa', '例えばこの窓際の席、隣との距離感が絶妙で——\n近すぎず、でも会話が生まれやすい角度になってるんです。', 'thinking'),
          narrate('——完全にスイッチが入っている。\n目がきらきらしていて、声のトーンがさっきと全然違う。'),
          say('aaa', '……あ。\nまた私、一人で喋りすぎてますね。ごめんなさい。', 'embarrassed'),
          affinity('aaa', 3),
        ],
      },
      {
        text: '（隣に座る）静かでいい場所ですね',
        commands: [
          say('aaa', 'ですよね！', 'happy'),
          say('aaa', '特に夕方の時間帯がいいんです。\n光の入り方がきれいで……あ、今ちょうどいい感じです。', 'excited'),
          narrate('窓から差し込む夕陽を指差す彼女。\n——その横顔が、オレンジ色に染まっていた。'),
          say('aaa', 'あ、すみません。座りたかったんですよね。\nどうぞどうぞ。', 'embarrassed'),
          narrate('隣に座る。\n彼女は慌ててバッグをどけて、スペースを作ってくれた。'),
          affinity('aaa', 2),
        ],
      },
    ]),

    narrate('読書会が始まった。\n参加者が順番に、持ってきた本を紹介する。'),
    narrate('ビジネス書、ラノベ、旅行記——ジャンルはバラバラだ。'),
    narrate('彼女の番が来た。'),
    narrate('……途端に、さっきまでの明るさが少し引っ込んだ。\n人前で話すのは、得意ではないらしい。'),

    say('aaa', '……えっと。\n『見えない都市』——イタロ・カルヴィーノ、です。', 'worried'),
    say('aaa', 'マルコ・ポーロが、存在しない都市について語る話で……。', 'normal'),
    narrate('最初は緊張していた声が——本の内容に入るにつれて、変わっていく。'),
    say('aaa', 'この街にいると、読み返したくなったんです。', 'normal'),
    say('aaa', '設計された都市と、そこに住む人の関係。\n建築が人を変えるのか、人が建築を変えるのか——', 'thinking'),
    say('aaa', '……って、カルヴィーノはどっちとも言わないんですよね。\nそこがすごく好きなんです。', 'confused_light'),

    narrate('彼女の紹介は——最初の緊張が嘘のように、熱を帯びていた。'),
    narrate('好きなものを語るとき、この人はこんなにも表情が変わるんだ。'),

    choice([
      {
        text: 'いい本ですね。読んでみたい',
        commands: [
          say('aaa', 'えっ、本当ですか！？', 'excited'),
          say('aaa', 'よかったら貸します！\n私もう何度も読んでるので！', 'happy'),
          narrate('目を輝かせて、身を乗り出してきた。\n……すごい勢いだ。'),
          say('aaa', 'あ……ごめんなさい、ちょっとテンション上がっちゃって。', 'embarrassed'),
          say('aaa', 'この本の話ができる人、あんまりいなくて。', 'happy'),
          affinity('aaa', 4),
          flag('borrowed_book', true),
        ],
      },
      {
        text: '難しそうですね',
        commands: [
          say('aaa', 'あ、そう見えます？', 'confused'),
          say('aaa', 'でも短い話の連作なので、意外と読みやすいですよ！\n……騙されたと思って、最初の3話だけでも。', 'normal'),
          narrate('諦めない。\n——好きな本を布教したいタイプらしい。'),
          affinity('aaa', 1),
        ],
      },
    ]),

    narrate('読書会が終わり、参加者が三々五々散っていく。'),
    say('aaa', 'あの、そういえば——', 'normal'),
    say('aaa', '名前、聞いてもいいですか？', 'normal'),
    narrate('少し迷ったように——でも、はっきりと。'),
    say('aaa', '私は[大空燈叶|おおぞら とうか]、と言います。', 'happy'),
    say('aaa', 'また読書会、来てくれたら嬉しいです。', 'happy'),

    flag('aaa_name_known', true),
    hide('aaa'),
    transition('fade_black', 800),
    narrate('図書館を出ると、空が茜色に染まっていた。'),
    narrate('普段は穏やかだけど、好きなものの話になるとスイッチが入る。'),
    narrate('——そういう人なんだ、彼女は。'),
    narrate('——第1週、終了。'),
    flag('week1_complete', true),
  ],
}
