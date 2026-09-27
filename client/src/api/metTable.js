export const MET_TABLE = {
  Squat: 6.0,
  'Bench Press': 5.0,
  Deadlift: 6.0,
  'Barbell Row': 4.5,
  'Overhead Press': 4.5,
  'Pull-up': 4.0,
  'Chin-up': 4.0,
  'Bicep Curl': 3.5,
  'Tricep Extension': 3.5,
  'Lat Pulldown': 4.0,
  'Leg Press': 5.0,
  Lunges: 5.0,
  Plank: 3.0,
  Default: 5.0,
}

export function getMET(exercise) {
  return MET_TABLE[exercise] || MET_TABLE.Default
}

export function calculateCalories(sets, bodyWeightKg, durationMinutes) {
  if (!sets || sets.length === 0) return 0
  const avgMet = sets.reduce((sum, s) => sum + getMET(s.exercise), 0) / sets.length
  const durationHours = durationMinutes / 60
  return Math.round(avgMet * bodyWeightKg * durationHours)
}