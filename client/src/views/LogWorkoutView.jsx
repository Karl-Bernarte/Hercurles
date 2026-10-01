import { useState } from 'react'
import { formatDay } from '../dateUtils.js'

export default function LogWorkoutView({ workouts, forDate, onSubmit, onCancel }) {
  const [form, setForm] = useState({ workoutId: '', durationMinutes: 45, notes: '' })
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    const workout = workouts.find((row) => row.id === form.workoutId)
    await onSubmit({
      date: forDate,
      durationMinutes: Number(form.durationMinutes),
      notes: form.notes.trim(),
      workoutId: workout ? workout.id : null,
      title: workout ? workout.name : '',
    })
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2>Log workout</h2>
      <p className="muted logging-for">Logging for {formatDay(forDate)}</p>

      <label htmlFor="log-workout">Workout (optional)</label>
      <select
        id="log-workout"
        value={form.workoutId}
        onChange={(event) => setForm({ ...form, workoutId: event.target.value })}
      >
        <option value="">No workout, just log</option>
        {workouts.map((workout) => (
          <option key={workout.id} value={workout.id}>
            {workout.name}
          </option>
        ))}
      </select>

      <label htmlFor="log-duration">Duration (minutes)</label>
      <input
        id="log-duration"
        type="number"
        min="1"
        max="600"
        value={form.durationMinutes}
        onChange={(event) => setForm({ ...form, durationMinutes: event.target.value })}
        required
      />

      <label htmlFor="log-notes">Notes (optional)</label>
      <textarea
        id="log-notes"
        rows={2}
        placeholder="e.g. Felt strong today"
        value={form.notes}
        onChange={(event) => setForm({ ...form, notes: event.target.value })}
      />

      <button type="submit" disabled={saving}>
        {saving ? 'Saving...' : 'Start session'}
      </button>
      <button type="button" className="ghost btn-block form-cancel" onClick={onCancel}>
        Cancel
      </button>
    </form>
  )
}