import { useEffect, useState } from 'react';
import { useT } from '../i18n';
import { hasVoice, onVoicesChanged } from '../lib/tts';
import { exportData, resetDemo, updateSettings } from '../storage/actions';
import { useAppState } from '../storage/state';
import { Button, Modal } from '../components/ui';

const LIMITS = [5, 10, 15, 20, 25, 30, 40];

export function SettingsModal({ onClose }: { onClose: () => void }) {
  const { t } = useT();
  const settings = useAppState((s) => s.settings);
  const [confirmReset, setConfirmReset] = useState(false);
  const [, force] = useState(0);
  useEffect(() => onVoicesChanged(() => force((n) => n + 1)), []);

  return (
    <Modal onClose={onClose} title={t('settings.title')} testId="settings">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-ink">⚙️ {t('settings.title')}</h2>
        <Button variant="ghost" onClick={onClose} testId="settings-close">
          ✕ {t('settings.close')}
        </Button>
      </div>

      <div className="space-y-5">
        <section>
          <h3 className="mb-2 text-sm font-semibold text-ink">{t('settings.language')}</h3>
          <div className="grid grid-cols-2 gap-2">
            {(['bn', 'en'] as const).map((l) => (
              <button
                key={l}
                type="button"
                data-testid={`lang-${l}`}
                aria-pressed={settings.lang === l}
                onClick={() => updateSettings({ lang: l })}
                className={`min-h-[48px] rounded-xl border text-base font-semibold ${settings.lang === l ? 'border-sage-600 bg-sage-600 text-white' : 'border-gray-300 bg-white text-ink'}`}
              >
                {l === 'bn' ? 'বাংলা' : 'English'}
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-ink">🌙 {t('settings.islamic')}</h3>
            <button
              type="button"
              role="switch"
              aria-checked={settings.islamicOn}
              data-testid="islamic-toggle"
              onClick={() => updateSettings({ islamicOn: !settings.islamicOn })}
              className={`relative h-9 w-16 shrink-0 rounded-full transition-colors ${settings.islamicOn ? 'bg-sage-600' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-1 h-7 w-7 rounded-full bg-white shadow transition-all ${settings.islamicOn ? 'left-8' : 'left-1'}`} />
              <span className="sr-only">{settings.islamicOn ? t('settings.on') : t('settings.off')}</span>
            </button>
          </div>
          <p className="mt-1 text-sm text-muted">{t('settings.islamicHelp')}</p>
        </section>

        <section>
          <label className="block text-sm font-semibold text-ink" htmlFor="limit">
            ⏱️ {t('settings.screenLimit')}
          </label>
          <select
            id="limit"
            data-testid="screen-limit"
            value={settings.screenLimitMin}
            onChange={(e) => updateSettings({ screenLimitMin: Number(e.target.value) })}
            className="mt-1 min-h-[48px] w-full rounded-xl border border-gray-300 bg-white px-3 text-base"
          >
            {LIMITS.map((m) => (
              <option key={m} value={m}>
                {t('settings.minutes', { n: m })}
              </option>
            ))}
          </select>
          <p className="mt-1 text-sm text-muted">{t('settings.screenHelp')}</p>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-ink">🔊 {t('settings.tts')}</h3>
          <p className="text-sm text-muted" data-testid="tts-status">
            {t('settings.ttsStatus', {
              bn: hasVoice('bn') ? t('settings.available') : t('settings.unavailable'),
              en: hasVoice('en') ? t('settings.available') : t('settings.unavailable'),
            })}
          </p>
        </section>

        <section className="space-y-3 border-t border-gray-200 pt-4">
          <div>
            <Button variant="secondary" onClick={exportData} testId="export">
              ⬇️ {t('settings.export')}
            </Button>
            <p className="mt-1 text-sm text-muted">{t('settings.exportHelp')}</p>
          </div>
          <div>
            {!confirmReset ? (
              <Button variant="danger" onClick={() => setConfirmReset(true)} testId="reset">
                ↺ {t('settings.reset')}
              </Button>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-red-700">{t('settings.resetConfirm')}</span>
                <Button
                  variant="danger"
                  testId="reset-confirm"
                  onClick={async () => {
                    await resetDemo();
                    setConfirmReset(false);
                    onClose();
                  }}
                >
                  ✓ {t('settings.reset')}
                </Button>
                <Button variant="secondary" onClick={() => setConfirmReset(false)}>
                  {t('offline.cancel')}
                </Button>
              </div>
            )}
            <p className="mt-1 text-sm text-muted">{t('settings.resetHelp')}</p>
          </div>
        </section>
      </div>
    </Modal>
  );
}
