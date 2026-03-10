import { supabase } from './supabase'
import type { SaveSlot } from '../engine/types'
import { SAVE_SLOT_COUNT } from '../data/constants'

export async function cloudSaveToSlot(userId: string, slot: SaveSlot): Promise<void> {
  if (!supabase) return
  const { error } = await supabase.from('save_slots').upsert(
    {
      user_id: userId,
      slot_id: slot.id,
      timestamp: slot.timestamp,
      week: slot.week,
      background_id: slot.backgroundId,
      game_state: {
        ...slot.gameState,
        _display: {
          characters: slot.characters,
          bgm: slot.bgm,
        },
      },
    },
    { onConflict: 'user_id,slot_id' },
  )
  if (error) console.error('Cloud save failed:', error)
}

export async function cloudGetSaveSlots(userId: string): Promise<(SaveSlot | null)[]> {
  if (!supabase) return Array(SAVE_SLOT_COUNT).fill(null)

  const { data, error } = await supabase
    .from('save_slots')
    .select('*')
    .eq('user_id', userId)
    .order('slot_id', { ascending: true })

  if (error || !data) return Array(SAVE_SLOT_COUNT).fill(null)

  const slots: (SaveSlot | null)[] = Array(SAVE_SLOT_COUNT).fill(null)
  for (const row of data) {
    if (row.slot_id >= 0 && row.slot_id < SAVE_SLOT_COUNT) {
      const { _display, ...gameState } = row.game_state as Record<string, unknown>
      slots[row.slot_id] = {
        id: row.slot_id,
        timestamp: row.timestamp,
        week: row.week,
        backgroundId: row.background_id,
        characters: (_display as Record<string, unknown>)?.characters as SaveSlot['characters'] ?? [],
        bgm: ((_display as Record<string, unknown>)?.bgm as string) ?? null,
        gameState: gameState as unknown as SaveSlot['gameState'],
      }
    }
  }
  return slots
}

export async function cloudLoadFromSlot(userId: string, slotId: number): Promise<SaveSlot | null> {
  if (!supabase) return null

  const { data, error } = await supabase
    .from('save_slots')
    .select('*')
    .eq('user_id', userId)
    .eq('slot_id', slotId)
    .single()

  if (error || !data) return null

  const { _display, ...gameState } = data.game_state as Record<string, unknown>
  return {
    id: data.slot_id,
    timestamp: data.timestamp,
    week: data.week,
    backgroundId: data.background_id,
    characters: (_display as Record<string, unknown>)?.characters as SaveSlot['characters'] ?? [],
    bgm: ((_display as Record<string, unknown>)?.bgm as string) ?? null,
    gameState: gameState as unknown as SaveSlot['gameState'],
  }
}

export async function cloudDeleteSave(userId: string, slotId: number): Promise<void> {
  if (!supabase) return
  const { error } = await supabase
    .from('save_slots')
    .delete()
    .eq('user_id', userId)
    .eq('slot_id', slotId)
  if (error) console.error('Cloud delete failed:', error)
}
