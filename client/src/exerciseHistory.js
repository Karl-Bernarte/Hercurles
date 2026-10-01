const KEY = 'final-project:recentexercises'
const MAX_HISTORY = 10

export function getRecentExercises() {
  const stored = localStorage.getItem(KEY)
  if (!stored) return []
  try {
    return JSON.parse(stored)
  } catch {
    return []
  }
}

export function addRecentExercise(name) {
  const current = getRecentExercises().filter((item) => item !== name)
  current.unshift(name)
  const trimmed = current.slice(0, MAX_HISTORY)
  localStorage.setItem(KEY, JSON.stringify(trimmed))
  return trimmed
}