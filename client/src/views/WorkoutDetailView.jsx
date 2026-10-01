import { useState } from 'react'
import { MET_TABLE } from '../api/metTable.js'

const EXERCISE_NAMES = Object.keys(MET_TABLE).filter((name) => name !== 'Default')
const EMPTY_FORM = { name: '', sets: 3, reps: 10 }

export default function WorkoutDetailView({
  workout,
  onBack,
  onAddExercise,
  onDeleteExercise,
  onDeleteWorkout,
}) {
  const [form, setForm] = useState(EMPTY_FORM)

  async function handleSubmit(event) {
    event.preventDefault()
    if (!form.name.trim()) return
    const saved = await onAddExercise(workout.id, {
      name: form.name.trim(),
      sets: Number(form.sets),
      reps: Number(form.reps),
    })
    if (saved) setForm(EMPTY_FORM)
  }

  return (
    <>
      <button type="button" className="ghost back-link" onClick={onBack}>
        ← Your workouts
      </button>

      <h2 className="detail-title">{workout.name}</h2>
      <p className="muted">
        {workout.exercises.length} exercise{workout.exercises.length === 1 ? '' : 's'}
      </p>

      {workout.exercises.length === 0 ? (
        <p className="muted">Nothing in this workout yet. Add your first exercise below.</p>
      ) : (
        <div className="card">
          {workout.exercises.map((exercise, index) => (
            <div key={exercise.id} className="entry-row">
              <span>
                {index + 1}. {exercise.name}{' '}
                <span className="muted">
                  · {exercise.sets} × {exercise.reps}
                </span>
              </span>
              <button
                type="button"
                className="ghost"
                onClick={() => onDeleteExercise(workout.id, exercise.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card">
        <h2>Add exercise</h2>

        <label htmlFor="exercise-name">Exercise</label>
        <input
          id="exercise-name"
          list="detail-exercise-options"
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
          required
        />
        <datalist id="detail-exercise-options">
          {EXERCISE_NAMES.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>

        <div className="row-inputs">
          <div>
            <label htmlFor="exercise-sets">Sets</label>
            <input
              id="exercise-sets"
              type="number"
              min="1"
              max="20"
              value={form.sets}
              onChange={(event) => setForm({ ...form, sets: event.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="exercise-reps">Reps</label>
            <input
              id="exercise-reps"
              type="number"
              min="1"
              max="100"
              value={form.reps}
              onChange={(event) => setForm({ ...form, reps: event.target.value })}
              required
            />
          </div>
        </div>

        <button type="submit">+ Add exercise</button>
      </form>

      <button
        type="button"
        className="ghost btn-block danger-outline"
        onClick={() => onDeleteWorkout(workout.id)}
      >
        Delete workout
      </button>
    </>
  )
}