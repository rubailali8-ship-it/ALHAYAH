import { allLessons, lessonById, SUBJECTS } from '../content';
import { skillSummaries, suggestionFor } from '../engine/adaptive';
import { useT, type DictKey } from '../i18n';
import { CHILD, DAYS } from '../lib/constants';
import { useBlobUrl } from '../lib/hooks';
import { effectiveDay, lessonStatus, setOverride, visibleLessons } from '../storage/actions';
import { useAppState, type AppEvent } from '../storage/state';
import { Card, Meter, Pill, SUBJECT_STYLE } from '../components/ui';
import { suggestionReason } from './Today';

const ISLAMIC_SKILLS = new Set(allLessons.filter((l) => l.kind === 'islamic').map((l) => l.skill));

export function Progress() {
  const { t, pick, lang } = useT();
  const s = useAppState((x) => x);
  const islamicOn = s.settings.islamicOn;
  const visible = (lessonId?: string) => !!lessonId && (islamicOn || lessonById[lessonId]?.kind !== 'islamic');

  // Everything below is derived from the event log.
  const events = s.events.filter((e) => !e.lessonId || visible(e.lessonId));
  const completed = new Set(events.filter((e) => e.type === 'lesson_completed').map((e) => e.lessonId!));
  const bnCls = lang === 'bn' ? 'font-bn leading-[1.7]' : '';

  const dayStats = DAYS.map((d) => {
    const ls = visibleLessons(s, d);
    return { d, total: ls.length, done: ls.filter((l) => completed.has(l.id)).length };
  });
  const today = dayStats[s.selectedDay - 1];

  const subjects = SUBJECTS.filter((sub) => islamicOn || sub !== 'islamic').map((sub) => ({
    sub,
    total: allLessons.filter((l) => l.subject === sub).length,
    done: [...completed].filter((id) => lessonById[id]?.subject === sub).length,
  }));

  const skills = skillSummaries(events).filter((k) => islamicOn || !ISLAMIC_SKILLS.has(k.skill));
  const practiseMore = skills.filter((k) => k.state === 'practising' && (k.hints > 0 || k.simplerShown > 0));

  const observations = events.filter((e) => e.type === 'observation_added');

  const upcoming = allLessons
    .filter((l) => visible(l.id) && lessonStatus(s, l.id) === 'not_started')
    .map((l) => ({ l, sug: suggestionFor(l, s.events) }))
    .filter((x) => x.sug);

  const inLesson = events.filter((e) => (e.type === 'harder_offered' && e.data?.rule === 'R1') || (e.type === 'simpler_shown' && e.data?.rule === 'R2')).slice(-6).reverse();

  if (s.events.length === 0) {
    return (
      <Card testId="progress-empty">
        <p className="text-muted">{t('progress.empty')}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4" data-testid="progress">
      <p className="text-xs text-muted">{t('progress.fromEvents')}</p>
      {!islamicOn && <p className="rounded-xl bg-sage-50 p-3 text-sm text-sage-700" data-testid="islamic-hidden-note">🌙 {t('progress.islamicHidden')}</p>}

      <Card testId="progress-today">
        <h2 className="mb-2 font-bold text-ink">{t('progress.today', { n: s.selectedDay })}</h2>
        <p className="mb-2 text-2xl font-bold text-sage-700" data-testid="progress-today-count">
          {t('progress.lessonsDone', { done: today.done, total: today.total })}
        </p>
        <Meter value={today.done} max={today.total} />
      </Card>

      <Card testId="progress-week">
        <h2 className="mb-3 font-bold text-ink">{t('progress.week')}</h2>
        <div className="grid grid-cols-5 gap-2">
          {dayStats.map(({ d, done, total }) => (
            <div key={d} className="text-center">
              <div className="mx-auto mb-1 flex h-20 w-full items-end overflow-hidden rounded-xl bg-gray-100">
                <div className="w-full rounded-xl bg-sage-600" style={{ height: `${total ? (done / total) * 100 : 0}%` }} />
              </div>
              <p className="text-xs font-semibold text-ink">{t('day.label', { n: d })}</p>
              <p className="text-xs text-muted">
                {done}/{total}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <Card testId="progress-subjects">
        <h2 className="mb-3 font-bold text-ink">{t('progress.bySubject')}</h2>
        <ul className="space-y-2">
          {subjects.map(({ sub, done, total }) => (
            <li key={sub} className="flex items-center gap-3">
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${SUBJECT_STYLE[sub].bg} ${SUBJECT_STYLE[sub].text}`} aria-hidden>
                {SUBJECT_STYLE[sub].icon}
              </span>
              <span className="min-w-0 flex-1 text-sm text-ink">{t(`subject.${sub}` as DictKey)}</span>
              <span className="text-sm font-semibold text-ink" data-testid={`subject-${sub}`}>
                {t('progress.lessonsDone', { done, total })}
              </span>
            </li>
          ))}
        </ul>
      </Card>

      <Card testId="progress-skills">
        <h2 className="mb-3 font-bold text-ink">{t('progress.skills')}</h2>
        {skills.length === 0 ? (
          <p className="text-sm text-muted">{t('progress.practiseMoreEmpty')}</p>
        ) : (
          <ul className="space-y-2">
            {skills.map((k) => (
              <li key={k.skill} className="flex flex-wrap items-center gap-2 text-sm">
                <span className="font-semibold text-ink">{t(`skill.${k.skill}` as DictKey)}</span>
                <Pill tone={k.state === 'comfortable' ? 'done' : 'progress'}>{t(`skillState.${k.state}` as DictKey)}</Pill>
                <span className="text-xs text-muted">
                  {t('progress.firstTry', { n: k.firstTryCorrect })} · {t('progress.hintsUsed', { n: k.hints })}
                </span>
              </li>
            ))}
          </ul>
        )}
        <h3 className="mb-2 mt-4 text-sm font-bold text-ink">{t('progress.practiseMore')}</h3>
        {practiseMore.length === 0 ? (
          <p className="text-sm text-muted">{t('progress.practiseMoreEmpty')}</p>
        ) : (
          <ul className="list-inside list-disc text-sm text-ink" data-testid="practise-more">
            {practiseMore.map((k) => (
              <li key={k.skill}>{t(`skill.${k.skill}` as DictKey)}</li>
            ))}
          </ul>
        )}
      </Card>

      <Card testId="progress-suggestions">
        <h2 className="mb-1 font-bold text-ink">🧭 {t('progress.suggestions')}</h2>
        {upcoming.length === 0 && inLesson.length === 0 && <p className="text-sm text-muted">{t('suggest.none')}</p>}
        <ul className="space-y-3">
          {upcoming.map(({ l, sug }) => {
            const overridden = !!s.overrides[l.id];
            return (
              <li key={l.id} className="rounded-xl bg-sky-50 p-3 text-sm">
                <p className="font-semibold text-ink">
                  {t('day.label', { n: effectiveDay(s, l.id) })} · {pick(l.title)}
                </p>
                <p className={`text-ink ${bnCls}`}>{overridden ? t('suggest.overridden') : suggestionReason(sug!.mode, sug!.firstTryCorrect, sug!.skill, t, pick)}</p>
                <button type="button" onClick={() => setOverride(l.id, !overridden)} className="min-h-[44px] font-semibold text-sky-600 underline">
                  {overridden ? t('suggest.restore') : t('suggest.override')}
                </button>
              </li>
            );
          })}
          {inLesson.map((e) => (
            <InLessonReason key={e.id} e={e} />
          ))}
        </ul>
      </Card>

      <Card testId="progress-observations">
        <h2 className="mb-3 font-bold text-ink">{t('progress.observations')}</h2>
        {observations.length === 0 ? (
          <p className="text-sm text-muted">{t('progress.observationsEmpty')}</p>
        ) : (
          <ul className="space-y-3">
            {observations
              .slice()
              .reverse()
              .map((e) => (
                <ObservationItem key={e.id} e={e} photoKey={s.observations.find((o) => o.id === e.data?.observationId)?.photoKey} />
              ))}
          </ul>
        )}
      </Card>

      <Card testId="progress-teacher">
        <h2 className="mb-3 flex items-center gap-2 font-bold text-ink">
          {t('progress.teacherComments')} <Pill tone="demo">{t('progress.sample')}</Pill>
        </h2>
        <ul className={`space-y-2 text-sm text-ink ${bnCls}`}>
          {(['progress.sampleComment1', 'progress.sampleComment2', 'progress.sampleComment3'] as DictKey[]).map((k) => (
            <li key={k} className="rounded-xl bg-lilac-50 p-3">
              🧕 {t(k)}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function InLessonReason({ e }: { e: AppEvent }) {
  const { t, pick, lang } = useT();
  const lesson = e.lessonId ? lessonById[e.lessonId] : undefined;
  return (
    <li className="rounded-xl bg-gray-50 p-3 text-sm">
      <p className="text-xs text-muted">
        {t('day.label', { n: e.day })} · {lesson ? pick(lesson.title) : ''}
      </p>
      <p className={`text-ink ${lang === 'bn' ? 'font-bn leading-[1.7]' : ''}`}>
        {t(e.type === 'harder_offered' ? 'suggest.inLessonHarder' : 'suggest.inLessonSimpler', { name: pick(CHILD.name) })}
      </p>
    </li>
  );
}

function ObservationItem({ e, photoKey }: { e: AppEvent; photoKey?: string }) {
  const { t, pick, lang } = useT();
  const url = useBlobUrl(photoKey);
  const lesson = e.lessonId ? lessonById[e.lessonId] : undefined;
  return (
    <li className="flex gap-3 rounded-xl bg-peach-50 p-3 text-sm" data-testid="observation">
      {url && <img src={url} alt="" className="h-16 w-16 shrink-0 rounded-lg object-cover" />}
      <div className="min-w-0">
        <p className="text-xs text-muted">
          {t('day.label', { n: e.day })} · {lesson ? pick(lesson.title) : ''} · {new Date(e.ts).toLocaleTimeString(lang === 'bn' ? 'bn-IN' : 'en-IN', { hour: '2-digit', minute: '2-digit' })}
        </p>
        {typeof e.data?.text === 'string' && e.data.text && <p className={`text-ink ${lang === 'bn' ? 'font-bn leading-[1.7]' : ''}`}>{e.data.text}</p>}
      </div>
    </li>
  );
}
