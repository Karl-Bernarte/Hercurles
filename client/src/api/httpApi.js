const BASE = import.meta.env.VITE_API_BASE_URL || ''

async function request(path, options) {
  const response = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!response.ok) {
    let message = `${response.status} ${response.statusText}`
    try {
      const body = await response.json()
      if (body?.error) message = body.error
    } catch {
      // The body was not JSON. The status line is all we have.
    }
    throw new Error(message)
  }

  return response.status === 204 ? null : response.json()
}

export const listSessions = () => request('/api/sessions')
export const getSession = (id) => request(`/api/sessions/${id}`)
export const createSession = (input) =>
  request('/api/sessions', { method: 'POST', body: JSON.stringify(input) })
export const updateSession = (id, input) =>
  request(`/api/sessions/${id}`, { method: 'PATCH', body: JSON.stringify(input) })
export const deleteSession = (id) =>
  request(`/api/sessions/${id}`, { method: 'DELETE' })
export const addSet = (sessionId, input) =>
  request(`/api/sessions/${sessionId}/sets`, { method: 'POST', body: JSON.stringify(input) })
export const deleteSet = (sessionId, setId) =>
  request(`/api/sessions/${sessionId}/sets/${setId}`, { method: 'DELETE' })

export const listWeights = () => request('/api/weights')
export const addWeight = (input) =>
  request('/api/weights', { method: 'POST', body: JSON.stringify(input) })
export const deleteWeight = (id) =>
  request(`/api/weights/${id}`, { method: 'DELETE' })

export const listWorkouts = () => request('/api/workouts')
export const createWorkout = (input) =>
  request('/api/workouts', { method: 'POST', body: JSON.stringify(input) })
export const deleteWorkout = (id) =>
  request(`/api/workouts/${id}`, { method: 'DELETE' })
export const addExercise = (workoutId, input) =>
  request(`/api/workouts/${workoutId}/exercises`, { method: 'POST', body: JSON.stringify(input) })
export const deleteExercise = (workoutId, exerciseId) =>
  request(`/api/workouts/${workoutId}/exercises/${exerciseId}`, { method: 'DELETE' })