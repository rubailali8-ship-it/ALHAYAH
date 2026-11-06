import { useState } from 'react';
import { useT, type DictKey } from '../i18n';
import { suggestionFor } from '../engine/adaptive';
import { CHILD, DAYS } from '../lib/constants';
import { fmtClock } from '../lib/format';
import { useNow } from '../lib/hooks';
import { compressImage, deleteBlob, putBlob } from '../storage/media';
import {
  confirmOffline,
  effectiveDay,
  lessonStatus,
  openLesson,
  reschedule,
  screenLimitMs,
  screenLimitReached,
  screenUsedMs,
  selectDay,
  setOverride,
  startOffline,
  visibleLessons,
} from '../storage/actions';
import { type AppState, type LessonStatus, uid, useAppState } from '../storage/state';
import type { Lesson } from '../types/content';
import { Button, Card, Meter, Pill, SUBJECT_STYLE } from '../components/ui';

const STATUS_TONE: Record<LessonStatus, 'muted' | 'progress' | 'wait' | 'done'> = {
  not_started: 'muted',
  in_progress: 'progress',
  awaiting_parent: 'wait',
  done: 'done',
};

export function Today() {
  const { t, lang, pick } = useT();
  const s = useAppState((x) => x);
  const day = s.selectedDay;
  const lessons = visibleLessons(s, day);
  const used = screenUsedMs(s);
  const limit = screenLimitMs(s);
  const pending = visibleLessons(s, day).filter((l) => lessonStatus(s, l.id) === 'awaiting_parent').length;
  const pct = Math.round((used / limit) * 100);
  const allDone = lessons.length > 0 && lessons.every((l) => lessonStatus(s, l.id) === 'done');

  const dateStr = new Intl.DateTimeFormat(lang === 'bn' ? 'bn-IN' : 'en-IN', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());

  return (
    <div className="space-y-4">
      <Card testId="child-card" className="flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-peach-100 text-4xl" aria-hidden>
          👧
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-lg font-bold text-ink">
            {pick(CHILD.name)} <span className="text-sm font-normal text-muted">· {t('child.age', { age: CHILD.age })}</span>
          </p>
          <p className="text-sm text-muted">{dateStr}</p>
          <p className="text-sm font-semibold text-sage-700">{t('day.of', { n: day })}</p>
        </div>
      </Card>

      <nav aria-label={t('day.select')} className="flex gap-2 overflow-x-auto pb-1" data-testid="day-selector">
        {DAYS.map((d) => {
          const dl = visibleLessons(s, d);
          const done = dl.length > 0 && dl.every((l) => lessonStatus(s, l.id) === 'done');
          return (
            <button
              key={d}
              type="button"
              data-testid={`day-${d}`}
              aria-pressed={d === day}
              onClick={() => selectDay(d)}
              className={`min-h-[44px] shrink-0 rounded-full px-4 text-sm font-semibold ${d === day ? 'bg-sage-600 text-white' : 'border border-gray-200 bg-white text-ink'}`}
            >
              {t('day.label', { n: d })} {done ? '✓' : ''}
            </button>
          );
        })}
      </nav>

      <Card testId="screen-meter">
        <div className="mb-2 flex items-baseline justify-between">
          <h2 className="text-sm font-semibold text-ink">⏱️ {t('screen.meter')}</h2>
          <span className="text-sm text-muted" data-testid="screen-used">
            {t('screen.of', { used: Math.floor(used / 60000), limit: s.settings.screenLimitMin })}
          </span>
        </div>
        <Meter value={used} max={limit} />
      </Card>

      {(pct >= 80 || pending > 0) && (
        <Card testId="reminders" className="border-amber-200 bg-amber-50">
          <h2 className="mb-1 text-sm font-semibold text-amber-900">🔔 {t('reminder.title')}</h2>
          <ul className="space-y-1 text-sm text-amber-900">
            {pct >= 100 ? <li>{t('reminder.limitReached')}</li> : pct >= 80 ? <li>{t('reminder.breakSoon', { pct })}</li> : null}
            {pending > 0 && <li data-testid="reminder-offline">{t('reminder.offlinePending', { n: pending })}</li>}
          </ul>
          <p className="mt-1 text-xs text-amber-800">{t('reminder.note')}</p>
        </Card>
      )}

      <h2 className="pt-1 text-base font-bold text-ink">{t('day.plan')}</h2>
      {allDone && (
        <Card className="bg-sage-50 text-center text-sage-700" testId="day-done">
          🌟 {t('day.allDone')}
        </Card>
      )}
      {lessons.length === 0 && <p className="text-sm text-muted">{t('day.empty')}</p>}
      <div className="space-y-3">
        {lessons.map((l) => (
          <LessonCard key={l.id} lesson={l} s={s} />
        ))}
      </div>
    </div>
  );
}

function LessonCard({ lesson, s }: { lesson: Lesson; s: AppState }) {
  const { t, pick, lang } = useT();
  const status = lessonStatus(s, lesson.id);
  const p = s.progress[lesson.id];
  const style = SUBJECT_STYLE[lesson.subject];
  const paused = s.session?.lessonId === lesson.id && s.session.stage !== 'finish';
  const locked = screenLimitReached(s);
  const day = effectiveDay(s, lesson.id);
  const suggestion = status === 'not_started' ? suggestionFor(lesson, s.events) : null;
  const overridden = !!s.overrides[lesson.id];
  const bnCls = lang === 'bn' ? 'font-bn leading-[1.7]' : '';

  return (
    <Card testId={`lesson-${lesson.id}`} className={`border ${style.ring}`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${style.bg} ${style.text} text-lg font-bold`} aria-hidden>
          {style.icon}
        </span>
        <span className={`text-xs font-bold uppercase tracking-wide ${style.text}`}>{t(`subject.${lesson.subject}` as DictKey)}</span>
        <span className="ml-auto flex flex-wrap gap-1">
          {lesson.needsReview && (
            <Pill tone="review" testId="needs-review">
              ⚠ পর্যালোচনা বাকি / Needs review
            </Pill>
          )}
          <Pill tone={STATUS_TONE[status]} testId="lesson-status">
            {t(`status.${status}` as DictKey)}
          </Pill>
        </span>
      </div>

      <h3 className={`mt-2 text-lg font-bold text-ink ${bnCls}`}>{pick(lesson.title)}</h3>
      <p className="text-sm text-muted">
        📱 {t('lesson.screenMin', { n: lesson.durationMin })} · 🏠 {t('lesson.offlineMin', { n: lesson.offlineActivity.durationMin })}
        {p && p.activeMs > 0 && (
          <span className="ml-2 font-semibold text-ink" data-testid="lesson-timer">
            · {t('lesson.timer', { time: fmtClock(p.activeMs) })}
          </span>
        )}
      </p>
      {day !== lesson.day && <p className="text-xs text-muted">↪ {t('lesson.rescheduled', { from: lesson.day })}</p>}

      {suggestion && (
        <div className="mt-3 rounded-xl border border-sky-100 bg-sky-50 p-3 text-sm" data-testid="suggestion">
          <p className="text-xs font-bold text-sky-600">🧭 {t('suggest.label')}</p>
          {overridden ? <p className="text-ink">{t('suggest.overridden')}</p> : <p className={`text-ink ${bnCls}`}>{suggestionReason(suggestion.mode, suggestion.firstTryCorrect, suggestion.skill, t, pick)}</p>}
          <button type="button" onClick={() => setOverride(lesson.id, !overridden)} className="mt-1 min-h-[44px] font-semibold text-sky-600 underline" data-testid="suggestion-override">
            {overridden ? t('suggest.restore') : t('suggest.override')}
          </button>
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        {status !== 'done' && status !== 'awaiting_parent' && (
          <Button onClick={() => openLesson(lesson.id)} disabled={locked} testId="lesson-start">
            {paused ? `▶ ${t('lesson.resume')}` : `▶ ${t('lesson.start')}`}
          </Button>
        )}
        {(status === 'done' || status === 'awaiting_parent') && (
          <Button variant="secondary" onClick={() => openLesson(lesson.id)} disabled={locked} testId="lesson-redo">
            ↻ {t('lesson.redo')}
          </Button>
        )}
        {status !== 'done' && day < 5 && (
          <Button variant="ghost" onClick={() => reschedule(lesson.id)} testId="lesson-reschedule">
            → {t('lesson.reschedule')}
          </Button>
        )}
      </div>
      {locked && status !== 'done' && <p className="mt-2 text-xs text-peach-600">{t('lesson.screenLocked')}</p>}

      <OfflineSection lesson={lesson} s={s} />

      <details className="mt-3 text-sm">
        <summary className="min-h-[44px] cursor-pointer py-2 font-semibold text-sage-700">{t('lesson.details')}</summary>
        <dl className={`space-y-2 text-ink ${bnCls}`}>
          <Detail label={t('lesson.objective')} value={pick(lesson.objective)} />
          <Detail label={t('lesson.materials')} value={pick(lesson.materials)} />
          <Detail label={t('lesson.parentInstructions')} value={pick(lesson.parentInstructions)} />
          <Detail label={t('lesson.completion')} value={pick(lesson.completionCriteria)} />
          <Detail label={t('offline.observationPrompt')} value={pick(lesson.observationPrompt)} />
          <Detail label={t('lesson.source')} value={lesson.source} />
        </dl>
      </details>
    </Card>
  );
}

export function suggestionReason(
  mode: 'harder' | 'simpler',
  n: number,
  skill: string,
  t: (k: DictKey, p?: Record<string, string | number>) => string,
  pick: (b: { bn: string; en: string }) => string,
) {
  return t(mode === 'harder' ? 'suggest.reasonHarder' : 'suggest.reasonSimpler', { name: pick(CHILD.name), n, skill: t(`skill.${skill}` as DictKey) });
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function OfflineSection({ lesson, s }: { lesson: Lesson; s: AppState }) {
  const { t, pick, lang } = useT();
  const p = s.progress[lesson.id];
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState('');
  const [photo, setPhoto] = useState<{ key: string; url: string } | null>(null);
  const running = !!p?.offlineStartedAt && !p.offlineDone;
  const now = useNow(running);
  const bnCls = lang === 'bn' ? 'font-bn leading-[1.7]' : '';

  if (p?.offlineDone) {
    return (
      <p className="mt-3 rounded-xl bg-sage-50 px-3 py-2 text-sm font-semibold text-sage-700" data-testid="offline-confirmed">
        ✓ {t('offline.confirmed')}
      </p>
    );
  }

  const onPhoto = async (file?: File) => {
    if (!file) return;
    const blob = await compressImage(file);
    const key = `photo:${uid()}`;
    await putBlob(key, blob);
    if (photo) {
      URL.revokeObjectURL(photo.url);
      void deleteBlob(photo.key);
    }
    setPhoto({ key, url: URL.createObjectURL(blob) });
  };

  const cancel = () => {
    if (photo) {
      URL.revokeObjectURL(photo.url);
      void deleteBlob(photo.key);
    }
    setPhoto(null);
    setNote('');
    setOpen(false);
  };

  const save = () => {
    confirmOffline(lesson.id, note, photo?.key);
    if (photo) URL.revokeObjectURL(photo.url);
    setPhoto(null);
    setNote('');
    setOpen(false);
  };

  return (
    <div className="mt-3 rounded-xl border border-dashed border-gray-300 p-3" data-testid="offline-section">
      <p className="text-xs font-bold uppercase tracking-wide text-muted">🏠 {t('offline.title')}</p>
      <p className={`font-semibold text-ink ${bnCls}`}>{pick(lesson.offlineActivity.title)}</p>
      {p?.started || p?.childDone || open || running ? (
        <p className={`text-sm text-ink ${bnCls}`}>{pick(lesson.offlineActivity.steps)}</p>
      ) : (
        <details className="text-sm">
          <summary className="cursor-pointer py-1 text-sage-700">…</summary>
          <p className={`text-ink ${bnCls}`}>{pick(lesson.offlineActivity.steps)}</p>
        </details>
      )}
      {p?.extraPractice && (
        <p className={`mt-2 rounded-lg bg-sun-50 p-2 text-sm text-sun-600 ${bnCls}`} data-testid="extra-practice-parent">
          ➕ <span className="font-semibold">{t('offline.extra')}:</span> {pick(lesson.offlineActivity.extraPractice)}
        </p>
      )}
      {running && <p className="mt-2 text-sm font-semibold text-sky-600" data-testid="offline-running">{t('offline.running', { time: fmtClock(now - (p?.offlineStartedAt ?? now)) })}</p>}

      {!open ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {!running && (
            <Button variant="secondary" onClick={() => startOffline(lesson.id)} testId="offline-start">
              {t('offline.start')}
            </Button>
          )}
          <Button onClick={() => setOpen(true)} testId="offline-done">
            ✓ {t('offline.done')}
          </Button>
        </div>
      ) : (
        <div className="mt-3 space-y-3" data-testid="offline-form">
          <p className={`rounded-lg bg-lilac-50 p-2 text-sm text-lilac-600 ${bnCls}`}>💭 {pick(lesson.observationPrompt)}</p>
          <label className="block text-sm font-semibold text-ink">
            {t('offline.note')}
            <textarea
              data-testid="offline-note"
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, 280))}
              placeholder={t('offline.notePlaceholder')}
              rows={2}
              className={`mt-1 w-full rounded-xl border border-gray-300 bg-white p-2 text-base font-normal ${bnCls}`}
            />
          </label>
          <div>
            <label className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-xl border border-gray-300 bg-white px-3 text-sm font-semibold text-ink">
              📷 {t('offline.photo')}
              <input data-testid="offline-photo" type="file" accept="image/*" capture="environment" className="sr-only" onChange={(e) => void onPhoto(e.target.files?.[0])} />
            </label>
            {photo && (
              <div className="mt-2 flex items-center gap-2">
                <img src={photo.url} alt="" className="h-20 w-20 rounded-xl object-cover" data-testid="offline-photo-preview" />
                <button type="button" className="min-h-[44px] text-sm text-red-700" onClick={() => { URL.revokeObjectURL(photo.url); void deleteBlob(photo.key); setPhoto(null); }}>
                  {t('offline.photoRemove')}
                </button>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={save} testId="offline-save">
              {t('offline.save')}
            </Button>
            <Button variant="secondary" onClick={cancel}>
              {t('offline.cancel')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
