import type { Scene } from '../engine/types'
import { scene001 } from './prologue/scene001'
import { scene002 } from './prologue/scene002'
import { scene003 } from './prologue/scene003'
import { scene004 } from './prologue/scene004'
import { scene005 } from './prologue/scene005'
import { week01Cooking } from './week01/cooking'
import { week01Boardgame } from './week01/boardgame'
import { week01Library } from './week01/library'

export const SCENE_REGISTRY: Record<string, Scene> = {
  // Prologue
  [scene001.id]: scene001,
  [scene002.id]: scene002,
  [scene003.id]: scene003,
  [scene004.id]: scene004,
  [scene005.id]: scene005,

  // Week 1
  [week01Cooking.id]: week01Cooking,
  [week01Boardgame.id]: week01Boardgame,
  [week01Library.id]: week01Library,
}
