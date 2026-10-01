import { shiftDate, formatDay } from '../dateUtils.js'

export default function DayNav({ date, today, onChange }) {
  const isToday = date === today
  const isYesterday = date === shiftDate(today, -1)
  const prefix = isToday ? 'Today · ' : isYesterday ? 'Yesterday · ' : ''

  return (
    <div className="day-nav">
      <div className="day-nav-row">
        <button
          type="button"
          className="ghost day-step"
          aria-label="Previous day"
          onClick={() => onChange(shiftDate(date, -1))}
        >
          ‹
        </button>
        <input
          type="date"
          value={date}
          max={today}
          aria-label="Pick a day"
          onChange={(event) => event.target.value && onChange(event.target.value)}
        />
        <button
          type="button"
          className="ghost day-step"
          aria-label="Next day"
          disabled={isToday}
          onClick={() => onChange(shiftDate(date, 1))}
        >
          ›
        </button>
      </div>
      <div className="day-nav-caption">
        <span>
          {prefix}
          {formatDay(date)}
        </span>
        {!isToday && (
          <button type="button" className="link-button" onClick={() => onChange(today)}>
            Back to today
          </button>
        )}
      </div>
    </div>
  )
}