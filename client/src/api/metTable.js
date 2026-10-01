export const EXERCISE_CATALOG = [
  { name: 'Squat', category: 'Strength', met: 6.0 },
  { name: 'Bench Press', category: 'Strength', met: 5.0 },
  { name: 'Deadlift', category: 'Strength', met: 6.0 },
  { name: 'Barbell Row', category: 'Strength', met: 4.5 },
  { name: 'Overhead Press', category: 'Strength', met: 4.5 },
  { name: 'Pull-up', category: 'Strength', met: 4.0 },
  { name: 'Chin-up', category: 'Strength', met: 4.0 },
  { name: 'Bicep Curl', category: 'Strength', met: 3.5 },
  { name: 'Tricep Extension', category: 'Strength', met: 3.5 },
  { name: 'Lat Pulldown', category: 'Strength', met: 4.0 },
  { name: 'Leg Press', category: 'Strength', met: 5.0 },
  { name: 'Lunges', category: 'Strength', met: 5.0 },
  { name: 'Plank', category: 'Strength', met: 3.0 },
  { name: 'Running', category: 'Cardio', met: 9.8 },
  { name: 'Jogging', category: 'Cardio', met: 7.0 },
  { name: 'Cycling', category: 'Cardio', met: 7.5 },
  { name: 'Jump Rope', category: 'Cardio', met: 10.0 },
  { name: 'Rowing Machine', category: 'Cardio', met: 7.0 },
  { name: 'Elliptical', category: 'Cardio', met: 5.0 },
  { name: 'Stair Climber', category: 'Cardio', met: 8.0 },
  { name: 'Swimming', category: 'Cardio', met: 8.0 },
]

export const CATEGORIES = ['Strength', 'Cardio']

export const MET_TABLE = Object.fromEntries(
  EXERCISE_CATALOG.map((exercise) => [exercise.name, exercise.met])
)
MET_TABLE.Default = 5.0

export function getMET(exercise) {
  return MET_TABLE[exercise] || MET_TABLE.Default
}

export function calculateCalories(sets, bodyWeightKg, durationMinutes) {
  if (!sets || sets.length === 0) return 0
  const avgMet = sets.reduce((sum, s) => sum + getMET(s.exercise), 0) / sets.length
  const durationHours = durationMinutes / 60
  return Math.round(avgMet * bodyWeightKg * durationHours)
}