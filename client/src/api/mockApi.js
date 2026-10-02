import seed from './seed.json'

const SESSIONS_KEY = 'final-project:sessions'
const WEIGHTS_KEY = 'final-project:weights'
const WORKOUTS_KEY = 'final-project:workouts'

const DAY = 24 * 60 * 60 * 1000
const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms))

function readKey(key, makeSeed) {
  const stored = localStorage.getItem(key)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      localStorage.removeItem(key)
    }
  }
  const value = makeSeed()
  localStorage.setItem(key, JSON.stringify(value))
  return value
}

function writeKey(key, rows) {
  localStorage.setItem(key, JSON.stringify(rows))
  return rows
}

// Sample weigh-ins over the last 100 days so the graph has something to show.
function buildWeightSeed() {
  const daysAgo = [100, 90, 80, 70, 60, 50, 40, 30, 21, 14, 7, 3, 0]
  const kilos = [76.4, 76.0, 75.8, 75.1, 75.3, 74.6, 74.2, 74.0, 73.5, 73.2, 72.9, 72.7, 72.5]
  return daysAgo.map((days, index) => ({
    id: `seed-weight-${index}`,
    weightKg: kilos[index],
    recordedAt: new Date(Date.now() - days * DAY).toISOString(),
  }))
}

// One example workout so the "Your workouts" list is not empty on first load.
function buildWorkoutSeed() {
  return [
    {
      id: 'seed-workout-1',
      name: 'Back / Biceps Day',
      exercises: [
        { id: 'seed-exercise-1', name: 'Barbell Row', sets: 4, reps: 8 },
        { id: 'seed-exercise-2', name: 'Lat Pulldown', sets: 3, reps: 10 },
        { id: 'seed-exercise-3', name: 'Bicep Curl', sets: 3, reps: 12 },
      ],
    },
  ]
}

const readSessions = () => readKey(SESSIONS_KEY, () => seed)
const writeSessions = (rows) => writeKey(SESSIONS_KEY, rows)
const readWeights = () => readKey(WEIGHTS_KEY, buildWeightSeed)
const writeWeights = (rows) => writeKey(WEIGHTS_KEY, rows)
const readWorkouts = () => readKey(WORKOUTS_KEY, buildWorkoutSeed)
const writeWorkouts = (rows) => writeKey(WORKOUTS_KEY, rows)

// Sessions: one logged workout on one day, with the sets done in it.

export async function listSessions() {
  await delay()
  return readSessions().slice().sort((a, b) => b.date.localeCompare(a.date))
}

export async function getSession(id) {
  await delay()
  const found = readSessions().find((row) => String(row.id) === String(id))
  if (!found) throw new Error('Not found')
  return found
}

export async function createSession(input) {
  await delay()
  const created = { ...input, id: crypto.randomUUID(), complete: false, sets: [] }
  writeSessions([...readSessions(), created])
  return created
}

export async function updateSession(id, input) {
  await delay()
  const rows = readSessions()
  const index = rows.findIndex((row) => String(row.id) === String(id))
  if (index === -1) throw new Error('Not found')
  rows[index] = { ...rows[index], ...input }
  writeSessions(rows)
  return rows[index]
}

export async function deleteSession(id) {
  await delay()
  writeSessions(readSessions().filter((row) => String(row.id) !== String(id)))
}

export async function addSet(sessionId, input) {
  await delay()
  const rows = readSessions()
  const session = rows.find((row) => String(row.id) === String(sessionId))
  if (!session) throw new Error('Not found')
  const set = { ...input, id: crypto.randomUUID() }
  session.sets = [...session.sets, set]
  writeSessions(rows)
  return set
}

export async function deleteSet(sessionId, setId) {
  await delay()
  const rows = readSessions()
  const session = rows.find((row) => String(row.id) === String(sessionId))
  if (!session) throw new Error('Not found')
  session.sets = session.sets.filter((set) => String(set.id) !== String(setId))
  writeSessions(rows)
}

// Weight entries, oldest first so the graph can draw left to right.

export async function listWeights() {
  await delay()
  return readWeights().slice().sort((a, b) => a.recordedAt.localeCompare(b.recordedAt))
}

export async function addWeight(input) {
  await delay()
  const created = {
    id: crypto.randomUUID(),
    weightKg: Number(input.weightKg),
    recordedAt: input.recordedAt,
  }
  writeWeights([...readWeights(), created])
  return created
}

export async function deleteWeight(id) {
  await delay()
  writeWeights(readWeights().filter((row) => String(row.id) !== String(id)))
}

// Workouts: named lists of exercises the user builds ("Back / Biceps Day").

export async function listWorkouts() {
  await delay()
  return readWorkouts()
}

export async function createWorkout(input) {
  await delay()
  const created = { id: crypto.randomUUID(), name: input.name, exercises: [] }
  writeWorkouts([...readWorkouts(), created])
  return created
}

export async function deleteWorkout(id) {
  await delay()
  writeWorkouts(readWorkouts().filter((row) => String(row.id) !== String(id)))
}

export async function addExercise(workoutId, input) {
  await delay()
  const rows = readWorkouts()
  const workout = rows.find((row) => String(row.id) === String(workoutId))
  if (!workout) throw new Error('Not found')
  const exercise = {
    id: crypto.randomUUID(),
    name: input.name,
    weight: Number(input.weight) || 0,
    sets: Number(input.sets),
    reps: Number(input.reps),
  }
  workout.exercises = [...workout.exercises, exercise]
  writeWorkouts(rows)
  return exercise
}

export async function deleteExercise(workoutId, exerciseId) {
  await delay()
  const rows = readWorkouts()
  const workout = rows.find((row) => String(row.id) === String(workoutId))
  if (!workout) throw new Error('Not found')
  workout.exercises = workout.exercises.filter((row) => String(row.id) !== String(exerciseId))
  writeWorkouts(rows)
}