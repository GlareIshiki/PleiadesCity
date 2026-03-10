import { useEffect, useState, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../../stores/gameStore'
import { CHARACTERS } from '../../data/characters'
import { AudioManager } from '../../systems/AudioManager'

// [漢字|ふりがな] syntax
type TextSegment =
  | { type: 'text'; content: string }
  | { type: 'ruby'; base: string; reading: string }
  | { type: 'newline' }

function parseRubyText(text: string): TextSegment[] {
  const segments: TextSegment[] = []
  let cursor = 0

  while (cursor < text.length) {
    const bracketStart = text.indexOf('[', cursor)

    if (bracketStart === -1) {
      // Remaining plain text
      const remaining = text.slice(cursor)
      if (remaining) pushTextSegments(segments, remaining)
      break
    }

    // Plain text before bracket
    if (bracketStart > cursor) {
      pushTextSegments(segments, text.slice(cursor, bracketStart))
    }

    const bracketEnd = text.indexOf(']', bracketStart)
    const pipePos = text.indexOf('|', bracketStart)

    if (bracketEnd === -1 || pipePos === -1 || pipePos > bracketEnd) {
      // Not a valid ruby — treat '[' as plain text
      pushTextSegments(segments, '[')
      cursor = bracketStart + 1
      continue
    }

    const base = text.slice(bracketStart + 1, pipePos)
    const reading = text.slice(pipePos + 1, bracketEnd)
    segments.push({ type: 'ruby', base, reading })
    cursor = bracketEnd + 1
  }

  return segments
}

function pushTextSegments(segments: TextSegment[], text: string) {
  for (const part of text.split('\n')) {
    if (segments.length > 0 && segments[segments.length - 1].type !== 'newline' && text.includes('\n') && part !== text.split('\n')[0]) {
      // This logic is cleaner with an explicit split
    }
  }
  // Simpler approach: split by newline, interleave with newline segments
  const parts = text.split('\n')
  parts.forEach((part, i) => {
    if (i > 0) segments.push({ type: 'newline' })
    if (part) segments.push({ type: 'text', content: part })
  })
}

// Build "display units" — each unit is one typewriter step
function buildDisplayUnits(segments: TextSegment[]): number[] {
  // Returns array of unit counts per segment
  // text: 1 unit per character, ruby: 1 unit for whole group, newline: 1 unit
  return segments.map((seg) => {
    if (seg.type === 'text') return seg.content.length
    return 1
  })
}

function renderSegments(
  segments: TextSegment[],
  visibleUnits: number,
): React.ReactNode[] {
  const nodes: React.ReactNode[] = []
  let remaining = visibleUnits

  for (let i = 0; i < segments.length && remaining > 0; i++) {
    const seg = segments[i]
    if (seg.type === 'newline') {
      nodes.push(<br key={`br-${i}`} />)
      remaining--
    } else if (seg.type === 'text') {
      const chars = Math.min(remaining, seg.content.length)
      nodes.push(<span key={`t-${i}`}>{seg.content.slice(0, chars)}</span>)
      remaining -= chars
    } else {
      // ruby — show entire group as one unit
      nodes.push(
        <ruby key={`r-${i}`}>
          {seg.base}
          <rp>(</rp>
          <rt>{seg.reading}</rt>
          <rp>)</rp>
        </ruby>,
      )
      remaining--
    }
  }
  return nodes
}

function getTotalUnits(segments: TextSegment[]): number {
  return buildDisplayUnits(segments).reduce((a, b) => a + b, 0)
}

export function DialogueBox() {
  const dialogue = useGameStore((s) => s.display.dialogue)
  const textSpeed = useGameStore((s) => s.textSpeed)
  const autoMode = useGameStore((s) => s.autoMode)
  const completeDialogue = useGameStore((s) => s.completeDialogue)

  const [visibleUnits, setVisibleUnits] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const fullText = dialogue?.text ?? ''
  const characterId = dialogue?.characterId
  const charDef = characterId ? CHARACTERS[characterId] : null

  const segments = useMemo(() => parseRubyText(fullText), [fullText])
  const totalUnits = useMemo(() => getTotalUnits(segments), [segments])

  // Typewriter effect
  useEffect(() => {
    if (!dialogue || dialogue.isComplete) {
      setVisibleUnits(totalUnits)
      setIsTyping(false)
      return
    }

    setVisibleUnits(0)
    setIsTyping(true)
    let count = 0

    timerRef.current = setInterval(() => {
      count++
      if (count % 2 === 1) AudioManager.playSE('advance')
      setVisibleUnits(count)
      if (count >= totalUnits) {
        setIsTyping(false)
        if (timerRef.current) clearInterval(timerRef.current)
        completeDialogue()
      }
    }, textSpeed)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [dialogue?.text, dialogue?.isComplete, textSpeed, totalUnits, completeDialogue])

  // When dialogue is force-completed, show full text
  useEffect(() => {
    if (dialogue?.isComplete && isTyping) {
      if (timerRef.current) clearInterval(timerRef.current)
      setVisibleUnits(totalUnits)
      setIsTyping(false)
    }
  }, [dialogue?.isComplete, isTyping, totalUnits])

  if (!dialogue) return null

  return (
      <div
        className="absolute bottom-0 left-0 right-0 px-4 pb-4"
      >
        {/* Name tag */}
        {charDef && charDef.name && (
          <div
            className="inline-block px-4 py-1 mb-0 rounded-t-lg text-base font-bold"
            style={{
              backgroundColor: 'rgba(10, 10, 30, 0.9)',
              color: charDef.nameColor,
              borderTop: `2px solid ${charDef.nameColor}40`,
              borderLeft: `2px solid ${charDef.nameColor}40`,
              borderRight: `2px solid ${charDef.nameColor}40`,
            }}
          >
            {charDef.name}
          </div>
        )}

        {/* Text box */}
        <div
          className="relative p-6 rounded-lg h-[160px]"
          style={{
            backgroundColor: 'rgba(10, 10, 30, 0.88)',
            borderTop: charDef ? `2px solid ${charDef.nameColor}30` : '2px solid rgba(135, 206, 235, 0.2)',
            borderBottom: '1px solid rgba(135, 206, 235, 0.1)',
            borderLeft: '1px solid rgba(135, 206, 235, 0.1)',
            borderRight: '1px solid rgba(135, 206, 235, 0.1)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <p
            className="text-xl leading-relaxed"
            style={{
              color: charDef?.textColor ?? '#e0e0e0',
              fontFamily: 'var(--font-serif)',
            }}
          >
            {renderSegments(segments, visibleUnits)}
            {isTyping && <span className="cursor-blink ml-0.5">▎</span>}
          </p>

          {/* Advance indicator */}
          {!isTyping && dialogue.isComplete && (
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
              className="absolute bottom-2 right-4 text-xs opacity-40"
            >
              ▼
            </motion.div>
          )}

          {/* Auto mode indicator */}
          {autoMode && (
            <div className="absolute top-2 right-3 text-xs opacity-50 tracking-wider">
              AUTO
            </div>
          )}
        </div>
      </div>
  )
}
