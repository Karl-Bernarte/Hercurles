-- Add a small starter workout and weigh-in for a newly-created local database.
-- These inserts are non-destructive and safe to run more than once.

INSERT INTO workouts (name)
SELECT 'Back / Biceps Day'
WHERE NOT EXISTS (SELECT 1 FROM workouts WHERE name = 'Back / Biceps Day');

INSERT INTO exercises (workout_id, name, weight, sets, reps)
SELECT w.id, seed.name, seed.weight, seed.sets, seed.reps
FROM workouts w
CROSS JOIN (VALUES
  ('Barbell Row', 70, 4, 8),
  ('Lat Pulldown', 50, 3, 10),
  ('Bicep Curl', 12, 3, 12)
) AS seed(name, weight, sets, reps)
WHERE w.name = 'Back / Biceps Day'
  AND NOT EXISTS (
    SELECT 1 FROM exercises e
    WHERE e.workout_id = w.id AND e.name = seed.name
  );

INSERT INTO weights (weight_kg, recorded_at)
SELECT 72.5, now()
WHERE NOT EXISTS (SELECT 1 FROM weights);
