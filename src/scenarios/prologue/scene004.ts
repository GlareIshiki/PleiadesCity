import type { Scene } from '../../engine/types'
import { say, narrate, show, hide, bg, choice, affinity, adapt, flag, jump, transition, wait, bgm, se } from '../helpers'

/** プロローグ - BBBとの出会い（シーシャバー） */
export const scene004: Scene = {
  id: 'prologue_004',
  label: 'プロローグ - BBBとの出会い',
  commands: [
    bgm('beach'),
    bg('city_sunset', 'dissolve'),
    narrate('夕方。'),
    narrate('オリエンテーションを終え、荷物を滞在先に置いた後——\n特にやることもなく、海沿いの遊歩道を歩いていた。'),
    narrate('夕焼けが、海面をオレンジ色に染めている。\n……確かに、景色だけは素晴らしい。'),
    narrate('遊歩道沿いに、いくつかの店が並んでいた。\nカフェ、レストラン、バー。\nどれも洒落ているが、背伸びした感じはしない。'),
    narrate('その中に——ひときわ柔らかい照明の店があった。'),

    bgm('romance'),
    se('door'),
    bg('shisha_bar', 'dissolve'),
    narrate('シーシャバー。'),
    se('shisha'),
    narrate('水タバコの甘い香りと、アンビエントな音楽。\n隣の席との距離が絶妙に近い。'),
    narrate('……入ってみるか。どうせ初日だし。'),
    wait(300),

    show('master', 'center', 'normal'),
    say('master', 'いらっしゃい。お一人？'),
    narrate('カウンターの向こうに、整えた髭の中年男性。\n落ち着いた佇まい——この店のマスターらしい。'),
    say('master', '初めてなら、フルーツ系がおすすめだよ。\nダブルアップルかミントレモン、どちらがいいかな。'),
    narrate('……とりあえずダブルアップルを頼んだ。'),
    say('master', 'いい選択だ。ゆっくりしていって。'),
    hide('master'),

    narrate('カウンター席に座ると、隣に——'),

    show('bbb', 'center', 'normal'),
    narrate('蜂蜜色の巻き髪。フリルドレスにだぼっとしたジャケット。\nそして——琥珀と深藍のオッドアイ。'),
    narrate('彼女は、こちらの視線に気づくと——片頬にだけ笑窪を浮かべた。'),

    say('bbb', 'あ、新入りさんだ。'),
    say('bbb', '今日のオリエンテーション組？ わかるよ〜、その「ここどこ」って顔。', 'playful'),

    choice([
      {
        text: 'そんなに顔に出てました？',
        commands: [
          say('bbb', 'バレバレ。\nアタシも最初そうだったし。', 'playful'),
          say('bbb', '——ま、この街のことは、この街にいればわかるようになるよ。', 'normal'),
          say('bbb', 'とりあえず、シーシャ頼みなよ。\nここのダブルアップルは絶品。', 'happy'),
          affinity('bbb', 2),
        ],
      },
      {
        text: 'シーシャって、初めてなんですけど',
        commands: [
          say('bbb', 'えっ、マジ？', 'surprised'),
          say('bbb', 'じゃあ尚更ここで正解。\nマスターのおすすめ聞いとけば間違いないから。', 'happy'),
          say('bbb', '——あ、リュミエルはね、ミントレモンが好き。\nすっきりして、頭がクリアになるの。', 'playful'),
          narrate('リュミエル？\n……自分のことを名前で呼んでいるのか？'),
          affinity('bbb', 3),
        ],
      },
      {
        text: '（黙ってシーシャを吸う）',
        commands: [
          narrate('無言で注文したシーシャを吸う。\n甘い煙が、肺を満たす。'),
          say('bbb', '……ふーん、無口なタイプ？', 'normal'),
          say('bbb', 'いいよ別に。\nシーシャバーって、喋らなくても成立する場所だし。', 'normal'),
          narrate('隣の彼女は、特に気にした様子もなく自分のシーシャに戻った。\n……不思議と、気まずさはなかった。'),
          affinity('bbb', 1),
        ],
      },
    ]),

    say('bbb', 'ところでさ、', 'normal'),
    say('bbb', 'この街に来た理由、聞いてもいい？', 'normal'),
    say('bbb', '——あ、別に言いたくなかったら言わなくていいよ。\nアタシ、こういうの聞くの好きなだけだから。', 'playful'),

    choice([
      {
        text: '会社の福利厚生で……半ば強制的に',
        commands: [
          say('bbb', 'あはは、マジか。\nそういうパターンもあるんだ。', 'happy'),
          say('bbb', 'でもさ、来ちゃったからには楽しまないと損じゃない？', 'playful'),
          say('bbb', '——3ヶ月って、長いようで短いよ。', 'normal'),
          affinity('bbb', 2),
        ],
      },
      {
        text: 'あなたは？',
        commands: [
          say('bbb', 'アタシ？\nアタシは——', 'normal'),
          say('bbb', '——ヒミツ。', 'teasing'),
          say('bbb', '初日から全部話したら、つまんないでしょ。', 'playful'),
          narrate('はぐらかされた。\nだが、不快な感じはしない。\nむしろ——この距離感が、彼女なりの礼儀なのかもしれない。'),
          affinity('bbb', 2),
        ],
      },
    ]),

    flag('met_bbb', true),
    hide('bbb'),
    bg('beach_night', 'dissolve'),
    narrate('シーシャバーを出る頃には、空は完全に暗くなっていた。'),
    narrate('街灯が等間隔で遊歩道を照らしている。\n——本当に、計算された街だ。'),

    transition('fade_black', 800),
    jump('prologue_005'),
  ],
}
