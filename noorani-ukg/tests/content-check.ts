// Structural checks on the curriculum. Run: npm run check:content
import { allLessons } from '../src/content';
import { QURAN_PLACEHOLDER } from '../src/content/islamic/lessons';

const errors: string[] = [];
const fail = (m: string) => errors.push(m);

if (allLessons.length !== 25) fail(`expected 25 lessons, got ${allLessons.length}`);
for (let d = 1; d <= 5; d++) {
  const day = allLessons.filter((l) => l.day === d);
  if (day.length !== 5) fail(`day ${d}: ${day.length} lessons`);
  if (day.filter((l) => l.kind === 'islamic').length !== 1) fail(`day ${d}: needs exactly 1 Islamic lesson`);
  const screen = day.reduce((a, l) => a + l.durationMin, 0);
  const offline = day.reduce((a, l) => a + l.offlineActivity.durationMin, 0);
  if (screen >= 25) fail(`day ${d}: planned screen ${screen} min ≥ 25`);
  if (screen + offline > 45 || screen + offline < 30) fail(`day ${d}: planned total ${screen + offline} min outside 30–45`);
  console.log(`Day ${d}: screen ${screen} min + offline ${offline} min = ${screen + offline} min`);
}
const ids = new Set<string>();
for (const l of allLessons) {
  if (ids.has(l.id)) fail(`duplicate lesson id ${l.id}`);
  ids.add(l.id);
  for (const k of ['title', 'objective', 'materials', 'parentInstructions', 'completionCriteria', 'observationPrompt', 'guideLine'] as const) {
    if (!l[k].bn?.trim() || !l[k].en?.trim()) fail(`${l.id}: missing ${k}`);
  }
  if (!l.source.trim()) fail(`${l.id}: missing source`);
  if ((l.kind === 'islamic' || l.subject === 'bengali') && !l.needsReview) fail(`${l.id}: must have needsReview`);
  if (l.kind === 'islamic' && l.tts !== false) fail(`${l.id}: Islamic lessons must disable TTS`);
  if (l.interactiveQuestions.length < 2) fail(`${l.id}: too few questions`);
  for (const set of l.interactiveQuestions) {
    if (!set.simpler) fail(`${l.id}: question without simpler variant`);
    for (const q of [set.base, set.simpler, set.harder].filter(Boolean)) {
      if (ids.has(q!.id)) fail(`duplicate question id ${q!.id}`);
      ids.add(q!.id);
      if (!q!.hint.bn || !q!.hint.en) fail(`${q!.id}: missing hint`);
      if (q!.kind === 'choice' && !q!.options.some((o) => o.id === q!.answer)) fail(`${q!.id}: answer not among options`);
      if (q!.kind === 'choice' && new Set(q!.options.map((o) => o.id)).size !== q!.options.length) fail(`${q!.id}: duplicate option ids`);
    }
  }
  if (l.kind === 'islamic') {
    for (const t of l.texts) {
      if (!t.reference) fail(`${l.id}: Arabic text without reference`);
      if (t.reference.startsWith("Qur'an") && t.arabic === null && t.placeholder !== QURAN_PLACEHOLDER) fail(`${l.id}: Qur'an placeholder missing`);
    }
  }
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`Content OK: ${allLessons.length} lessons, ${ids.size - allLessons.length} question variants.`);
