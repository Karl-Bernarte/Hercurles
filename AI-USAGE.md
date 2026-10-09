# AI usage

This is a working draft based on the repository history and the project conversations available to me. Check that each description matches what you remember before submitting. The commit links point to changes in this repository.

## 1. How I used AI

### 2026-09-27 - Turning the starter into Hercurles

- **Tool:** Claude (Anthropic), as credited in the project README.
- **What I asked for:** Replace the starter app with workout sessions, sets, calorie estimates, and the Hercurles interface.
- **What it gave back:** Frontend session flows, API adapter changes, an initial MET table, and styling updates.
- **What I kept, what I changed, and why:** The commit shows the app-specific interface and session flow that became the basis for later work. I tested the app and continued correcting it as I found issues.
- **Commit:** https://github.com/Karl-Bernarte/Hercurles/commit/13c6980

### 2026-10-01 - Workout plans and exercise browsing

- **Tool:** Claude (Anthropic), as credited in the project README.
- **What I asked for:** Add named workout plans, a workout browser, and history for recent, strength, and cardio exercises.
- **What it gave back:** Changes to workout navigation, plan browsing, and exercise selection.
- **What I kept, what I changed, and why:** I kept the plan and browsing features, then continued testing the exercise logging flow and requested fixes when the behavior did not match what I expected.
- **Commit:** https://github.com/Karl-Bernarte/Hercurles/commit/9a398d7

### 2026-10-03 - Fixing exercise logging behavior

- **Tool:** Claude (Anthropic), as credited in the project README.
- **What I asked for:** Fix workout/exercise logging behavior, including unwanted duplicate sessions and adding sets while logging an exercise.
- **What it gave back:** Updates to the workout/session logging flow and interface.
- **What I kept, what I changed, and why:** I checked the logging flow and asked for changes to make cancellation and saving behave as intended.
- **Commit:** https://github.com/Karl-Bernarte/Hercurles/commit/3914ac6

### 2026-10-05 - Expanding exercises and food logging

- **Tool:** Claude (Anthropic), as credited in the project README.
- **What I asked for:** Expand the exercise and food choices and support custom food logging.
- **What it gave back:** Catalog entries and food logging code.
- **What I kept, what I changed, and why:** I kept the catalog and food logging work, and later gave more specific feedback about useful exercise names and keeping the catalog directly in `metTable.js`.
- **Commit:** https://github.com/Karl-Bernarte/Hercurles/commit/f88a595

### 2026-10-09 - Building the Express and PostgreSQL API

- **Tool:** Claude (Anthropic), as credited in the project README.
- **What I asked for:** Build out the fitness API, database schema/repository, and request validation for the app.
- **What it gave back:** Express routes, PostgreSQL queries and schema changes, validation, and tests.
- **What I kept, what I changed, and why:** I ran the server tests and used local runs to check that the client and API worked together. I did not treat generated code as correct without testing it.
- **Commit:** https://github.com/Karl-Bernarte/Hercurles/commit/1a97100

### 2026-10-09 - Making cardio duration-based

- **Tool:** GitHub Copilot (Copilot SDK in VS Code).
- **What I asked for:** Use minutes for cardio instead of weight, sets, and reps; keep cancellation behavior consistent; and add more exercise choices.
- **What it gave back:** Cardio duration handling across the client and API/database, validation and tests, plus an expanded exercise catalog.
- **What I kept, what I changed, and why:** I reviewed the local behavior, corrected the catalog to use ordinary exercise names and separate Strength and Cardio entries, and checked the build and server tests.
- **Commit:** https://github.com/Karl-Bernarte/Hercurles/commit/726a599

### 2026-10-09 - Troubleshooting deployment

- **Tool:** GitHub Copilot (Copilot SDK in VS Code).
- **What I asked for:** Help diagnose why the deployed Render health endpoint was not responding.
- **What it gave back:** Deployment diagnostics and a Dockerfile location change.
- **What I kept, what I changed, and why:** I tried the proposed deployment changes and checked Render's logs and endpoint. Since the live endpoint still did not work, I stopped relying on that diagnosis and focused on running the app locally.
- **Commit:** https://github.com/Karl-Bernarte/Hercurles/commit/cc1839b
- **Related commit:** https://github.com/Karl-Bernarte/Hercurles/commit/91df3c0

## 2. Where the AI got it wrong

### Case 1 - The exercise-catalog change was overcomplicated

- **What it gave me:** An early attempt at adding activities introduced extra catalog structure and changes beyond the direct catalog edit I requested.
- **What was wrong with it:** It expanded the scope and made a simple exercise-list change harder to review. I wanted the exercises as ordinary entries directly in `metTable.js`.
- **What I did instead:** I clarified the scope and kept the catalog entries in the existing file.
- **Commit:** https://github.com/Karl-Bernarte/Hercurles/commit/726a599

### Case 2 - The generated exercise names were too repetitive

- **What it gave me:** Some exercise suggestions used technique/grip/tempo variants and labels such as “chest focus.”
- **What was wrong with it:** These were not the straightforward exercise names I wanted and they made the picker unnecessarily long.
- **What I did instead:** I asked for the variants to be removed, the categories grouped cleanly, and more genuine chest movements mixed with other strength exercises.
- **Commit:** https://github.com/Karl-Bernarte/Hercurles/commit/726a599

### Case 3 - The Render diagnosis did not fix the live endpoint

- **What it gave me:** The AI suggested deployment configuration and health-route troubleshooting changes.
- **What was wrong with it:** Despite those changes, the deployed health endpoint still did not respond. The suggested diagnosis was not enough to explain or resolve what was happening on Render.
- **What I did instead:** I checked the logs and URL myself, reported that the endpoint was still unavailable, and switched to local testing rather than claiming the deployment was fixed.
- **Commit:** https://github.com/Karl-Bernarte/Hercurles/commit/cc1839b
- **Related commit:** https://github.com/Karl-Bernarte/Hercurles/commit/91df3c0

## 3. Who wrote what

> **Complete this section yourself before submitting.** Do not claim AI-generated code as your own. The badge requires at least 20% of the Node/Express/PostgreSQL app to be code you personally wrote and can explain. Pick specific server-side code you actually wrote, estimate the portion honestly, and explain it in your own words. If you cannot identify that much code yet, write and commit more server-side code yourself before submitting.

### Written by me

- **My GitHub handle:** `[fill in]`
- **File(s) and functions I personally wrote:** `[fill in exact server-side file paths/functions]`
- **Commit(s):** `[link to the commit(s) that contain your own code]`
- **Approximate share of the Node/Express/PostgreSQL app:** `[estimate honestly; explain how you estimated it]`
- **What my code does and why I built it this way (in my own words):** `[write your explanation]`

### The AI-written part I understand best

- **File:** `server/validation.js`
- **Commit:** https://github.com/Karl-Bernarte/Hercurles/commit/1a97100
- **What it does:** The validation functions check incoming request data before it is used by the API. They reject unexpected fields and invalid values, and return normalized values for valid requests.
- **Why we kept it:** It provides a clear boundary between untrusted request data and the route/repository code. **Rewrite this explanation in your own words and be ready to explain one validation function.**
