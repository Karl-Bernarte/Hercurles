ALTER TABLE exercises
  ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'Strength',
  ADD COLUMN IF NOT EXISTS duration_minutes INTEGER;

ALTER TABLE session_sets
  ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'Strength',
  ADD COLUMN IF NOT EXISTS duration_minutes INTEGER;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'exercises_category_check'
  ) THEN
    ALTER TABLE exercises
      ADD CONSTRAINT exercises_category_check CHECK (category IN ('Strength', 'Cardio'));
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'exercises_duration_minutes_check'
  ) THEN
    ALTER TABLE exercises
      ADD CONSTRAINT exercises_duration_minutes_check CHECK (duration_minutes BETWEEN 1 AND 600);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'session_sets_category_check'
  ) THEN
    ALTER TABLE session_sets
      ADD CONSTRAINT session_sets_category_check CHECK (category IN ('Strength', 'Cardio'));
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'session_sets_duration_minutes_check'
  ) THEN
    ALTER TABLE session_sets
      ADD CONSTRAINT session_sets_duration_minutes_check CHECK (duration_minutes BETWEEN 1 AND 600);
  END IF;
END $$;
