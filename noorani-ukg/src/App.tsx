import { useEffect, useState } from 'react';
import { ChildPlayer } from './child/ChildPlayer';
import { useT } from './i18n';
import { Founder } from './screens/Founder';
import { Progress } from './screens/Progress';
import { SettingsModal } from './screens/Settings';
import { Teacher } from './screens/Teacher';
import { Today } from './screens/Today';
import { useAppState } from './storage/state';
import { DemoTag } from './components/ui';

type Tab = 'today' | 'progress' | 'teacher';

const isFounder = () => new URLSearchParams(window.location.search).get('founder') === '1';

export default function App() {
  const { t, lang } = useT();
  const childMode = useAppState((s) => s.childMode && !!s.session);
  const [tab, setTab] = useState<Tab>('today');
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  if (isFounder()) return <Founder />;
  if (childMode) return <ChildPlayer />;

  const tabs: { id: Tab; icon: string; label: string }[] = [
    { id: 'today', icon: '📚', label: t('nav.today') },
    { id: 'progress', icon: '🌱', label: t('nav.progress') },
    { id: 'teacher', icon: '💬', label: t('nav.teacher') },
  ];

  return (
    <div className={`min-h-screen bg-cream ${lang === 'bn' ? 'font-bn' : ''}`}>
      <header className="sticky top-0 z-20 border-b border-gray-100 bg-cream/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-2 px-4 py-3">
          <span className="text-2xl" aria-hidden>🌙</span>
          <h1 className="text-lg font-bold text-ink">{t('app.name')}</h1>
          <DemoTag />
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            aria-label={t('nav.settings')}
            data-testid="open-settings"
            className="ml-auto flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl shadow-sm"
          >
            ⚙️
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 pb-28 pt-4">
        {tab === 'today' && <Today />}
        {tab === 'progress' && <Progress />}
        {tab === 'teacher' && <Teacher />}
        <footer className="mt-8 space-y-1 text-center text-xs text-muted">
          <p data-testid="footer">{t('app.footer')}</p>
          <p>{t('app.fictional')} · Rahima & Aisha</p>
        </footer>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom)]" aria-label="Main">
        <div className="mx-auto grid max-w-2xl grid-cols-3">
          {tabs.map((x) => (
            <button
              key={x.id}
              type="button"
              data-testid={`tab-${x.id}`}
              aria-current={tab === x.id ? 'page' : undefined}
              onClick={() => setTab(x.id)}
              className={`flex min-h-[64px] flex-col items-center justify-center gap-0.5 text-xs font-semibold ${tab === x.id ? 'text-sage-700' : 'text-muted'}`}
            >
              <span className="text-xl" aria-hidden>{x.icon}</span>
              {x.label}
            </button>
          ))}
        </div>
      </nav>

      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
    </div>
  );
}
