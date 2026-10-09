const SESSION_COLUMNS = `
  s.id,
  s.date::text AS date,
  s.duration_minutes AS "durationMinutes",
  s.notes,
  s.workout_id AS "workoutId",
  s.title,
  s.complete
`

const SET_COLUMNS = `
  id,
  session_id AS "sessionId",
  exercise,
  category,
  duration_minutes AS "durationMinutes",
  weight::float8 AS weight,
  sets,
  reps
`

const WORKOUT_COLUMNS = 'id, name'
const EXERCISE_COLUMNS = `
  id,
  workout_id AS "workoutId",
  name,
  category,
  duration_minutes AS "durationMinutes",
  weight::float8 AS weight,
  sets,
  reps
`

export async function listSessions(pool) {
  const sessions = await pool.query(
    `SELECT ${SESSION_COLUMNS} FROM sessions s ORDER BY s.date DESC, s.id DESC`
  )
  const sets = await pool.query(
    `SELECT ${SET_COLUMNS} FROM session_sets ORDER BY id`
  )
  const setsBySession = new Map(sessions.rows.map(({ id }) => [id, []]))
  for (const set of sets.rows) setsBySession.get(set.sessionId)?.push(set)
  return sessions.rows.map((session) => ({
    ...session,
    sets: setsBySession.get(session.id),
  }))
}

export async function getSession(pool, id) {
  const result = await pool.query(
    `SELECT ${SESSION_COLUMNS} FROM sessions s WHERE s.id = $1`,
    [id]
  )
  const session = result.rows[0]
  if (!session) return null
  const sets = await pool.query(
    `SELECT ${SET_COLUMNS} FROM session_sets WHERE session_id = $1 ORDER BY id`,
    [id]
  )
  return { ...session, sets: sets.rows }
}

export async function createSession(pool, session) {
  const result = await pool.query(
    `INSERT INTO sessions (date, duration_minutes, notes, workout_id, title)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, date::text AS date, duration_minutes AS "durationMinutes",
       notes, workout_id AS "workoutId", title, complete`,
    [
      session.date,
      session.durationMinutes,
      session.notes ?? '',
      session.workoutId ?? null,
      session.title ?? '',
    ]
  )
  return { ...result.rows[0], sets: [] }
}

export async function updateSession(pool, id, changes) {
  const columns = {
    date: 'date',
    durationMinutes: 'duration_minutes',
    notes: 'notes',
    workoutId: 'workout_id',
    title: 'title',
    complete: 'complete',
  }
  const entries = Object.entries(changes)
  const assignments = entries.map(([field], index) => `${columns[field]} = $${index + 1}`)
  const values = entries.map(([, value]) => value)
  values.push(id)
  const result = await pool.query(
    `UPDATE sessions SET ${assignments.join(', ')}
     WHERE id = $${values.length}
     RETURNING id, date::text AS date, duration_minutes AS "durationMinutes",
       notes, workout_id AS "workoutId", title, complete`,
    values
  )
  if (!result.rows[0]) return null
  const sets = await pool.query(
    `SELECT ${SET_COLUMNS} FROM session_sets WHERE session_id = $1 ORDER BY id`,
    [id]
  )
  return { ...result.rows[0], sets: sets.rows }
}

export async function deleteSession(pool, id) {
  const result = await pool.query('DELETE FROM sessions WHERE id = $1 RETURNING id', [id])
  return result.rowCount > 0
}

export async function addSet(pool, sessionId, input) {
  const result = await pool.query(
    `INSERT INTO session_sets (session_id, exercise, category, duration_minutes, weight, sets, reps)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, session_id AS "sessionId", exercise, category,
       duration_minutes AS "durationMinutes", weight::float8 AS weight, sets, reps`,
    [sessionId, input.exercise, input.category, input.durationMinutes, input.weight, input.sets, input.reps]
  )
  return result.rows[0]
}

export async function deleteSet(pool, sessionId, setId) {
  const result = await pool.query(
    'DELETE FROM session_sets WHERE session_id = $1 AND id = $2 RETURNING id',
    [sessionId, setId]
  )
  return result.rowCount > 0
}

export async function listWeights(pool) {
  const result = await pool.query(
    `SELECT id, weight_kg::float8 AS "weightKg", recorded_at AS "recordedAt"
     FROM weights ORDER BY recorded_at, id`
  )
  return result.rows
}

export async function addWeight(pool, input) {
  const result = await pool.query(
    `INSERT INTO weights (weight_kg, recorded_at)
     VALUES ($1, $2)
     RETURNING id, weight_kg::float8 AS "weightKg", recorded_at AS "recordedAt"`,
    [input.weightKg, input.recordedAt]
  )
  return result.rows[0]
}

export async function deleteWeight(pool, id) {
  const result = await pool.query('DELETE FROM weights WHERE id = $1 RETURNING id', [id])
  return result.rowCount > 0
}

export async function listWorkouts(pool) {
  const workouts = await pool.query(
    `SELECT ${WORKOUT_COLUMNS} FROM workouts ORDER BY id`
  )
  const exercises = await pool.query(
    `SELECT ${EXERCISE_COLUMNS} FROM exercises ORDER BY id`
  )
  const exercisesByWorkout = new Map(workouts.rows.map(({ id }) => [id, []]))
  for (const exercise of exercises.rows) {
    exercisesByWorkout.get(exercise.workoutId)?.push(exercise)
  }
  return workouts.rows.map((workout) => ({
    ...workout,
    exercises: exercisesByWorkout.get(workout.id),
  }))
}

export async function getWorkout(pool, id) {
  const result = await pool.query(
    `SELECT ${WORKOUT_COLUMNS} FROM workouts WHERE id = $1`,
    [id]
  )
  const workout = result.rows[0]
  if (!workout) return null
  const exercises = await pool.query(
    `SELECT ${EXERCISE_COLUMNS} FROM exercises WHERE workout_id = $1 ORDER BY id`,
    [id]
  )
  return { ...workout, exercises: exercises.rows }
}

export async function createWorkout(pool, name) {
  const result = await pool.query(
    'INSERT INTO workouts (name) VALUES ($1) RETURNING id, name',
    [name]
  )
  return { ...result.rows[0], exercises: [] }
}

export async function deleteWorkout(pool, id) {
  const result = await pool.query('DELETE FROM workouts WHERE id = $1 RETURNING id', [id])
  return result.rowCount > 0
}

export async function addExercise(pool, workoutId, input) {
  const result = await pool.query(
    `INSERT INTO exercises (workout_id, name, category, duration_minutes, weight, sets, reps)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, workout_id AS "workoutId", name,
       category, duration_minutes AS "durationMinutes",
       weight::float8 AS weight, sets, reps`,
    [workoutId, input.name, input.category, input.durationMinutes, input.weight, input.sets, input.reps]
  )
  return result.rows[0]
}

export async function deleteExercise(pool, workoutId, exerciseId) {
  const result = await pool.query(
    'DELETE FROM exercises WHERE workout_id = $1 AND id = $2 RETURNING id',
    [workoutId, exerciseId]
  )
  return result.rowCount > 0
}
