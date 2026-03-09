import type { GameCondition, GameState } from './types'

export function evaluateCondition(condition: GameCondition, state: GameState): boolean {
  switch (condition.type) {
    case 'flag':
      return state.flags[condition.flag] === condition.value
    case 'affinity_gte':
      return (state.affinity[condition.characterId] ?? 0) >= condition.value
    case 'affinity_lte':
      return (state.affinity[condition.characterId] ?? 0) <= condition.value
    case 'adaptation_gte':
      return state.adaptation >= condition.value
    case 'adaptation_lte':
      return state.adaptation <= condition.value
    case 'week_gte':
      return state.week >= condition.value
    case 'week_lte':
      return state.week <= condition.value
    case 'and':
      return condition.conditions.every((c) => evaluateCondition(c, state))
    case 'or':
      return condition.conditions.some((c) => evaluateCondition(c, state))
    case 'not':
      return !evaluateCondition(condition.condition, state)
  }
}
