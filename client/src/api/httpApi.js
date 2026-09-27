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
      // body wasn't JSON
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

// Body weight stays purely client-side for now — no server concept for it yet.
const WEIGHT_KEY = 'final-project:bodyweight'
export function getBodyWeight() {
  const stored = localStorage.getItem(WEIGHT_KEY)
  return stored ? Number(stored) : 70
}
export function setBodyWeight(kg) {
  localStorage.setItem(WEIGHT_KEY, String(kg))
}