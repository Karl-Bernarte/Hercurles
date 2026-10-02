import { useEffect, useState } from 'react'
import {
  listSessions,
  updateSession,
  deleteSession,
  addSet,
  deleteSet,
  createSession,
  listWeights,
  addWeight,
  deleteWeight,
  listWorkouts,
  createWorkout,
  deleteWorkout,
  addExercise,
  deleteExercise,
} from './api'
import { todayLocal, formatDay } from './dateUtils.js'
import BottomNav from './components/BottomNav.jsx'
import WorkoutView from './views/WorkoutView.jsx'
import SessionDetailView from './views/SessionDetailView.jsx'
import WorkoutsView from './views/WorkoutsView.jsx'
import WorkoutDetailView from './views/WorkoutDetailView.jsx'
import WeightView from './views/WeightView.jsx'

const DEFAULT_BODY_WEIGHT = 70
const DEFAULT_LOG_DURATION = 45

const newestFirst = (a, b) => b.date.localeCompare(a.date)
const oldestFirst = (a, b) => a.recordedAt.localeCompare(b.recordedAt)

export default function App() {
  // workout | sessionDetail | workouts | workoutDetail | weight
  const [view, setView] = useState('workout')
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [sessions, setSessions] = useState([])
  const [weights, setWeights] = useState([])
  const [workouts, setWorkouts] = useState([])
  const [error, setError] = useState(null)
  const [slow, setSlow] = useState(false)
  const [openSessionId, setOpenSessionId] = useState(null)
  const [openWorkoutId, setOpenWorkoutId] = useState(null)

  const [today, setToday] = useState(todayLocal())
  const [pickedDate, setPickedDate] = useState(null)
  const activeDate = pickedDate ?? today

  useEffect(() => {
    const timer = setInterval(() => setToday(todayLocal()), 60 * 1000)
    return () => clearInterval(timer)
  }, [])

  async function load() {
    setStatus('loading')
    setError(null)
    const timer = setTimeout(() => setSlow(true), 3000)
    try {
      const [sessionRows, weightRows, workoutRows] = await Promise.all([
        listSessions(),
        listWeights(),
        listWorkouts(),
      ])
      setSessions(sessionRows)
      setWeights(weightRows)
      setWorkouts(workoutRows)
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

  const bodyWeight =
    weights.length > 0 ? weights[weights.length - 1].weightKg : DEFAULT_BODY_WEIGHT

  const openSession = sessions.find((session) => session.id === openSessionId)
  const openWorkout = workouts.find((workout) => workout.id === openWorkoutId)

  function handleDateChange(value) {
    if (value > today) return
    setPickedDate(value === today ? null : value)
  }

  // Logging a saved workout: create today's session, add one set per planned
  // exercise, then mark it complete, since picking it from the list IS the
  // "I did this" action.
  async function handleLogFromWorkout(workoutId) {
    const workout = workouts.find((row) => row.id === workoutId)
    if (!workout) return
    try {
      const created = await createSession({
        date: activeDate,
        durationMinutes: DEFAULT_LOG_DURATION,
        notes: '',
        workoutId: workout.id,
        title: workout.name,
      })
      
      let builtSets = []
      for (const exercise of workout.exercises) {
        const set = await addSet(created.id, { exercise: exercise.name, weight: 0, reps: exercise.reps })
        builtSets = [...builtSets, set]
      }
      await updateSession(created.id, { complete: true })
      const finalSession = { ...created, sets: builtSets, complete: true }

      setSessions((current) => [finalSession, ...current].sort(newestFirst))
      setPickedDate(finalSession.date === today ? null : finalSession.date)
      setOpenSessionId(finalSession.id)
      setView('sessionDetail')
    } catch (caught) {
      setError(caught)
    }
  }

  async function handleDeleteSession(id) {
    if (!window.confirm('Delete this log?')) return
    const previous = sessions
    setSessions((current) => current.filter((session) => session.id !== id))
    setView('workout')
    try {
      await deleteSession(id)
    } catch (caught) {
      setSessions(previous)
      setError(caught)
    }
  }

  async function handleMarkComplete(id) {
    try {
      const updated = await updateSession(id, { complete: true })
      setSessions((current) => current.map((session) => (session.id === id ? updated : session)))
    } catch (caught) {
      setError(caught)
    }
  }

  async function handleAddSet(sessionId, input) {
    try {
      const created = await addSet(sessionId, input)
      setSessions((current) =>
        current.map((session) =>
          session.id === sessionId ? { ...session, sets: [...session.sets, created] } : session
        )
      )
      return true
    } catch (caught) {
      setError(caught)
      return false
    }
  }

  async function handleDeleteSet(sessionId, setId) {
    const previous = sessions
    setSessions((current) =>
      current.map((session) =>
        session.id === sessionId
          ? { ...session, sets: session.sets.filter((set) => set.id !== setId) }
          : session
      )
    )
    try {
      await deleteSet(sessionId, setId)
    } catch (caught) {
      setSessions(previous)
      setError(caught)
    }
  }

  async function handleCreateWorkout(name) {
    try {
      const created = await createWorkout({ name })
      setWorkouts((current) => [...current, created])
      setOpenWorkoutId(created.id)
      setView('workoutDetail')
      return true
    } catch (caught) {
      setError(caught)
      return false
    }
  }

  async function handleDeleteWorkout(id) {
    if (!window.confirm('Delete this workout? Logs you already made keep its name.')) return
    const previous = workouts
    setWorkouts((current) => current.filter((workout) => workout.id !== id))
    setView('workouts')
    try {
      await deleteWorkout(id)
    } catch (caught) {
      setWorkouts(previous)
      setError(caught)
    }
  }

  async function handleAddExercise(workoutId, input) {
    try {
      const created = await addExercise(workoutId, input)
      setWorkouts((current) =>
        current.map((workout) =>
          workout.id === workoutId
            ? { ...workout, exercises: [...workout.exercises, created] }
            : workout
        )
      )
      return true
    } catch (caught) {
      setError(caught)
      return false
    }
  }

  async function handleDeleteExercise(workoutId, exerciseId) {
    const previous = workouts
    setWorkouts((current) =>
      current.map((workout) =>
        workout.id === workoutId
          ? { ...workout, exercises: workout.exercises.filter((row) => row.id !== exerciseId) }
          : workout
      )
    )
    try {
      await deleteExercise(workoutId, exerciseId)
    } catch (caught) {
      setWorkouts(previous)
      setError(caught)
    }
  }

  async function handleAddWeight(input) {
    try {
      const created = await addWeight(input)
      setWeights((current) => [...current, created].sort(oldestFirst))
      return true
    } catch (caught) {
      setError(caught)
      return false
    }
  }

  async function handleDeleteWeight(id) {
    const previous = weights
    setWeights((current) => current.filter((entry) => entry.id !== id))
    try {
      await deleteWeight(id)
    } catch (caught) {
      setWeights(previous)
      setError(caught)
    }
  }

  return (
    <div className="page">
      <header>
        <h1>Hercurles</h1>
        <p className="lede">{formatDay(today)}</p>
      </header>

      {error && (
        <p className="error" role="alert">
          {error.message} <button onClick={load}>Try again</button>
        </p>
      )}

      {status === 'loading' && (
        <p className="muted">
          Loading{slow ? '. The server may be waking up, which can take up to a minute.' : '...'}
        </p>
      )}

      {status === 'ready' && view === 'workout' && (
        <WorkoutView
          sessions={sessions}
          date={activeDate}
          today={today}
          bodyWeight={bodyWeight}
          onDateChange={handleDateChange}
          onOpenSession={(id) => {
            setOpenSessionId(id)
            setView('sessionDetail')
          }}
          onOpenWorkouts={() => setView('workouts')}
        />
      )}

      {status === 'ready' && view === 'sessionDetail' && openSession && (
        <SessionDetailView
          session={openSession}
          bodyWeight={bodyWeight}
          onBack={() => setView('workout')}
          onMarkComplete={handleMarkComplete}
          onDelete={handleDeleteSession}
          onAddSet={handleAddSet}
          onDeleteSet={handleDeleteSet}
        />
      )}

      {status === 'ready' && view === 'workouts' && (
        <WorkoutsView
          workouts={workouts}
          onCreate={handleCreateWorkout}
          onOpenForEdit={(id) => {
            setOpenWorkoutId(id)
            setView('workoutDetail')
          }}
          onLog={handleLogFromWorkout}
          onBack={() => setView('workout')}
        />
      )}

      {status === 'ready' && view === 'workoutDetail' && openWorkout && (
        <WorkoutDetailView
          workout={openWorkout}
          onBack={() => setView('workouts')}
          onAddExercise={handleAddExercise}
          onDeleteExercise={handleDeleteExercise}
          onDeleteWorkout={handleDeleteWorkout}
        />
      )}

      {status === 'ready' && view === 'weight' && (
        <WeightView weights={weights} onAdd={handleAddWeight} onDelete={handleDeleteWeight} />
      )}

      <BottomNav active={view === 'weight' ? 'weight' : 'workout'} onChange={setView} />
    </div>
  )
}