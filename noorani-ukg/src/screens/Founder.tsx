import { allLessons } from '../content';
import { useT, type DictKey } from '../i18n';
import { DAYS } from '../lib/constants';
import { fmtClock, minutes1 } from '../lib/format';
import { effectiveDay, exportData, lessonStatus } from '../storage/actions';
import { useAppState } from '../storage/state';
import { Button, Card, Pill } from '../components/ui';

/** Hidden evaluation view (?founder=1): is the daily loop working? */
export function Founder() {
  const { t, pick } = useT();
  const s = useAppState((x) => x);

  const rows = allLessons.map((l) => {
    const ev = s.events.filter((e) => e.lessonId === l.id);
    const answers = ev.filter((e) => e.type === 'answer_submitted');
    const wrongByQ = new Map<string, number>();
    answers.filter((e) => e.data?.correct === false).forEach((e) => wrongByQ.set(e.questionId!, (wrongByQ.get(e.questionId!) ?? 0) + 1));
    const stuck = [...wrongByQ.entries()].filter(([, n]) => n >= 2).map(([q, n]) => `${q} (${n}×)`);
    const offline = ev.filter((e) => e.type === 'offline_confirmed').pop();
    const offlineMs = typeof offline?.data?.durationMs === 'number' ? (offline.data.durationMs as number) : null;
    return {
      l,
      day: effectiveDay(s, l.id),
      status: lessonStatus(s, l.id),
      activeMs: s.progress[l.id]?.activeMs ?? 0,
      attempts: answers.length,
      hints: ev.filter((e) => e.type === 'hint_used').length,
      simpler: ev.filter((e) => e.type === 'simpler_shown').length,
      stuck,
      offlineMs,
      offlineDone: !!offline,
    };
  });

  const perDay = DAYS.map((d) => {
    const r = rows.filter((x) => x.day === d);
    const screen = r.reduce((a, x) => a + x.activeMs, 0);
    let offline = 0;
    let estimated = false;
    r.forEach((x) => {
      if (!x.offlineDone) return;
      if (x.offlineMs != null) offline += x.offlineMs;
      else {
        offline += x.l.offlineActivity.durationMin * 60_000;
        estimated = true;
      }
    });
    return { d, screen, offline, estimated, total: screen + offline, done: r.filter((x) => x.status === 'done').length, count: r.length };
  });

  return (
    <div className="min-h-screen bg-cream p-4" data-testid="founder">
      <div className="mx-auto max-w-5xl space-y-4">
        <header className="flex flex-wrap items-center gap-3">
          <h1 className="text-xl font-bold text-ink">🔎 {t('founder.title')}</h1>
          <Pill tone="demo">DEMO</Pill>
          <span className="text-sm text-muted">{t('founder.events', { n: s.events.length })}</span>
          <div className="ml-auto flex gap-2">
            <Button variant="secondary" onClick={exportData}>
              ⬇️ {t('settings.export')}
            </Button>
            <a href={window.location.pathname} className="inline-flex min-h-[44px] items-center rounded-xl bg-sage-600 px-4 text-sm font-semibold text-white">
              {t('founder.back')}
            </a>
          </div>
        </header>

        <Card>
          <h2 className="mb-2 font-bold text-ink">{t('founder.perDay')}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm" data-testid="founder-days">
              <thead className="text-xs uppercase text-muted">
                <tr>
                  <th className="p-2">{t('day.select')}</th>
                  <th className="p-2">{t('founder.status')}</th>
                  <th className="p-2">{t('founder.screen')}</th>
                  <th className="p-2">{t('founder.offline')}</th>
                  <th className="p-2">{t('founder.total')}</th>
                </tr>
              </thead>
              <tbody>
                {perDay.map((x) => (
                  <tr key={x.d} className="border-t border-gray-100">
                    <td className="p-2 font-semibold">{t('day.label', { n: x.d })}</td>
                    <td className="p-2">
                      {x.done}/{x.count}
                    </td>
                    <td className={`p-2 ${x.screen > s.settings.screenLimitMin * 60_000 ? 'font-bold text-peach-600' : ''}`}>{minutes1(x.screen)} min</td>
                    <td className="p-2">
                      {minutes1(x.offline)} min {x.estimated && <span className="text-xs text-muted">({t('founder.est')})</span>}
                    </td>
                    <td className={`p-2 font-semibold ${x.total > 45 * 60_000 ? 'text-peach-600' : ''}`}>{minutes1(x.total)} min</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-muted">{t('founder.note')}</p>
        </Card>

        <Card>
          <h2 className="mb-2 font-bold text-ink">{t('founder.perLesson')}</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm" data-testid="founder-lessons">
              <thead className="text-xs uppercase text-muted">
                <tr>
                  <th className="p-2">{t('founder.lesson')}</th>
                  <th className="p-2">{t('founder.status')}</th>
                  <th className="p-2">{t('founder.time')}</th>
                  <th className="p-2">{t('founder.attempts')}</th>
                  <th className="p-2">{t('founder.hints')}</th>
                  <th className="p-2">{t('founder.stuck')}</th>
                  <th className="p-2">{t('founder.offline')}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.l.id} className="border-t border-gray-100 align-top" data-testid={`founder-row-${r.l.id}`}>
                    <td className="p-2">
                      <span className="font-mono text-xs text-muted">{r.l.id}</span>
                      <br />
                      {pick(r.l.title)}
                    </td>
                    <td className="p-2">{t(`status.${r.status}` as DictKey)}</td>
                    <td className="p-2">{fmtClock(r.activeMs)}</td>
                    <td className="p-2">{r.attempts}</td>
                    <td className="p-2">{r.hints}</td>
                    <td className="p-2 text-xs">
                      {r.stuck.join(', ') || '—'}
                      {r.simpler > 0 && <div className="text-peach-600">simpler ×{r.simpler}</div>}
                    </td>
                    <td className="p-2">{r.offlineDone ? (r.offlineMs != null ? fmtClock(r.offlineMs) : `${r.l.offlineActivity.durationMin}:00 (${t('founder.est')})`) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
