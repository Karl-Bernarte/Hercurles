-- The fitness log schema. Safe to run against an empty database and repeatedly.

CREATE TABLE IF NOT EXISTS workouts (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 60),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS exercises (
  id         SERIAL PRIMARY KEY,
  workout_id INTEGER NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  name       TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  weight     NUMERIC(7, 2) NOT NULL DEFAULT 0 CHECK (weight BETWEEN 0 AND 1000),
  sets       INTEGER NOT NULL CHECK (sets BETWEEN 1 AND 20),
  reps       INTEGER NOT NULL CHECK (reps BETWEEN 1 AND 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS exercises_workout_id_idx ON exercises (workout_id, id);

CREATE TABLE IF NOT EXISTS sessions (
  id               SERIAL PRIMARY KEY,
  date             DATE NOT NULL,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes BETWEEN 1 AND 600),
  notes            TEXT NOT NULL DEFAULT '' CHECK (char_length(notes) <= 2000),
  workout_id       INTEGER REFERENCES workouts(id) ON DELETE SET NULL,
  title            TEXT NOT NULL DEFAULT '' CHECK (char_length(title) <= 60),
  complete         BOOLEAN NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sessions_date_idx ON sessions (date DESC, id DESC);

CREATE TABLE IF NOT EXISTS session_sets (
  id         SERIAL PRIMARY KEY,
  session_id INTEGER NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  exercise   TEXT NOT NULL CHECK (char_length(exercise) BETWEEN 1 AND 100),
  weight     NUMERIC(7, 2) NOT NULL CHECK (weight BETWEEN 0 AND 1000),
  sets       INTEGER NOT NULL CHECK (sets BETWEEN 1 AND 20),
  reps       INTEGER NOT NULL CHECK (reps BETWEEN 1 AND 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS session_sets_session_id_idx ON session_sets (session_id, id);

CREATE TABLE IF NOT EXISTS weights (
  id          SERIAL PRIMARY KEY,
  weight_kg   NUMERIC(6, 2) NOT NULL CHECK (weight_kg BETWEEN 20 AND 500),
  recorded_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS weights_recorded_at_idx ON weights (recorded_at, id);
