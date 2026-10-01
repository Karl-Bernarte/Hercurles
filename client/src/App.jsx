import { useEffect, useState } from 'react'
import {
  listSessions,
  createSession,
  updateSession,
  deleteSession,
  addSet,
  deleteSet,
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
import LogWorkoutView from './views/LogWorkoutView.jsx'
import SessionDetailView from './views/SessionDetailView.jsx'
import WorkoutsView from './views/WorkoutsView.jsx'
import WorkoutDetailView from './views/WorkoutDetailView.jsx'
import WeightView from './views/WeightView.jsx'

const DEFAULT_BODY_WEIGHT = 70

const newestFirst = (a, b) => b.date.localeCompare(a.date)
const oldestFirst = (a, b) => a.recordedAt.localeCompare(b.recordedAt)

export default function App() {
  // workout | log | sessionDetail | workouts | workoutDetail | weight
  const [view, setView] = useState('workout')
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [sessions, setSessions] = useState([])
  const [weights, setWeights] = useState([])
  const [workouts, setWorkouts] = useState([])
  const [error, setError] = useState(null)
  const [slow, setSlow] = useState(false)
  const [openSessionId, setOpenSessionId] = useState(null)
  const [openWorkoutId, setOpenWorkoutId] = useState(null)

  // "Today" is re-checked every minute, so a tab left open past midnight moves
  // to the new day by itself. pickedDate stays null while following today.
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

    // A free-tier API sleeps. Say so instead of spinning silently.
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

  // Calorie estimates use the most recent weigh-in.
  const bodyWeight =
    weights.length > 0 ? weights[weights.length - 1].weightKg : DEFAULT_BODY_WEIGHT

  const openSession = sessions.find((session) => session.id === openSessionId)
  const openWorkout = workouts.find((workout) => workout.id === openWorkoutId)

  function handleDateChange(value) {
    if (value > today) return
    setPickedDate(value === today ? null : value)
  }

  // Sessions (logged workouts)

  async function handleCreateSession(input) {
    try {
      const created = await createSession(input)
      setSessions((current) => [created, ...current].sort(newestFirst))
      setPickedDate(created.date === today ? null : created.date)
      setOpenSessionId(created.id) // open it so sets can go in right away
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

  // Workouts (named exercise lists)

  async function handleCreateWorkout(name) {
    try {
      const created = await createWorkout({ name })
      setWorkouts((current) => [...current, created])
      setOpenWorkoutId(created.id)
      setView('workoutDetail') // straight into the new list so exercises can go in
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

  // Weight

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
          onLogWorkout={() => setView('log')}
          onOpenWorkouts={() => setView('workouts')}
        />
      )}

      {status === 'ready' && view === 'log' && (
        <LogWorkoutView
          workouts={workouts}
          forDate={activeDate}
          onSubmit={handleCreateSession}
          onCancel={() => setView('workout')}
        />
      )}

      {status === 'ready' && view === 'sessionDetail' && openSession && (
        <SessionDetailView
          session={openSession}
          workouts={workouts}
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
          onOpen={(id) => {
            setOpenWorkoutId(id)
            setView('workoutDetail')
          }}
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