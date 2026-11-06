# Decisions log

Judgement calls made while building, in roughly the order they came up.

## Sources & religious content
1. **Tanzil.net was unreachable** (blocked by the build environment's network policy — HTTP 403 on CONNECT, verified twice). Per the brief, Qur'an 1:1 and 112:1–4 render as the marked placeholder `[QURAN TEXT — INSERT FROM VERIFIED SOURCE]`. I did **not** use any npm package or mirror as a substitute, because its provenance could not be verified as Tanzil's unmodified text. `npm run fetch-quran` fetches the exact text + licence notice from Tanzil when internet is available and writes it to `quran-text.json` without modification.
2. **Bismillah on Day 2 is treated as Qur'anic text** (1:1), so it is also a placeholder. On Day 3 the short dua "بِسْمِ اللَّهِ" before eating is shown as **hadith wording** (Bukhari 5376 / Muslim 2022), which I am confident of — flagged for review anyway.
3. **Only the short form of the eating dua** is included. The longer "if you forget" form was left out because I was not fully certain of the exact wording across narrations.
4. **Hadith reference numbers** (Bukhari 5376, Muslim 2022, Bukhari 6227, Muslim 54) are given with "(to be verified)" in-app and listed in `CONTENT_REVIEW.md`.
5. **No meanings/translations of Qur'anic verses** were written — the meaning field says "to be added from a verified translation". Writing a translation is tafsir-adjacent and outside what I should author.
6. **Arabic letter names** use transliteration only (Alif, Ba, Ta, Tha) plus a Bengali transliteration (আলিফ, বা, তা, ছা — ث as "ছা" follows common Bengali madrasa convention; flagged). No pronunciation guide.
7. **TTS is disabled for the whole Islamic lesson**, not just the Arabic lines. Partial TTS would risk a Bengali voice reading letter names, i.e. an invented pronunciation guide. The child sees "Parent recites — the app does not read this aloud".
8. **Islamic letter recognition is quizzed; recitation is not.** Surah Al-Ikhlas is 4 "listen & repeat" steps confirmed by the parent — the app never judges recitation.
9. Arabic letter questions use dot-counting (ب one dot below, ت two above, ث three above) — a factual property of the letter form, so no religious claim is made.

## Curriculum
10. Kept the suggested progression. Changes: **Day 4 Bengali words are আম, ইট, উট** — chosen because they start with the vowels taught on Days 1–3, so the child can recognise the first letter. **Day 4 English adds "hat"** to cat/bat (three-way choice, same -at family).
11. Example words for Bengali vowels follow common primer convention (অজগর, আম, ইঁদুর, ঈগল, উট, ঊষা). ঊষা is abstract for a 5-year-old; parent instructions explain it.
12. Day 5 rhyme is the first line of the traditional folk rhyme "আয় আয় চাঁদ মামা, টিপ দিয়ে যা" (public domain), quoted from memory, flagged.
13. World & Life Skills avoids religiously-coded examples from other traditions (e.g. tulsi) and uses neutral household examples (roti, samosa, rice fields, rickshaw driver).
14. **Time budget:** first draft planned 20 min screen + 27 min offline = 47 min/day, over the 45-min ceiling. Offline activities were trimmed to 4 min each → **20–21 min screen + 20 min offline ≈ 40–41 min/day**. `npm run check:content` fails the build if a day exceeds 45 min total or 25 min screen.
15. Every question has a simpler variant; most have a harder one. Where a "harder" variant would be artificial (e.g. some World questions), it was omitted rather than padded.
16. Shapes use `● ■ ▲` text glyphs, not colour emoji, so they render on older Android. The 🫓 emoji was removed for the same reason.
17. **Child-facing language:** English lessons are taught in English with a Bengali "parent support" line; Bengali lessons are taught in Bengali (with an English support line only when the UI is English); other lessons follow the UI language.

## Adaptive engine (src/engine/adaptive.ts)
18. **Wrong options stay tappable** (faded), instead of being disabled. With 3 options and disabled wrong answers, a child can never make a 3rd wrong attempt, so the "→ simpler variant" rule could never fire. Caught by testing.
19. Wrong-attempt ladder: 1st wrong → "try again"; 2nd → hint; 3rd → simpler variant + extra offline practice; on the simpler variant, 3rd wrong → the answer is gently revealed and the child moves on (never stuck).
20. **"Comfortable" requires the latest lesson to need no hints and no simpler variant** (plus ≥2 first-try correct and ≥60% first-try rate). The first version only checked the simpler variant, so a skill that needed a hint was called "comfortable" — wrong and caught in testing.
21. Cross-lesson suggestion (R3) uses the **most recent finished lesson of the same skill**. Override is per lesson and logged as an event; the parent can restore it.
22. Parent-confirmed steps (say aloud, recite) are excluded from streaks and skill scores — the app cannot validate them, so they don't inflate "comfortable".

## Time, status and parent flow
23. **Screen time counts only while child mode is open, visible, not paused and not on the break screen.** It stops on the "well done" screen. Each tick is capped at 5 s, so a phone left asleep doesn't add time.
24. **The daily limit is per calendar date**, not per curriculum day (it's a real-world screen-time rule). If you run two curriculum days in one calendar day, you'll hit the limit — raise it in Settings while testing.
25. Lesson = **child part done AND offline activity confirmed**. Offline can be confirmed at any time (even before the screen part), so a parent who skips the screen still gets credit for the offline work.
26. Parent/offline time = from "Start offline activity" to "Done" (capped at 60 min). If Start wasn't pressed, Founder view uses the planned duration and labels it "est.".
27. **Refreshing mid-lesson re-opens child mode on the same question** — this also stops a child escaping the parent gate by refreshing.
28. Parent gate = press-and-hold 3 s (also works with keyboard Space/Enter held). Chosen over an arithmetic question: faster for the parent, still hard for a 5-year-old to do accidentally.
29. Reset keeps the chosen UI language; everything else (progress, events, photos, messages) is wiped.
30. Export includes events, observations (photo flag only — not the image bytes, to keep the file small), progress, screen time and overrides.
31. Islamic OFF hides Islamic lessons from Today **and** from Progress/skills (with a visible note that records are kept). Events are never deleted.

## Teacher demo
32. A welcome message and a scripted, clearly-labelled **"Demo auto-reply"** are shown so the screen isn't empty; both carry "DEMO". The banner is always in both languages.

## Tech
33. Tailwind 3 (stable, no config surprises), fonts bundled via `@fontsource` (Inter, Hind Siliguri, Amiri) so there are **no runtime network calls**.
34. State is one small store over `useSyncExternalStore` + localStorage; no Redux. Media in IndexedDB via `idb-keyval`; photos are downscaled to ≤1024px JPEG before storing.
35. Tests are a plain Node Playwright script (no test runner) to use the pre-installed browser. In tests only, a localStorage flag exposes the correct option as a DOM attribute; it's off for real use.
36. Fixed a crash where newer Chromium's `scrollIntoView()` returns a Promise and React treated it as an effect cleanup.
