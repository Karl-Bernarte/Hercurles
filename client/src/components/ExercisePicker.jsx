import { useState } from 'react'
import {
  EXERCISE_CATALOG,
  CATEGORIES,
  addCustomExercise,
  listCustomExercises,
} from '../api/metTable.js'
import { getRecentExercises, addRecentExercise } from '../exerciseHistory.js'

export default function ExercisePicker({ value, onSelect, label = 'Exercise' }) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState('History')
  const [query, setQuery] = useState('')
  const [customExercises, setCustomExercises] = useState(() => listCustomExercises())
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [form, setForm] = useState({ name: '', met: '', category: CATEGORIES[0] })
  const [formError, setFormError] = useState('')

  function handlePick(name) {
    addRecentExercise(name)
    onSelect(name)
    setOpen(false)
    setQuery('')
    setShowCustomForm(false)
    setFormError('')
  }

  function handleAddCustomExercise(event) {
    event.preventDefault()
    try {
      const exercise = addCustomExercise(form)
      setCustomExercises((current) => [...current, exercise])
      setForm({ name: '', met: '', category: CATEGORIES[0] })
      handlePick(exercise.name)
    } catch (error) {
      setFormError(error.message)
    }
  }

  const lowerQuery = query.trim().toLowerCase()
  let items = tab === 'History'
    ? getRecentExercises()
    : tab === 'Custom'
      ? customExercises.map((exercise) => exercise.name)
      : [...EXERCISE_CATALOG, ...customExercises]
          .filter((exercise) => exercise.category === tab)
          .map((exercise) => exercise.name)
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
              <h2>{showCustomForm ? 'Add a custom exercise' : 'Select exercise'}</h2>
              <button
                type="button"
                className="ghost"
                onClick={() => {
                  setOpen(false)
                  setShowCustomForm(false)
                  setFormError('')
                }}
              >
                Close
              </button>
            </div>

            {showCustomForm ? (
              <form className="exercise-custom-form" onSubmit={handleAddCustomExercise}>
                <p className="muted">Add an exercise with its MET estimate and category.</p>
                <label htmlFor="custom-exercise-name">Name of the workout</label>
                <input
                  id="custom-exercise-name"
                  maxLength="100"
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  required
                />

                <label htmlFor="custom-exercise-met">MET</label>
                <input
                  id="custom-exercise-met"
                  type="number"
                  min="0.1"
                  max="20"
                  step="0.1"
                  placeholder="e.g. 5"
                  value={form.met}
                  onChange={(event) => setForm({ ...form, met: event.target.value })}
                  required
                />

                <label htmlFor="custom-exercise-category">Category</label>
                <select
                  id="custom-exercise-category"
                  value={form.category}
                  onChange={(event) => setForm({ ...form, category: event.target.value })}
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {formError && <p className="exercise-form-error" role="alert">{formError}</p>}
                <button type="submit">Save custom exercise</button>
              </form>
            ) : (
              <>
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
                  <button
                    type="button"
                    className={tab === 'Custom' ? 'active' : ''}
                    onClick={() => setTab('Custom')}
                  >
                    Custom
                  </button>
                </div>

                {tab === 'Custom' && (
                  <button
                    type="button"
                    className="food-add-custom"
                    onClick={() => {
                      setFormError('')
                      setShowCustomForm(true)
                    }}
                  >
                    + Add custom exercise
                  </button>
                )}

                <input
                  type="text"
                  className="exercise-search"
                  placeholder="Search for an exercise"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />

                <div className="exercise-list">
                  {items.length === 0 ? (
                    <p className="muted exercise-empty">
                      {tab === 'History'
                        ? 'Nothing logged yet.'
                        : tab === 'Custom'
                          ? 'Your custom exercises will appear here.'
                          : 'No matches.'}
                    </p>
                  ) : (
                    items.map((name) => {
                      const custom = customExercises.find((exercise) => exercise.name === name)
                      return (
                        <button key={name} type="button" className="exercise-item" onClick={() => handlePick(name)}>
                          {custom ? `${name} · ${custom.met} MET · ${custom.category}` : name}
                        </button>
                      )
                    })
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}