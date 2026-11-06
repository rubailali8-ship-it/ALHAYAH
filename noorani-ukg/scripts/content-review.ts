// Generates CONTENT_REVIEW.md from the lesson data: every needsReview item, its exact text and source.
// Run: npm run content-review
import { writeFileSync } from 'node:fs';
import { allLessons } from '../src/content';
import { quranMeta } from '../src/content/islamic/lessons';
import type { Bi, Lesson, Option, Question } from '../src/types/content';

const out: string[] = [];
const bi = (b: Bi) => `${b.bn}  \n  _EN:_ ${b.en}`;
const optText = (o: Option) => [o.visual, typeof o.label === 'string' ? o.label : o.label ? `${o.label.bn} / ${o.label.en}` : ''].filter(Boolean).join(' — ');

function question(q: Question, tag: string) {
  out.push(`- [ ] **${q.id}** (${tag}) — prompt: ${bi(q.prompt)}`);
  if (q.visual) out.push(`  - visual: \`${q.visual}\``);
  if (q.kind === 'choice') out.push(`  - options: ${q.options.map((o) => `${o.id === q.answer ? '✅ ' : ''}${optText(o)}`).join(' · ')}`);
  else out.push(`  - parent-confirmed step${q.textRefs?.length ? ` (shows text #${q.textRefs.map((i) => i + 1).join(', #')})` : ''}`);
  out.push(`  - hint: ${bi(q.hint)}`);
}

function lesson(l: Lesson) {
  out.push(`\n### ${l.id} — ${l.title.en}`, '', `**Reviewer:** ${l.kind === 'islamic' ? 'Alim / Qur\'an teacher' : 'Bengali teacher'}  `, `**Source:** ${l.source}`, '');
  out.push(`- [ ] Title: ${bi(l.title)}`, `- [ ] Objective: ${bi(l.objective)}`, `- [ ] Guide line: ${bi(l.guideLine)}`);
  l.explanation.forEach((e, i) => out.push(`- [ ] Explanation ${i + 1}: ${bi(e.text)}${e.visual ? `  \n  visual: \`${e.visual}\`` : ''}`));
  if (l.kind === 'islamic') {
    l.texts.forEach((t, i) => {
      out.push(`- [ ] **Arabic text #${i + 1}:** ${t.arabic ? `\`${t.arabic}\`` : `**${t.placeholder}** (not yet filled)`}`);
      if (t.transliteration) out.push(`  - transliteration: ${t.transliteration}`);
      out.push(`  - meaning: ${bi(t.meaning)}`, `  - reference: ${t.reference}`);
    });
  }
  l.interactiveQuestions.forEach((s) => {
    question(s.base, 'base');
    question(s.simpler, 'simpler');
    if (s.harder) question(s.harder, 'harder');
  });
  out.push(`- [ ] Offline activity: ${bi(l.offlineActivity.title)} — ${bi(l.offlineActivity.steps)}`);
  out.push(`- [ ] Extra practice: ${bi(l.offlineActivity.extraPractice)}`);
  out.push(`- [ ] Parent instructions: ${bi(l.parentInstructions)}`);
  out.push(`- [ ] Completion criteria: ${bi(l.completionCriteria)}`, `- [ ] Observation prompt: ${bi(l.observationPrompt)}`);
}

const review = allLessons.filter((l) => l.needsReview);
const islamic = review.filter((l) => l.kind === 'islamic');
const bengali = review.filter((l) => l.kind !== 'islamic');

out.push(
  '# Content review checklist',
  '',
  '_Generated from `src/content` by `npm run content-review` — do not edit by hand; edit the lesson files and regenerate._',
  '',
  `Items needing review: **${review.length} lessons** (${islamic.length} Islamic → alim, ${bengali.length} Bengali → Bengali teacher).`,
  '',
  "## Qur'anic text status",
  '',
  quranMeta.fetched
    ? `Fetched verbatim from Tanzil.net. Licence: ${quranMeta.license}`
    : "**NOT FETCHED.** Tanzil.net was blocked from the build environment. The app shows `[QURAN TEXT — INSERT FROM VERIFIED SOURCE]` for Qur'an 1:1 and 112:1–4. Run `npm run fetch-quran` on a machine with internet, then have the alim confirm the rendered text against a printed mushaf.",
  '',
  '## Hadith references to verify',
  '',
  '- [ ] Sahih al-Bukhari 5376 / Sahih Muslim 2022 — boy told to say Bismillah, eat with right hand, eat from what is near (used in d3-islamic).',
  '- [ ] Sahih al-Bukhari 6227 — greeting of Salam (used in d4-islamic).',
  '- [ ] Sahih Muslim 54 — spreading Salam (used in d4-islamic).',
  '- [ ] Reply wording "وَعَلَيْكُمُ السَّلَامُ" and transliterations (d4-islamic).',
  '- [ ] Bengali transliteration of Arabic letter names (আলিফ, বা, তা, ছা) — note: ث shown as "ছা" follows common Bengali madrasa convention; confirm preferred spelling.',
  '',
  '## Islamic lessons (reviewer: alim)',
);
islamic.forEach(lesson);
out.push('', '## Bengali lessons (reviewer: Bengali teacher)');
bengali.forEach(lesson);
out.push(
  '',
  '## Also worth a Bengali proofread (not flagged `needsReview`)',
  '',
  'All Bengali UI strings (`src/i18n/bn.ts`) and the Bengali lines of maths/English/world lessons were written without a native-speaker review. They are not flagged per the brief (only Bengali and Islamic lessons are), but a quick read-through by the same teacher is recommended.',
  '',
);
writeFileSync(new URL('../CONTENT_REVIEW.md', import.meta.url), out.join('\n'));
console.log(`CONTENT_REVIEW.md: ${review.length} lessons`);
