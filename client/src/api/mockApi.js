import seed from './seed.json'

const SESSIONS_KEY = 'final-project:sessions'
const WEIGHT_KEY = 'final-project:bodyweight'

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms))

function read() {
  const stored = localStorage.getItem(SESSIONS_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      localStorage.removeItem(SESSIONS_KEY)
    }
  }
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(seed))
  return seed
}

function write(rows) {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(rows))
  return rows
}

export function getBodyWeight() {
  const stored = localStorage.getItem(WEIGHT_KEY)
  return stored ? Number(stored) : 70
}

export function setBodyWeight(kg) {
  localStorage.setItem(WEIGHT_KEY, String(kg))
}

export async function listSessions() {
  await delay()
  return read().slice().sort((a, b) => b.date.localeCompare(a.date))
}

export async function getSession(id) {
  await delay()
  const found = read().find((row) => String(row.id) === String(id))
  if (!found) throw new Error('Not found')
  return found
}

export async function createSession(input) {
  await delay()
  const created = { ...input, id: crypto.randomUUID(), complete: false, sets: [] }
  write([...read(), created])
  return created
}

export async function updateSession(id, input) {
  await delay()
  const rows = read()
  const index = rows.findIndex((row) => String(row.id) === String(id))
  if (index === -1) throw new Error('Not found')
  rows[index] = { ...rows[index], ...input }
  write(rows)
  return rows[index]
}

export async function deleteSession(id) {
  await delay()
  write(read().filter((row) => String(row.id) !== String(id)))
}

export async function addSet(sessionId, input) {
  await delay()
  const rows = read()
  const session = rows.find((row) => String(row.id) === String(sessionId))
  if (!session) throw new Error('Not found')
  const set = { ...input, id: crypto.randomUUID() }
  session.sets = [...session.sets, set]
  write(rows)
  return set
}

export async function deleteSet(sessionId, setId) {
  await delay()
  const rows = read()
  const session = rows.find((row) => String(row.id) === String(sessionId))
  if (!session) throw new Error('Not found')
  session.sets = session.sets.filter((set) => String(set.id) !== String(setId))
  write(rows)
}