const WIDTH = 400
const HEIGHT = 220
const PAD = { top: 16, right: 16, bottom: 28, left: 40 }

function formatTick(time, showTime) {
  const date = new Date(time)
  return showTime
    ? date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
    : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

// A plain SVG line chart. The x axis is real time between start and end, so a
// week view and a year view both place points where they belong.
export default function WeightChart({ entries, start, end, showTime }) {
  if (entries.length === 0) {
    return <p className="muted chart-empty">No weight logged in this range yet.</p>
  }

  const values = entries.map((entry) => entry.weightKg)
  let min = Math.min(...values)
  let max = Math.max(...values)
  if (min === max) {
    min -= 1
    max += 1
  }
  const breathing = (max - min) * 0.15
  min -= breathing
  max += breathing

  const innerWidth = WIDTH - PAD.left - PAD.right
  const innerHeight = HEIGHT - PAD.top - PAD.bottom
  const x = (time) => PAD.left + ((time - start) / (end - start)) * innerWidth
  const y = (value) => PAD.top + (1 - (value - min) / (max - min)) * innerHeight

  const points = entries.map((entry) => ({
    entry,
    x: x(new Date(entry.recordedAt).getTime()),
    y: y(entry.weightKg),
  }))
  const path = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x.toFixed(1)},${point.y.toFixed(1)}`)
    .join(' ')

  const ticks = [0, 0.5, 1].map((fraction) => min + (max - min) * fraction)

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="weight-chart"
      role="img"
      aria-label="Body weight over time"
    >
      {ticks.map((tick) => (
        <g key={tick}>
          <line
            x1={PAD.left}
            x2={WIDTH - PAD.right}
            y1={y(tick)}
            y2={y(tick)}
            stroke="#2e2e2e"
            strokeWidth="1"
          />
          <text x={PAD.left - 6} y={y(tick) + 4} textAnchor="end" fontSize="11" fill="#71717a">
            {tick.toFixed(1)}
          </text>
        </g>
      ))}

      <path
        d={path}
        fill="none"
        stroke="#b2e35e"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {points.map((point) => (
        <circle key={point.entry.id} cx={point.x} cy={point.y} r="3.5" fill="#b2e35e">
          <title>{`${point.entry.weightKg} kg`}</title>
        </circle>
      ))}

      <text x={PAD.left} y={HEIGHT - 8} textAnchor="start" fontSize="11" fill="#71717a">
        {formatTick(start, showTime)}
      </text>
      <text x={WIDTH - PAD.right} y={HEIGHT - 8} textAnchor="end" fontSize="11" fill="#71717a">
        {formatTick(end, showTime)}
      </text>
    </svg>
  )
}