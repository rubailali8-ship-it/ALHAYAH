import { useEffect, useRef, useState } from 'react';
import { lessonById } from '../content';
import { QURAN_PLACEHOLDER } from '../content/islamic/lessons';
import { useT } from '../i18n';
import { playCorrect, playTryAgain } from '../lib/sound';
import { hasVoice, onVoicesChanged, speak, stopSpeaking } from '../lib/tts';
import {
  advanceIntro,
  answerChoice,
  confirmStep,
  currentQuestion,
  exitChildMode,
  nextQuestion,
  pauseLesson,
  resumeLesson,
  screenLimitReached,
  showHint,
  switchToSimplerConfirm,
  tick,
} from '../storage/actions';
import { useAppState } from '../storage/state';
import type { ArabicText, Bi, IslamicLesson, Lang, Lesson } from '../types/content';
import { Visual } from '../components/ui';
import { ParentGate } from './ParentGate';

const GUIDE = '🦜';

// Automated tests set this flag to read the correct option from the DOM. Off for real use.
const TEST_MODE = (() => {
  try {
    return localStorage.getItem('noorani-ukg:test') === '1';
  } catch {
    return false;
  }
})();

function useVoices() {
  const [, force] = useState(0);
  useEffect(() => onVoicesChanged(() => force((n) => n + 1)), []);
}

/** Primary (child-facing) and support (parent) language for a lesson. */
function langsFor(lesson: Lesson, ui: Lang): { primary: Lang; support: Lang | null } {
  if (lesson.teachLang === 'en') return { primary: 'en', support: 'bn' };
  if (lesson.teachLang === 'bn') return { primary: 'bn', support: ui === 'en' ? 'en' : null };
  return { primary: ui, support: null };
}

function SpokenText({ text, lesson, big = false, testId }: { text: Bi; lesson: Lesson; big?: boolean; testId?: string }) {
  const { t, lang } = useT();
  useVoices();
  const { primary, support } = langsFor(lesson, lang);
  const isIslamic = lesson.kind === 'islamic';
  const canSpeak = !isIslamic && hasVoice(primary);
  const line = text[primary];
  const lastSpoken = useRef('');

  useEffect(() => {
    if (canSpeak && lastSpoken.current !== line) {
      lastSpoken.current = line;
      speak(line, primary);
    }
  }, [canSpeak, line, primary]);

  return (
    <div className="text-center" data-testid={testId}>
      <p lang={primary} className={`${primary === 'bn' ? 'font-bn leading-[1.7]' : 'leading-snug'} ${big ? 'text-2xl' : 'text-xl'} font-semibold text-ink`}>
        {line}
      </p>
      {support && (
        <p lang={support} className={`mt-1 text-sm text-muted ${support === 'bn' ? 'font-bn leading-[1.7]' : ''}`}>
          <span className="font-semibold">{t('player.parentSupport')}:</span> {text[support]}
        </p>
      )}
      <div className="mt-2 flex justify-center">
        {canSpeak ? (
          <button type="button" onClick={() => speak(line, primary)} className="min-h-[44px] rounded-full bg-sky-50 px-4 text-sm font-semibold text-sky-600" data-testid="tts-button">
            🔊 {t('player.listen')}
          </button>
        ) : (
          <span className="rounded-full bg-sun-50 px-3 py-1 text-xs font-semibold text-sun-600" data-testid="parent-reads-cue">
            🗣️ {isIslamic ? t('player.parentRecites') : t('player.parentReads')}
          </span>
        )}
      </div>
    </div>
  );
}

function ReciteCard({ texts }: { texts: ArabicText[] }) {
  const { t, pick } = useT();
  if (!texts.length) return null;
  return (
    <div className="mt-4 rounded-2xl border border-sage-200 bg-sage-50 p-4 text-left" data-testid="recite-card">
      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-sage-700">📖 {t('player.textToRecite')}</p>
      {texts.map((x, i) => (
        <div key={i} className="mb-3 last:mb-0">
          {x.arabic ? (
            <p dir="rtl" lang="ar" className="font-ar text-3xl leading-[2] text-ink">{x.arabic}</p>
          ) : (
            <p className="rounded-lg border-2 border-dashed border-amber-400 bg-amber-50 p-2 text-center font-mono text-sm font-bold text-amber-900" data-testid="quran-placeholder">
              {x.placeholder ?? QURAN_PLACEHOLDER}
            </p>
          )}
          {x.transliteration && (
            <p className="text-sm text-ink">
              <span className="text-muted">{t('player.transliteration')}:</span> {x.transliteration}
            </p>
          )}
          <p className="text-sm text-ink">
            <span className="text-muted">{t('player.meaning')}:</span> {pick(x.meaning)}
          </p>
          <p className="text-xs text-muted">
            {t('player.reference')}: {x.reference}
          </p>
        </div>
      ))}
    </div>
  );
}

export function ChildPlayer() {
  const { t, pick, lang } = useT();
  const session = useAppState((s) => s.session);
  const limitHit = useAppState((s) => screenLimitReached(s));
  const limitMin = useAppState((s) => s.settings.screenLimitMin);
  const extraPractice = useAppState((s) => (s.session ? !!s.progress[s.session.lessonId]?.extraPractice : false));
  const [gate, setGate] = useState(false);

  const lesson = session ? lessonById[session.lessonId] : undefined;
  const onBreak = limitHit && session?.stage !== 'finish';
  const running = !!session && !session.paused && !onBreak && session.stage !== 'finish';

  // Screen-time clock: counts only while visible, running and not on break.
  useEffect(() => {
    if (!running) return;
    let last = Date.now();
    const id = window.setInterval(() => {
      const now = Date.now();
      const delta = Math.min(now - last, 5000);
      last = now;
      if (document.visibilityState === 'visible') tick(delta);
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  useEffect(() => () => stopSpeaking(), []);

  if (!session || !lesson) return null;

  const total = lesson.interactiveQuestions.length;
  const q = session.stage === 'question' ? currentQuestion(session) : undefined;
  const islamic = lesson.kind === 'islamic' ? (lesson as IslamicLesson) : null;
  const { primary } = langsFor(lesson, lang);

  const choose = (id: string) => {
    const ok = answerChoice(id);
    if (ok) playCorrect();
    else playTryAgain();
  };

  const feedbackText =
    session.feedback === 'correct'
      ? t('player.correct')
      : session.feedback === 'tryAgain'
        ? t('player.tryAgain')
        : session.feedback === 'simpler'
          ? t('player.simpler')
          : session.feedback === 'harder'
            ? t('player.harder')
            : session.feedback === 'reveal'
              ? t('player.reveal')
              : null;

  return (
    <div className="fixed inset-0 z-30 flex flex-col bg-cream" data-testid="child-mode">
      {/* Minimal top bar: pause + progress dots. No navigation chrome. */}
      <div className="flex items-center justify-between px-4 pt-3">
        <button
          type="button"
          onClick={pauseLesson}
          aria-label={t('player.pause')}
          data-testid="child-pause"
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm"
        >
          ⏸
        </button>
        <div className="flex gap-1.5" aria-label={t('player.question', { n: session.qIndex + 1, total })}>
          {lesson.interactiveQuestions.map((_, i) => (
            <span
              key={i}
              className={`h-3 w-3 rounded-full ${session.stage === 'finish' || (session.stage === 'question' && i < session.qIndex) ? 'bg-sage-600' : session.stage === 'question' && i === session.qIndex ? 'bg-amber-500' : 'bg-gray-200'}`}
            />
          ))}
        </div>
        <div className="h-16 w-16" />
      </div>

      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col overflow-y-auto px-5 pb-6 pt-2">
        {session.stage === 'intro' && (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
            <div className="text-7xl" aria-hidden>{GUIDE}</div>
            <SpokenText text={lesson.guideLine} lesson={lesson} big />
            <p className={`text-base text-muted ${lang === 'bn' ? 'font-bn' : ''}`}>{pick(lesson.title)}</p>
            <BigButton onClick={advanceIntro} testId="child-start">
              {t('player.start')} ▶
            </BigButton>
          </div>
        )}

        {session.stage === 'explain' && (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
            {lesson.explanation[session.step].visual && (
              <div className="rounded-3xl bg-white px-6 py-6 shadow-sm">
                <Visual text={lesson.explanation[session.step].visual!} lang={lesson.explanation[session.step].visualLang} className="text-6xl" />
              </div>
            )}
            <SpokenText text={lesson.explanation[session.step].text} lesson={lesson} big />
            {islamic && session.step === lesson.explanation.length - 1 && <ReciteCard texts={islamic.texts} />}
            <BigButton onClick={advanceIntro} testId="child-next">
              {t('player.next')} ▶
            </BigButton>
          </div>
        )}

        {session.stage === 'question' && q && (
          <div className="flex flex-1 flex-col items-center gap-4 pt-2 text-center" data-testid="question" data-question-id={q.id} data-variant={session.variant}>
            <div className="flex items-center gap-2 self-start text-sm text-muted">
              <span aria-hidden className="text-2xl">{GUIDE}</span>
              <span>{t('player.question', { n: session.qIndex + 1, total })}</span>
            </div>
            <SpokenText text={q.prompt} lesson={lesson} testId="question-prompt" />
            {q.visual && (
              <div className="w-full rounded-3xl bg-white px-4 py-4 shadow-sm">
                <Visual text={q.visual} lang={q.visualLang} className="break-words text-5xl" />
              </div>
            )}

            {feedbackText && (
              <div
                role="status"
                data-testid="feedback"
                data-feedback={session.feedback ?? ''}
                className={`w-full rounded-2xl px-4 py-3 text-lg font-bold ${session.feedback === 'correct' ? 'bg-sage-100 text-sage-700' : session.feedback === 'harder' ? 'bg-sky-100 text-sky-600' : 'bg-sun-100 text-sun-600'}`}
              >
                {session.feedback === 'correct' ? '🌟 ' : ''}
                {feedbackText}
              </div>
            )}

            {session.hintShown && !session.revealed && (
              <div className="w-full rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-left text-base text-amber-900" data-testid="hint">
                💡 <span className="font-semibold">{t('player.hint')}:</span> {q.hint[primary]}
              </div>
            )}

            {q.kind === 'choice' ? (
              <div className={`grid w-full gap-3 ${q.options.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                {q.options.map((o) => {
                  const isAnswer = session.revealed && o.id === q.answer;
                  const wasWrong = session.wrongIds.includes(o.id);
                  return (
                    <button
                      key={o.id}
                      type="button"
                      data-testid="option"
                      data-option-id={o.id}
                      data-correct={TEST_MODE ? String(o.id === q.answer) : undefined}
                      disabled={session.revealed}
                      onClick={() => choose(o.id)}
                      className={`flex min-h-[96px] flex-col items-center justify-center gap-1 rounded-3xl border-4 bg-white p-2 shadow-sm transition-transform active:scale-95 ${isAnswer ? 'border-sage-600 bg-sage-50' : wasWrong ? 'border-gray-200 opacity-50' : 'border-transparent'}`}
                    >
                      {o.visual && <Visual text={o.visual} lang={o.visualLang} className={`${(o.visual?.length ?? 0) > 4 ? 'text-2xl' : 'text-4xl'} break-all`} />}
                      {o.label && <span className={`text-sm font-semibold text-ink ${lang === 'bn' ? 'font-bn' : ''}`}>{typeof o.label === 'string' ? o.label : o.label[primary]}</span>}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="w-full">
                {islamic && <ReciteCard texts={(q.textRefs ?? []).map((i) => islamic.texts[i]).filter(Boolean)} />}
                <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-muted">{t('player.parentConfirm')}</p>
                <BigButton onClick={confirmStep} testId="confirm-step">
                  {t('player.weDidIt')}
                </BigButton>
                {session.variant !== 'simpler' && (
                  <button type="button" onClick={switchToSimplerConfirm} className="mt-3 min-h-[44px] text-sm font-semibold text-sage-700" data-testid="make-easier">
                    {t('player.simpler')}
                  </button>
                )}
              </div>
            )}

            {q.kind === 'choice' && !session.revealed && !session.hintShown && session.attempts > 0 && (
              <button type="button" onClick={showHint} className="min-h-[44px] text-sm font-semibold text-sage-700" data-testid="show-hint">
                💡 {t('player.hint')}
              </button>
            )}

            {session.revealed && (
              <BigButton onClick={nextQuestion} testId="child-next">
                {t('player.next')} ▶
              </BigButton>
            )}
          </div>
        )}

        {session.stage === 'finish' && (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center" data-testid="child-finish">
            <div className="text-7xl" aria-hidden>🌟{GUIDE}🌟</div>
            <h2 className={`text-2xl font-bold text-ink ${lang === 'bn' ? 'font-bn' : ''}`}>{t('player.wellDone')}</h2>
            <div className="w-full rounded-3xl bg-white p-5 text-left shadow-sm">
              <p className="mb-1 text-sm font-semibold text-muted">{t('player.nowOffline')}</p>
              <p className={`text-lg font-bold text-ink ${lang === 'bn' ? 'font-bn' : ''}`}>🏠 {pick(lesson.offlineActivity.title)}</p>
              <p className={`mt-1 text-base text-ink ${lang === 'bn' ? 'font-bn leading-[1.7]' : ''}`}>{pick(lesson.offlineActivity.steps)}</p>
              {extraPractice && (
                <p className={`mt-3 rounded-xl bg-sun-50 p-3 text-sm text-sun-600 ${lang === 'bn' ? 'font-bn leading-[1.7]' : ''}`} data-testid="extra-practice">
                  ➕ {pick(lesson.offlineActivity.extraPractice)}
                </p>
              )}
            </div>
            <BigButton onClick={() => setGate(true)} testId="child-back">
              {t('player.backToParent')}
            </BigButton>
          </div>
        )}
      </main>

      {session.paused && !onBreak && session.stage !== 'finish' && (
        <Overlay testId="paused-overlay">
          <div className="text-6xl" aria-hidden>☕</div>
          <h2 className="text-2xl font-bold text-ink">{t('player.paused')}</h2>
          <BigButton onClick={resumeLesson} testId="child-resume">
            {t('player.resume')} ▶
          </BigButton>
          <button type="button" onClick={() => setGate(true)} className="min-h-[48px] font-semibold text-sage-700" data-testid="child-back">
            {t('player.backToParent')}
          </button>
        </Overlay>
      )}

      {onBreak && (
        <Overlay testId="break-screen">
          <div className="text-6xl" aria-hidden>🌿</div>
          <h2 className="text-2xl font-bold text-ink">{t('break.title')}</h2>
          <p className={`text-lg text-ink ${lang === 'bn' ? 'font-bn leading-[1.7]' : ''}`}>{t('break.body', { n: limitMin })}</p>
          <p className="text-sm font-semibold text-sage-700">🏠 {pick(lesson.offlineActivity.title)}</p>
          <p className="text-xs text-muted">{t('break.parentNote')}</p>
          <BigButton onClick={() => setGate(true)} testId="child-back">
            {t('player.backToParent')}
          </BigButton>
        </Overlay>
      )}

      {gate && (
        <ParentGate
          onCancel={() => setGate(false)}
          onSuccess={() => {
            setGate(false);
            stopSpeaking();
            exitChildMode();
          }}
        />
      )}
    </div>
  );
}

function BigButton({ children, onClick, testId }: { children: React.ReactNode; onClick: () => void; testId?: string }) {
  return (
    <button type="button" onClick={onClick} data-testid={testId} className="min-h-[64px] w-full max-w-sm rounded-3xl bg-sage-600 px-6 text-xl font-bold text-white shadow-md active:scale-[0.98]">
      {children}
    </button>
  );
}

function Overlay({ children, testId }: { children: React.ReactNode; testId: string }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-cream/95 p-6" data-testid={testId}>
      <div className="flex w-full max-w-sm flex-col items-center gap-4 text-center">{children}</div>
    </div>
  );
}
