import { calculateCalories } from '../api/metTable.js'

export default function SessionCard({ session, bodyWeight, onOpen }) {
  const kcal = calculateCalories(session.sets, bodyWeight, session.durationMinutes)

  return (
    <li>
      <button type="button" className="workout-row session-row" onClick={() => onOpen(session.id)}>
        <span className="session-row-main">
          <span className="session-row-title">
            {session.title || 'Workout'} {session.complete && <span className="badge">DONE</span>}
          </span>
          <span className="muted session-row-sub">
            {session.sets.length} set{session.sets.length === 1 ? '' : 's'}
            {session.notes ? ` · ${session.notes}` : ''}
          </span>
        </span>
        <span className="kcal-tag">{kcal} kcal ›</span>
      </button>
    </li>
  )
}