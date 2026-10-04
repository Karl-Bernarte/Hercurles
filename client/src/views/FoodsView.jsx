import { useMemo, useState } from 'react'
import DayNav from '../components/DayNav.jsx'
import { formatDay } from '../dateUtils.js'
import { BUILT_IN_FOODS } from '../foodLog.js'

export default function FoodsView({
  date,
  today,
  customFoods,
  foodLogs,
  allFoodLogs,
  onDateChange,
  onAddCustomFood,
  onDeleteCustomFood,
  onLogFood,
  onDeleteFoodLog,
}) {
  const [tab, setTab] = useState('History')
  const [query, setQuery] = useState('')
  const [selectedFood, setSelectedFood] = useState(null)
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [quantity, setQuantity] = useState('1')
  const [form, setForm] = useState({ name: '', serving: '', calories: '' })
  const foods = useMemo(() => {
    const search = query.trim().toLowerCase()
    return [...BUILT_IN_FOODS, ...customFoods].filter((food) =>
      `${food.name} ${food.serving}`.toLowerCase().includes(search)
    )
  }, [customFoods, query])
  const recentFoods = useMemo(() => {
    const foodById = new Map([...BUILT_IN_FOODS, ...customFoods].map((food) => [food.id, food]))
    const recentIds = []
    const seen = new Set()

    for (const entry of [...allFoodLogs].reverse()) {
      if (!seen.has(entry.foodId) && foodById.has(entry.foodId)) {
        seen.add(entry.foodId)
        recentIds.push(entry.foodId)
        if (recentIds.length === 5) break
      }
    }

    return recentIds.map((id) => foodById.get(id))
  }, [allFoodLogs, customFoods])
  const filteredRecentFoods = recentFoods.filter((food) =>
    `${food.name} ${food.serving}`.toLowerCase().includes(query.trim().toLowerCase())
  )
  const loggedCalories = foodLogs.reduce((sum, entry) => sum + entry.calories, 0)
  const quantityValue = Number(quantity)
  const estimatedCalories =
    selectedFood && Number.isFinite(quantityValue)
      ? Math.round(selectedFood.calories * quantityValue)
      : 0

  function handleSubmit(event) {
    event.preventDefault()
    if (onAddCustomFood(form)) {
      setForm({ name: '', serving: '', calories: '' })
      setShowCustomForm(false)
    }
  }

  function handleLogSelectedFood(event) {
    event.preventDefault()
    if (!Number.isFinite(quantityValue) || quantityValue <= 0 || quantityValue > 100) return
    onLogFood(selectedFood, date, quantityValue)
    setSelectedFood(null)
    setQuantity('1')
  }

  function renderFoodButton(food) {
    return (
      <button
        key={food.id}
        type="button"
        className="food-picker-item"
        onClick={() => {
          setSelectedFood(food)
          setQuantity('1')
        }}
      >
        <span className="food-picker-info">
          <strong>{food.name}</strong>
          <span>{food.serving}</span>
        </span>
        <span className="food-picker-calories">
          {food.calories} kcal <span aria-hidden="true">+</span>
        </span>
      </button>
    )
  }

  function renderCustomFood(food) {
    return (
      <div className="food-custom-row" key={food.id}>
        {renderFoodButton(food)}
        <button
          type="button"
          className="ghost food-delete-button"
          aria-label={`Delete custom food ${food.name}`}
          onClick={() => onDeleteCustomFood(food.id)}
        >
          Delete
        </button>
      </div>
    )
  }

  return (
    <>
      <DayNav date={date} today={today} onChange={onDateChange} />

      <section className="food-picker-sheet" aria-label="Select food to log">
        <div className="food-tabs" role="tablist" aria-label="Food options">
          {['History', 'Food List', 'Custom'].map((name) => (
            <button
              key={name}
              type="button"
              role="tab"
              aria-selected={tab === name}
              className={tab === name ? 'active' : ''}
              onClick={() => {
                setTab(name)
                setQuery('')
              }}
            >
              {name}
            </button>
          ))}
        </div>

        {tab !== 'Custom' && (
          <>
            <input
              type="search"
              className="exercise-search"
              placeholder={tab === 'History' ? 'Search food history' : 'Search food list'}
              aria-label={tab === 'History' ? 'Search food history' : 'Search foods'}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <p className="food-picker-date">Adding to {formatDay(date)}</p>

            <div className="food-picker-list">
              {tab === 'History' ? (
                filteredRecentFoods.length === 0 ? (
                  <p className="muted exercise-empty">
                    {recentFoods.length === 0
                      ? 'Foods you log will show up here.'
                      : 'No recent foods match your search.'}
                  </p>
                ) : (
                  filteredRecentFoods.map(renderFoodButton)
                )
              ) : foods.length === 0 ? (
                <p className="muted exercise-empty">No foods match your search.</p>
              ) : (
                foods.map(renderFoodButton)
              )}
            </div>
          </>
        )}

        {tab === 'Custom' && (
          <>
            <button
              type="button"
              className="food-add-custom"
              onClick={() => setShowCustomForm(true)}
            >
              + Add custom food
            </button>
            <div className="food-picker-list">
              {customFoods.length === 0 ? (
                <p className="muted exercise-empty">Your custom foods will appear here.</p>
              ) : (
                customFoods.map(renderCustomFood)
              )}
            </div>
          </>
        )}
      </section>

      <section className="food-log-section" aria-labelledby="logged-foods-title">
        <div className="food-log-header">
          <h2 id="logged-foods-title">Logged foods</h2>
          <span>{loggedCalories} kcal</span>
        </div>
        {foodLogs.length === 0 ? (
          <p className="card muted foods-empty">No food logged for this day yet.</p>
        ) : (
          <ul className="list food-list logged-food-list">
            {foodLogs.map((entry) => (
              <li className="food-row" key={entry.id}>
                <div className="food-row-info">
                  <strong>{entry.name}</strong>
                  <span className="muted">
                    {entry.servingQuantity && entry.servingQuantity !== 1
                      ? `${entry.servingQuantity} × `
                      : ''}
                    {entry.serving}
                  </span>
                  <span className="kcal-tag">{entry.calories} kcal</span>
                </div>
                <button
                  type="button"
                  className="ghost"
                  aria-label={`Remove ${entry.name} from food log`}
                  onClick={() => onDeleteFoodLog(entry.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {selectedFood && (
        <div className="exercise-overlay" role="dialog" aria-label={`Log ${selectedFood.name}`}>
          <form className="food-custom-sheet" onSubmit={handleLogSelectedFood}>
            <div className="exercise-sheet-header">
              <h2>Log {selectedFood.name}</h2>
              <button
                type="button"
                className="ghost"
                onClick={() => setSelectedFood(null)}
              >
                Close
              </button>
            </div>
            <p className="muted food-serving-note">
              One serving: {selectedFood.serving} · {selectedFood.calories} kcal
            </p>
            <label htmlFor="food-quantity">Number of servings</label>
            <input
              id="food-quantity"
              type="number"
              min="0.1"
              max="100"
              step="0.1"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              required
            />
            <p className="food-calorie-preview">
              {estimatedCalories} kcal total
            </p>
            <button
              type="submit"
              disabled={!Number.isFinite(quantityValue) || quantityValue <= 0 || quantityValue > 100}
            >
              Add to food log
            </button>
          </form>
        </div>
      )}

      {showCustomForm && (
        <div className="exercise-overlay" role="dialog" aria-label="Add a custom food">
          <form className="food-custom-sheet" onSubmit={handleSubmit}>
            <div className="exercise-sheet-header">
              <h2>Add a custom food</h2>
              <button
                type="button"
                className="ghost"
                onClick={() => setShowCustomForm(false)}
              >
                Close
              </button>
            </div>
            <p className="muted food-serving-note">Save a food with its serving size and calories.</p>

            <label htmlFor="food-name">Food name</label>
            <input
              id="food-name"
              maxLength="100"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              required
            />

            <label htmlFor="food-serving">Serving size</label>
            <input
              id="food-serving"
              maxLength="100"
              placeholder="e.g. 1 cup or 100 g"
              value={form.serving}
              onChange={(event) => setForm({ ...form, serving: event.target.value })}
              required
            />

            <label htmlFor="food-calories">Calories per serving</label>
            <input
              id="food-calories"
              type="number"
              min="0"
              max="10000"
              step="1"
              value={form.calories}
              onChange={(event) => setForm({ ...form, calories: event.target.value })}
              required
            />
            <button type="submit">Save custom food</button>
          </form>
        </div>
      )}

    </>
  )
}
