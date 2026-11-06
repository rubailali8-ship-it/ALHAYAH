// All state mutations. Each meaningful action appends to the event log,
// which is the single source of truth for the Progress and Founder screens.
import { allLessons, lessonById } from '../content';
import { chooseVariant, onWrongAttempt, suggestionFor } from '../engine/adaptive';
import type { Lesson, Question } from '../types/content';
import { clearMedia } from './media';
import {
  type AppEvent,
  type AppState,
  type EventType,
  type LessonProgress,
  type LessonStatus,
  type Session,
  type Settings,
  type Variant,
  defaultState,
  getState,
  replaceState,
  setState,
  todayKey,
  uid,
} from './state';

const emptyProgress = (): LessonProgress => ({ started: false, activeMs: 0, childDone: false, offlineDone: false });

export function effectiveDay(s: AppState, lessonId: string): number {
  return s.reschedules[lessonId] ?? lessonById[lessonId]?.day ?? 1;
}

export function lessonStatus(s: AppState, lessonId: string): LessonStatus {
  const p = s.progress[lessonId];
  if (!p) return 'not_started';
  if (p.childDone && p.offlineDone) return 'done';
  if (p.childDone) return 'awaiting_parent';
  if (p.started || p.offlineDone) return 'in_progress';
  return 'not_started';
}

export function visibleLessons(s: AppState, day: number): Lesson[] {
  return allLessons.filter((l) => effectiveDay(s, l.id) === day && (s.settings.islamicOn || l.kind !== 'islamic'));
}

export const screenUsedMs = (s: AppState) => s.screenMs[todayKey()] ?? 0;
export const screenLimitMs = (s: AppState) => s.settings.screenLimitMin * 60_000;
export const screenLimitReached = (s: AppState) => screenUsedMs(s) >= screenLimitMs(s);

function withEvent(s: AppState, type: EventType, fields: Partial<AppEvent> = {}): AppState {
  const lesson = fields.lessonId ? lessonById[fields.lessonId] : undefined;
  const ev: AppEvent = {
    id: uid(),
    ts: Date.now(),
    type,
    day: fields.day ?? (lesson ? effectiveDay(s, lesson.id) : s.selectedDay),
    date: todayKey(),
    skill: fields.skill ?? lesson?.skill,
    ...fields,
  };
  return { ...s, events: [...s.events, ev] };
}

function patchProgress(s: AppState, lessonId: string, patch: Partial<LessonProgress>): AppState {
  return { ...s, progress: { ...s.progress, [lessonId]: { ...(s.progress[lessonId] ?? emptyProgress()), ...patch } } };
}

/** Lesson is complete once both the child part and the offline activity are done. */
function maybeComplete(s: AppState, lessonId: string): AppState {
  const p = s.progress[lessonId];
  if (p?.childDone && p.offlineDone && !s.events.some((e) => e.type === 'lesson_completed' && e.lessonId === lessonId)) {
    return withEvent(s, 'lesson_completed', { lessonId, data: { activeMs: p.activeMs } });
  }
  return s;
}

export const currentQuestion = (session: Session): Question | undefined => {
  const set = lessonById[session.lessonId]?.interactiveQuestions[session.qIndex];
  return set ? (set[session.variant] ?? set.base) : undefined;
};

// ---------- settings ----------

export function updateSettings(patch: Partial<Settings>) {
  setState((s) => withEvent({ ...s, settings: { ...s.settings, ...patch } }, 'settings_changed', { data: patch }));
}

export function selectDay(day: number) {
  setState((s) => ({ ...s, selectedDay: day }));
}

// ---------- lesson lifecycle ----------

/** Start or resume a lesson in child mode. */
export function openLesson(lessonId: string) {
  setState((s) => {
    const lesson = lessonById[lessonId];
    if (!lesson) return s;
    if (s.session?.lessonId === lessonId && s.session.stage !== 'finish') {
      const resumed = { ...s, childMode: true, session: { ...s.session, paused: false } };
      return withEvent(resumed, 'lesson_resumed', { lessonId });
    }
    const sug = s.overrides[lessonId] ? null : suggestionFor(lesson, s.events);
    const session: Session = {
      lessonId,
      stage: 'intro',
      step: 0,
      qIndex: 0,
      variant: 'base',
      attempts: 0,
      hintShown: false,
      revealed: false,
      streak: 0,
      paused: false,
      startMode: sug?.mode,
      feedback: null,
      wrongIds: [],
    };
    let next: AppState = { ...s, session, childMode: true };
    next = patchProgress(next, lessonId, { started: true, ...(sug?.mode === 'simpler' ? { extraPractice: true } : {}) });
    return withEvent(next, 'lesson_started', { lessonId, data: { startMode: sug?.mode ?? 'base' } });
  });
}

export function pauseLesson() {
  setState((s) => (s.session ? withEvent({ ...s, session: { ...s.session, paused: true } }, 'lesson_paused', { lessonId: s.session.lessonId, data: { activeMs: s.progress[s.session.lessonId]?.activeMs ?? 0 } }) : s));
}

export function resumeLesson() {
  setState((s) => (s.session ? withEvent({ ...s, session: { ...s.session, paused: false } }, 'lesson_resumed', { lessonId: s.session.lessonId }) : s));
}

/** Leave child mode (after the parent gate). An unfinished lesson is paused, not lost. */
export function exitChildMode() {
  setState((s) => {
    if (!s.session) return { ...s, childMode: false };
    const finished = s.session.stage === 'finish';
    let next: AppState = { ...s, childMode: false, session: finished ? null : { ...s.session, paused: true } };
    next = withEvent(next, 'child_mode_exited', { lessonId: s.session.lessonId, data: { activeMs: s.progress[s.session.lessonId]?.activeMs ?? 0, stage: s.session.stage } });
    return next;
  });
}

/** Called every second by the child player while it is visible and running. */
export function tick(deltaMs: number) {
  setState((s) => {
    if (!s.session || s.session.paused) return s;
    const id = s.session.lessonId;
    const key = todayKey();
    const before = s.screenMs[key] ?? 0;
    const after = before + deltaMs;
    let next = patchProgress(s, id, { activeMs: (s.progress[id]?.activeMs ?? 0) + deltaMs });
    next = { ...next, screenMs: { ...next.screenMs, [key]: after } };
    const limit = screenLimitMs(s);
    if (before < limit && after >= limit) next = withEvent(next, 'break_shown', { lessonId: id, data: { screenMs: after, limitMin: s.settings.screenLimitMin } });
    return next;
  });
}

function setSession(s: AppState, patch: Partial<Session>): AppState {
  return s.session ? { ...s, session: { ...s.session, ...patch } } : s;
}

export function advanceIntro() {
  setState((s) => {
    const lesson = s.session && lessonById[s.session.lessonId];
    if (!s.session || !lesson) return s;
    if (s.session.stage === 'intro') return setSession(s, { stage: lesson.explanation.length ? 'explain' : 'question', step: 0 });
    if (s.session.stage === 'explain') {
      if (s.session.step + 1 < lesson.explanation.length) return setSession(s, { step: s.session.step + 1 });
      return startQuestion(s, 0);
    }
    return s;
  });
}

function startQuestion(s: AppState, qIndex: number): AppState {
  const session = s.session!;
  const lesson = lessonById[session.lessonId];
  const set = lesson.interactiveQuestions[qIndex];
  if (!set) return finishChildPart(s);
  const { variant, byRule } = chooseVariant(qIndex, session.streak, set, session.startMode);
  let next = setSession(s, { stage: 'question', qIndex, variant, attempts: 0, hintShown: false, revealed: false, feedback: byRule === 'R1' ? 'harder' : null, wrongIds: [] });
  const q = set[variant] ?? set.base;
  if (variant === 'harder') next = withEvent(next, 'harder_offered', { lessonId: lesson.id, questionId: q.id, data: { rule: byRule, streak: session.streak } });
  if (variant === 'simpler' && byRule === 'R3') next = withEvent(next, 'simpler_shown', { lessonId: lesson.id, questionId: q.id, data: { rule: 'R3' } });
  return next;
}

function finishChildPart(s: AppState): AppState {
  const id = s.session!.lessonId;
  let next = setSession(s, { stage: 'finish', feedback: null });
  next = patchProgress(next, id, { childDone: true });
  next = withEvent(next, 'lesson_child_done', { lessonId: id, data: { activeMs: next.progress[id].activeMs } });
  return maybeComplete(next, id);
}

/** Child picked an option (choice question). Returns whether it was correct. */
export function answerChoice(optionId: string): boolean {
  let correct = false;
  setState((s) => {
    const session = s.session;
    if (!session || session.revealed) return s;
    const lesson = lessonById[session.lessonId];
    const set = lesson.interactiveQuestions[session.qIndex];
    const q = currentQuestion(session);
    if (!q || q.kind !== 'choice') return s;
    correct = optionId === q.answer;
    const attempt = session.attempts + 1;
    let next = withEvent(s, 'answer_submitted', {
      lessonId: lesson.id,
      questionId: q.id,
      skill: set.skill,
      data: { kind: 'choice', correct, attempt, variant: session.variant, chosen: optionId },
    });
    if (correct) {
      const streak = session.attempts === 0 ? session.streak + 1 : 0;
      return setSession(next, { streak, feedback: 'correct', revealed: true });
    }
    const action = onWrongAttempt(attempt, session.variant, set);
    const wrongIds = [...session.wrongIds, optionId];
    if (action === 'retry') return setSession(next, { attempts: attempt, streak: 0, feedback: 'tryAgain', wrongIds });
    if (action === 'hint') {
      next = withEvent(next, 'hint_used', { lessonId: lesson.id, questionId: q.id, skill: set.skill });
      return setSession(next, { attempts: attempt, streak: 0, hintShown: true, feedback: 'tryAgain', wrongIds });
    }
    if (action === 'simpler') {
      next = withEvent(next, 'simpler_shown', { lessonId: lesson.id, questionId: set.simpler.id, skill: set.skill, data: { rule: 'R2', from: q.id } });
      next = patchProgress(next, lesson.id, { extraPractice: true });
      return setSession(next, { variant: 'simpler', attempts: 0, hintShown: false, streak: 0, feedback: 'simpler', wrongIds: [] });
    }
    // reveal
    next = patchProgress(next, lesson.id, { extraPractice: true });
    return setSession(next, { attempts: attempt, streak: 0, feedback: 'reveal', revealed: true, wrongIds });
  });
  return correct;
}

/** Parent confirmed an out-loud / hands-on step. */
export function confirmStep() {
  setState((s) => {
    const session = s.session;
    const q = session && currentQuestion(session);
    if (!session || !q) return s;
    const set = lessonById[session.lessonId].interactiveQuestions[session.qIndex];
    const next = withEvent(s, 'answer_submitted', {
      lessonId: session.lessonId,
      questionId: q.id,
      skill: set.skill,
      data: { kind: 'parent_confirm', correct: true, attempt: 1, variant: session.variant },
    });
    return startQuestion(next, session.qIndex + 1);
  });
}

export function switchToSimplerConfirm() {
  setState((s) => {
    const session = s.session;
    if (!session) return s;
    const set = lessonById[session.lessonId].interactiveQuestions[session.qIndex];
    let next = withEvent(s, 'simpler_shown', { lessonId: session.lessonId, questionId: set.simpler.id, skill: set.skill, data: { rule: 'parent' } });
    next = patchProgress(next, session.lessonId, { extraPractice: true });
    return setSession(next, { variant: 'simpler', feedback: 'simpler' });
  });
}

export function showHint() {
  setState((s) => {
    const session = s.session;
    const q = session && currentQuestion(session);
    if (!session || !q || session.hintShown) return s;
    return setSession(withEvent(s, 'hint_used', { lessonId: session.lessonId, questionId: q.id, data: { manual: true } }), { hintShown: true });
  });
}

export function nextQuestion() {
  setState((s) => (s.session ? startQuestion(s, s.session.qIndex + 1) : s));
}

// ---------- offline activity / parent ----------

export function startOffline(lessonId: string) {
  setState((s) => withEvent(patchProgress(s, lessonId, { offlineStartedAt: Date.now() }), 'offline_started', { lessonId }));
}

export function confirmOffline(lessonId: string, note: string, photoKey?: string) {
  setState((s) => {
    const p = s.progress[lessonId];
    const lesson = lessonById[lessonId];
    const durationMs = p?.offlineStartedAt ? Math.min(Date.now() - p.offlineStartedAt, 60 * 60_000) : null;
    let next = patchProgress(s, lessonId, { offlineDone: true, offlineStartedAt: undefined });
    next = withEvent(next, 'offline_confirmed', {
      lessonId,
      data: { durationMs, plannedMin: lesson.offlineActivity.durationMin, hasNote: !!note.trim(), hasPhoto: !!photoKey, extraPractice: !!p?.extraPractice },
    });
    if (note.trim() || photoKey) {
      const obs = { id: uid(), ts: Date.now(), lessonId, day: effectiveDay(s, lessonId), text: note.trim(), photoKey };
      next = withEvent({ ...next, observations: [...next.observations, obs] }, 'observation_added', { lessonId, data: { observationId: obs.id, text: obs.text, hasPhoto: !!photoKey } });
    }
    return maybeComplete(next, lessonId);
  });
}

export function reschedule(lessonId: string) {
  setState((s) => {
    const from = effectiveDay(s, lessonId);
    if (from >= 5) return s;
    const next = { ...s, reschedules: { ...s.reschedules, [lessonId]: from + 1 } };
    return withEvent(next, 'lesson_rescheduled', { lessonId, day: from, data: { from, to: from + 1 } });
  });
}

export function setOverride(lessonId: string, overridden: boolean) {
  setState((s) => {
    const overrides = { ...s.overrides };
    if (overridden) overrides[lessonId] = true;
    else delete overrides[lessonId];
    return withEvent({ ...s, overrides }, overridden ? 'suggestion_overridden' : 'suggestion_restored', { lessonId });
  });
}

// ---------- founder tools ----------

export async function resetDemo() {
  try {
    await clearMedia();
  } catch {
    /* IndexedDB unavailable */
  }
  const lang = getState().settings.lang;
  const fresh = defaultState();
  fresh.settings.lang = lang;
  replaceState(fresh);
}

export function exportData() {
  const s = getState();
  const payload = {
    exportedAt: new Date().toISOString(),
    app: 'Noorani UKG prototype (demo, fictional data)',
    child: { name: 'Aisha', age: 5, parent: 'Rahima', fictional: true },
    settings: s.settings,
    events: s.events,
    observations: s.observations.map((o) => ({ ...o, photo: o.photoKey ? 'stored in IndexedDB (not exported)' : null })),
    progress: s.progress,
    screenMsByDate: s.screenMs,
    reschedules: s.reschedules,
    overrides: s.overrides,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `noorani-ukg-export-${todayKey()}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export type { Variant };
