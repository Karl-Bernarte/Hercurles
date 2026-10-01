const KEY = 'final-project:caloriegoal'
const DEFAULT_GOAL = 2000

export function getCalorieGoal() {
  const stored = localStorage.getItem(KEY)
  return stored ? Number(stored) : DEFAULT_GOAL
}

export function setCalorieGoal(kcal) {
  localStorage.setItem(KEY, String(kcal))
}