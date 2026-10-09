const SESSION_FIELDS = new Set([
  'date',
  'durationMinutes',
  'notes',
  'workoutId',
  'title',
  'complete',
])
const SET_FIELDS = new Set(['exercise', 'category', 'durationMinutes', 'weight', 'sets', 'reps'])
const WEIGHT_FIELDS = new Set(['weightKg', 'recordedAt'])
const WORKOUT_FIELDS = new Set(['name'])
const EXERCISE_FIELDS = new Set(['name', 'category', 'durationMinutes', 'weight', 'sets', 'reps'])

function readObject(body, allowedFields) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { errors: ['request body must be a JSON object'], value: {} }
  }
  const errors = Object.keys(body)
    .filter((field) => !allowedFields.has(field))
    .map((field) => `unexpected field: ${field}`)
  return { errors, value: body }
}

function readText(value, field, { required = true, max = 100 } = {}) {
  if (value === undefined && !required) return []
  if (typeof value !== 'string') {
    return [`${field} must be a string`]
  }
  const text = value.trim()
  if (required && !text) return [`${field} is required`]
  if (text.length > max) return [`${field} must be ${max} characters or fewer`]
  return []
}

function readNumber(value, field, min, max, { integer = false } = {}) {
  if (
    typeof value !== 'number' ||
    !Number.isFinite(value) ||
    value < min ||
    value > max ||
    (integer && !Number.isInteger(value))
  ) {
    const kind = integer ? 'a whole number' : 'a number'
    return [`${field} must be ${kind} from ${min} to ${max}`]
  }
  return []
}

function validDate(value) {
  return (
    typeof value === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(`${value}T00:00:00.000Z`)) &&
    new Date(`${value}T00:00:00.000Z`).toISOString().slice(0, 10) === value
  )
}

function validTimestamp(value) {
  return (
    typeof value === 'string' &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(value) &&
    validDate(value.slice(0, 10)) &&
    !Number.isNaN(Date.parse(value))
  )
}

export function validId(value) {
  return /^[1-9]\d*$/.test(value) && Number.isSafeInteger(Number(value))
}

export function validateSession(body, { partial = false } = {}) {
  const result = readObject(body, SESSION_FIELDS)
  const { value } = result
  const errors = [...result.errors]

  if (partial && Object.keys(value).length === 0) errors.push('at least one field is required')
  if (!partial || Object.hasOwn(value, 'date')) {
    if (!validDate(value.date)) errors.push('date must be a valid YYYY-MM-DD date')
  }
  if (!partial || Object.hasOwn(value, 'durationMinutes')) {
    errors.push(...readNumber(value.durationMinutes, 'durationMinutes', 1, 600, { integer: true }))
  }
  if (!partial || Object.hasOwn(value, 'notes')) {
    errors.push(...readText(value.notes === undefined ? '' : value.notes, 'notes', { required: false, max: 2000 }))
  }
  if (!partial || Object.hasOwn(value, 'title')) {
    errors.push(...readText(value.title === undefined ? '' : value.title, 'title', { required: false, max: 60 }))
  }
  if (!partial || Object.hasOwn(value, 'workoutId')) {
    if (value.workoutId !== null && value.workoutId !== undefined && (
      !Number.isSafeInteger(value.workoutId) || value.workoutId < 1
    )) {
      errors.push('workoutId must be a positive integer or null')
    }
  }
  if (Object.hasOwn(value, 'complete') && typeof value.complete !== 'boolean') {
    errors.push('complete must be a boolean')
  }

  return { errors, value }
}

export function validateSet(body) {
  const result = readObject(body, SET_FIELDS)
  const { value } = result
  const category = value.category ?? 'Strength'
  const errors = [...result.errors, ...readText(value.exercise, 'exercise', { max: 100 })]
  if (!['Strength', 'Cardio'].includes(category)) errors.push('category must be Strength or Cardio')
  if (category === 'Cardio') {
    errors.push(...readNumber(value.durationMinutes, 'durationMinutes', 1, 600, { integer: true }))
  } else {
    errors.push(...readNumber(value.weight, 'weight', 0, 1000))
    errors.push(...readNumber(value.sets, 'sets', 1, 20, { integer: true }))
    errors.push(...readNumber(value.reps, 'reps', 1, 100, { integer: true }))
  }
  return {
    errors,
    value: {
      ...value,
      exercise: typeof value.exercise === 'string' ? value.exercise.trim() : value.exercise,
      category,
      ...(category === 'Cardio' ? { weight: 0, sets: 1, reps: 1 } : { durationMinutes: null }),
    },
  }
}

export function validateWeight(body) {
  const result = readObject(body, WEIGHT_FIELDS)
  const { value } = result
  const errors = [
    ...result.errors,
    ...readNumber(value.weightKg, 'weightKg', 20, 500),
  ]
  if (!validTimestamp(value.recordedAt)) {
    errors.push('recordedAt must be an ISO 8601 timestamp with a timezone')
  }
  return { errors, value }
}

export function validateWorkout(body) {
  const result = readObject(body, WORKOUT_FIELDS)
  return {
    errors: [...result.errors, ...readText(result.value.name, 'name', { max: 60 })],
    value: {
      ...result.value,
      name: typeof result.value.name === 'string' ? result.value.name.trim() : result.value.name,
    },
  }
}

export function validateExercise(body) {
  const result = readObject(body, EXERCISE_FIELDS)
  const { value } = result
  const category = value.category ?? 'Strength'
  const errors = [...result.errors, ...readText(value.name, 'name', { max: 100 })]
  if (!['Strength', 'Cardio'].includes(category)) errors.push('category must be Strength or Cardio')
  if (category === 'Cardio') {
    errors.push(...readNumber(value.durationMinutes, 'durationMinutes', 1, 600, { integer: true }))
  } else {
    errors.push(...readNumber(value.weight, 'weight', 0, 1000))
    errors.push(...readNumber(value.sets, 'sets', 1, 20, { integer: true }))
    errors.push(...readNumber(value.reps, 'reps', 1, 100, { integer: true }))
  }
  return {
    errors,
    value: {
      ...value,
      name: typeof value.name === 'string' ? value.name.trim() : value.name,
      category,
      ...(category === 'Cardio' ? { weight: 0, sets: 1, reps: 1 } : { durationMinutes: null }),
    },
  }
}
