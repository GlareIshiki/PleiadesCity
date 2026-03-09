import type { Scene } from '../../engine/types'
import { say, narrate, show, hide, bg, choice, transition, affinity, adapt, flag, jump, wait, bgm, se } from '../helpers'

/** プロローグ - 到着 */
export const scene001: Scene = {
  id: 'prologue_001',
  label: 'プロローグ - 到着',
  commands: [
    transition('fade_black', 1200),
    bgm('daily'),
    bg('airport'),
    narrate('——四国南部、太平洋に面した海岸線。'),
    narrate('そこに、その街はあった。'),
    narrate('プレアデス市国。'),
    narrate('世界初の「恋愛特区」。'),
    narrate('経済特区の亜種として恋愛関連産業を誘致し、\n「恋愛が副産物として大量発生する経済圏」を形成した都市国家。'),
    narrate('……と、パンフレットには書いてあった。'),
    narrate('空港の到着ロビーで、俺は所在なさげに立ち尽くしていた。'),
    narrate('「3ヶ月間、がんばってこい」'),
    narrate('出発前の部長の言葉が、頭の中でリフレインする。'),
    narrate('会社の福利厚生プログラム。\n要するに、独身社員向けの「恋愛研修」だ。'),

    choice([
      {
        text: '……がんばるって、何を。',
        commands: [
          narrate('恋愛経験がほぼないのに、「恋愛特区」に放り込まれて何をがんばれと。'),
          narrate('ため息をひとつ。\nとりあえず、出口を探そう。'),
        ],
      },
      {
        text: 'まあ、3ヶ月のバカンスだと思えば……',
        commands: [
          narrate('暖かい気候、海の景観、食べ物がうまい——らしい。'),
          narrate('最悪、リモートワークしながらのんびり過ごせばいい。'),
          adapt(2),
        ],
      },
    ]),

    transition('fade_black', 600),
    jump('prologue_002'),
  ],
}
