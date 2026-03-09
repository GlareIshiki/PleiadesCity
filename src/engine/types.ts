// ===== Script Command Types =====

export type ScriptCommand =
  | DialogueCommand
  | ChoiceCommand
  | NarrationCommand
  | ShowCharacterCommand
  | HideCharacterCommand
  | MoveCharacterCommand
  | SetBackgroundCommand
  | SetFlagCommand
  | ModifyAffinityCommand
  | ModifyAdaptationCommand
  | ConditionalCommand
  | JumpCommand
  | WaitCommand
  | TransitionCommand
  | ShakeCommand
  | PlayBgmCommand
  | StopBgmCommand
  | PlaySECommand

export interface DialogueCommand {
  type: 'dialogue'
  characterId: string
  expression?: string
  text: string
}

export interface NarrationCommand {
  type: 'narration'
  text: string
}

export interface ChoiceCommand {
  type: 'choice'
  prompt?: string
  choices: ChoiceOption[]
}

export interface ChoiceOption {
  text: string
  condition?: GameCondition
  commands: ScriptCommand[]
  effects?: {
    affinity?: Record<string, number>
    adaptation?: number
  }
}

export interface ShowCharacterCommand {
  type: 'show_character'
  characterId: string
  expression?: string
  position: CharacterPosition
  transition?: TransitionType
}

export interface HideCharacterCommand {
  type: 'hide_character'
  characterId: string
  transition?: TransitionType
}

export interface MoveCharacterCommand {
  type: 'move_character'
  characterId: string
  position: CharacterPosition
}

export interface SetBackgroundCommand {
  type: 'set_background'
  backgroundId: string
  transition?: 'fade' | 'dissolve' | 'instant'
}

export interface SetFlagCommand {
  type: 'set_flag'
  flag: string
  value: boolean | number | string
}

export interface ModifyAffinityCommand {
  type: 'modify_affinity'
  characterId: string
  delta: number
}

export interface ModifyAdaptationCommand {
  type: 'modify_adaptation'
  delta: number
}

export interface ConditionalCommand {
  type: 'conditional'
  condition: GameCondition
  then: ScriptCommand[]
  else?: ScriptCommand[]
}

export interface JumpCommand {
  type: 'jump'
  sceneId: string
}

export interface WaitCommand {
  type: 'wait'
  duration: number
}

export interface TransitionCommand {
  type: 'transition'
  effect: 'fade_black' | 'fade_white' | 'dissolve'
  duration: number
}

export interface ShakeCommand {
  type: 'shake'
  intensity: 'light' | 'medium' | 'heavy'
  duration: number
}

export interface PlayBgmCommand {
  type: 'play_bgm'
  trackId: string
  fadeIn?: number
}

export interface StopBgmCommand {
  type: 'stop_bgm'
  fadeOut?: number
}

export interface PlaySECommand {
  type: 'play_se'
  seId: string
}

// ===== Shared Types =====

export type CharacterPosition = 'left' | 'center' | 'right'
export type TransitionType = 'fade' | 'slide_left' | 'slide_right' | 'instant'

// ===== Condition System =====

export type GameCondition =
  | { type: 'flag'; flag: string; value: boolean | number | string }
  | { type: 'affinity_gte'; characterId: string; value: number }
  | { type: 'affinity_lte'; characterId: string; value: number }
  | { type: 'adaptation_gte'; value: number }
  | { type: 'adaptation_lte'; value: number }
  | { type: 'week_gte'; value: number }
  | { type: 'week_lte'; value: number }
  | { type: 'and'; conditions: GameCondition[] }
  | { type: 'or'; conditions: GameCondition[] }
  | { type: 'not'; condition: GameCondition }

// ===== Scene =====

export interface Scene {
  id: string
  label?: string
  commands: ScriptCommand[]
}

// ===== Character Definition =====

export interface CharacterDefinition {
  id: string
  name: string
  nameColor: string
  textColor?: string
  expressions: Record<string, string>
  defaultExpression: string
  description?: string
}

// ===== Background Definition =====

export interface BackgroundDefinition {
  id: string
  label: string
  imagePath: string
  fallbackColor: string
  description?: string
}

// ===== Activity & Schedule =====

export interface Activity {
  id: string
  name: string
  description: string
  icon: string
  characterEncounters: string[]
  adaptationDelta: number
  sceneId: string
  aiRecommendWeight?: number
  condition?: GameCondition
}

export interface WeekSchedule {
  weekNumber: number
  availableActivities: string[]
  aiRecommendation: string
  aiReason: string
  fixedEvents?: ScriptCommand[]
}

// ===== Game State =====

export interface GameState {
  currentSceneId: string
  currentCommandIndex: number
  week: number
  flags: Record<string, boolean | number | string>
  affinity: Record<string, number>
  adaptation: number
  chosenActivities: string[]
  dialogueLog: DialogueLogEntry[]
  playerName: string
}

export interface DialogueLogEntry {
  characterId?: string
  characterName?: string
  text: string
}

// ===== Display State =====

export interface CharacterOnScreen {
  id: string
  expression: string
  position: CharacterPosition
}

export interface DisplayState {
  background: string | null
  characters: CharacterOnScreen[]
  dialogue: {
    characterId?: string
    text: string
    isComplete: boolean
  } | null
  choices: ChoiceOption[] | null
  transition: {
    effect: string
    active: boolean
  } | null
  bgm: string | null
}

// ===== Save Data =====

export interface SaveSlot {
  id: number
  timestamp: number
  week: number
  backgroundId: string | null
  gameState: GameState
}
