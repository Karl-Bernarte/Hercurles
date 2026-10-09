import { useState } from 'react'
import {
  EXERCISE_CATALOG,
  CATEGORIES,
  addCustomExercise,
  deleteCustomExercise,
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

  function handleAddCustomExercise() {
    try {
      const exercise = addCustomExercise(form)
      setCustomExercises((current) => [...current, exercise])
      setForm({ name: '', met: '', category: CATEGORIES[0] })
      setTab('Custom')
      setQuery('')
      setShowCustomForm(false)
      setFormError('')
    } catch (error) {
      setFormError(error.message)
    }
  }

  function handleDeleteCustomExercise(name) {
    if (!window.confirm(`Delete custom exercise "${name}"? Existing workout logs will be kept.`)) return
    try {
      setCustomExercises(deleteCustomExercise(name))
      setFormError('')
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
  items = [...new Set(items)]
  if (lowerQuery) {
    const queryWords = lowerQuery.match(/[a-z0-9]+/g) ?? []
    const normalizeWord = (word) => word.endsWith('s') ? word.slice(0, -1) : word
    const normalizedQuery = queryWords.map(normalizeWord)
    items = items.filter((name) => {
      const nameWords = (name.toLowerCase().match(/[a-z0-9]+/g) ?? []).map(normalizeWord)
      return normalizedQuery.every((queryWord) =>
        nameWords.some((nameWord) => nameWord.includes(queryWord))
      )
    })
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
              <div
                className="exercise-custom-form"
                role="group"
                aria-label="Add a custom exercise"
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && event.target.tagName === 'INPUT') {
                    event.preventDefault()
                    handleAddCustomExercise()
                  }
                }}
              >
                <p className="muted">Add an exercise with its MET estimate and category.</p>
                <label htmlFor="custom-exercise-name">Name of the workout</label>
                <input
                  id="custom-exercise-name"
                  type="text"
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
                <button type="button" onClick={handleAddCustomExercise}>Save custom exercise</button>
              </div>
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
                  {tab === 'Custom' && formError && (
                    <p className="exercise-form-error" role="alert">{formError}</p>
                  )}
                  {items.length === 0 ? (
                    <p className="muted exercise-empty">
                      {tab === 'History'
                        ? 'Nothing logged yet.'
                        : tab === 'Custom'
                          ? 'Your custom exercises will appear here.'
                          : 'No matches.'}
                    </p>
                  ) : (
                    items.map((name, index) => {
                      if (tab === 'Custom') {
                        return (
                          <div key={`${name}-${index}`} className="exercise-custom-row">
                            <button
                              type="button"
                              className="exercise-item"
                              onClick={() => handlePick(name)}
                            >
                              {name}
                            </button>
                            <button
                              type="button"
                              className="ghost exercise-delete-button"
                              aria-label={`Delete custom exercise ${name}`}
                              onClick={() => handleDeleteCustomExercise(name)}
                            >
                              Delete
                            </button>
                          </div>
                        )
                      }
                      return (
                        <button key={`${name}-${index}`} type="button" className="exercise-item" onClick={() => handlePick(name)}>
                          {name}
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