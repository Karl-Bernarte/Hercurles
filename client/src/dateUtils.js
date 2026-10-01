const pad = (value) => String(value).padStart(2, '0')

// Built from the LOCAL calendar fields. toISOString() gives the UTC date, which
// is still "yesterday" in the Philippines until 8 AM.
function toDateString(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function parseDateString(dateString) {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function todayLocal() {
  return toDateString(new Date())
}

export function shiftDate(dateString, days) {
  const date = parseDateString(dateString)
  date.setDate(date.getDate() + days)
  return toDateString(date)
}

export function formatDay(dateString) {
  return parseDateString(dateString).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}