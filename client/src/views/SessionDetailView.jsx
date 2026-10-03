import { useState } from 'react'
import { calculateCalories } from '../api/metTable.js'
import ExercisePicker from '../components/ExercisePicker.jsx'

const EMPTY_SET_FORM = { exercise: '', weight: '', sets: 3, reps: '' }

export default function SessionDetailView({
  session,
  bodyWeight,
  onBack,
  onMarkComplete,
  onDelete,
  onAddSet,
  onDeleteSet,
}) {
  const [form, setForm] = useState(EMPTY_SET_FORM)

  const kcal = calculateCalories(session.sets, bodyWeight, session.durationMinutes)
  const totalSets = session.sets.reduce((sum, set) => sum + (Number(set.sets) || 1), 0)

  async function handleSubmit(event) {
    event.preventDefault()
    if (!form.exercise.trim()) return
    const saved = await onAddSet(session.id, {
      exercise: form.exercise.trim(),
      weight: Number(form.weight) || 0,
      sets: Number(form.sets) || 1,
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
        {session.durationMinutes} min · {totalSets} set{totalSets === 1 ? '' : 's'}
        {session.notes ? ` · ${session.notes}` : ''}
      </p>

      {session.sets.length === 0 ? (
        <p className="muted">No exercises logged yet. Add your first below.</p>
      ) : (
        <div className="card">
          {session.sets.map((set, index) => (
            <div key={set.id} className="entry-row">
              <span>
                {index + 1}. {set.exercise}{' '}
                <span className="muted">
                  · {set.weight} kg · {set.sets ?? 1} sets × {set.reps} reps
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
        <h2>Log exercise</h2>

        <ExercisePicker value={form.exercise} onSelect={(name) => setForm({ ...form, exercise: name })} />

        <label htmlFor="set-weight">Weight (kg)</label>
        <input
          id="set-weight"
          type="number"
          value={form.weight}
          onChange={(event) => setForm({ ...form, weight: event.target.value })}
          required
        />

        <div className="row-inputs">
          <div>
            <label htmlFor="set-sets">Sets</label>
            <input
              id="set-sets"
              type="number"
              min="1"
              max="20"
              value={form.sets}
              onChange={(event) => setForm({ ...form, sets: event.target.value })}
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

        <button type="submit">+ Log exercise</button>
      </form>

      {!session.complete && (
        <button type="button" className="btn-block" onClick={() => onMarkComplete(session.id)}>
          Mark complete
        </button>
      )}
      <button type="button" className="ghost btn-block danger-outline" onClick={() => onDelete(session.id)}>
        Delete workout log
      </button>
    </>
  )
}