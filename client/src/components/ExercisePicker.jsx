import { useState } from 'react'
import { EXERCISE_CATALOG, CATEGORIES } from '../api/metTable.js'
import { getRecentExercises, addRecentExercise } from '../exerciseHistory.js'

export default function ExercisePicker({ value, onSelect, label = 'Exercise' }) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState('History')
  const [query, setQuery] = useState('')

  function handlePick(name) {
    addRecentExercise(name)
    onSelect(name)
    setOpen(false)
    setQuery('')
  }

  const lowerQuery = query.trim().toLowerCase()
  let items =
    tab === 'History'
      ? getRecentExercises()
      : EXERCISE_CATALOG.filter((exercise) => exercise.category === tab).map((exercise) => exercise.name)
  if (lowerQuery) {
    items = items.filter((name) => name.toLowerCase().includes(lowerQuery))
  }

  return (
    <>
      <label>{label}</label>
      <button type="button" className="exercise-trigger" onClick={() => setOpen(true)}>
        {value || 'Select exercise'}
      </button>

      {open && (
        <div className="exercise-overlay" role="dialog" aria-label="Select exercise">
          <div className="exercise-sheet">
            <div className="exercise-sheet-header">
              <h2>Select exercise</h2>
              <button type="button" className="ghost" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>

            <input
              type="text"
              className="exercise-search"
              placeholder="Search for an exercise"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />

            <div className="segmented exercise-tabs">
              <button type="button" className={tab === 'History' ? 'active' : ''} onClick={() => setTab('History')}>
                History
              </button>
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={tab === category ? 'active' : ''}
                  onClick={() => setTab(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="exercise-list">
              {items.length === 0 ? (
                <p className="muted exercise-empty">
                  {tab === 'History' ? 'Nothing logged yet.' : 'No matches.'}
                </p>
              ) : (
                items.map((name) => (
                  <button key={name} type="button" className="exercise-item" onClick={() => handlePick(name)}>
                    {name}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}