import { useState } from 'react'
import SessionCard from '../components/SessionCard.jsx'
import DayNav from '../components/DayNav.jsx'
import { calculateCalories } from '../api/metTable.js'
import { getCalorieGoal, setCalorieGoal } from '../calorieGoal.js'
import { shiftDate } from '../dateUtils.js'

export default function WorkoutView({
  sessions,
  date,
  today,
  bodyWeight,
  onDateChange,
  onOpenSession,
  onOpenWorkouts,
  onLogExercise,
}) {
  const [goal, setGoal] = useState(() => getCalorieGoal())

  const isToday = date === today
  const daySessions = sessions.filter((session) => session.date === date)
  const dayCalories = daySessions.reduce(
    (sum, session) => sum + calculateCalories(session.sets, bodyWeight, session.durationMinutes),
    0
  )
  const caloriesLeft = goal + dayCalories

  const weekStart = shiftDate(today, -6)
  const weekSessions = sessions.filter((session) => session.date >= weekStart && session.date <= today)
  const weekCalories = weekSessions.reduce(
    (sum, session) => sum + calculateCalories(session.sets, bodyWeight, session.durationMinutes),
    0
  )

  function handleGoalChange(event) {
    const value = Number(event.target.value)
    setGoal(value)
    setCalorieGoal(value)
  }

  return (
    <>
      <div className="calorie-hero">
        <div className="calorie-hero-label">
          {isToday ? 'Calorie burn today' : 'Calorie burn on this day'}
        </div>
        <div className="calorie-hero-value">{dayCalories}</div>
        <div className="calorie-hero-unit">kcal estimated</div>
      </div>

      <div className="calorie-secondary">
        <div className="calorie-secondary-box">
          <div className="calorie-hero-label">Daily goal</div>
          <input
            type="number"
            className="goal-input"
            min="0"
            max="10000"
            value={goal}
            onChange={handleGoalChange}
          />
          <div className="calorie-hero-unit">kcal</div>
        </div>
        <div className="calorie-secondary-box">
          <div className="calorie-hero-label">Left to eat</div>
          <div className="calorie-secondary-value">{caloriesLeft}</div>
          <div className="calorie-hero-unit">kcal</div>
        </div>
      </div>
      <p className="hint">Goal + what you burned {isToday ? 'today' : 'on this day'} = left to eat.</p>

      <div className="week-summary">
        <span>This week</span>
        <span>
          {weekSessions.length} workout{weekSessions.length === 1 ? '' : 's'} · {weekCalories} kcal burned
        </span>
      </div>

      <div className="button-row">
        <button type="button" onClick={onOpenWorkouts}>
          + Create workout
        </button>
        <button type="button" className="btn-outline" onClick={onLogExercise}>
          + Log Exercise
        </button>
      </div>
      <p className="hint">Estimates use {bodyWeight} kg, your latest entry in the Weight tab.</p>

      <DayNav date={date} today={today} onChange={onDateChange} />

      {daySessions.length === 0 ? (
        <p className="card muted empty-day">
          {isToday
            ? 'Nothing logged today yet. Tap Create workout or Log Exercise to start.'
            : 'Nothing was logged on this day.'}
        </p>
      ) : (
        <ul className="list">
          {daySessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              bodyWeight={bodyWeight}
              onOpen={onOpenSession}
            />
          ))}
        </ul>
      )}
    </>
  )
}