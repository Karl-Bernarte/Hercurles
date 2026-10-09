import { useState } from 'react'
import ExercisePicker from '../components/ExercisePicker.jsx'
import { getExerciseCategory } from '../api/metTable.js'

const EMPTY_FORM = { name: '', weight: '', sets: 3, reps: 12, durationMinutes: '' }

export default function WorkoutDetailView({
  workout,
  onBack,
  onAddExercise,
  onDeleteExercise,
  onDeleteWorkout,
  onLogWorkout,
}) {
  const [form, setForm] = useState(EMPTY_FORM)
  const isCardio = getExerciseCategory(form.name) === 'Cardio'

  async function handleSubmit(event) {
    event.preventDefault()
    if (!form.name.trim()) return
    const saved = await onAddExercise(workout.id, {
      name: form.name.trim(),
      category: isCardio ? 'Cardio' : 'Strength',
      ...(isCardio
        ? { durationMinutes: Number(form.durationMinutes) }
        : {
            weight: Number(form.weight) || 0,
            sets: Number(form.sets),
            reps: Number(form.reps),
          }),
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
                  {exercise.category === 'Cardio'
                    ? `· ${exercise.durationMinutes} min`
                    : `· ${exercise.weight ?? 0} kg · ${exercise.sets} sets × ${exercise.reps} reps`}
                </span>
              </span>
              <button type="button" className="ghost" onClick={() => onDeleteExercise(workout.id, exercise.id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card">
        <h2>Add exercise</h2>

        <ExercisePicker value={form.name} onSelect={(name) => setForm({ ...form, name })} />

        {isCardio ? (
          <>
            <label htmlFor="exercise-duration">Duration (minutes)</label>
            <input
              id="exercise-duration"
              type="number"
              min="1"
              max="600"
              value={form.durationMinutes}
              onChange={(event) => setForm({ ...form, durationMinutes: event.target.value })}
              required
            />
          </>
        ) : (
          <>
            <label htmlFor="exercise-weight">Weight (kg)</label>
            <input
              id="exercise-weight"
              type="number"
              min="0"
              step="0.5"
              value={form.weight}
              onChange={(event) => setForm({ ...form, weight: event.target.value })}
              required
            />

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
          </>
        )}

        <button type="submit">+ Add exercise</button>
      </form>

      {workout.exercises.length > 0 && (
        <button type="button" className="btn-block" onClick={() => onLogWorkout(workout.id)}>
          Log Workout
        </button>
      )}

      <button type="button" className="ghost btn-block danger-outline" onClick={() => onDeleteWorkout(workout.id)}>
        Delete workout
      </button>
    </>
  )
}