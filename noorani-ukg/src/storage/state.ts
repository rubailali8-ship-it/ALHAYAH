// App state: preferences + progress + event log, persisted to localStorage.
// Media (photos, voice notes, teacher messages) lives in IndexedDB (see media.ts).
import { useSyncExternalStore } from 'react';
import type { Lang } from '../types/content';

export type Variant = 'base' | 'harder' | 'simpler';
export type StartMode = 'harder' | 'simpler';
export type LessonStatus = 'not_started' | 'in_progress' | 'awaiting_parent' | 'done';

export interface LessonProgress {
  started: boolean;
  /** Active on-screen milliseconds in child mode (only counted while visible and not paused). */
  activeMs: number;
  childDone: boolean;
  offlineDone: boolean;
  offlineStartedAt?: number;
  /** Set by the adaptive engine when the simpler variant was needed. */
  extraPractice?: boolean;
}

export type Stage = 'intro' | 'explain' | 'question' | 'finish';

export interface Session {
  lessonId: string;
  stage: Stage;
  step: number;
  qIndex: number;
  variant: Variant;
  attempts: number;
  hintShown: boolean;
  revealed: boolean;
  /** First-try-correct answers in a row (choice questions only). */
  streak: number;
  paused: boolean;
  startMode?: StartMode;
  /** Short feedback message key shown to the child. */
  feedback?: 'correct' | 'tryAgain' | 'simpler' | 'harder' | 'reveal' | null;
  wrongIds: string[];
}

export type EventType =
  | 'lesson_started'
  | 'lesson_paused'
  | 'lesson_resumed'
  | 'answer_submitted'
  | 'hint_used'
  | 'simpler_shown'
  | 'harder_offered'
  | 'lesson_child_done'
  | 'offline_started'
  | 'offline_confirmed'
  | 'observation_added'
  | 'lesson_completed'
  | 'break_shown'
  | 'lesson_rescheduled'
  | 'suggestion_overridden'
  | 'suggestion_restored'
  | 'child_mode_exited'
  | 'settings_changed';

export interface AppEvent {
  id: string;
  ts: number;
  type: EventType;
  /** Curriculum day (1–5) the event belongs to. */
  day: number;
  /** Calendar date (YYYY-MM-DD, local). */
  date: string;
  lessonId?: string;
  questionId?: string;
  skill?: string;
  data?: Record<string, unknown>;
}

export interface Observation {
  id: string;
  ts: number;
  lessonId: string;
  day: number;
  text: string;
  photoKey?: string;
}

export interface Settings {
  lang: Lang;
  islamicOn: boolean;
  screenLimitMin: number;
}

export interface AppState {
  version: 1;
  settings: Settings;
  selectedDay: number;
  progress: Record<string, LessonProgress>;
  session: Session | null;
  childMode: boolean;
  /** Screen milliseconds per calendar date. */
  screenMs: Record<string, number>;
  events: AppEvent[];
  observations: Observation[];
  /** lessonId → curriculum day it was moved to. */
  reschedules: Record<string, number>;
  /** lessonId → true when the parent overrode the rule-based suggestion. */
  overrides: Record<string, boolean>;
}

export const STORAGE_KEY = 'noorani-ukg:v1';

export const defaultState = (): AppState => ({
  version: 1,
  settings: { lang: 'bn', islamicOn: true, screenLimitMin: 25 },
  selectedDay: 1,
  progress: {},
  session: null,
  childMode: false,
  screenMs: {},
  events: [],
  observations: [],
  reschedules: {},
  overrides: {},
});

function load(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as Partial<AppState>;
    if (parsed.version !== 1) return defaultState();
    const d = defaultState();
    return { ...d, ...parsed, settings: { ...d.settings, ...parsed.settings } };
  } catch {
    return defaultState();
  }
}

let state: AppState = load();
const listeners = new Set<() => void>();

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    // Storage full or blocked: keep working in memory.
    console.warn('Could not save progress', err);
  }
}

export function getState(): AppState {
  return state;
}

export function setState(update: (s: AppState) => AppState) {
  state = update(state);
  persist();
  listeners.forEach((l) => l());
}

export function replaceState(next: AppState) {
  state = next;
  persist();
  listeners.forEach((l) => l());
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useAppState<T>(selector: (s: AppState) => T): T {
  return useSyncExternalStore(subscribe, () => selector(state));
}

// Keep tabs in sync if the app is open twice.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
      state = load();
      listeners.forEach((l) => l());
    }
  });
}

export const todayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
