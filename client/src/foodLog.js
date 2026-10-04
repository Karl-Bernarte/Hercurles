const CUSTOM_FOODS_KEY = 'hercurles:custom-foods'
const FOOD_LOGS_KEY = 'hercurles:food-logs'

export const BUILT_IN_FOODS = [
  { id: 'banana', name: 'Banana', serving: '1 medium', calories: 105 },
  { id: 'chicken-breast', name: 'Chicken breast', serving: '100 g', calories: 165 },
  { id: 'cooked-rice', name: 'Cooked rice', serving: '1 cup', calories: 205 },
  { id: 'egg', name: 'Egg', serving: '1 large', calories: 78 },
  { id: 'greek-yogurt', name: 'Plain Greek yogurt', serving: '170 g', calories: 100 },
  { id: 'oats', name: 'Rolled oats', serving: '1/2 cup dry (40 g)', calories: 150 },
  { id: 'peanut-butter', name: 'Peanut butter', serving: '2 tbsp', calories: 190 },
  { id: 'apple', name: 'Apple', serving: '1 medium', calories: 95 },
]

function readRows(key) {
  const stored = localStorage.getItem(key)
  if (!stored) return []

  try {
    const rows = JSON.parse(stored)
    if (Array.isArray(rows)) return rows
  } catch {
    localStorage.removeItem(key)
  }
  return []
}

function writeRows(key, rows) {
  localStorage.setItem(key, JSON.stringify(rows))
  return rows
}

export function listCustomFoods() {
  return readRows(CUSTOM_FOODS_KEY)
}

export function addCustomFood(input) {
  const food = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    serving: input.serving.trim(),
    calories: Number(input.calories),
  }
  writeRows(CUSTOM_FOODS_KEY, [...listCustomFoods(), food])
  return food
}

export function deleteCustomFood(id) {
  writeRows(CUSTOM_FOODS_KEY, listCustomFoods().filter((food) => String(food.id) !== String(id)))
}

export function listFoodLogs() {
  return readRows(FOOD_LOGS_KEY)
}

export function logFood(food, date, quantity = 1) {
  const servingQuantity = Number(quantity)
  if (!Number.isFinite(servingQuantity) || servingQuantity <= 0 || servingQuantity > 100) {
    throw new Error('Serving quantity must be greater than 0 and no more than 100.')
  }

  const entry = {
    id: crypto.randomUUID(),
    foodId: food.id,
    name: food.name,
    serving: food.serving,
    servingQuantity,
    caloriesPerServing: Number(food.calories),
    calories: Math.round(Number(food.calories) * servingQuantity),
    date,
  }
  writeRows(FOOD_LOGS_KEY, [...listFoodLogs(), entry])
  return entry
}

export function deleteFoodLog(id) {
  writeRows(FOOD_LOGS_KEY, listFoodLogs().filter((entry) => entry.id !== id))
}
