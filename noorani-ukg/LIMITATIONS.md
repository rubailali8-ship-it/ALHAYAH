# Limitations

## Simulated (labelled "Demo" in the app)
- **Teacher chat:** local only. Nothing is sent; replies are scripted auto-replies.
- **Teacher comments on Progress:** 3 hard-coded samples, labelled "Sample".
- **Adaptive suggestions:** four fixed rules (see `src/engine/adaptive.ts`), labelled "Rule-based suggestions (demo)". Not AI, not a learning model.
- **Child profile:** fictional (Rahima, Aisha). Single child, single device.

## Content gaps
- **Qur'anic text is a placeholder** (Qur'an 1:1, 112:1–4) — Tanzil.net was blocked during the build. Run `npm run fetch-quran` with internet access; until then Day 2 Bismillah and Day 5 Surah Al-Ikhlas rely entirely on the parent's own recitation.
- **No verified audio** for Qur'an/duas (`audioUrl` fields are reserved and null).
- **No meanings** for the Qur'anic verses (deliberately not authored).
- All Bengali text — lessons and UI — was written without native-speaker review. Islamic and Bengali lessons are flagged; the rest still deserve a proofread.
- One week only (25 lessons). There is nothing after Day 5.

## Untested
- **Real devices:** tested only in headless Chromium at 360×740 and 1280×800. Not tested on a physical budget Android phone, iOS Safari, Samsung Internet, or with system font-scaling turned up.
- **Text-to-speech:** headless Chromium has no voices, so only the fallback path ("parent reads aloud") is tested. Whether a Bengali voice exists depends on the phone (many Android phones have none unless Google TTS Bengali is installed).
- **Voice notes:** MediaRecorder path is not covered by automated tests (no microphone in headless); the "not supported / permission denied" messages are implemented but only manually reasoned about.
- **Camera capture** for offline photos uses `<input capture>`; tested with file upload only.
- No usability testing with an actual parent or child.
- No formal accessibility audit (contrast chosen for WCAG AA; screen-reader flow not tested).

## Known browser limits
- **Storage is per browser, per device.** Clearing site data, private/incognito mode, or iOS Safari's 7-day eviction of unused site data will erase progress. Export regularly during your test.
- **No notifications when the browser is closed.** Reminders are in-app only.
- **Screen time is counted only while the page is visible**; if the phone is locked mid-lesson, the clock stops (intended). If the browser kills the tab, up to ~1 s of time may be lost.
- Some emoji (🧱 brick, 🦇 bat, 🩺 stethoscope) need Android 9+; older phones show a box. Shapes use text glyphs to avoid this.
- Running two tabs at once is supported (they sync via the `storage` event) but not recommended during a lesson.
- Export does not include photo/voice bytes (only that one exists).
