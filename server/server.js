import express from 'express'
import cors from 'cors'
import { pool } from './db/pool.js'
import * as fitness from './fitnessRepo.js'
import {
  validId,
  validateExercise,
  validateSession,
  validateSet,
  validateWeight,
  validateWorkout,
} from './validation.js'

const app = express()
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(cors({ origin: allowedOrigins }))
app.use(express.json({ limit: '100kb' }))

app.get('/healthz', (request, response) => {
  response.json({ ok: true })
})

app.get('/readyz', async (request, response) => {
  try {
    await pool.query('SELECT 1')
    response.json({ ok: true, db: 'up' })
  } catch (error) {
    console.error('readyz failed:', error.message)
    response.status(503).json({ ok: false, db: 'down' })
  }
})

function route(handler) {
  return (request, response, next) => {
    Promise.resolve(handler(request, response)).catch(next)
  }
}

function parseId(request, response, parameter = 'id') {
  const value = request.params[parameter]
  if (!validId(value)) {
    response.status(400).json({ error: `${parameter} must be a positive integer` })
    return null
  }
  return Number(value)
}

function rejectInvalid(response, errors) {
  if (errors.length === 0) return false
  response.status(400).json({ error: errors.join('; ') })
  return true
}

app.get('/api/sessions', route(async (request, response) => {
  response.json(await fitness.listSessions(pool))
}))

app.get('/api/sessions/:id', route(async (request, response) => {
  const id = parseId(request, response)
  if (id === null) return
  const session = await fitness.getSession(pool, id)
  if (!session) return response.status(404).json({ error: 'Session not found' })
  response.json(session)
}))

app.post('/api/sessions', route(async (request, response) => {
  const { errors, value } = validateSession(request.body)
  if (rejectInvalid(response, errors)) return
  if (value.workoutId && !(await fitness.getWorkout(pool, value.workoutId))) {
    return response.status(404).json({ error: 'Workout not found' })
  }
  response.status(201).json(await fitness.createSession(pool, value))
}))

app.patch('/api/sessions/:id', route(async (request, response) => {
  const id = parseId(request, response)
  if (id === null) return
  const { errors, value } = validateSession(request.body, { partial: true })
  if (rejectInvalid(response, errors)) return
  if (value.workoutId && !(await fitness.getWorkout(pool, value.workoutId))) {
    return response.status(404).json({ error: 'Workout not found' })
  }
  const session = await fitness.updateSession(pool, id, value)
  if (!session) return response.status(404).json({ error: 'Session not found' })
  response.json(session)
}))

app.delete('/api/sessions/:id', route(async (request, response) => {
  const id = parseId(request, response)
  if (id === null) return
  if (!(await fitness.deleteSession(pool, id))) {
    return response.status(404).json({ error: 'Session not found' })
  }
  response.status(204).end()
}))

app.post('/api/sessions/:sessionId/sets', route(async (request, response) => {
  const sessionId = parseId(request, response, 'sessionId')
  if (sessionId === null) return
  const { errors, value } = validateSet(request.body)
  if (rejectInvalid(response, errors)) return
  if (!(await fitness.getSession(pool, sessionId))) {
    return response.status(404).json({ error: 'Session not found' })
  }
  response.status(201).json(await fitness.addSet(pool, sessionId, value))
}))

app.delete('/api/sessions/:sessionId/sets/:setId', route(async (request, response) => {
  const sessionId = parseId(request, response, 'sessionId')
  if (sessionId === null) return
  const setId = parseId(request, response, 'setId')
  if (setId === null) return
  if (!(await fitness.getSession(pool, sessionId))) {
    return response.status(404).json({ error: 'Session not found' })
  }
  if (!(await fitness.deleteSet(pool, sessionId, setId))) {
    return response.status(404).json({ error: 'Set not found' })
  }
  response.status(204).end()
}))

app.get('/api/weights', route(async (request, response) => {
  response.json(await fitness.listWeights(pool))
}))

app.post('/api/weights', route(async (request, response) => {
  const { errors, value } = validateWeight(request.body)
  if (rejectInvalid(response, errors)) return
  response.status(201).json(await fitness.addWeight(pool, value))
}))

app.delete('/api/weights/:id', route(async (request, response) => {
  const id = parseId(request, response)
  if (id === null) return
  if (!(await fitness.deleteWeight(pool, id))) {
    return response.status(404).json({ error: 'Weight entry not found' })
  }
  response.status(204).end()
}))

app.get('/api/workouts', route(async (request, response) => {
  response.json(await fitness.listWorkouts(pool))
}))

app.post('/api/workouts', route(async (request, response) => {
  const { errors, value } = validateWorkout(request.body)
  if (rejectInvalid(response, errors)) return
  response.status(201).json(await fitness.createWorkout(pool, value.name))
}))

app.delete('/api/workouts/:id', route(async (request, response) => {
  const id = parseId(request, response)
  if (id === null) return
  if (!(await fitness.deleteWorkout(pool, id))) {
    return response.status(404).json({ error: 'Workout not found' })
  }
  response.status(204).end()
}))

app.post('/api/workouts/:workoutId/exercises', route(async (request, response) => {
  const workoutId = parseId(request, response, 'workoutId')
  if (workoutId === null) return
  const { errors, value } = validateExercise(request.body)
  if (rejectInvalid(response, errors)) return
  if (!(await fitness.getWorkout(pool, workoutId))) {
    return response.status(404).json({ error: 'Workout not found' })
  }
  response.status(201).json(await fitness.addExercise(pool, workoutId, value))
}))

app.delete('/api/workouts/:workoutId/exercises/:exerciseId', route(async (request, response) => {
  const workoutId = parseId(request, response, 'workoutId')
  if (workoutId === null) return
  const exerciseId = parseId(request, response, 'exerciseId')
  if (exerciseId === null) return
  if (!(await fitness.getWorkout(pool, workoutId))) {
    return response.status(404).json({ error: 'Workout not found' })
  }
  if (!(await fitness.deleteExercise(pool, workoutId, exerciseId))) {
    return response.status(404).json({ error: 'Exercise not found' })
  }
  response.status(204).end()
}))

app.use((request, response) => {
  response.status(404).json({ error: 'No such route' })
})

app.use((error, request, response, next) => {
  if (error.type === 'entity.parse.failed') {
    return response.status(400).json({ error: 'Request body must contain valid JSON' })
  }
  console.error('API request failed:', error)
  response.status(500).json({ error: 'Something went wrong on the server' })
})

const port = process.env.PORT || 3000
const server = app.listen(port, () => {
  console.log(`API listening on port ${port}`)
  console.log(`CORS allows: ${allowedOrigins.join(', ')}`)
})

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    server.close(async () => {
      await pool.end()
      process.exit(0)
    })
  })
}
