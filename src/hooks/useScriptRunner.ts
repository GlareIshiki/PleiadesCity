import { useCallback, useEffect, useRef } from 'react'
import { useGameStore } from '../stores/gameStore'
import { evaluateCondition } from '../engine/ConditionEvaluator'
import { AudioManager } from '../systems/AudioManager'
import type { ScriptCommand } from '../engine/types'

export function useScriptRunner() {
  const store = useGameStore()
  const processingRef = useRef(false)

  const processCommand = useCallback(async (cmd: ScriptCommand) => {
    const s = useGameStore.getState()

    switch (cmd.type) {
      case 'dialogue': {
        s.addToLog(cmd.characterId, cmd.text)
        // Update character expression if specified
        if (cmd.expression) {
          const existing = s.display.characters.find((c) => c.id === cmd.characterId)
          if (existing) {
            s.showCharacter(cmd.characterId, cmd.expression, existing.position)
          }
        }
        s.setDialogue(cmd.characterId, cmd.text)
        return // Waits for input
      }

      case 'narration': {
        s.addToLog(undefined, cmd.text)
        s.setDialogue(undefined, cmd.text)
        return // Waits for input
      }

      case 'choice': {
        // Filter choices by condition
        const available = cmd.choices.filter(
          (c) => !c.condition || evaluateCondition(c.condition, s.gameState),
        )
        s.showChoices(available)
        return // Waits for input
      }

      case 'show_character': {
        s.showCharacter(
          cmd.characterId,
          cmd.expression ?? 'normal',
          cmd.position,
        )
        break
      }

      case 'hide_character': {
        s.hideCharacter(cmd.characterId)
        break
      }

      case 'move_character': {
        const char = s.display.characters.find((c) => c.id === cmd.characterId)
        if (char) {
          s.showCharacter(cmd.characterId, char.expression, cmd.position)
        }
        break
      }

      case 'set_background': {
        s.setBackground(cmd.backgroundId)
        break
      }

      case 'set_flag': {
        s.setFlag(cmd.flag, cmd.value)
        // Handle special flags
        if (cmd.flag === 'goto_schedule' && cmd.value === true) {
          s.advanceWeek()
          s.setScreen('schedule')
          s.clearDialogue()
          s.setWaitingForInput(false)
          useGameStore.setState({ commandQueue: [] })
          return
        }
        if (cmd.flag === 'week1_complete' && cmd.value === true) {
          // Demo ends here - show a message then return to title
          s.setDialogue(undefined, '【デモ版はここまでです。プレイしていただきありがとうございました】')
          // After this dialogue, clicking will go back to title
          return
        }
        break
      }

      case 'modify_affinity': {
        s.modifyAffinity(cmd.characterId, cmd.delta)
        if (cmd.delta > 0) AudioManager.playSE('affinity_up')
        break
      }

      case 'modify_adaptation': {
        s.modifyAdaptation(cmd.delta)
        break
      }

      case 'conditional': {
        const result = evaluateCondition(cmd.condition, s.gameState)
        const branch = result ? cmd.then : (cmd.else ?? [])
        if (branch.length > 0) {
          // Inject branch commands at front of queue
          const currentQueue = useGameStore.getState().commandQueue
          useGameStore.setState({ commandQueue: [...branch, ...currentQueue] })
        }
        break
      }

      case 'jump': {
        s.loadScene(cmd.sceneId)
        break
      }

      case 'wait': {
        await new Promise((resolve) => setTimeout(resolve, cmd.duration))
        break
      }

      case 'transition': {
        s.setTransition(cmd.effect)
        s.setIsTransitioning(true)
        await new Promise((resolve) => setTimeout(resolve, cmd.duration))
        s.setTransition(null)
        s.setIsTransitioning(false)
        break
      }

      case 'shake': {
        // Shake effect handled by CSS animation on GameScreen
        s.setTransition('shake_' + cmd.intensity)
        await new Promise((resolve) => setTimeout(resolve, cmd.duration))
        s.setTransition(null)
        break
      }

      case 'play_bgm': {
        AudioManager.play(cmd.trackId, cmd.fadeIn)
        break
      }

      case 'stop_bgm': {
        AudioManager.stop(cmd.fadeOut)
        break
      }

      case 'play_se': {
        AudioManager.playSE(cmd.seId)
        break
      }
    }
  }, [])

  const runNext = useCallback(async () => {
    if (processingRef.current) return
    processingRef.current = true

    try {
      // Process commands until we hit one that waits for input
      let cmd = useGameStore.getState().processNextCommand()
      while (cmd) {
        await processCommand(cmd)
        // Check if we're now waiting for input
        if (useGameStore.getState().waitingForInput) break
        cmd = useGameStore.getState().processNextCommand()
      }
    } finally {
      processingRef.current = false
    }
  }, [processCommand])

  // Auto-run commands when queue changes and not waiting
  const commandQueue = useGameStore((s) => s.commandQueue)
  const waitingForInput = useGameStore((s) => s.waitingForInput)

  useEffect(() => {
    if (!waitingForInput && commandQueue.length > 0) {
      runNext()
    }
  }, [commandQueue, waitingForInput, runNext])

  const handleAdvance = useCallback(() => {
    const s = useGameStore.getState()
    if (s.display.choices) return // Can't advance during choices

    if (s.display.dialogue && !s.display.dialogue.isComplete) {
      // Fast-complete the current text
      s.completeDialogue()
    } else if (s.waitingForInput) {
      // If demo is complete, return to title
      if (s.gameState.flags['week1_complete'] && s.commandQueue.length === 0) {
        s.clearDialogue()
        s.setWaitingForInput(false)
        s.setScreen('title')
        return
      }
      // Advance to next command
      s.clearDialogue()
      s.setWaitingForInput(false)
    }
  }, [])

  const handleChoice = useCallback((index: number) => {
    useGameStore.getState().selectChoice(index)
  }, [])

  return { handleAdvance, handleChoice, runNext }
}
