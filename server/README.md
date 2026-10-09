# Hercurles API

The Express API stores workout sessions, exercises, saved workout plans, and
weigh-ins in PostgreSQL. It serves the data contract used by `client/src/api`.

## Run locally

1. Install Node.js 20 or newer and PostgreSQL.
2. Create a database, then copy `.env.example` to `.env` and set `DATABASE_URL`.
3. From this directory, run `npm ci`, `npm run db:reset`, and `npm run dev`.
   For an existing database, use `npm run db:migrate:cardio` to add cardio
   categories and per-activity durations without resetting existing data.
4. Check `http://localhost:3000/readyz`; it returns `{"ok":true,"db":"up"}` when
   the database connection works.

`db:reset` applies the schema and adds starter data without deleting existing
rows. Keep `.env` private. For the frontend, set
`VITE_USE_MOCK_API=false` and `VITE_API_BASE_URL=http://localhost:3000` in
`client/.env`.

## API

All request and response bodies use JSON. IDs are positive integer numbers.
Validation failures return `400`, missing resources return `404`, and successful
deletes return `204` with no body.

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/healthz` | Process health |
| `GET` | `/readyz` | Database readiness |
| `GET` | `/api/sessions` | List sessions with their sets, newest date first |
| `GET` | `/api/sessions/:id` | Get one session with sets |
| `POST` | `/api/sessions` | Create a session |
| `PATCH` | `/api/sessions/:id` | Update session fields |
| `DELETE` | `/api/sessions/:id` | Delete a session and its sets |
| `POST` | `/api/sessions/:sessionId/sets` | Add a set to a session |
| `DELETE` | `/api/sessions/:sessionId/sets/:setId` | Delete a session set |
| `GET` | `/api/weights` | List weigh-ins oldest first |
| `POST` | `/api/weights` | Add a weigh-in |
| `DELETE` | `/api/weights/:id` | Delete a weigh-in |
| `GET` | `/api/workouts` | List workout plans with exercises |
| `POST` | `/api/workouts` | Create a workout plan |
| `DELETE` | `/api/workouts/:id` | Delete a plan and its exercises |
| `POST` | `/api/workouts/:workoutId/exercises` | Add an exercise to a plan |
| `DELETE` | `/api/workouts/:workoutId/exercises/:exerciseId` | Delete a plan exercise |

Create a session with `date` (`YYYY-MM-DD`) and `durationMinutes`; `notes`,
`workoutId`, and `title` are optional. Strength sets use `exercise`, `weight`,
`sets`, and `reps`; cardio entries use `exercise`, `category: "Cardio"`, and
`durationMinutes`. Weigh-ins use `weightKg` and an ISO `recordedAt` timestamp.
Workout plans use `name`; strength exercises use `name`, `weight`, `sets`, and
`reps`, while cardio exercises use `name`, `category: "Cardio"`, and
`durationMinutes`.

Set `CORS_ORIGINS` to a comma-separated list of exact frontend origins when
deploying (for example, `https://example.github.io`). The database URL must be
configured on the API host; never expose it in the client build.
