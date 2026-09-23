# Hercurles

One sentence: Hercurles is a workout logging app for lifters who want to track sets, reps and weight per session, and see how their training changes over time.

**Live site:** https://karl-bernarte.github.io/Hercurles/
**API:** (not deployed yet — running in demo mode)
**Demo video:** (link, added in week 3)

> **This deployment is running in demo mode.** The interface is real; the backend
> is simulated in your browser so the site works without a server. See
> [Demo mode](#demo-mode) below. Delete this quote once your API is live.

![A screenshot of the main screen](docs/assets/screenshot.png)

## What it does

- Log a workout session with a date, duration and optional notes
- Add sets to a session (exercise, weight, reps) and see total training volume update live
- Mark a session complete
- Browse past sessions, newest first
- Delete a session or an individual set

## Built with

React and Vite on the front end, Express and PostgreSQL on the back end. The client is on GitHub Pages, the API on (host, TBD), the database on (host, TBD).

## Demo mode

This repository can run two ways, chosen by one environment variable at **build** time.

**Demo mode is the default.** Only the exact string `false` turns it off, so a forgotten or mistyped variable leaves you on the simulated backend with a visible notice rather than on a silently broken build.

| `VITE_USE_MOCK_API` | What happens |
| --- | --- |
| unset, or `true` | The client answers its own requests from `localStorage`. No server, no database, nothing shared between visitors. This is what the template ships with, so the GitHub Pages link works on day one. |
| `false` | The client calls the Express API at `VITE_API_BASE_URL`, which reads and writes real PostgreSQL. |

**Demo mode is a starting point and a fallback, not a finished project.** My finals submission will be all three pieces deployed and talking to each other. Demo mode is there so I can build the interface in week one before the API exists.

GitHub Pages serves files and cannot run Node, so the API and the database can never live there. They go somewhere else:

| Piece | Options |
| --- | --- |
| **API** | Render, Railway, Fly.io, Koyeb, or a VPS |
| **Database** | Neon, Supabase, Railway, or Aiven |

## Running it yourself

**The client only, in demo mode.** No database needed.

    cd client
    npm install
    cp .env.example .env        # VITE_USE_MOCK_API stays true
    npm run dev                 # http://localhost:5173

**The whole stack.** Needs a PostgreSQL, either local or hosted.

    # 1. the database
    docker run --name my-pg -e POSTGRES_PASSWORD=devpassword \
      -e POSTGRES_DB=hercurles -p 5432:5432 -d postgres:17

    # 2. the API
    cd server
    npm install
    cp .env.example .env        # check DATABASE_URL
    npm run db:reset            # creates the tables and adds sample rows
    npm run dev                 # http://localhost:3000

    # 3. the client, in another terminal
    cd client
    npm install
    cp .env.example .env
    # set VITE_USE_MOCK_API=false
    npm run dev

Check the API on its own before you blame the client:

    curl http://localhost:3000/healthz
    curl http://localhost:3000/readyz
    curl http://localhost:3000/api/sessions

## Environment variables

None of these are committed. `.env.example` in each folder lists them with placeholder values.

| Name | Where | What it is |
| --- | --- | --- |
| `DATABASE_URL` | server | PostgreSQL connection string. Contains a password |
| `CORS_ORIGINS` | server | comma-separated origins allowed to call the API |
| `NODE_ENV` | server | `production` on your host |
| `PORT` | server | **set by the host**, do not set it yourself |
| `VITE_USE_MOCK_API` | client, at build time | only `false` turns demo mode off; unset means on |
| `VITE_API_BASE_URL` | client, at build time | your API's public URL, no trailing slash |

Every `VITE_` value is compiled into the built JavaScript and is **public**. Never put a key, a password or a connection string in one.

## Deploying

**Client, to GitHub Pages.** Already wired up in `.github/workflows/deploy-pages.yml`.

1. **Settings > Pages > Build and deployment > Source: GitHub Actions.**
2. Nothing else, until the API is live. Demo mode is the default, so the first deploy works on its own.

The repository must be **public** for Pages to serve it on a free account.

**API and database.** Not automated yet — planned for week 2–3. Will point the host at the `server/` folder, set environment variables in its dashboard, and run `server/db/schema.sql` once against the hosted database.

## Project structure

    client/          React front end, built by Vite
      src/api/       ONE interface, two implementations, chosen by a variable
      src/components/
    server/          Express API
      db/            pool, schema.sql, seed.sql, and a runner for them
    docs/            planning documents and weekly reports

## Architecture

The React client (GitHub Pages) talks to an Express API (host TBD), which reads and writes a PostgreSQL database (host TBD). In demo mode, the client instead reads and writes `localStorage` directly, using the same `src/api/` interface so switching to the real API later is a one-line change.

## What I would do next

- Connect the real Express/PostgreSQL backend I already built and tested locally, adapting it into this template's `server/` structure and schema
- Add the calorie-estimate feature (MET table × body weight × duration) from my original proposal, which isn't built yet
- Add editing for existing sets (currently only add/delete)

## Author

Karl Shane Y. Bernarte. CS-403, 6APSI.

## AI use

![Built with AI assistance](https://img.shields.io/badge/built%20with-AI%20assistance-0b5fff)

Built with heavy assistance from Claude (Anthropic) across both the frontend and backend. See [AI-USAGE.md](AI-USAGE.md) for the full account of what was AI-written, what I changed, and where it got things wrong.

## Licence

MIT, see [LICENSE](LICENSE).
