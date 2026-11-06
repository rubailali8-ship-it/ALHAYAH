import type { Bi, ChoiceQuestion, Option, ParentConfirmQuestion, TextLang } from '../types/content';

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
export const bnNum = (n: number): string =>
  String(n)
    .split('')
    .map((d) => (/\d/.test(d) ? BN_DIGITS[Number(d)] : d))
    .join('');

const EN_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
const BN_WORDS = ['শূন্য', 'এক', 'দুই', 'তিন', 'চার', 'পাঁচ', 'ছয়', 'সাত', 'আট', 'নয়', 'দশ'];

export const numberOption = (n: number): Option => ({
  id: String(n),
  visual: String(n),
  label: { bn: `${bnNum(n)} · ${BN_WORDS[n] ?? ''}`, en: EN_WORDS[n] ?? String(n) },
});

/** Option tuple: [id, visual, label?, visualLang?] */
export type Opt = [string, string, (string | Bi)?, TextLang?];
export const opts = (list: Opt[]): Option[] =>
  list.map(([id, visual, label, visualLang]) => ({ id, visual, label, visualLang }));

export const choice = (
  id: string,
  prompt: Bi,
  options: Opt[],
  answer: string,
  hint: Bi,
  visual?: string,
  visualLang?: TextLang,
): ChoiceQuestion => ({ kind: 'choice', id, prompt, options: opts(options), answer, hint, visual, visualLang });

export const confirm = (id: string, prompt: Bi, hint: Bi, visual?: string, visualLang?: TextLang, textRefs?: number[]): ParentConfirmQuestion => ({
  kind: 'parent_confirm',
  id,
  prompt,
  hint,
  visual,
  visualLang,
  textRefs,
});

const COUNT_HINT: Bi = {
  bn: 'প্রতিটির উপর আঙুল রেখে এক, দুই, তিন… করে গোনো।',
  en: 'Touch each one and count: one, two, three…',
};

/** Counting question: show n copies of an emoji, choose the number. */
export const countQ = (id: string, emoji: string, thing: Bi, n: number, options: number[]): ChoiceQuestion => ({
  kind: 'choice',
  id,
  prompt: { bn: `কয়টা ${thing.bn}? গুনে দেখো!`, en: `How many ${thing.en}? Let's count!` },
  visual: emoji.repeat(n),
  options: options.map(numberOption),
  answer: String(n),
  hint: COUNT_HINT,
});

/** "Tap the group with n" question. */
export const groupQ = (id: string, emoji: string, thing: Bi, n: number, groups: number[]): ChoiceQuestion => ({
  kind: 'choice',
  id,
  prompt: {
    bn: `কোন দলে ${bnNum(n)}টা ${thing.bn} আছে? সেটায় চাপ দাও।`,
    en: `Tap the group with ${n} ${thing.en}.`,
  },
  options: groups.map((g) => ({ id: String(g), visual: emoji.repeat(g) })),
  answer: String(n),
  hint: { bn: 'প্রতিটি দল আলাদা করে গুনে দেখো।', en: 'Count each group one by one.' },
});

const SOURCE_ORIGINAL =
  'Original content written for this prototype. Informally aligned with NCF-FS 2022 goal areas; not an official or affiliated curriculum.';
export const sourceOriginal = (extra?: string) => (extra ? `${SOURCE_ORIGINAL} ${extra}` : SOURCE_ORIGINAL);
