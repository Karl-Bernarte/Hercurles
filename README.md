# Hercurles

Hercurles is a workout and nutrition tracker for lifters who want to plan training, log sessions, and follow their progress over time.

**Live app:** [karl-bernarte.github.io/Hercurles](https://karl-bernarte.github.io/Hercurles/)

The client is deployed to GitHub Pages. Demo mode is enabled by default: workout, weight, and workout-plan data are stored in your browser, so they are not shared or synced between devices. Food logs and custom foods are also stored locally in the browser.

## Features

- Create reusable workout plans with strength and cardio exercises, then log a plan as a session
- Log individual exercises, sets, reps, weight, and cardio duration
- Track sessions by date, review past workouts, delete sessions or sets, and mark sessions complete
- See estimated calories burned using exercise MET values and your latest recorded body weight
- Log meals from a food list or create custom foods with serving sizes and calories
- Set a daily calorie goal and track food logged against it
- Record body weight and view progress over day, week, month, and year ranges

Calorie burn is an estimate, not a medical or nutrition measurement.

## Built with

- **Client:** React and Vite
- **API:** Node.js and Express
- **Database:** PostgreSQL
- **Deployment:** GitHub Pages for the client; the API and database run separately

The client uses one API interface with two implementations: a local-storage mock API for demo mode and an HTTP client for the Express API. Food logging is currently browser-local in either mode.

## Run locally

### Client in demo mode

Requires Node.js and npm. No API or database is needed.

```powershell
cd client
npm install
Copy-Item .env.example .env
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### Full stack

Requires Node.js 20 or newer, npm, and PostgreSQL.

1. Start PostgreSQL locally or use a hosted database.
2. Configure the API environment and start it:

   ```powershell
   cd server
   npm install
   Copy-Item .env.example .env
   # Set DATABASE_URL and CORS_ORIGINS in .env.
   npm run db:reset
   npm run dev
   ```

3. In a second terminal, configure and start the client:

   ```powershell
   cd client
   npm install
   Copy-Item .env.example .env
   # Set VITE_USE_MOCK_API=false and VITE_API_BASE_URL=http://localhost:3000 in .env.
   npm run dev
   ```

Check that the API is responding:

```text
http://localhost:3000/healthz
http://localhost:3000/readyz
```

## Demo mode and configuration

`VITE_USE_MOCK_API` is read at build time. Only the exact value `false` switches the client to the Express API; when unset or set to `true`, the client uses browser storage.

| Variable | Used by | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | API | PostgreSQL connection string |
| `CORS_ORIGINS` | API | Comma-separated list of allowed client origins |
| `NODE_ENV` | API | Set to `production` when deployed |
| `PORT` | API | Listening port; deployment hosts usually set this |
| `VITE_USE_MOCK_API` | Client build | Set to `false` to use the real API |
| `VITE_API_BASE_URL` | Client build | Public base URL of the Express API |

The server and client each provide an `.env.example`. Do not commit `.env` files. Every `VITE_` value is included in the public client bundle; never put passwords, API keys, or database credentials in a `VITE_` variable.

## Deployment

The GitHub Actions workflow in `.github/workflows/deploy-pages.yml` builds and deploys the client to GitHub Pages when changes are pushed to `main`. To connect the deployed client to a hosted API, configure the repository Actions variables `VITE_USE_MOCK_API=false` and `VITE_API_BASE_URL` with the API's public URL, then trigger the Pages workflow manually or push a client change. Configure the API's `CORS_ORIGINS` to include the GitHub Pages origin.

GitHub Pages serves the client only; it does not run the Express API or PostgreSQL. The API and database must be hosted separately.

## Project structure

```text
client/       React application and Vite build
  src/api/    Mock and HTTP API implementations
  src/views/  Workout, session, food, and weight screens
server/       Express API and PostgreSQL integration
  db/         Schema, seed data, and database runner
docs/         Project proposal, design, reports, and security notes
```

## Project documents

- [AI use](AI-USAGE.md)
- [Project documents](docs/README.md)
- [License](LICENSE)

## Author

Karl Shane Y. Bernarte · CS-403, 6APSI
