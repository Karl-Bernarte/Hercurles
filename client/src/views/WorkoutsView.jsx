import { useState } from 'react'

export default function WorkoutsView({ workouts, onCreate, onOpenForEdit, onLog, onBack }) {
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    setSaving(true)
    await onCreate(trimmed)
    setSaving(false)
    setName('')
  }

  return (
    <>
      <button type="button" className="ghost back-link" onClick={onBack}>
        ← Back
      </button>

      <form onSubmit={handleSubmit} className="card">
        <h2>Create workout</h2>
        <label htmlFor="workout-name">Workout name</label>
        <input
          id="workout-name"
          value={name}
          maxLength={60}
          placeholder="e.g. Back / Biceps Day"
          onChange={(event) => setName(event.target.value)}
          required
        />
        <button type="submit" disabled={saving}>
          {saving ? 'Creating...' : 'Create workout'}
        </button>
      </form>

      <div className="section-label">Your workouts</div>
      <p className="hint">Tap a workout to log it as today's session.</p>
      {workouts.length === 0 ? (
        <p className="muted">No workouts yet. Name your first one above.</p>
      ) : (
        <ul className="list">
          {workouts.map((workout) => (
            <li key={workout.id} className="workout-row-wrap">
              <button type="button" className="workout-row" onClick={() => onLog(workout.id)}>
                <span>{workout.name}</span>
                <span className="muted">
                  {workout.exercises.length} exercise{workout.exercises.length === 1 ? '' : 's'}
                </span>
              </button>
              <button
                type="button"
                className="ghost workout-edit"
                onClick={() => onOpenForEdit(workout.id)}
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}