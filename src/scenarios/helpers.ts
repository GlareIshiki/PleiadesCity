import type {
  ScriptCommand,
  GameCondition,
  CharacterPosition,
  TransitionType,
} from '../engine/types'

/** Dialogue from a character */
export function say(characterId: string, text: string, expression?: string): ScriptCommand {
  return { type: 'dialogue', characterId, text, expression }
}

/** Narration (no speaker) */
export function narrate(text: string): ScriptCommand {
  return { type: 'narration', text }
}

/** Show character on screen */
export function show(
  characterId: string,
  position: CharacterPosition = 'center',
  expression?: string,
  transition: TransitionType = 'fade',
): ScriptCommand {
  return { type: 'show_character', characterId, position, expression, transition }
}

/** Hide character */
export function hide(characterId: string, transition: TransitionType = 'fade'): ScriptCommand {
  return { type: 'hide_character', characterId, transition }
}

/** Move character to new position */
export function move(characterId: string, position: CharacterPosition): ScriptCommand {
  return { type: 'move_character', characterId, position }
}

/** Set background */
export function bg(backgroundId: string, transition: 'fade' | 'dissolve' | 'instant' = 'fade'): ScriptCommand {
  return { type: 'set_background', backgroundId, transition }
}

/** Present choices to player */
export function choice(
  options: Array<{
    text: string
    commands: ScriptCommand[]
    affinity?: Record<string, number>
    adaptation?: number
    condition?: GameCondition
  }>,
): ScriptCommand {
  return {
    type: 'choice',
    choices: options.map((o) => ({
      text: o.text,
      commands: o.commands,
      effects: {
        affinity: o.affinity,
        adaptation: o.adaptation,
      },
      condition: o.condition,
    })),
  }
}

/** Modify affinity */
export function affinity(characterId: string, delta: number): ScriptCommand {
  return { type: 'modify_affinity', characterId, delta }
}

/** Modify adaptation */
export function adapt(delta: number): ScriptCommand {
  return { type: 'modify_adaptation', delta }
}

/** Set a flag */
export function flag(name: string, value: boolean | number | string = true): ScriptCommand {
  return { type: 'set_flag', flag: name, value }
}

/** Conditional execution */
export function when(
  condition: GameCondition,
  then: ScriptCommand[],
  otherwise?: ScriptCommand[],
): ScriptCommand {
  return { type: 'conditional', condition, then, else: otherwise }
}

/** Jump to another scene */
export function jump(sceneId: string): ScriptCommand {
  return { type: 'jump', sceneId }
}

/** Screen transition effect */
export function transition(
  effect: 'fade_black' | 'fade_white' | 'dissolve' = 'fade_black',
  duration: number = 800,
): ScriptCommand {
  return { type: 'transition', effect, duration }
}

/** Wait for duration */
export function wait(ms: number): ScriptCommand {
  return { type: 'wait', duration: ms }
}

/** Screen shake effect */
export function shake(
  intensity: 'light' | 'medium' | 'heavy' = 'light',
  duration: number = 500,
): ScriptCommand {
  return { type: 'shake', intensity, duration }
}

/** Play background music */
export function bgm(trackId: string, fadeIn?: number): ScriptCommand {
  return { type: 'play_bgm', trackId, fadeIn }
}

/** Stop background music */
export function stopBgm(fadeOut?: number): ScriptCommand {
  return { type: 'stop_bgm', fadeOut }
}

/** Play sound effect */
export function se(seId: string): ScriptCommand {
  return { type: 'play_se', seId }
}
