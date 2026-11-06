// End-to-end checks with Playwright (plain Node script, no test runner).
// Usage: npm run build && npm run preview  (in another shell)  then  npm run e2e
// Env: BASE_URL (default http://localhost:4173), STAGE=day1|all (default all)
import { createRequire } from 'node:module';
// Uses the system Playwright if present (require resolves NODE_PATH); otherwise `npm i -D playwright`.
const { chromium } = createRequire(import.meta.url)('playwright');
import { mkdir } from 'node:fs/promises';

const BASE = process.env.BASE_URL ?? 'http://localhost:4173';
const STAGE = process.env.STAGE ?? 'all';
const SHOTS = new URL('./screenshots/', import.meta.url).pathname;
await mkdir(SHOTS, { recursive: true });

let failures = 0;
const results = [];
function check(name, cond, detail = '') {
  results.push(`${cond ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
  if (!cond) failures++;
}

const browser = await chromium.launch();

async function newPage(viewport) {
  const context = await browser.newContext({ viewport, acceptDownloads: true });
  const page = await context.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(BASE);
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem('noorani-ukg:test', '1');
  });
  await page.reload();
  return { page, context, errors };
}

const vis = (page, id) => page.getByTestId(id).first().isVisible().catch(() => false);

async function holdGate(page) {
  await page.getByTestId('gate-hold').waitFor();
  const box = await page.getByTestId('gate-hold').boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(3300);
  await page.mouse.up();
}

/** Play the child part. mode: 'correct' (first try) | 'wrong-first' (exercise retry/hint/simpler). */
async function playChild(page, mode = 'correct', maxSteps = 80) {
  for (let i = 0; i < maxSteps; i++) {
    if (await vis(page, 'child-finish')) return 'finish';
    if (await vis(page, 'break-screen')) return 'break';
    if (await vis(page, 'child-start')) {
      await page.getByTestId('child-start').click();
      continue;
    }
    if (await vis(page, 'question')) {
      if (await vis(page, 'confirm-step')) {
        await page.getByTestId('confirm-step').click();
        continue;
      }
      const revealedNext = page.getByTestId('question').getByTestId('child-next');
      if (await revealedNext.isVisible().catch(() => false)) {
        await revealedNext.click();
        continue;
      }
      const sel = mode === 'correct' ? '[data-testid=option][data-correct=true]' : '[data-testid=option][data-correct=false]';
      let opt = page.locator(sel).first();
      if (!(await opt.count())) opt = page.locator('[data-testid=option][data-correct=true]').first();
      await opt.click();
      continue;
    }
    if (await vis(page, 'child-next')) {
      await page.getByTestId('child-next').click();
      continue;
    }
    await page.waitForTimeout(100);
  }
  return 'stuck';
}

async function confirmOffline(page, lessonId, note) {
  const card = page.getByTestId(`lesson-${lessonId}`);
  await card.getByTestId('offline-start').click();
  await page.waitForTimeout(1200);
  await card.getByTestId('offline-done').click();
  if (note) await card.getByTestId('offline-note').fill(note);
  await card.getByTestId('offline-save').click();
}

async function status(page, lessonId, expect) {
  const loc = page.getByTestId(`lesson-${lessonId}`).getByTestId('lesson-status');
  for (let i = 0; i < 30; i++) {
    const txt = await loc.innerText().catch(() => '');
    if (!expect || txt.includes(expect)) return txt;
    await page.waitForTimeout(100);
  }
  return loc.innerText().catch(() => '');
}

async function setLang(page, lang) {
  await page.getByTestId('open-settings').click();
  await page.getByTestId(`lang-${lang}`).click();
  await page.getByTestId('settings-close').click();
}

// ---------------------------------------------------------------- Day 1 end to end
for (const viewport of [
  { width: 360, height: 740 },
  { width: 1280, height: 800 },
]) {
  const tag = `${viewport.width}x${viewport.height}`;
  const { page, context, errors } = await newPage(viewport);

  check(`[${tag}] Bengali is default UI`, (await page.getByTestId('tab-today').innerText()).includes('আজকের শেখা'));
  check(`[${tag}] footer disclaimer`, (await page.getByTestId('footer').innerText()).includes('NCF-FS 2022'));
  check(`[${tag}] Day 1 shows 5 lessons`, (await page.locator('[data-testid^=lesson-d1-]').count()) === 5);
  check(`[${tag}] needs-review badges on Bengali + Islamic`, (await page.getByTestId('lesson-d1-bengali').getByTestId('needs-review').count()) === 1 && (await page.getByTestId('lesson-d1-islamic').getByTestId('needs-review').count()) === 1 && (await page.getByTestId('lesson-d1-maths').getByTestId('needs-review').count()) === 0);
  await page.screenshot({ path: `${SHOTS}${tag}-today-bn.png`, fullPage: true });

  // Maths in Bengali, with wrong answers to exercise the adaptive rules
  await page.getByTestId('lesson-d1-maths').getByTestId('lesson-start').click();
  check(`[${tag}] child mode opens`, await vis(page, 'child-mode'));
  check(`[${tag}] no bottom nav in child mode`, !(await vis(page, 'tab-today')));
  await page.getByTestId('child-start').click();
  await page.getByTestId('child-next').click();
  await page.screenshot({ path: `${SHOTS}${tag}-child-explain.png` });
  // reach first question
  while (!(await vis(page, 'question'))) await page.getByTestId('child-next').click();
  check(`[${tag}] TTS fallback cue shown when no voice`, (await vis(page, 'parent-reads-cue')) || (await vis(page, 'tts-button')));
  // wrong ×2 → hint
  await page.locator('[data-testid=option][data-correct=false]').first().click();
  check(`[${tag}] wrong #1 → try again`, (await page.getByTestId('feedback').getAttribute('data-feedback')) === 'tryAgain');
  await page.locator('[data-testid=option][data-correct=false]').first().click();
  check(`[${tag}] wrong #2 → hint`, await vis(page, 'hint'));
  await page.screenshot({ path: `${SHOTS}${tag}-child-hint.png` });
  await page.locator('[data-testid=option][data-correct=true]').first().click();
  check(`[${tag}] correct feedback`, (await page.getByTestId('feedback').getAttribute('data-feedback')) === 'correct');
  await page.getByTestId('question').getByTestId('child-next').click();

  // Refresh mid-lesson: timer and position survive
  await page.waitForTimeout(2500);
  const before = await page.evaluate(() => JSON.parse(localStorage.getItem('noorani-ukg:v1')));
  const qBefore = await page.getByTestId('question').getAttribute('data-question-id');
  await page.reload();
  check(`[${tag}] after refresh still in child mode`, await vis(page, 'child-mode'));
  const qAfter = await page.getByTestId('question').getAttribute('data-question-id');
  check(`[${tag}] after refresh same question`, qBefore === qAfter, `${qBefore} → ${qAfter}`);
  const after = await page.evaluate(() => JSON.parse(localStorage.getItem('noorani-ukg:v1')));
  check(`[${tag}] timer survived refresh`, after.progress['d1-maths'].activeMs >= before.progress['d1-maths'].activeMs && before.progress['d1-maths'].activeMs >= 2000, `${before.progress['d1-maths'].activeMs}ms`);

  // Pause → overlay → resume
  await page.getByTestId('child-pause').click();
  check(`[${tag}] pause overlay`, await vis(page, 'paused-overlay'));
  await page.getByTestId('child-resume').click();

  const r = await playChild(page, 'correct');
  check(`[${tag}] maths child part finished`, r === 'finish', r);
  await page.screenshot({ path: `${SHOTS}${tag}-child-finish.png` });
  await page.getByTestId('child-back').click();
  await holdGate(page);
  check(`[${tag}] parent gate returns to Today`, await vis(page, 'lesson-d1-maths'));
  check(`[${tag}] status waiting for parent`, (await status(page, 'd1-maths')).includes('অভিভাবকের'));
  check(`[${tag}] in-app reminder for pending offline`, await vis(page, 'reminder-offline'));
  await confirmOffline(page, 'd1-maths', 'প্রতিটি আপেল ছুঁয়ে গুনেছে');
  check(`[${tag}] maths done`, (await status(page, 'd1-maths')).includes('সম্পন্ন'));

  // Progress updates
  await page.getByTestId('tab-progress').click();
  check(`[${tag}] progress today 1/5`, (await page.getByTestId('progress-today-count').innerText()).includes('১/৫'));
  check(`[${tag}] observation listed`, (await page.getByTestId('observation').count()) === 1);
  check(`[${tag}] hint recorded → practise more`, await vis(page, 'practise-more'));
  await page.screenshot({ path: `${SHOTS}${tag}-progress-bn.png`, fullPage: true });
  await page.getByTestId('tab-today').click();

  // English lesson with English UI
  await setLang(page, 'en');
  check(`[${tag}] UI switched to English`, (await page.getByTestId('tab-today').innerText()).includes('Today'));
  await page.getByTestId('lesson-d1-english').getByTestId('lesson-start').click();
  const r2 = await playChild(page, 'correct');
  check(`[${tag}] english child part finished (en UI)`, r2 === 'finish', r2);
  await page.getByTestId('child-back').click();
  await holdGate(page);
  await confirmOffline(page, 'd1-english', '');
  check(`[${tag}] english done`, (await status(page, 'd1-english')) === 'Done');
  await page.screenshot({ path: `${SHOTS}${tag}-today-en.png`, fullPage: true });

  // Islamic lesson: placeholder never TTS; recite card visible
  await page.getByTestId('lesson-d1-islamic').getByTestId('lesson-start').click();
  await page.getByTestId('child-start').click();
  check(`[${tag}] Islamic shows parent-recites cue (no TTS)`, (await vis(page, 'parent-reads-cue')) && !(await vis(page, 'tts-button')));
  const r3 = await playChild(page, 'correct');
  check(`[${tag}] islamic child part finished`, r3 === 'finish', r3);
  await page.getByTestId('child-back').click();
  await holdGate(page);
  await confirmOffline(page, 'd1-islamic', '');

  // Islamic toggle off → hidden; on → history intact
  await page.getByTestId('open-settings').click();
  await page.getByTestId('islamic-toggle').click();
  await page.getByTestId('settings-close').click();
  check(`[${tag}] Islamic OFF hides lesson`, (await page.getByTestId('lesson-d1-islamic').count()) === 0);
  await page.getByTestId('tab-progress').click();
  check(`[${tag}] progress notes Islamic hidden`, await vis(page, 'islamic-hidden-note'));
  await page.getByTestId('tab-today').click();
  await page.getByTestId('open-settings').click();
  await page.getByTestId('islamic-toggle').click();
  await page.getByTestId('settings-close').click();
  check(`[${tag}] Islamic ON → lesson back with history`, (await status(page, 'd1-islamic')) === 'Done');

  // Founder view
  await page.goto(`${BASE}/?founder=1`);
  check(`[${tag}] founder view`, await vis(page, 'founder'));
  const row = await page.getByTestId('founder-row-d1-maths').innerText();
  check(`[${tag}] founder shows maths stuck/hints`, row.includes('d1m-q1'), row.replace(/\s+/g, ' '));
  await page.screenshot({ path: `${SHOTS}${tag}-founder.png`, fullPage: true });
  await page.goto(BASE);

  // Export
  await page.getByTestId('open-settings').click();
  const [download] = await Promise.all([page.waitForEvent('download'), page.getByTestId('export').click()]);
  const path = await download.path();
  const { readFile } = await import('node:fs/promises');
  const data = JSON.parse(await readFile(path, 'utf8'));
  check(`[${tag}] export has events + observations`, data.events.length > 10 && data.observations.length >= 1, `${data.events.length} events`);
  await page.getByTestId('settings-close').click();

  // Screen-time limit → break screen
  await page.evaluate(() => {
    const s = JSON.parse(localStorage.getItem('noorani-ukg:v1'));
    const d = new Date();
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    s.settings.screenLimitMin = 5;
    s.screenMs[key] = 5 * 60000 - 2500;
    localStorage.setItem('noorani-ukg:v1', JSON.stringify(s));
  });
  await page.reload();
  await page.getByTestId('lesson-d1-bengali').getByTestId('lesson-start').click();
  await page.waitForTimeout(4500);
  check(`[${tag}] screen limit triggers break screen`, await vis(page, 'break-screen'));
  await page.screenshot({ path: `${SHOTS}${tag}-break.png` });
  await page.getByTestId('child-back').click();
  await holdGate(page);
  check(`[${tag}] start disabled after limit`, await page.getByTestId('lesson-d1-bengali').getByTestId('lesson-start').isDisabled());

  // Reset
  await page.getByTestId('open-settings').click();
  await page.getByTestId('reset').click();
  await page.getByTestId('reset-confirm').click();
  check(`[${tag}] reset back to clean Day 1`, (await status(page, 'd1-maths', 'Not started')) === 'Not started');

  if (STAGE === 'all') {
    // Reschedule
    await page.getByTestId('lesson-d1-world').getByTestId('lesson-reschedule').click();
    await page.getByTestId('day-2').click();
    check(`[${tag}] reschedule moves lesson to Day 2`, (await page.getByTestId('lesson-d1-world').count()) === 1);
    await page.getByTestId('day-1').click();

    // Teacher demo
    await page.getByTestId('tab-teacher').click();
    check(`[${tag}] teacher demo banner`, (await page.getByTestId('teacher-banner').innerText()).includes('Demo'));
    await page.getByTestId('teacher-input').fill('Assalamu alaikum, test message');
    await page.getByTestId('teacher-send').click();
    await page.waitForTimeout(1300);
    check(`[${tag}] teacher message + demo reply`, (await page.getByTestId('message').count()) >= 3);
    await page.getByTestId('teacher-image').setInputFiles({ name: 'p.png', mimeType: 'image/png', buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64') });
    await page.getByTestId('image-preview').waitFor();
    check(`[${tag}] image preview`, await vis(page, 'image-preview'));
    await page.getByTestId('teacher-send').click();
    await page.waitForTimeout(300);
    await page.reload();
    await page.getByTestId('tab-teacher').click();
    await page.waitForTimeout(500);
    check(`[${tag}] teacher history persisted`, (await page.getByTestId('message').count()) >= 4);
    await page.screenshot({ path: `${SHOTS}${tag}-teacher.png`, fullPage: true });
  }

  check(`[${tag}] no console errors`, errors.length === 0, errors.join(' | '));
  await context.close();
}

// ---------------------------------------------------------------- Full week + adaptive
if (STAGE === 'all') {
  const { page, context, errors } = await newPage({ width: 360, height: 740 });
  await page.evaluate(() => {
    const s = { version: 1, settings: { lang: 'en', islamicOn: true, screenLimitMin: 40 } };
    localStorage.setItem('noorani-ukg:v1', JSON.stringify(s));
  });
  await page.reload();
  // Day 1 maths all first-try correct → Day 2 maths should get a "harder" suggestion
  for (let d = 1; d <= 5; d++) {
    await page.getByTestId(`day-${d}`).click();
    const ids = await page.locator('[data-testid^=lesson-d]').evaluateAll((els) => els.map((e) => e.dataset.testid.replace('lesson-', '')));
    check(`[week] Day ${d} has 5 lessons`, ids.length === 5, ids.join(','));
    for (const id of ids) {
      if (d === 2 && id === 'd2-maths') check('[week] adaptive suggestion shown for Day 2 maths', await page.getByTestId(`lesson-${id}`).getByTestId('suggestion').isVisible());
      await page.getByTestId(`lesson-${id}`).getByTestId('lesson-start').click();
      if (d === 2 && id === 'd2-maths') {
        await page.getByTestId('child-start').click();
        while (!(await vis(page, 'question'))) await page.getByTestId('child-next').click();
        check('[week] Day 2 maths starts with harder variant', (await page.getByTestId('question').getAttribute('data-variant')) === 'harder');
      }
      const r = await playChild(page, id === 'd3-english' ? 'wrong-first' : 'correct');
      check(`[week] ${id} child part`, r === 'finish', r);
      await page.getByTestId('child-back').click();
      await holdGate(page);
      const card = page.getByTestId(`lesson-${id}`);
      if (id === 'd3-english') check('[week] repeated wrong answers → simpler variant + extra offline practice', await card.getByTestId('extra-practice-parent').isVisible());
      await card.getByTestId('offline-done').click();
      await card.getByTestId('offline-save').click();
    }
    check(`[week] Day ${d} all done`, await vis(page, 'day-done'));
  }
  await page.getByTestId('tab-progress').click();
  check('[week] progress shows 5/5 for subjects', (await page.getByTestId('subject-maths').innerText()).includes('5/5'));
  await page.screenshot({ path: `${SHOTS}week-progress.png`, fullPage: true });
  check('[week] no console errors', errors.length === 0, errors.join(' | '));
  await context.close();
}

await browser.close();
console.log(results.join('\n'));
console.log(`\n${results.length - failures}/${results.length} checks passed`);
process.exit(failures ? 1 : 0);
