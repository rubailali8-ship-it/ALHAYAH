# Noorani UKG — home-learning prototype (demo)

A phone-first daily learning loop for a Muslim parent in West Bengal and their 5–6-year-old: 4 academic lessons + 1 Islamic lesson a day, ~20 min on screen and ~20 min offline with the parent. Built to answer one question: **will a parent and child complete it in 30–45 minutes and want to come back tomorrow?**

Fictional data only (parent **Rahima**, child **Aisha, 5**). No backend, no login, no network calls at runtime, no AI.

## Run it

```bash
npm install
npm run dev          # http://localhost:5173  (add --host to open on your phone over Wi-Fi)
```

Production build: `npm run build && npm run preview` (http://localhost:4173).

### On your phone
Run `npm run dev -- --host`, then open the "Network" URL Vite prints on a phone on the same Wi-Fi. Everything (progress, photos, messages) is stored on that phone's browser only.

## How to use it

**As Rahima (parent mode — default)**
- **Today (আজকের শেখা):** pick Day 1–5, see the 5 lesson cards, the daily screen-time meter and in-app reminders. Tap **Start** to hand the phone to the child. After the child part, the card shows **Waiting for parent confirmation** — do the offline activity together, tap **Done**, optionally add a note/photo. Incomplete lessons can be moved to tomorrow.
- **Progress (অগ্রগতি):** built only from the recorded event log — today's and the week's completion, lessons by subject, skills (`practising` / `comfortable`), your observations, rule-based suggestions with an **Override** button, and 3 clearly-labelled sample teacher comments.
- **Teacher (শিক্ষক):** a local-only demo chat with "Ustadha Fatima — demo" (text, photo, voice note). Nothing is sent anywhere.
- **⚙️ Settings:** language (বাংলা / English), Islamic Education on/off, daily screen-time limit (default 25 min), export data (JSON), reset demo.

**As Aisha (child mode)**
Full-screen, one task per screen, big buttons, no navigation. Wrong answers → "try again" → hint → easier version. A **⏸** button pauses. Getting back to parent mode needs the **parent gate: press and hold the lock for 3 seconds**. When today's screen-time limit is reached, a "Break time" screen appears and sends the child to the offline activity.

Refreshing or closing the browser mid-lesson is safe: the app reopens on the same question with the timer intact.

## Founder view

Open **`/?founder=1`** (e.g. http://localhost:5173/?founder=1). Per lesson: screen time, attempts, hints, where the child got stuck (questions with ≥2 wrong attempts, simpler variants used), offline time. Per day: screen time vs parent/offline time vs total (red when screen > limit or total > 45 min). Export is also available there.

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` / `build` / `preview` | Vite dev server / production build / serve the build |
| `npm run check:content` | Validates the 25 lessons (fields, answers, needsReview rules, daily time budget) |
| `npm run content-review` | Regenerates `CONTENT_REVIEW.md` from the lesson files |
| `npm run fetch-quran` | Pulls the exact Uthmani text for Qur'an 1:1 and 112:1–4 from Tanzil.net into `src/content/islamic/quran-text.json` (needs internet) |
| `npm run e2e` | Playwright end-to-end checks against `npm run preview` (360×740 and 1280×800) |

## Where things live

```
src/content/academic/day1..5.ts   academic lessons (typed AcademicLesson)
src/content/islamic/lessons.ts    Islamic lessons (typed IslamicLesson) + quran-text.json
src/engine/adaptive.ts            rule-based adaptive engine (R1–R4, documented at the top)
src/storage/state.ts, actions.ts  localStorage state + event log; every action logs an event
src/storage/media.ts              IndexedDB (photos, voice notes, teacher messages)
src/i18n/bn.ts, en.ts             every UI string
src/child/                        child-mode player + parent gate
src/screens/                      Today, Progress, Teacher, Settings, Founder
```

See also: `DECISIONS.md`, `LIMITATIONS.md`, `CONTENT_REVIEW.md`, `ROADMAP.md`.

_Learning aligned with NCF-FS 2022 goals — not an affiliated or recognised school._
