import { bn, type DictKey } from './bn';
import { en } from './en';
import { useAppState } from '../storage/state';
import type { Bi, Lang } from '../types/content';

const dicts = { bn, en } as const;

export type Params = Record<string, string | number>;

export function translate(lang: Lang, key: DictKey, params?: Params): string {
  let s: string = dicts[lang][key] ?? dicts.bn[key] ?? key;
  if (params) for (const [k, v] of Object.entries(params)) s = s.split(`{${k}}`).join(String(v));
  return s;
}

const BN_DIGITS = '০১২৩৪৫৬৭৮৯';
export const localDigits = (lang: Lang, s: string | number) =>
  lang === 'bn' ? String(s).replace(/\d/g, (d) => BN_DIGITS[Number(d)]) : String(s);

/** Hook: returns t(), the current language and a picker for bilingual content. */
export function useT() {
  const lang = useAppState((s) => s.settings.lang);
  const t = (key: DictKey, params?: Params) => {
    const p = params && Object.fromEntries(Object.entries(params).map(([k, v]) => [k, typeof v === 'number' ? localDigits(lang, v) : v]));
    return translate(lang, key, p);
  };
  const pick = (b: Bi | string | undefined) => (b === undefined ? '' : typeof b === 'string' ? b : b[lang]);
  const num = (n: number | string) => localDigits(lang, n);
  return { t, lang, pick, num };
}

export type { DictKey };
