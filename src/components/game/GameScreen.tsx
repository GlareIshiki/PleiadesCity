import { useCallback } from 'react'
import { Background } from './Background'
import { CharacterSprites } from './CharacterSprite'
import { DialogueBox } from './DialogueBox'
import { ChoiceMenu } from './ChoiceMenu'
import { TransitionOverlay } from './TransitionOverlay'
import { StatusBar } from '../hud/StatusBar'
import { useScriptRunner } from '../../hooks/useScriptRunner'
import { useKeyboard } from '../../hooks/useKeyboard'
import { useGameStore } from '../../stores/gameStore'
import { AudioManager } from '../../systems/AudioManager'

export function GameScreen() {
  const { handleAdvance, handleChoice } = useScriptRunner()
  const choices = useGameStore((s) => s.display.choices)

  useKeyboard(handleAdvance)

  const onClick = useCallback(() => {
    if (!choices) {
      handleAdvance()
    }
  }, [choices, handleAdvance])

  const onChoice = useCallback((index: number) => {
    AudioManager.playSE('select')
    handleChoice(index)
  }, [handleChoice])

  return (
    <div
      className="relative w-full h-full overflow-hidden cursor-pointer select-none"
      onClick={onClick}
    >
      <Background />
      <CharacterSprites />
      <StatusBar />
      <DialogueBox />
      <ChoiceMenu onChoice={onChoice} />
      <TransitionOverlay />
    </div>
  )
}
