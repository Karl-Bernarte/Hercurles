import { useState } from 'react'
import { MET_TABLE, calculateCalories } from '../api/metTable.js'

const EMPTY_SET_FORM = { exercise: '', weight: '', reps: '' }
const MET_NAMES = Object.keys(MET_TABLE).filter((name) => name !== 'Default')

// Exercises from the workout this log was based on come first in the box.
function suggestionsFor(session, workouts) {
  const workout = workouts.find((row) => row.id === session.workoutId)
  const planned = workout ? workout.exercises.map((exercise) => exercise.name) : []
  return [...new Set([...planned, ...MET_NAMES])]
}

export default function SessionDetailView({
  session,
  workouts,
  bodyWeight,
  onBack,
  onMarkComplete,
  onDelete,
  onAddSet,
  onDeleteSet,
}) {
  const [form, setForm] = useState(EMPTY_SET_FORM)
  const kcal = calculateCalories(session.sets, bodyWeight, session.durationMinutes)
  const suggestions = suggestionsFor(session, workouts)

  async function handleSubmit(event) {
    event.preventDefault()
    if (!form.exercise.trim()) return
    const saved = await onAddSet(session.id, {
      exercise: form.exercise.trim(),
      weight: Number(form.weight),
      reps: Number(form.reps),
    })
    if (saved) setForm(EMPTY_SET_FORM)
  }

  return (
    <>
      <button type="button" className="ghost back-link" onClick={onBack}>
        ← Back
      </button>

      <div className="row-head">
        <h2 className="detail-title">
          {session.title || 'Workout'} {session.complete && <span className="badge">DONE</span>}
        </h2>
        <span className="kcal-tag">{kcal} kcal</span>
      </div>
      <p className="muted">
        {session.durationMinutes} min · {session.sets.length} set{session.sets.length === 1 ? '' : 's'}
        {session.notes ? ` · ${session.notes}` : ''}
      </p>

      {session.sets.length === 0 ? (
        <p className="muted">No sets logged yet. Add your first below.</p>
      ) : (
        <div className="card">
          {session.sets.map((set, index) => (
            <div key={set.id} className="entry-row">
              <span>
                {index + 1}. {set.exercise}{' '}
                <span className="muted">
                  · {set.weight} kg × {set.reps} reps
                </span>
              </span>
              <button type="button" className="ghost" onClick={() => onDeleteSet(session.id, set.id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card">
        <h2>Log set</h2>

        <label htmlFor="set-exercise">Exercise</label>
        <input
          id="set-exercise"
          list="session-exercise-options"
          value={form.exercise}
          onChange={(event) => setForm({ ...form, exercise: event.target.value })}
          required
        />
        <datalist id="session-exercise-options">
          {suggestions.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>

        <div className="row-inputs">
          <div>
            <label htmlFor="set-weight">Weight (kg)</label>
            <input
              id="set-weight"
              type="number"
              value={form.weight}
              onChange={(event) => setForm({ ...form, weight: event.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="set-reps">Reps</label>
            <input
              id="set-reps"
              type="number"
              value={form.reps}
              onChange={(event) => setForm({ ...form, reps: event.target.value })}
              required
            />
          </div>
        </div>

        <button type="submit">+ Log set</button>
      </form>

      {!session.complete && (
        <button type="button" className="btn-block" onClick={() => onMarkComplete(session.id)}>
          Mark complete
        </button>
      )}
      <button
        type="button"
        className="ghost btn-block danger-outline"
        onClick={() => onDelete(session.id)}
      >
        Delete workout log
      </button>
    </>
  )
}