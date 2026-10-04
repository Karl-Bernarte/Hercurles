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
  { id: 'orange', name: 'Orange', serving: '1 medium', calories: 62 },
  { id: 'blueberries', name: 'Blueberries', serving: '1 cup', calories: 84 },
  { id: 'strawberries', name: 'Strawberries', serving: '1 cup', calories: 49 },
  { id: 'avocado', name: 'Avocado', serving: '1/2 medium', calories: 120 },
  { id: 'broccoli', name: 'Broccoli', serving: '1 cup cooked', calories: 55 },
  { id: 'spinach', name: 'Spinach', serving: '1 cup raw', calories: 7 },
  { id: 'carrot', name: 'Carrot', serving: '1 medium', calories: 25 },
  { id: 'sweet-potato', name: 'Sweet potato', serving: '1 medium baked', calories: 103 },
  { id: 'potato', name: 'Potato', serving: '1 medium baked', calories: 161 },
  { id: 'salmon', name: 'Salmon', serving: '100 g cooked', calories: 206 },
  { id: 'tuna', name: 'Tuna, canned in water', serving: '100 g drained', calories: 116 },
  { id: 'ground-beef', name: 'Ground beef, lean', serving: '100 g cooked', calories: 250 },
  { id: 'turkey-breast', name: 'Turkey breast', serving: '100 g cooked', calories: 135 },
  { id: 'tofu', name: 'Firm tofu', serving: '100 g', calories: 144 },
  { id: 'black-beans', name: 'Black beans', serving: '1/2 cup cooked', calories: 114 },
  { id: 'chickpeas', name: 'Chickpeas', serving: '1/2 cup cooked', calories: 135 },
  { id: 'lentils', name: 'Lentils', serving: '1/2 cup cooked', calories: 115 },
  { id: 'quinoa', name: 'Quinoa', serving: '1 cup cooked', calories: 222 },
  { id: 'pasta', name: 'Pasta', serving: '1 cup cooked', calories: 200 },
  { id: 'whole-wheat-bread', name: 'Whole wheat bread', serving: '1 slice', calories: 100 },
  { id: 'white-bread', name: 'White bread', serving: '1 slice', calories: 75 },
  { id: 'tortilla', name: 'Flour tortilla', serving: '1 medium', calories: 140 },
  { id: 'cheddar-cheese', name: 'Cheddar cheese', serving: '1 oz (28 g)', calories: 114 },
  { id: 'cottage-cheese', name: 'Cottage cheese', serving: '1/2 cup', calories: 110 },
  { id: 'milk', name: 'Whole milk', serving: '1 cup', calories: 149 },
  { id: 'skim-milk', name: 'Skim milk', serving: '1 cup', calories: 83 },
  { id: 'protein-shake', name: 'Protein shake', serving: '1 scoop with water', calories: 120 },
  { id: 'almonds', name: 'Almonds', serving: '1 oz (28 g)', calories: 164 },
  { id: 'walnuts', name: 'Walnuts', serving: '1 oz (28 g)', calories: 185 },
  { id: 'hummus', name: 'Hummus', serving: '2 tbsp', calories: 70 },
  { id: 'olive-oil', name: 'Olive oil', serving: '1 tbsp', calories: 119 },
  { id: 'sweetcorn', name: 'Sweet corn', serving: '1/2 cup', calories: 66 },
  { id: 'tomato', name: 'Tomato', serving: '1 medium', calories: 22 },
  { id: 'cucumber', name: 'Cucumber', serving: '1 cup sliced', calories: 16 },
  { id: 'bell-pepper', name: 'Bell pepper', serving: '1 medium', calories: 31 },
  { id: 'pasta-sauce', name: 'Tomato pasta sauce', serving: '1/2 cup', calories: 70 },
  { id: 'granola', name: 'Granola', serving: '1/2 cup', calories: 225 },
  { id: 'cereal', name: 'Corn flakes cereal', serving: '1 cup', calories: 101 },
  { id: 'pancake', name: 'Pancake', serving: '1 medium', calories: 175 },
  { id: 'dark-chocolate', name: 'Dark chocolate', serving: '1 oz (28 g)', calories: 170 },
  { id: 'honey', name: 'Honey', serving: '1 tbsp', calories: 64 },
  { id: 'orange-juice', name: 'Orange juice', serving: '1 cup', calories: 112 },
  { id: 'coffee', name: 'Black coffee', serving: '1 cup', calories: 2 },
  { id: 'sports-drink', name: 'Sports drink', serving: '1 bottle (20 fl oz)', calories: 130 },
  { id: 'pear', name: 'Pear', serving: '1 medium', calories: 101 },
  { id: 'grapes', name: 'Grapes', serving: '1 cup', calories: 104 },
  { id: 'raspberries', name: 'Raspberries', serving: '1 cup', calories: 64 },
  { id: 'blackberries', name: 'Blackberries', serving: '1 cup', calories: 62 },
  { id: 'watermelon', name: 'Watermelon', serving: '1 cup diced', calories: 46 },
  { id: 'pineapple', name: 'Pineapple', serving: '1 cup chunks', calories: 82 },
  { id: 'mango', name: 'Mango', serving: '1 cup sliced', calories: 99 },
  { id: 'peach', name: 'Peach', serving: '1 medium', calories: 59 },
  { id: 'kiwi', name: 'Kiwi', serving: '1 medium', calories: 42 },
  { id: 'cherries', name: 'Cherries', serving: '1 cup', calories: 97 },
  { id: 'cantaloupe', name: 'Cantaloupe', serving: '1 cup diced', calories: 54 },
  { id: 'raisins', name: 'Raisins', serving: '1/4 cup', calories: 123 },
  { id: 'dates', name: 'Dates', serving: '2 Medjool dates', calories: 133 },
  { id: 'lettuce', name: 'Romaine lettuce', serving: '2 cups shredded', calories: 16 },
  { id: 'kale', name: 'Kale', serving: '1 cup chopped raw', calories: 33 },
  { id: 'mushrooms', name: 'Mushrooms', serving: '1 cup sliced', calories: 15 },
  { id: 'onion', name: 'Onion', serving: '1 medium', calories: 44 },
  { id: 'cauliflower', name: 'Cauliflower', serving: '1 cup cooked', calories: 29 },
  { id: 'green-beans', name: 'Green beans', serving: '1 cup cooked', calories: 44 },
  { id: 'asparagus', name: 'Asparagus', serving: '1 cup cooked', calories: 40 },
  { id: 'zucchini', name: 'Zucchini', serving: '1 cup sliced', calories: 19 },
  { id: 'peas', name: 'Green peas', serving: '1/2 cup cooked', calories: 67 },
  { id: 'edamame', name: 'Edamame', serving: '1/2 cup shelled', calories: 94 },
  { id: 'chicken-thigh', name: 'Chicken thigh, skinless', serving: '100 g cooked', calories: 209 },
  { id: 'pork-chop', name: 'Pork chop, lean', serving: '100 g cooked', calories: 231 },
  { id: 'shrimp', name: 'Shrimp', serving: '100 g cooked', calories: 99 },
  { id: 'cod', name: 'Cod', serving: '100 g cooked', calories: 105 },
  { id: 'sardines', name: 'Sardines, canned', serving: '1 can (92 g)', calories: 191 },
  { id: 'tempeh', name: 'Tempeh', serving: '100 g', calories: 193 },
  { id: 'seitan', name: 'Seitan', serving: '100 g', calories: 143 },
  { id: 'kidney-beans', name: 'Kidney beans', serving: '1/2 cup cooked', calories: 112 },
  { id: 'pinto-beans', name: 'Pinto beans', serving: '1/2 cup cooked', calories: 123 },
  { id: 'split-peas', name: 'Split peas', serving: '1/2 cup cooked', calories: 116 },
  { id: 'brown-rice', name: 'Brown rice', serving: '1 cup cooked', calories: 216 },
  { id: 'white-rice', name: 'White rice', serving: '1/2 cup cooked', calories: 103 },
  { id: 'oatmeal', name: 'Oatmeal, cooked', serving: '1 cup', calories: 154 },
  { id: 'bagel', name: 'Plain bagel', serving: '1 medium', calories: 277 },
  { id: 'english-muffin', name: 'English muffin', serving: '1 muffin', calories: 134 },
  { id: 'pita-bread', name: 'Pita bread', serving: '1 medium', calories: 170 },
  { id: 'pretzels', name: 'Pretzels', serving: '1 oz (28 g)', calories: 108 },
  { id: 'popcorn', name: 'Air-popped popcorn', serving: '3 cups', calories: 93 },
  { id: 'rice-cakes', name: 'Plain rice cakes', serving: '2 cakes', calories: 70 },
  { id: 'mozzarella', name: 'Mozzarella cheese', serving: '1 oz (28 g)', calories: 85 },
  { id: 'parmesan', name: 'Parmesan cheese', serving: '1 tbsp grated', calories: 22 },
  { id: 'feta', name: 'Feta cheese', serving: '1 oz (28 g)', calories: 75 },
  { id: 'plain-yogurt', name: 'Plain low-fat yogurt', serving: '1 cup', calories: 154 },
  { id: 'soy-milk', name: 'Unsweetened soy milk', serving: '1 cup', calories: 80 },
  { id: 'almond-milk', name: 'Unsweetened almond milk', serving: '1 cup', calories: 30 },
  { id: 'cream-cheese', name: 'Cream cheese', serving: '1 tbsp', calories: 51 },
  { id: 'cashews', name: 'Cashews', serving: '1 oz (28 g)', calories: 157 },
  { id: 'pistachios', name: 'Pistachios', serving: '1 oz (28 g)', calories: 159 },
  { id: 'sunflower-seeds', name: 'Sunflower seeds', serving: '1 oz (28 g)', calories: 165 },
  { id: 'chia-seeds', name: 'Chia seeds', serving: '1 tbsp', calories: 58 },
  { id: 'flaxseed', name: 'Ground flaxseed', serving: '1 tbsp', calories: 37 },
  { id: 'mayonnaise', name: 'Mayonnaise', serving: '1 tbsp', calories: 94 },
  { id: 'ketchup', name: 'Ketchup', serving: '1 tbsp', calories: 17 },
  { id: 'salsa', name: 'Salsa', serving: '1/4 cup', calories: 20 },
  { id: 'maple-syrup', name: 'Maple syrup', serving: '1 tbsp', calories: 52 },
  { id: 'butter', name: 'Butter', serving: '1 tbsp', calories: 102 },
  { id: 'coconut-oil', name: 'Coconut oil', serving: '1 tbsp', calories: 121 },
  { id: 'soy-sauce', name: 'Soy sauce', serving: '1 tbsp', calories: 9 },
  { id: 'soup-chicken-noodle', name: 'Chicken noodle soup', serving: '1 cup', calories: 75 },
  { id: 'hummus-wrap', name: 'Hummus and veggie wrap', serving: '1 wrap', calories: 300 },
  { id: 'cheese-pizza', name: 'Cheese pizza', serving: '1 slice (1/8 of 14-inch)', calories: 285 },
  { id: 'turkey-sandwich', name: 'Turkey sandwich', serving: '1 sandwich', calories: 320 },
  { id: 'granola-bar', name: 'Granola bar', serving: '1 bar (about 35 g)', calories: 140 },
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
