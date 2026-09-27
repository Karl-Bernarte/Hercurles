import { useEffect, useState } from 'react'
import {
  listSessions,
  createSession,
  updateSession,
  deleteSession,
  addSet,
  deleteSet,
  getBodyWeight,
  setBodyWeight,
} from './api'
import { calculateCalories } from './api/metTable.js'
import DemoNotice from './components/DemoNotice.jsx'

const EMPTY_SESSION_FORM = {
  date: new Date().toISOString().split('T')[0],
  durationMinutes: 45,
  notes: '',
}
const EMPTY_SET_FORM = { exercise: '', weight: '', reps: '' }

export default function App() {
  const [status, setStatus] = useState('loading')
  const [rows, setRows] = useState([])
  const [error, setError] = useState(null)
  const [slow, setSlow] = useState(false)
  const [bodyWeight, setBodyWeightState] = useState(70)
  const [sessionForm, setSessionForm] = useState(EMPTY_SESSION_FORM)
  const [saving, setSaving] = useState(false)
  const [expandedId, setExpandedId] = useState(null)
  const [setForm, setSetForm] = useState(EMPTY_SET_FORM)

  async function load() {
    setStatus('loading')
    setError(null)
    const timer = setTimeout(() => setSlow(true), 3000)
    try {
      setRows(await listSessions())
      setBodyWeightState(getBodyWeight())
      setStatus('ready')
    } catch (caught) {
      setError(caught)
      setStatus('error')
    } finally {
      clearTimeout(timer)
      setSlow(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const totalCalories = rows.reduce(
    (sum, session) => sum + calculateCalories(session.sets, bodyWeight, session.durationMinutes),
    0
  )

  function handleWeightChange(event) {
    const kg = Number(event.target.value)
    setBodyWeightState(kg)
    setBodyWeight(kg)
  }

  async function handleCreateSession(event) {
    event.preventDefault()
    setSaving(true)
    try {
      const created = await createSession({
        date: sessionForm.date,
        durationMinutes: Number(sessionForm.durationMinutes),
        notes: sessionForm.notes.trim(),
      })
      setRows([created, ...rows])
      setSessionForm(EMPTY_SESSION_FORM)
    } catch (caught) {
      setError(caught)
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteSession(id) {
    const previous = rows
    setRows(rows.filter((row) => row.id !== id))
    try {
      await deleteSession(id)
    } catch (caught) {
      setRows(previous)
      setError(caught)
    }
  }

  async function handleMarkComplete(id) {
    try {
      const updated = await updateSession(id, { complete: true })
      setRows(rows.map((row) => (row.id === id ? updated : row)))
    } catch (caught) {
      setError(caught)
    }
  }

  async function handleAddSet(event, sessionId) {
    event.preventDefault()
    if (!setForm.exercise.trim()) return
    try {
      const created = await addSet(sessionId, {
        exercise: setForm.exercise.trim(),
        weight: Number(setForm.weight),
        reps: Number(setForm.reps),
      })
      setRows(
        rows.map((row) =>
          row.id === sessionId ? { ...row, sets: [...row.sets, created] } : row
        )
      )
      setSetForm(EMPTY_SET_FORM)
    } catch (caught) {
      setError(caught)
    }
  }

  async function handleDeleteSet(sessionId, setId) {
    const previous = rows
    setRows(
      rows.map((row) =>
        row.id === sessionId
          ? { ...row, sets: row.sets.filter((set) => set.id !== setId) }
          : row
      )
    )
    try {
      await deleteSet(sessionId, setId)
    } catch (caught) {
      setRows(previous)
      setError(caught)
    }
  }

  return (
    <div className="page">
      <header>
        <h1>Hercurles</h1>
        <p className="lede">Log your workouts, track sets, and see your calorie burn.</p>
      </header>

      <DemoNotice />

      <div className="calorie-hero">
        <div className="calorie-hero-label">Total Calorie Burn</div>
        <div className="calorie-hero-value">{totalCalories}</div>
        <div className="calorie-hero-unit">kcal estimated</div>
      </div>

      {error && (
        <p className="error" role="alert">
          {error.message} <button onClick={load}>Try again</button>
        </p>
      )}

      <div className="card">
        <label htmlFor="bodyweight">Body weight (for calorie calc)</label>
        <input
          id="bodyweight"
          type="number"
          value={bodyWeight}
          onChange={handleWeightChange}
          style={{ width: 80 }}
        />{' '}
        kg
      </div>

      <form onSubmit={handleCreateSession} className="card">
        <h2>New session</h2>

        <label htmlFor="date">Date</label>
        <input
          id="date"
          type="date"
          value={sessionForm.date}
          onChange={(event) => setSessionForm({ ...sessionForm, date: event.target.value })}
          required
        />

        <label htmlFor="duration">Duration (minutes)</label>
        <input
          id="duration"
          type="number"
          min="1"
          value={sessionForm.durationMinutes}
          onChange={(event) =>
            setSessionForm({ ...sessionForm, durationMinutes: event.target.value })
          }
          required
        />

        <label htmlFor="notes">Notes (optional)</label>
        <textarea
          id="notes"
          value={sessionForm.notes}
          onChange={(event) => setSessionForm({ ...sessionForm, notes: event.target.value })}
          rows={2}
          placeholder="e.g. Push day, feeling strong"
        />

        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Start session'}
        </button>
      </form>

      {status === 'loading' && (
        <p className="muted">
          Loading{slow ? '. The server may be waking up, which can take up to a minute.' : '...'}
        </p>
      )}

      {status === 'ready' && rows.length === 0 && (
        <p className="muted">No sessions yet. Log your first workout above.</p>
      )}

      {status === 'ready' && rows.length > 0 && (
        <ul className="list">
          {rows.map((session) => {
            const kcal = calculateCalories(session.sets, bodyWeight, session.durationMinutes)
            const isExpanded = expandedId === session.id
            return (
              <li key={session.id} className="card">
                <div className="row-head">
                  <h3>
                    {session.date} {session.complete ? <span className="badge">DONE</span> : null}
                  </h3>
                  <span className="kcal-tag">{kcal} kcal</span>
                </div>
                <p className="muted">
                  {session.durationMinutes} min · {session.sets.length} sets
                  {session.notes ? ` · ${session.notes}` : ''}
                </p>

                {session.sets.length > 0 && (
                  <ul className="set-list">
                    {session.sets.map((set, i) => (
                      <li key={set.id}>
                        {i + 1}. {set.exercise} — {set.weight}kg × {set.reps} reps{' '}
                        <button onClick={() => handleDeleteSet(session.id, set.id)}>✕</button>
                      </li>
                    ))}
                  </ul>
                )}

                <footer>
                  <button onClick={() => setExpandedId(isExpanded ? null : session.id)}>
                    {isExpanded ? 'Close' : 'Add set'}
                  </button>
                  {!session.complete && (
                    <button onClick={() => handleMarkComplete(session.id)}>Mark complete</button>
                  )}
                  <button onClick={() => handleDeleteSession(session.id)}>Delete</button>
                </footer>

                {isExpanded && (
                  <form onSubmit={(event) => handleAddSet(event, session.id)} className="inline-form">
                    <input
                      placeholder="Exercise"
                      value={setForm.exercise}
                      onChange={(event) => setSetForm({ ...setForm, exercise: event.target.value })}
                      required
                    />
                    <input
                      type="number"
                      placeholder="Weight (kg)"
                      value={setForm.weight}
                      onChange={(event) => setSetForm({ ...setForm, weight: event.target.value })}
                      required
                    />
                    <input
                      type="number"
                      placeholder="Reps"
                      value={setForm.reps}
                      onChange={(event) => setSetForm({ ...setForm, reps: event.target.value })}
                      required
                    />
                    <button type="submit">+ Log set</button>
                  </form>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}