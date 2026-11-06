// Rule-based adaptive engine (demo). No AI, no statistics — a handful of
// transparent rules, each producing a one-line reason the parent can read and override.
//
// Rules:
//  R1  2 first-try-correct answers in a row (within a lesson) → next question uses the harder variant.
//  R2  Wrong attempts on one question: 1st → "try again"; 2nd → hint; 3rd → simpler variant
//      (and an extra offline practice is added); on the simpler variant, 3rd wrong → answer revealed gently.
//  R3  Across lessons, the most recent finished lesson of the same skill decides how the next one starts:
//      simpler variant was needed → start simpler + extra offline practice;
//      ≥2 first-try-correct answers and no simpler variant → start with the harder variant.
//  R4  Skill state: "comfortable" when ≥2 first-try-correct answers, ≥60% first-try rate and the
//      most recent lesson needed no hint and no simpler variant; otherwise "practising". Never negative labels,
//      never a numeric mastery score.
import type { Lesson, QuestionSet } from '../types/content';
import type { AppEvent, StartMode, Variant } from '../storage/state';

export type WrongAction = 'retry' | 'hint' | 'simpler' | 'reveal';

/** R2 — what to do after a wrong attempt. `attempts` = wrong attempts so far on this variant, including this one. */
export function onWrongAttempt(attempts: number, variant: Variant, set: QuestionSet): WrongAction {
  if (attempts <= 1) return 'retry';
  if (attempts === 2) return 'hint';
  return variant !== 'simpler' && set.simpler ? 'simpler' : 'reveal';
}

/** R1 + R3 — which variant to use for the question at `qIndex`. */
export function chooseVariant(qIndex: number, streak: number, set: QuestionSet, startMode?: StartMode): { variant: Variant; byRule: 'R1' | 'R3' | null } {
  if (qIndex === 0 && startMode === 'simpler') return { variant: 'simpler', byRule: 'R3' };
  if (qIndex === 0 && startMode === 'harder' && set.harder) return { variant: 'harder', byRule: 'R3' };
  if (streak >= 2 && set.harder) return { variant: 'harder', byRule: 'R1' };
  return { variant: 'base', byRule: null };
}

export interface Suggestion {
  lessonId: string;
  skill: string;
  mode: StartMode;
  /** Data for the one-line reason. */
  firstTryCorrect: number;
  basedOnLessonId: string;
}

interface LessonStats {
  lessonId: string;
  skill: string;
  firstTryCorrect: number;
  choiceAnswers: number;
  hints: number;
  simplerShown: number;
  finishedAt: number;
}

/** Stats for each lesson whose child part was finished, most recent attempt only. */
export function lessonStats(events: AppEvent[]): LessonStats[] {
  const out: LessonStats[] = [];
  // Track runs per lesson: each lesson_started opens a new run.
  const runs = new Map<string, LessonStats>();
  for (const e of events) {
    if (!e.lessonId) continue;
    if (e.type === 'lesson_started') {
      runs.set(e.lessonId, { lessonId: e.lessonId, skill: e.skill ?? '', firstTryCorrect: 0, choiceAnswers: 0, hints: 0, simplerShown: 0, finishedAt: 0 });
      continue;
    }
    const run = runs.get(e.lessonId);
    if (!run) continue;
    if (e.type === 'answer_submitted' && e.data?.kind === 'choice') {
      if (e.data.attempt === 1) run.choiceAnswers += 1;
      if (e.data.correct && e.data.attempt === 1) run.firstTryCorrect += 1;
    } else if (e.type === 'hint_used') run.hints += 1;
    else if (e.type === 'simpler_shown') run.simplerShown += 1;
    else if (e.type === 'lesson_child_done') {
      run.finishedAt = e.ts;
      const idx = out.findIndex((s) => s.lessonId === run.lessonId);
      if (idx >= 0) out.splice(idx, 1);
      out.push({ ...run });
    }
  }
  return out.sort((a, b) => a.finishedAt - b.finishedAt);
}

/** R3 — suggestion for how `lesson` should start, or null. */
export function suggestionFor(lesson: Lesson, events: AppEvent[]): Suggestion | null {
  const prior = lessonStats(events).filter((s) => s.skill === lesson.skill && s.lessonId !== lesson.id);
  const last = prior[prior.length - 1];
  if (!last) return null;
  if (last.simplerShown > 0) {
    return { lessonId: lesson.id, skill: lesson.skill, mode: 'simpler', firstTryCorrect: last.firstTryCorrect, basedOnLessonId: last.lessonId };
  }
  const hasHarder = lesson.interactiveQuestions[0]?.harder;
  if (last.firstTryCorrect >= 2 && hasHarder) {
    return { lessonId: lesson.id, skill: lesson.skill, mode: 'harder', firstTryCorrect: last.firstTryCorrect, basedOnLessonId: last.lessonId };
  }
  return null;
}

export type SkillState = 'practising' | 'comfortable';

export interface SkillSummary {
  skill: string;
  state: SkillState;
  firstTryCorrect: number;
  choiceAnswers: number;
  hints: number;
  simplerShown: number;
  lessons: number;
}

/** R4 — per-skill state from the event log (only skills with recorded activity). */
export function skillSummaries(events: AppEvent[]): SkillSummary[] {
  const map = new Map<string, SkillSummary & { lastHelp: number }>();
  for (const s of lessonStats(events)) {
    const cur = map.get(s.skill) ?? { skill: s.skill, state: 'practising' as SkillState, firstTryCorrect: 0, choiceAnswers: 0, hints: 0, simplerShown: 0, lessons: 0, lastHelp: 0 };
    cur.firstTryCorrect += s.firstTryCorrect;
    cur.choiceAnswers += s.choiceAnswers;
    cur.hints += s.hints;
    cur.simplerShown += s.simplerShown;
    cur.lessons += 1;
    cur.lastHelp = s.simplerShown + s.hints;
    map.set(s.skill, cur);
  }
  return [...map.values()].map(({ lastHelp, ...s }) => ({
    ...s,
    state:
      s.firstTryCorrect >= 2 && s.choiceAnswers > 0 && s.firstTryCorrect / s.choiceAnswers >= 0.6 && lastHelp === 0
        ? 'comfortable'
        : 'practising',
  }));
}
