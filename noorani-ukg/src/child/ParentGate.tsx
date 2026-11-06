import { useEffect, useRef, useState } from 'react';
import { useT } from '../i18n';

const HOLD_MS = 3000;

/** Parent gate: press and hold for 3 seconds. Keyboard: hold Space/Enter. */
export function ParentGate({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
  const { t } = useT();
  const [progress, setProgress] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number>();
  const doneRef = useRef(false);

  const stop = () => {
    startRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (!doneRef.current) setProgress(0);
  };

  const loop = () => {
    if (startRef.current == null) return;
    const p = Math.min(1, (performance.now() - startRef.current) / HOLD_MS);
    setProgress(p);
    if (p >= 1) {
      doneRef.current = true;
      startRef.current = null;
      onSuccess();
      return;
    }
    rafRef.current = requestAnimationFrame(loop);
  };

  const start = () => {
    if (startRef.current != null || doneRef.current) return;
    startRef.current = performance.now();
    rafRef.current = requestAnimationFrame(loop);
  };

  useEffect(
    () => () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  const deg = Math.round(progress * 360);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-6" data-testid="parent-gate">
      <div className="w-full max-w-xs rounded-3xl bg-white p-6 text-center shadow-xl">
        <h2 className="mb-1 text-lg font-bold text-ink">{t('gate.title')}</h2>
        <p className="mb-5 text-sm text-muted">{progress > 0 ? t('gate.holding') : t('gate.hold')}</p>
        <button
          type="button"
          data-testid="gate-hold"
          aria-label={t('gate.hold')}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture?.(e.pointerId);
            start();
          }}
          onPointerUp={stop}
          onPointerCancel={stop}
          onPointerLeave={stop}
          onKeyDown={(e) => {
            if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
              e.preventDefault();
              start();
            }
          }}
          onKeyUp={stop}
          onContextMenu={(e) => e.preventDefault()}
          className="mx-auto flex h-28 w-28 select-none items-center justify-center rounded-full"
          style={{ background: `conic-gradient(#2F6B4A ${deg}deg, #DCEDE2 ${deg}deg)`, touchAction: 'none' }}
        >
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-3xl">🔒</span>
        </button>
        <button type="button" onClick={onCancel} className="mt-5 min-h-[44px] text-sm font-semibold text-sage-700" data-testid="gate-cancel">
          {t('gate.cancel')}
        </button>
      </div>
    </div>
  );
}
