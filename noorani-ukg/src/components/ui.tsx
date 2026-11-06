import { type ReactNode, useEffect, useRef } from 'react';
import type { Subject, TextLang } from '../types/content';

export const SUBJECT_STYLE: Record<Subject, { bg: string; text: string; icon: string; ring: string }> = {
  maths: { bg: 'bg-sky-50', text: 'text-sky-600', icon: '🔢', ring: 'border-sky-100' },
  english: { bg: 'bg-lilac-50', text: 'text-lilac-600', icon: '🔤', ring: 'border-lilac-100' },
  bengali: { bg: 'bg-peach-50', text: 'text-peach-600', icon: 'অ', ring: 'border-peach-100' },
  world: { bg: 'bg-sun-50', text: 'text-sun-600', icon: '🌱', ring: 'border-sun-100' },
  islamic: { bg: 'bg-sage-50', text: 'text-sage-700', icon: '🌙', ring: 'border-sage-100' },
};

export function scriptOf(text: string, hint?: TextLang): TextLang | 'other' {
  if (hint) return hint;
  if (/[؀-ۿ]/.test(text)) return 'ar';
  if (/[ঀ-৿]/.test(text)) return 'bn';
  return 'other';
}

/** Big visual (emoji / letters) with the right font for its script. */
export function Visual({ text, lang, className = '' }: { text: string; lang?: TextLang; className?: string }) {
  const script = scriptOf(text, lang);
  const font = script === 'ar' ? 'font-ar leading-[1.9]' : script === 'bn' ? 'font-bn leading-[1.6]' : 'leading-tight';
  return (
    <span dir={script === 'ar' ? 'rtl' : undefined} lang={script === 'ar' ? 'ar' : script === 'bn' ? 'bn' : undefined} className={`${font} ${className}`}>
      {text}
    </span>
  );
}

export function Pill({ children, tone = 'muted', testId }: { children: ReactNode; tone?: 'muted' | 'review' | 'demo' | 'done' | 'progress' | 'wait'; testId?: string }) {
  const tones = {
    muted: 'bg-gray-100 text-gray-700',
    review: 'bg-amber-100 text-amber-900 border border-amber-300',
    demo: 'bg-lilac-100 text-lilac-600',
    done: 'bg-sage-100 text-sage-700',
    progress: 'bg-sky-100 text-sky-600',
    wait: 'bg-peach-100 text-peach-600',
  };
  return (
    <span data-testid={testId} className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function DemoTag() {
  return <Pill tone="demo">DEMO</Pill>;
}

export function Card({ children, className = '', testId }: { children: ReactNode; className?: string; testId?: string }) {
  return (
    <section data-testid={testId} className={`rounded-xl2 border border-gray-100 bg-white p-4 shadow-sm ${className}`}>
      {children}
    </section>
  );
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  className = '',
  disabled,
  testId,
  type = 'button',
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  className?: string;
  disabled?: boolean;
  testId?: string;
  type?: 'button' | 'submit';
}) {
  const styles = {
    primary: 'bg-sage-600 text-white hover:bg-sage-700',
    secondary: 'bg-white text-ink border border-gray-300 hover:bg-gray-50',
    ghost: 'bg-transparent text-sage-700 hover:bg-sage-50',
    danger: 'bg-white text-red-700 border border-red-300 hover:bg-red-50',
  };
  return (
    <button
      type={type}
      data-testid={testId}
      disabled={disabled}
      onClick={onClick}
      className={`min-h-[44px] rounded-xl px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function Modal({ children, onClose, title, testId }: { children: ReactNode; onClose: () => void; title: string; testId?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    ref.current?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/30 sm:items-center" onClick={onClose}>
      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        data-testid={testId}
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-cream p-5 outline-none sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export function Meter({ value, max, testId }: { value: number; max: number; testId?: string }) {
  const pct = Math.min(100, Math.round((value / Math.max(1, max)) * 100));
  const color = pct >= 100 ? 'bg-peach-600' : pct >= 80 ? 'bg-amber-500' : 'bg-sage-600';
  return (
    <div data-testid={testId} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
      <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
    </div>
  );
}
