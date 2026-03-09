import type { Scene } from '../../engine/types'
import { say, narrate, show, hide, bg, choice, affinity, adapt, flag, jump, transition, wait, bgm, se } from '../helpers'

/** Week 1 - 料理教室 */
export const week01Cooking: Scene = {
  id: 'week01_cooking',
  label: 'Week 1 - 料理教室',
  commands: [
    bgm('comedy'),
    bg('cooking_studio', 'dissolve'),
    narrate('料理教室——イタリアンの基礎コース。'),
    narrate('清潔なキッチンスタジオに、10人ほどの参加者が集まっている。'),
    narrate('エプロンを渡され、調理台の前に立つ。\n今日のメニューは、トマトソースのペンネ。'),
    narrate('隣の調理台に、見覚えのある姿があった。'),

    show('aaa', 'center', 'surprised'),
    say('aaa', 'あっ！', 'surprised'),
    say('aaa', '昨日の……入口でお会いした方、ですよね？', 'happy'),
    narrate('藤色の髪の彼女が、ぱっと顔を上げた。\n——覚えていてくれたらしい。'),

    choice([
      {
        text: 'あのときはありがとうございました',
        commands: [
          say('aaa', 'いえ、全然！\nちゃんと会場に着けたならよかったです。', 'happy'),
          say('aaa', '料理教室、選んだんですね。\n私も迷ってこれにしたんです。', 'normal'),
          affinity('aaa', 2),
        ],
      },
      {
        text: 'また会いましたね',
        commands: [
          say('aaa', 'ほんとですね。この街、意外と狭いのかも。', 'normal'),
          say('aaa', '同じ活動を選ぶと、また会いやすいみたいです。', 'confused_light'),
          affinity('aaa', 1),
        ],
      },
    ]),

    show('instructor', 'center', 'normal'),
    say('instructor', 'はい、それじゃあ今日はトマトソースのペンネを作りましょう！\nまずはトマトの湯むきから。'),
    se('knife'),
    say('instructor', 'にんにくはできるだけ細かく。\n香りが出やすくなりますからね。'),
    say('instructor', 'わからないことがあったら、いつでも聞いてください。\n楽しくやりましょう！'),
    hide('instructor'),
    narrate('気さくな青年講師だ。\nエプロン姿が板についている。'),
    narrate('彼女はてきぱきと作業を進めている。\n——と、ちらりとこちらの手元を見た。'),
    say('aaa', 'あの、にんにく……もう少し細かい方がソースに馴染みやすいかも。', 'worried'),
    say('aaa', 'あっ、ごめんなさい。余計なこと……！', 'embarrassed'),

    choice([
      {
        text: 'いや、助かります。料理は得意じゃなくて',
        commands: [
          say('aaa', '私も、そんなに得意ってわけじゃないんですけど……。', 'normal'),
          say('aaa', 'でも、レシピ通りにやれば、ちゃんとできるじゃないですか。', 'normal'),
          say('aaa', '構造が決まっているものは……やりやすいんですよね。', 'confused_light'),
          say('aaa', 'あ、この街の設計もそうなんですけど——\n手順が明確だと、人は安心して動けるんです。', 'excited'),
          say('aaa', '……って、料理の話でしたね。すみません、脱線しちゃって。', 'embarrassed'),
          narrate('好きな話題になると、急にスイッチが入るらしい。\n——さっきまでの控えめな雰囲気はどこへ。'),
          affinity('aaa', 3),
        ],
      },
      {
        text: '（笑って）先生みたいですね',
        commands: [
          say('aaa', 'せっ……先生！？', 'embarrassed'),
          say('aaa', 'そんな、私なんかが先生だなんて……！\nただ、ちょっと気になっちゃっただけで……。', 'embarrassed'),
          narrate('顔が真っ赤だ。\nさっきまで冷静に手を動かしていた人とは思えない。'),
          narrate('——こういうリアクションをする人なんだな。'),
          affinity('aaa', 4),
        ],
      },
    ]),

    se('simmer'),
    bgm('intimate'),
    narrate('ペンネが茹で上がる。\nトマトソースと絡めて、チーズをかけて——完成。'),
    narrate('参加者全員で、自分の作った料理を食べる時間。'),
    say('aaa', '——わ、美味しい。', 'happy'),
    say('aaa', 'ちゃんとできた……！ よかった。', 'happy'),
    narrate('両手を合わせて、本当に嬉しそうに笑っている。'),
    say('aaa', 'あなたのも美味しそうですね。\n……一口もらっていいですか？', 'normal'),
    narrate('一口食べて——小さく頷いた。'),
    say('aaa', '美味しいです！ にんにく、ちゃんと馴染んでますよ。', 'excited'),
    narrate('……さっきのアドバイスが効いたらしい。\n自分のことのように喜んでくれている。'),

    narrate('片づけをしながら、少しだけ会話が続いた。'),
    say('aaa', 'あの……名前、まだ聞いてませんでした。', 'confused'),
    narrate('そう言ってから、少し慌てたように自分から名乗った。'),
    say('aaa', '私は[大空燈叶|おおぞら とうか]、です。\nよろしくお願いします！', 'happy'),

    flag('aaa_name_known', true),
    hide('aaa'),
    transition('fade_black', 800),
    narrate('こうして、プレアデス市国での最初の1週間が過ぎた。'),
    narrate('——第1週、終了。'),
    flag('week1_complete', true),
  ],
}
