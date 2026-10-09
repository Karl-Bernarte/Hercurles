import { useState } from 'react'
import WeightChart from '../components/WeightChart.jsx'
import { todayLocal } from '../dateUtils.js'

const DAY = 24 * 60 * 60 * 1000

const RANGES = [
  { key: 'day', label: 'Day', ms: DAY, caption: 'in the last 24 hours' },
  { key: 'week', label: 'Week', ms: 7 * DAY, caption: 'in the last 7 days' },
  { key: 'month', label: 'Month', ms: 30 * DAY, caption: 'in the last 30 days' },
  { key: 'year', label: 'Year', ms: 365 * DAY, caption: 'in the last year' },
]

function formatEntry(iso, showTime) {
  const date = new Date(iso)
  return showTime
    ? date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
    : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function WeightView({ weights, onAdd, onDelete }) {
  const [rangeKey, setRangeKey] = useState('week')
  const [form, setForm] = useState({ weightKg: '', date: todayLocal() })
  const [saving, setSaving] = useState(false)

  const range = RANGES.find((option) => option.key === rangeKey)
  const end = Date.now()
  const start = end - range.ms
  const inRange = weights.filter((entry) => new Date(entry.recordedAt).getTime() >= start)
  const chartStart = inRange.length
    ? Math.min(...inRange.map((entry) => new Date(entry.recordedAt).getTime()))
    : start
  const latest = weights.length > 0 ? weights[weights.length - 1] : null
  const showTime = range.key === 'day'

  let changeText = null
  if (inRange.length >= 2) {
    const delta = inRange[inRange.length - 1].weightKg - inRange[0].weightKg
    const rounded = Math.round(delta * 10) / 10
    changeText = `${rounded > 0 ? '+' : ''}${rounded} kg ${range.caption}`
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    const recordedAt =
      form.date === todayLocal()
        ? new Date().toISOString()
        : new Date(`${form.date}T12:00:00`).toISOString()
    const saved = await onAdd({ weightKg: Number(form.weightKg), recordedAt })
    if (saved) setForm({ ...form, weightKg: '' })
    setSaving(false)
  }

  return (
    <>
      <div className="weight-current">
        <div className="calorie-hero-label">Current weight</div>
        <div className="weight-current-value">{latest ? `${latest.weightKg} kg` : '--'}</div>
        {changeText && <div className="weight-change">{changeText}</div>}
      </div>

      <div className="segmented" role="group" aria-label="Chart range">
        {RANGES.map((option) => (
          <button
            key={option.key}
            type="button"
            className={option.key === rangeKey ? 'active' : ''}
            onClick={() => setRangeKey(option.key)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="card">
        <WeightChart entries={inRange} start={chartStart} end={end} showTime={showTime} />
      </div>

      <form onSubmit={handleSubmit} className="card">
        <h2>Log weight</h2>

        <label htmlFor="weight-kg">Weight (kg)</label>
        <input
          id="weight-kg"
          type="number"
          step="0.1"
          min="20"
          max="500"
          value={form.weightKg}
          onChange={(event) => setForm({ ...form, weightKg: event.target.value })}
          required
        />

        <label htmlFor="weight-date">Date</label>
        <input
          id="weight-date"
          type="date"
          max={todayLocal()}
          value={form.date}
          onChange={(event) => setForm({ ...form, date: event.target.value })}
          required
        />

        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Log weight'}
        </button>
      </form>

      {inRange.length > 0 && (
        <div className="card">
          <h2>Entries</h2>
          {inRange
            .slice()
            .reverse()
            .slice(0, 10)
            .map((entry) => (
              <div key={entry.id} className="entry-row">
                <span>
                  {entry.weightKg} kg{' '}
                  <span className="muted">· {formatEntry(entry.recordedAt, showTime)}</span>
                </span>
                <button type="button" className="ghost" onClick={() => onDelete(entry.id)}>
                  Delete
                </button>
              </div>
            ))}
        </div>
      )}
    </>
  )
}