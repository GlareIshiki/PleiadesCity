import { create } from 'zustand'
import type {
  GameState,
  DisplayState,
  CharacterOnScreen,
  CharacterPosition,
  ChoiceOption,
  Scene,
  ScriptCommand,
  SaveSlot,
} from '../engine/types'
import { CHARACTERS } from '../data/characters'
import { INITIAL_ADAPTATION, MAX_AFFINITY, MAX_ADAPTATION, SAVE_SLOT_COUNT } from '../data/constants'
import { evaluateCondition } from '../engine/ConditionEvaluator'
import { SCENE_REGISTRY } from '../scenarios'
import { useAuthStore } from './authStore'
import { cloudSaveToSlot, cloudGetSaveSlots, cloudDeleteSave } from '../lib/cloudSave'

export type Screen = 'title' | 'game' | 'schedule' | 'save' | 'load' | 'backlog' | 'settings'

interface GameStore {
  // Current screen
  screen: Screen

  // Game state
  gameState: GameState

  // Display state
  display: DisplayState

  // Engine state
  commandQueue: ScriptCommand[]
  waitingForInput: boolean
  isTransitioning: boolean
  textSpeed: number
  autoMode: boolean

  // Actions
  setScreen: (screen: Screen) => void
  startNewGame: (playerName: string) => void
  loadScene: (sceneId: string) => void

  // Script execution
  processNextCommand: () => ScriptCommand | null
  completeDialogue: () => void
  selectChoice: (index: number) => void

  // Display mutations
  setBackground: (bgId: string) => void
  showCharacter: (id: string, expression: string, position: CharacterPosition) => void
  hideCharacter: (id: string) => void
  setDialogue: (characterId: string | undefined, text: string) => void
  showChoices: (choices: ChoiceOption[]) => void
  clearChoices: () => void
  clearDialogue: () => void
  setTransition: (effect: string | null) => void

  // Game state mutations
  setFlag: (flag: string, value: boolean | number | string) => void
  modifyAffinity: (characterId: string, delta: number) => void
  modifyAdaptation: (delta: number) => void
  advanceWeek: () => void
  addToLog: (characterId: string | undefined, text: string) => void
  setChosenActivity: (activityId: string) => void

  // Engine state mutations
  setWaitingForInput: (waiting: boolean) => void
  setIsTransitioning: (transitioning: boolean) => void
  setAutoMode: (auto: boolean) => void

  // Save/Load
  saveToSlot: (slotId: number) => void
  loadFromSlot: (slotId: number) => SaveSlot | null
  getSaveSlots: () => (SaveSlot | null)[]
  fetchSaveSlots: () => Promise<(SaveSlot | null)[]>
  deleteSave: (slotId: number) => void
}

const initialGameState: GameState = {
  currentSceneId: '',
  currentCommandIndex: 0,
  week: 0,
  flags: {},
  affinity: {},
  adaptation: INITIAL_ADAPTATION,
  chosenActivities: [],
  dialogueLog: [],
  playerName: '',
}

const initialDisplay: DisplayState = {
  background: null,
  characters: [],
  dialogue: null,
  choices: null,
  transition: null,
  bgm: null,
}

export const useGameStore = create<GameStore>((set, get) => ({
  screen: 'title',
  gameState: { ...initialGameState },
  display: { ...initialDisplay },
  commandQueue: [],
  waitingForInput: false,
  isTransitioning: false,
  textSpeed: 40,
  autoMode: false,

  setScreen: (screen) => set({ screen }),

  startNewGame: (playerName) => {
    set({
      gameState: {
        ...initialGameState,
        playerName,
        affinity: Object.fromEntries(
          Object.keys(CHARACTERS).map((id) => [id, 0]),
        ),
      },
      display: { ...initialDisplay },
      commandQueue: [],
      waitingForInput: false,
      screen: 'game',
    })
    // Load the first scene
    get().loadScene('prologue_001')
  },

  loadScene: (sceneId) => {
    const scene = SCENE_REGISTRY[sceneId]
    if (!scene) {
      console.error(`Scene not found: ${sceneId}`)
      return
    }
    set((s) => ({
      commandQueue: [...scene.commands],
      waitingForInput: false,
      gameState: {
        ...s.gameState,
        currentSceneId: sceneId,
        currentCommandIndex: 0,
      },
    }))
  },

  processNextCommand: () => {
    const { commandQueue, waitingForInput } = get()
    if (waitingForInput || commandQueue.length === 0) return null

    const [cmd, ...rest] = commandQueue
    set({ commandQueue: rest })
    return cmd
  },

  completeDialogue: () => {
    set((s) => ({
      display: {
        ...s.display,
        dialogue: s.display.dialogue
          ? { ...s.display.dialogue, isComplete: true }
          : null,
      },
    }))
  },

  selectChoice: (index) => {
    const { display, gameState } = get()
    if (!display.choices) return

    const chosen = display.choices[index]
    if (!chosen) return

    // Apply effects
    if (chosen.effects?.affinity) {
      for (const [charId, delta] of Object.entries(chosen.effects.affinity)) {
        get().modifyAffinity(charId, delta)
      }
    }
    if (chosen.effects?.adaptation) {
      get().modifyAdaptation(chosen.effects.adaptation)
    }

    // Inject choice commands into queue
    set((s) => ({
      commandQueue: [...chosen.commands, ...s.commandQueue],
      display: { ...s.display, choices: null },
      waitingForInput: false,
    }))
  },

  // Display mutations
  setBackground: (bgId) =>
    set((s) => ({
      display: { ...s.display, background: bgId },
    })),

  showCharacter: (id, expression, position) =>
    set((s) => {
      const filtered = s.display.characters.filter((c) => c.id !== id)
      return {
        display: {
          ...s.display,
          characters: [...filtered, { id, expression, position }],
        },
      }
    }),

  hideCharacter: (id) =>
    set((s) => ({
      display: {
        ...s.display,
        characters: s.display.characters.filter((c) => c.id !== id),
      },
    })),

  setDialogue: (characterId, text) =>
    set((s) => ({
      display: {
        ...s.display,
        dialogue: { characterId, text, isComplete: false },
      },
      waitingForInput: true,
    })),

  showChoices: (choices) =>
    set((s) => ({
      display: { ...s.display, choices },
      waitingForInput: true,
    })),

  clearChoices: () =>
    set((s) => ({
      display: { ...s.display, choices: null },
    })),

  clearDialogue: () =>
    set((s) => ({
      display: { ...s.display, dialogue: null },
    })),

  setTransition: (effect) =>
    set((s) => ({
      display: {
        ...s.display,
        transition: effect ? { effect, active: true } : null,
      },
    })),

  // Game state mutations
  setFlag: (flag, value) =>
    set((s) => ({
      gameState: {
        ...s.gameState,
        flags: { ...s.gameState.flags, [flag]: value },
      },
    })),

  modifyAffinity: (characterId, delta) =>
    set((s) => {
      const current = s.gameState.affinity[characterId] ?? 0
      const next = Math.max(0, Math.min(MAX_AFFINITY, current + delta))
      return {
        gameState: {
          ...s.gameState,
          affinity: { ...s.gameState.affinity, [characterId]: next },
        },
      }
    }),

  modifyAdaptation: (delta) =>
    set((s) => ({
      gameState: {
        ...s.gameState,
        adaptation: Math.max(0, Math.min(MAX_ADAPTATION, s.gameState.adaptation + delta)),
      },
    })),

  advanceWeek: () =>
    set((s) => ({
      gameState: {
        ...s.gameState,
        week: s.gameState.week + 1,
      },
    })),

  addToLog: (characterId, text) =>
    set((s) => {
      const charName = characterId ? CHARACTERS[characterId]?.name : undefined
      return {
        gameState: {
          ...s.gameState,
          dialogueLog: [
            ...s.gameState.dialogueLog,
            { characterId, characterName: charName, text },
          ],
        },
      }
    }),

  setChosenActivity: (activityId) =>
    set((s) => ({
      gameState: {
        ...s.gameState,
        chosenActivities: [...s.gameState.chosenActivities, activityId],
      },
    })),

  setWaitingForInput: (waiting) => set({ waitingForInput: waiting }),
  setIsTransitioning: (transitioning) => set({ isTransitioning: transitioning }),
  setAutoMode: (auto) => set({ autoMode: auto }),

  // Save/Load
  saveToSlot: (slotId) => {
    const { gameState, display } = get()
    const slot: SaveSlot = {
      id: slotId,
      timestamp: Date.now(),
      week: gameState.week,
      backgroundId: display.background,
      gameState: JSON.parse(JSON.stringify(gameState)),
    }
    localStorage.setItem(`pleiades_save_${slotId}`, JSON.stringify(slot))

    // Cloud save (async, non-blocking)
    const user = useAuthStore.getState().user
    if (user) {
      cloudSaveToSlot(user.id, slot).catch(console.error)
    }
  },

  loadFromSlot: (slotId) => {
    const raw = localStorage.getItem(`pleiades_save_${slotId}`)
    if (!raw) return null
    try {
      const slot: SaveSlot = JSON.parse(raw)
      set({
        gameState: slot.gameState,
        display: { ...initialDisplay, background: slot.backgroundId },
        screen: 'game',
        waitingForInput: false,
        commandQueue: [],
      })
      // Reload the current scene from the saved position
      get().loadScene(slot.gameState.currentSceneId)
      return slot
    } catch {
      return null
    }
  },

  getSaveSlots: () => {
    const slots: (SaveSlot | null)[] = []
    for (let i = 0; i < SAVE_SLOT_COUNT; i++) {
      const raw = localStorage.getItem(`pleiades_save_${i}`)
      if (raw) {
        try {
          slots.push(JSON.parse(raw))
        } catch {
          slots.push(null)
        }
      } else {
        slots.push(null)
      }
    }
    return slots
  },

  fetchSaveSlots: async () => {
    const localSlots = get().getSaveSlots()
    const user = useAuthStore.getState().user
    if (!user) return localSlots

    const cloudSlots = await cloudGetSaveSlots(user.id)
    return localSlots.map((local, i) => {
      const cloud = cloudSlots[i]
      if (!local && !cloud) return null
      if (!local) return cloud
      if (!cloud) return local
      return local.timestamp >= cloud.timestamp ? local : cloud
    })
  },

  deleteSave: (slotId) => {
    localStorage.removeItem(`pleiades_save_${slotId}`)

    const user = useAuthStore.getState().user
    if (user) {
      cloudDeleteSave(user.id, slotId).catch(console.error)
    }
  },
}))
