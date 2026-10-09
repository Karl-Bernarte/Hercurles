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
- **What I asked for:** Create a Gym log workout with Calorie counter for me, with Logging of workout set and an individual call Log exercise for individual exercise instead of creating another workout set. Within those We create a workout set first in the Log workout then after creating we are able to put exercise in with reps and set and weight on how heavy the workout is. Apply that to Log exercise too.
- **What it gave back:** Calorie Counter in the middle and a button for Log Workout and Log exercise, although it was buggy and incomplete but it has session logs where it shows where the logged workout is in the very bottom of the logged workout. At this time it wasn't saving properly every refresh and every input you do wouldn't save as a local database or local save.
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

### Case 1 - Startup Demo app with occuring bugs and wrong understanding of AI

- **What it gave me:** It gave me a design that is very inconsistent and the design of the buttons got squished when i ask to make a button that would appealing to look at, but it gave me a run down button that is 2x2 size of Log Workout and Log Exercise. And the Log Workout and Log Exercise doesn't exactly work the way i intend it to be, it wouldn't save the changes i made or the workout sets i made. Rather every restart of the app would just go back straight to the hardcoded design.
- **What was wrong with it:** The App is stuck to the hard coded design and wouldn't be able to save the workout sets i've created and the Weights and Reps/Set doesn't calculate properly it will be stuck at 0 instead of calculating its calorie burn along the its met from the metTable.js. Another was the buttons for the Log Workout and Exercise are squished and was frustrating to fix.
- **What I did instead:** I clarified the design i got from the Figma to be exact of the design and copy the style I wouldn't stray away from its design as I was already fond of it. Kept prompting and prompting to fix it until it got it.
- **Commit:** https://github.com/Karl-Bernarte/Hercurles/actions/runs/36318043351

### Case 2 - Workout Session duplicating and Weights on workout plans

- **What it gave me:** It gave me a code that was somehow duplicating the workout and everytime I press my workout and just press back it would Log instantly without asking me to. As well the weights on workout plans doesn't calculate again properly as the AI accidentally removed the calculation for the weights.
- **What was wrong with it:** The Workout session is getting duplicated everytime you press it or press it on the Log Workout and press back, it would log immediately when you haven't pressed Log as complete. Another was it removed the calculation of the weights on each workout so the calorie burn wasn't working and doesn't calculate it on the Total Calorie burn and calorie left.
- **What I did instead:** I asked for it to fix the Workout session when you press the Workout session list it wouldn't mark it as log as complete or when you just press back on it that it wouldn't complete it as well. As well to fix the calculation of the weights from the list so it would calculate for the total calorie burn and total calorie left.
- **Commit:** https://github.com/Karl-Bernarte/Hercurles/actions/runs/37070843632

### Case 3 - The Adding of Exercises hallucination with adding a lot of changes 

- **What it gave me:** The AI gave me a lot of files that wasn't required for the website and creating a new file for the metTable where it would add more exercise onto the new file instead of adding them all in the metTable.js. The file was already laid out, but still bother to create a new file and add the new exercises from there and wasn't even consistent with the metTable.js, it also made some changes i don't even know what the AI changes made.
- **What was wrong with it:** The prompt i gave was add more 200 exercise for Strength and 20% to cardio, but instead it create a new file instead of going inside metTable and just follow that flow for the exercises. Another thing is creating a lot of changes when it wasn't even needed from the other files when i only ask to add more exercises.
- **What I did instead:** What i did after since the AI exercises it made from the new file didn't have a consistent list like on the metTable.js. I ask it to follow that with its name, category, and its met after that i just pasted it in the metTable.js and just re-organized it into Strength and Cardio so it would look more cleaner.
- **Commit:** https://github.com/Karl-Bernarte/Hercurles/actions/runs/37948308776

## 3. Who wrote what

> **Complete this section yourself before submitting.** I wrote the Food Tab and use what already laid out from the foundation of Workout Tab, took some of its idea and code, but adjust it so it would work for Food Tab as well took an inspiration from MyFitnessPal design. I went with MyFitnessPal idea as I was already used to it, implemented it and work with it and ask for AI to fix the code and if the code that he is providing for the fix on the error I would ask for it to make a copy and paste of my entire code so every indent and every error is already fixed. I also asked what can i add more for Food Tab so I wouldn't left anything important and how I would start  it. The Custom button was later add on as i don't know how to do it so i had AI to do it for Food and Exercise too since I don't have links to other workout and food datasets so i just made them to add a custom of their own food or exercise

### Written by me

- **My GitHub handle:** `Food Tab and FoodsView, Added atleast 56 exercise for metTable.js for Strength and Cardio. `
- **File(s) and functions I personally wrote:** `I did the Food tab, since the design and the structure was already laid out from the exercise i took some of the code and made some changes on it to fit the food tab. Although i had to ask help for copilot when things go wrong or how to fix it. Another thing i ask the copilot what i can do to add more and how i can fix it. It was tedious and tiring since i have to keep looking from code to code how the workout tab was creating, but other than that after laying out what i can do after all of that i had copilot help me after although i didn't do the custom add button that was added later on since i didn't know how i would design or do it. I asked help from copilot how i could make a branch first before doing my own coding just to be sure if something broke.Luckily it seem nothing broke and help how to push it on the main after since it was a struggle trying to get it out from branch to main.`
- **Commit(s):** `https://github.com/Karl-Bernarte/Hercurles/tree/feature/local-food-logging`
- **Approximate share of the Node/Express/PostgreSQL app:** `5% I used the code from the hauntsighting repo that we used on the modules. I did that first before starting my app but gave up half way as it was tiring my brain our figuring out how to make it work without asking AI for help.`
- **What my code does and why I built it this way (in my own words):** `I only used the layed out foundation of the workout tab although added some of my style to it so it would be differentiate a bit. Even differentiating it a bit i just ask what i could add more from the AI so i can do my thing first before the Ai does. After racking my brains out what causes the error i just copy and paste the whole code so nothing breaks, when i mean copy pasting the entire code is I already did the code i just make the Ai copy my whole code and fix the part with the problem only so when i paste it, Theres no more bugs and the indents of the code is corrected.`

### The AI-written part I understand best

- **Files:** `client/src/App.jsx` and `client/src/styles.css`
- **Commit:** https://github.com/Karl-Bernarte/Hercurles/commit/13c6980
- **What it does:** This was the first major step in turning the starter project into Hercurles. It replaced the starter screen with the workout app's main structure and established the early visual styling for logging sessions and sets and viewing workout information. Due to the colors and visual, i was quite fond of the design of it being neon as it was once my favorite color of my jacket with Black and Neon green. So that made me stuck with its design given by the wireframe from the AI of Figma.
- **Why we kept it:** It gave the project its initial website layout and styling to build on. As the project grew, I asked for changes to the workout, food, and weight areas, so the design evolved from that starting point. I understand this part as the foundation of the website. I stuck with the design given from Figma as it looks clean and only has the necessary things I would need for my gym session and not bloat it with premium stuffs that i wouldn't even consider using from those apps that makes you pay for things that should be free from their simple functions.
