import { calculateCalories } from '../api/metTable.js'

export default function SessionCard({ session, bodyWeight, onOpen }) {
  const kcal = calculateCalories(session.sets, bodyWeight, session.durationMinutes)
  const strengthEntries = session.sets.filter((set) => set.category !== 'Cardio').length
  const cardioMinutes = session.sets.reduce(
    (sum, set) => sum + (Number(set.durationMinutes) || 0),
    0
  )

  return (
    <li>
      <button type="button" className="workout-row session-row" onClick={() => onOpen(session.id)}>
        <span className="session-row-main">
          <span className="session-row-title">
            {session.title || 'Workout'} {session.complete && <span className="badge">DONE</span>}
          </span>
          <span className="muted session-row-sub">
            {strengthEntries} set{strengthEntries === 1 ? '' : 's'}
            {cardioMinutes ? ` · ${cardioMinutes} min cardio` : ''}
            {session.notes ? ` · ${session.notes}` : ''}
          </span>
        </span>
        <span className="kcal-tag">{kcal} kcal ›</span>
      </button>
    </li>
  )
}