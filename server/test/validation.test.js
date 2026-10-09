import test from 'node:test'
import assert from 'node:assert/strict'
import {
  validId,
  validateExercise,
  validateSession,
  validateSet,
  validateWeight,
  validateWorkout,
} from '../validation.js'

test('session validation accepts the client payload', () => {
  const result = validateSession({
    date: '2026-10-09',
    durationMinutes: 45,
    notes: '',
    workoutId: null,
    title: '',
  })
  assert.deepEqual(result.errors, [])
  assert.equal(result.value.durationMinutes, 45)
})

test('session validation rejects non-text optional fields', () => {
  assert.deepEqual(validateSession({
    date: '2026-10-09',
    durationMinutes: 45,
    notes: 123,
  }).errors, ['notes must be a string'])
})

test('session validation rejects invalid dates, out-of-range values, and unknown fields', () => {
  const result = validateSession({
    date: '2026-02-30',
    durationMinutes: 0,
    surprise: true,
  })
  assert.equal(result.errors.length, 3)
})

test('partial session updates require at least one valid field', () => {
  assert.deepEqual(validateSession({}, { partial: true }).errors, [
    'at least one field is required',
  ])
  assert.deepEqual(validateSession({ complete: true }, { partial: true }).errors, [])
})

test('set validation checks numeric ranges and trims exercise names', () => {
  const result = validateSet({
    exercise: '  Deadlift ',
    weight: 120,
    sets: 3,
    reps: 5,
  })
  assert.deepEqual(result.errors, [])
  assert.equal(result.value.exercise, 'Deadlift')
  assert.deepEqual(validateSet({ exercise: 'Squat', weight: -1, sets: 0, reps: 101 }).errors.length, 3)
})

test('weight validation accepts ISO timestamps and rejects malformed input', () => {
  assert.deepEqual(
    validateWeight({ weightKg: 72.5, recordedAt: '2026-10-09T00:00:00.000Z' }).errors,
    []
  )
  assert.equal(
    validateWeight({ weightKg: 501, recordedAt: 'not a date' }).errors.length,
    2
  )
  assert.equal(
    validateWeight({ weightKg: 72.5, recordedAt: '2026-10-09T00:00:00' }).errors.length,
    1
  )
})

test('workout and exercise validation enforces client limits', () => {
  assert.deepEqual(validateWorkout({ name: '  Upper body ' }).errors, [])
  assert.equal(validateWorkout({ name: ' ' }).errors[0], 'name is required')
  assert.deepEqual(
    validateExercise({ name: 'Row', weight: 70, sets: 4, reps: 8 }).errors,
    []
  )
})

test('path identifiers must be positive safe integers', () => {
  assert.equal(validId('1'), true)
  assert.equal(validId('0'), false)
  assert.equal(validId('1.5'), false)
  assert.equal(validId('9007199254740992'), false)
})
