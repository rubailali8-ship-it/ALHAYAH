// Content schema. Academic and Islamic lessons share a small base but are
// separate types living in separate folders (src/content/academic, src/content/islamic).

export type Lang = 'bn' | 'en';
export type Bi = { bn: string; en: string };

export type AcademicSubject = 'maths' | 'english' | 'bengali' | 'world';
export type Subject = AcademicSubject | 'islamic';

/** Which language a line of child-facing text is written in, for TTS and fonts. */
export type TextLang = 'bn' | 'en' | 'ar';

export interface Option {
  id: string;
  /** Large visual shown on the button (emoji, letter, numeral). */
  visual?: string;
  /** Optional caption. Plain string = same in all UI languages. */
  label?: string | Bi;
  /** Font hint for the visual (Arabic letters need the Arabic font). */
  visualLang?: TextLang;
}

interface QuestionBase {
  id: string;
  /** Child-facing prompt. */
  prompt: Bi;
  /** Big visual shown above the options (e.g. "🍎🍎🍎"). */
  visual?: string;
  visualLang?: TextLang;
  /** Hint shown after 2 wrong attempts. */
  hint: Bi;
}

export interface ChoiceQuestion extends QuestionBase {
  kind: 'choice';
  options: Option[];
  /** Answer validation: id of the correct option. */
  answer: string;
}

/**
 * A step the child does out loud / with hands, confirmed by the parent.
 * Used where a screen cannot validate (saying a sound, reciting with a parent).
 */
export interface ParentConfirmQuestion extends QuestionBase {
  kind: 'parent_confirm';
  /** Indexes into IslamicLesson.texts to show for the parent to recite during this step. */
  textRefs?: number[];
}

export type Question = ChoiceQuestion | ParentConfirmQuestion;

export interface QuestionSet {
  skill: string;
  base: Question;
  /** Easier variant used by the adaptive engine after repeated wrong attempts. */
  simpler: Question;
  /** Harder variant offered after 2 first-try correct answers in a row. */
  harder?: Question;
}

export interface ExplanationStep {
  text: Bi;
  visual?: string;
  visualLang?: TextLang;
}

export interface OfflineActivity {
  title: Bi;
  steps: Bi;
  durationMin: number;
  /** Extra practice added by the adaptive engine when the simpler variant was needed. */
  extraPractice: Bi;
}

export interface LessonBase {
  id: string;
  subject: Subject;
  day: 1 | 2 | 3 | 4 | 5;
  title: Bi;
  objective: Bi;
  materials: Bi;
  difficulty: 1 | 2 | 3;
  /** Planned on-screen minutes for the child part. */
  durationMin: number;
  /** Main skill this lesson practises (used by the adaptive engine). */
  skill: string;
  /**
   * Language the child-facing content is primarily taught in.
   * English lessons teach in English with Bengali parent support, Bengali lessons in Bengali.
   * Undefined = follow the UI language.
   */
  teachLang?: Lang;
  /** Scripted line from the guide character at lesson start. */
  guideLine: Bi;
  explanation: ExplanationStep[];
  interactiveQuestions: QuestionSet[];
  offlineActivity: OfflineActivity;
  parentInstructions: Bi;
  completionCriteria: Bi;
  observationPrompt: Bi;
  needsReview: boolean;
  source: string;
}

export interface AcademicLesson extends LessonBase {
  kind: 'academic';
  subject: AcademicSubject;
}

export interface ArabicText {
  /** Exact Arabic text, or null when it must come from a verified source that was unavailable. */
  arabic: string | null;
  /** Shown instead of the text when `arabic` is null. */
  placeholder?: string;
  transliteration?: string;
  meaning: Bi;
  reference: string;
  /** Reserved for a future verified recording. TTS is never used for these. */
  audioUrl: string | null;
}

export interface IslamicLesson extends LessonBase {
  kind: 'islamic';
  subject: 'islamic';
  /** Islamic content is never spoken by text-to-speech. */
  tts: false;
  /** Duas / Qur'anic text shown for the parent to recite. */
  texts: ArabicText[];
}

export type Lesson = AcademicLesson | IslamicLesson;
