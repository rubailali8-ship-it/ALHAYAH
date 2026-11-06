// Islamic lessons. Rules followed here:
// - Qur'anic text is NEVER typed from memory: it comes only from quran-text.json (Tanzil).
//   Missing verses render as a clearly marked placeholder.
// - Duas: only short, well-known wording with a named hadith reference. Every item needsReview.
// - Arabic letters: letter form + transliterated name only; no invented pronunciation guides.
// - Islamic content is never spoken by TTS (tts: false).
import type { ArabicText, Bi, IslamicLesson } from '../../types/content';
import { choice, confirm } from '../helpers';
import quran from './quran-text.json';

export const QURAN_PLACEHOLDER = '[QURAN TEXT — INSERT FROM VERIFIED SOURCE]';

const verses = quran.verses as Record<string, string | null>;
export const quranMeta = {
  fetched: quran.fetched,
  source: quran.source,
  license: quran.license as string | null,
};

const MEANING_PENDING: Bi = {
  bn: 'অর্থ: একটি যাচাইকৃত অনুবাদ থেকে যোগ করতে হবে।',
  en: 'Meaning: to be added from a verified translation.',
};

const ayah = (surah: number, aya: number): ArabicText => ({
  arabic: verses[`${surah}:${aya}`] ?? null,
  placeholder: QURAN_PLACEHOLDER,
  meaning: MEANING_PENDING,
  reference: `Qur'an ${surah}:${aya} — Uthmani text from Tanzil.net${quran.fetched ? '' : ' (not yet fetched)'}`,
  audioUrl: null,
});

const ISLAMIC_SOURCE_LETTERS =
  'Standard Arabic alphabet letter forms and names (transliterated). No pronunciation guide given — to be taught by parent/teacher. Needs review by an alim/Qur\'an teacher.';

const recite: Bi = {
  bn: 'অভিভাবক তিলাওয়াত করবেন, শিশু শুনে পুনরাবৃত্তি করবে। অ্যাপ এটি পড়ে শোনায় না।',
  en: 'The parent recites, the child listens and repeats. The app does not read this aloud.',
};

const LETTER_HINT_MATCH: Bi = { bn: 'উপরের বর্ণের মতো দেখতে কোনটা?', en: 'Which one looks like the letter at the top?' };

export const islamicLessons: IslamicLesson[] = [
  {
    kind: 'islamic',
    id: 'd1-islamic',
    subject: 'islamic',
    day: 1,
    tts: false,
    title: { bn: 'আরবি বর্ণ ا (আলিফ), ب (বা)', en: 'Arabic letters ا (Alif) and ب (Ba)' },
    objective: {
      bn: 'শিশু ا আলিফ ও ب বা চিনবে এবং নাম বলবে।',
      en: 'Child recognises ا Alif and ب Ba and says their names.',
    },
    materials: { bn: 'কাগজ ও পেন্সিল', en: 'Paper and pencil' },
    difficulty: 1,
    durationMin: 4,
    skill: 'arabic-letters',
    guideLine: { bn: 'চলো আরবির প্রথম দুটি বর্ণ দেখি!', en: "Let's look at the first two Arabic letters!" },
    texts: [],
    explanation: [
      { text: { bn: 'এটি আলিফ (Alif)। সোজা দাঁড়ানো একটা দাগ।', en: 'This is Alif. A straight standing line.' }, visual: 'ا', visualLang: 'ar' },
      { text: { bn: 'এটি বা (Ba)। নিচে একটা বিন্দু।', en: 'This is Ba. It has one dot below.' }, visual: 'ب', visualLang: 'ar' },
      { text: { bn: 'নামগুলো অভিভাবক বলবেন, শিশু পুনরাবৃত্তি করবে।', en: 'Your parent says the names; you repeat.' }, visual: 'ا  ب', visualLang: 'ar' },
    ],
    interactiveQuestions: [
      {
        skill: 'arabic-letters',
        base: choice(
          'd1i-q1',
          { bn: 'কোনটা আলিফ?', en: 'Which one is Alif?' },
          [['alif', 'ا', undefined, 'ar'], ['ba', 'ب', undefined, 'ar']],
          'alif',
          { bn: 'আলিফ সোজা দাঁড়িয়ে থাকে, কোনো বিন্দু নেই।', en: 'Alif stands straight and has no dot.' },
        ),
        simpler: choice(
          'd1i-q1s',
          { bn: 'একই রকম বর্ণটা খোঁজো।', en: 'Find the same letter.' },
          [['alif', 'ا', undefined, 'ar'], ['ba', 'ب', undefined, 'ar']],
          'alif',
          LETTER_HINT_MATCH,
          'ا',
          'ar',
        ),
        harder: choice(
          'd1i-q1h',
          { bn: 'কোনটা বা?', en: 'Which one is Ba?' },
          [['ta', 'ت', undefined, 'ar'], ['ba', 'ب', undefined, 'ar'], ['alif', 'ا', undefined, 'ar']],
          'ba',
          { bn: 'বা-এর বিন্দু নিচে।', en: 'Ba has its dot below.' },
        ),
      },
      {
        skill: 'arabic-letters',
        base: choice(
          'd1i-q2',
          { bn: 'কোন বর্ণের নিচে একটা বিন্দু আছে?', en: 'Which letter has one dot below?' },
          [['ba', 'ب', undefined, 'ar'], ['alif', 'ا', undefined, 'ar']],
          'ba',
          { bn: 'বর্ণের নিচের দিকে তাকাও।', en: 'Look underneath each letter.' },
        ),
        simpler: choice(
          'd1i-q2s',
          { bn: 'একই রকম বর্ণটা খোঁজো।', en: 'Find the same letter.' },
          [['alif', 'ا', undefined, 'ar'], ['ba', 'ب', undefined, 'ar']],
          'ba',
          LETTER_HINT_MATCH,
          'ب',
          'ar',
        ),
      },
      {
        skill: 'arabic-letters',
        base: confirm(
          'd1i-q3',
          { bn: 'অভিভাবকের সাথে বর্ণ দুটি দেখিয়ে নাম বলো: আলিফ, বা।', en: 'Point to each letter and say its name with your parent: Alif, Ba.' },
          { bn: 'আগে অভিভাবক বলবেন।', en: 'Parent says it first.' },
          'ا  ب',
          'ar',
        ),
        simpler: confirm(
          'd1i-q3s',
          { bn: 'অভিভাবকের সাথে শুধু আলিফ দেখিয়ে নাম বলো।', en: 'Point to Alif and say its name with your parent.' },
          { bn: 'আগে অভিভাবক বলবেন।', en: 'Parent says it first.' },
          'ا',
          'ar',
        ),
      },
    ],
    offlineActivity: {
      title: { bn: 'কাগজে আলিফ ও বা', en: 'Alif and Ba on paper' },
      steps: {
        bn: 'আপনি কাগজে বড় করে ا আর ب লিখুন (আরবি ডান থেকে বাঁয়ে লেখা হয়)। শিশু আঙুল দিয়ে তার উপর টানবে এবং নাম বলবে।',
        en: 'Write a large ا and ب on paper (Arabic is written right to left). Your child traces each with a finger and says its name.',
      },
      durationMin: 4,
      extraPractice: {
        bn: 'অতিরিক্ত অনুশীলন: ঘরের মধ্যে ৩টি জায়গায় ا আর ب লেখা কাগজ লুকিয়ে রাখুন; শিশু খুঁজে নাম বলবে।',
        en: 'Extra practice: hide 3 cards with ا or ب around the room; your child finds each one and names it.',
      },
    },
    parentInstructions: {
      bn: 'বর্ণের সঠিক উচ্চারণ আপনি বা শিক্ষক শেখাবেন — অ্যাপ কোনো উচ্চারণ নির্দেশিকা দেয় না।',
      en: 'You or a teacher teach the correct pronunciation — the app does not give a pronunciation guide.',
    },
    completionCriteria: { bn: 'ا ও ب চেনা ও নাম বলা।', en: 'Recognises and names ا and ب.' },
    observationPrompt: { bn: 'শিশু কি বিন্দু দেখে বা চিনতে পেরেছে?', en: 'Did your child use the dot to recognise Ba?' },
    needsReview: true,
    source: ISLAMIC_SOURCE_LETTERS,
  },
  {
    kind: 'islamic',
    id: 'd2-islamic',
    subject: 'islamic',
    day: 2,
    tts: false,
    title: { bn: 'আরবি বর্ণ ت (তা), ث (ছা) ও বিসমিল্লাহ', en: 'Arabic letters ت (Ta), ث (Tha) and Bismillah' },
    objective: {
      bn: 'শিশু ت ও ث চিনবে (বিন্দু গুনে) এবং অভিভাবকের সাথে বিসমিল্লাহ বলবে।',
      en: 'Child recognises ت and ث (by counting dots) and says Bismillah with the parent.',
    },
    materials: { bn: 'কাগজ, পেন্সিল', en: 'Paper, pencil' },
    difficulty: 1,
    durationMin: 4,
    skill: 'arabic-letters',
    guideLine: { bn: 'আজ আরও দুটি বর্ণ — আর একটি সুন্দর শুরু!', en: 'Two more letters today — and a beautiful way to begin!' },
    texts: [ayah(1, 1)],
    explanation: [
      { text: { bn: 'এটি তা (Ta)। উপরে দুটি বিন্দু।', en: 'This is Ta. Two dots above.' }, visual: 'ت', visualLang: 'ar' },
      { text: { bn: 'এটি ছা (Tha)। উপরে তিনটি বিন্দু।', en: 'This is Tha. Three dots above.' }, visual: 'ث', visualLang: 'ar' },
      { text: { bn: 'ভালো কাজ শুরু করার আগে আমরা বিসমিল্লাহ বলি। অভিভাবক বলবেন, তুমি পুনরাবৃত্তি করবে।', en: 'Before starting something good we say Bismillah. Your parent says it, you repeat.' }, visual: '🤲' },
    ],
    interactiveQuestions: [
      {
        skill: 'arabic-letters',
        base: choice(
          'd2i-q1',
          { bn: 'কোন বর্ণের উপরে দুটি বিন্দু?', en: 'Which letter has two dots above?' },
          [['ta', 'ت', undefined, 'ar'], ['tha', 'ث', undefined, 'ar'], ['ba', 'ب', undefined, 'ar']],
          'ta',
          { bn: 'উপরের বিন্দুগুলো গুনে দেখো: এক, দুই।', en: 'Count the dots on top: one, two.' },
        ),
        simpler: choice(
          'd2i-q1s',
          { bn: 'একই রকম বর্ণটা খোঁজো।', en: 'Find the same letter.' },
          [['ta', 'ت', undefined, 'ar'], ['alif', 'ا', undefined, 'ar']],
          'ta',
          LETTER_HINT_MATCH,
          'ت',
          'ar',
        ),
        harder: choice(
          'd2i-q1h',
          { bn: 'কোনটা ছা (Tha)?', en: 'Which one is Tha?' },
          [['ba', 'ب', undefined, 'ar'], ['ta', 'ت', undefined, 'ar'], ['tha', 'ث', undefined, 'ar']],
          'tha',
          { bn: 'ছা-এর উপরে তিনটি বিন্দু।', en: 'Tha has three dots above.' },
        ),
      },
      {
        skill: 'arabic-letters',
        base: choice(
          'd2i-q2',
          { bn: 'এই বর্ণে কয়টি বিন্দু?', en: 'How many dots does this letter have?' },
          [['1', '1'], ['2', '2'], ['3', '3']],
          '3',
          { bn: 'আঙুল দিয়ে প্রতিটি বিন্দু ছুঁয়ে গোনো।', en: 'Touch each dot and count.' },
          'ث',
          'ar',
        ),
        simpler: choice(
          'd2i-q2s',
          { bn: 'এই বর্ণে কয়টি বিন্দু?', en: 'How many dots does this letter have?' },
          [['1', '1'], ['2', '2']],
          '1',
          { bn: 'নিচে তাকাও — একটা বিন্দু।', en: 'Look below — one dot.' },
          'ب',
          'ar',
        ),
        harder: choice(
          'd2i-q2h',
          { bn: 'কোন বর্ণের বিন্দু নিচে?', en: 'Which letter has its dot below?' },
          [['ta', 'ت', undefined, 'ar'], ['ba', 'ب', undefined, 'ar'], ['tha', 'ث', undefined, 'ar']],
          'ba',
          { bn: 'বা-এর বিন্দু নিচে থাকে।', en: 'Ba keeps its dot underneath.' },
        ),
      },
      {
        skill: 'duas',
        base: confirm(
          'd2i-q3',
          { bn: 'অভিভাবকের সাথে বিসমিল্লাহ বলো।', en: 'Say Bismillah together with your parent.' },
          recite,
          '🤲',
          undefined,
          [0],
        ),
        simpler: confirm(
          'd2i-q3s',
          { bn: 'অভিভাবক বলবেন, তুমি শুনবে — তারপর একসাথে বলো।', en: 'Listen to your parent first, then say it together.' },
          recite,
          '🤲',
          undefined,
          [0],
        ),
      },
    ],
    offlineActivity: {
      title: { bn: 'বিন্দু গোনার খেলা ও বিসমিল্লাহ', en: 'Dot game and Bismillah' },
      steps: {
        bn: 'কাগজে ب ت ث লিখুন (বিন্দু ছাড়া)। শিশু সঠিক সংখ্যক বিন্দু বসাবে। আঁকা শুরুর আগে একসাথে বিসমিল্লাহ বলুন।',
        en: 'Write ب ت ث on paper without dots. Your child adds the right number of dots. Say Bismillah together before drawing.',
      },
      durationMin: 4,
      extraPractice: {
        bn: 'অতিরিক্ত অনুশীলন: আঙুলের ছাপ দিয়ে বিন্দু বসানো — ত-তে ২টি, ছা-তে ৩টি।',
        en: 'Extra practice: use fingerprints as dots — 2 for Ta, 3 for Tha.',
      },
    },
    parentInstructions: {
      bn: 'বিসমিল্লাহ আপনি নিজে তিলাওয়াত করে শোনান। অ্যাপে কুরআনের লেখা যাচাইকৃত উৎস (Tanzil) থেকে না আসা পর্যন্ত একটি চিহ্নিত স্থানধারক দেখাবে।',
      en: "Recite Bismillah yourself. The Qur'anic text shows a marked placeholder until it is filled from a verified source (Tanzil).",
    },
    completionCriteria: { bn: 'ت ও ث চেনা; অভিভাবকের সাথে বিসমিল্লাহ বলা।', en: 'Recognises ت and ث; says Bismillah with the parent.' },
    observationPrompt: { bn: 'শিশু কি বিন্দু গুনে বর্ণ আলাদা করতে পেরেছে?', en: 'Could your child tell the letters apart by counting dots?' },
    needsReview: true,
    source: `${ISLAMIC_SOURCE_LETTERS} Bismillah text: Qur'an 1:1 via Tanzil.net (placeholder until fetched).`,
  },
  {
    kind: 'islamic',
    id: 'd3-islamic',
    subject: 'islamic',
    day: 3,
    tts: false,
    title: { bn: 'খাওয়ার আগের দোয়া', en: 'Dua before eating' },
    objective: {
      bn: 'শিশু খাওয়ার আগে "বিসমিল্লাহ" বলবে এবং ডান হাতে খাবে।',
      en: 'Child says "Bismillah" before eating and eats with the right hand.',
    },
    materials: { bn: 'পরের খাবারের সময়', en: 'The next mealtime' },
    difficulty: 1,
    durationMin: 4,
    skill: 'duas',
    guideLine: { bn: 'খাওয়ার আগে আমরা কী বলি? চলো শিখি!', en: 'What do we say before we eat? Let\'s learn!' },
    texts: [
      {
        arabic: 'بِسْمِ اللَّهِ',
        transliteration: 'Bismillah',
        meaning: { bn: 'আল্লাহর নামে', en: 'In the name of Allah' },
        reference:
          'Sahih al-Bukhari 5376; Sahih Muslim 2022 — the Prophet ﷺ told a boy (Umar ibn Abi Salamah) to mention Allah\'s name, eat with his right hand and eat from what is near him. (Reference numbers to be verified.)',
        audioUrl: null,
      },
    ],
    explanation: [
      { text: { bn: 'খাওয়ার আগে আমরা বলি: বিসমিল্লাহ।', en: 'Before eating we say: Bismillah.' }, visual: '🍚 🤲' },
      { text: { bn: 'আমরা ডান হাতে খাই।', en: 'We eat with our right hand.' }, visual: '👉 🍚' },
    ],
    interactiveQuestions: [
      {
        skill: 'duas',
        base: choice(
          'd3i-q1',
          { bn: 'খাওয়া শুরুর আগে আমরা কী বলি?', en: 'What do we say before we start eating?' },
          [
            ['bismillah', '🤲', { bn: 'বিসমিল্লাহ', en: 'Bismillah' }],
            ['bye', '👋', { bn: 'টা-টা', en: 'Bye-bye' }],
            ['nothing', '🤐', { bn: 'কিছু না', en: 'Nothing' }],
          ],
          'bismillah',
          { bn: 'আল্লাহর নামে শুরু করি…', en: 'We begin in the name of Allah…' },
        ),
        simpler: choice(
          'd3i-q1s',
          { bn: 'খাওয়ার আগে আমরা কী বলি?', en: 'What do we say before eating?' },
          [
            ['bismillah', '🤲', { bn: 'বিসমিল্লাহ', en: 'Bismillah' }],
            ['bye', '👋', { bn: 'টা-টা', en: 'Bye-bye' }],
          ],
          'bismillah',
          { bn: 'দুই হাত তোলা ছবিটা দেখো।', en: 'Look at the picture with raised hands.' },
        ),
      },
      {
        skill: 'duas',
        base: choice(
          'd3i-q2',
          { bn: 'আমরা কোন হাতে খাই?', en: 'Which hand do we eat with?' },
          [
            ['right', '👉', { bn: 'ডান হাত', en: 'Right hand' }],
            ['left', '👈', { bn: 'বাঁ হাত', en: 'Left hand' }],
          ],
          'right',
          { bn: 'অভিভাবক তোমার ডান হাত ধরে দেখাবেন।', en: 'Your parent will hold up your right hand.' },
        ),
        simpler: choice(
          'd3i-q2s',
          { bn: 'অভিভাবক যে হাত তুলেছেন, সেটা দেখাও।', en: 'Tap the hand your parent is holding up (right).' },
          [
            ['right', '👉', { bn: 'ডান হাত', en: 'Right hand' }],
            ['left', '👈', { bn: 'বাঁ হাত', en: 'Left hand' }],
          ],
          'right',
          { bn: 'ডান দিকে আঙুল দেখানো ছবিটা।', en: 'The picture pointing right.' },
        ),
      },
      {
        skill: 'duas',
        base: confirm(
          'd3i-q3',
          { bn: 'অভিভাবকের সাথে বলো: বিসমিল্লাহ।', en: 'Say with your parent: Bismillah.' },
          recite,
          '🤲',
          undefined,
          [0],
        ),
        simpler: confirm(
          'd3i-q3s',
          { bn: 'অভিভাবকের কথা শুনে আস্তে আস্তে বলো।', en: 'Listen to your parent and say it slowly.' },
          recite,
          '🤲',
          undefined,
          [0],
        ),
      },
    ],
    offlineActivity: {
      title: { bn: 'খাবারের সময় অনুশীলন', en: 'Practise at mealtime' },
      steps: {
        bn: 'পরের খাবারে খাওয়ার আগে একসাথে বিসমিল্লাহ বলুন এবং শিশু ডান হাতে খাবে। প্লেটের কাছের দিক থেকে খেতে মনে করিয়ে দিন।',
        en: 'At the next meal, say Bismillah together before eating and your child eats with the right hand. Remind them to eat from the side of the plate nearest to them.',
      },
      durationMin: 4,
      extraPractice: {
        bn: 'অতিরিক্ত অনুশীলন: খেলনা রান্নাবাটি দিয়ে "খাওয়ার খেলা" — খেলার আগে বিসমিল্লাহ বলা।',
        en: 'Extra practice: pretend-play a meal with toy dishes and say Bismillah before "eating".',
      },
    },
    parentInstructions: {
      bn: 'দোয়াটি আপনি নিজে উচ্চারণ করে শেখান। রেফারেন্স নম্বরগুলো একজন আলিম যাচাই করবেন।',
      en: 'Say the dua yourself to teach it. The hadith reference numbers are pending review by an alim.',
    },
    completionCriteria: { bn: 'খাওয়ার আগে বিসমিল্লাহ বলা ও ডান হাতে খাওয়া।', en: 'Says Bismillah before a meal and eats with the right hand.' },
    observationPrompt: { bn: 'শিশু কি নিজে থেকে বিসমিল্লাহ বলেছে?', en: 'Did your child say Bismillah without being reminded?' },
    needsReview: true,
    source: 'Hadith: Sahih al-Bukhari 5376; Sahih Muslim 2022 (wording "Bismillah"). Needs review by an alim.',
  },
  {
    kind: 'islamic',
    id: 'd4-islamic',
    subject: 'islamic',
    day: 4,
    tts: false,
    title: { bn: 'আদব: সালাম দেওয়া', en: 'Adab: greeting with Salam' },
    objective: {
      bn: 'শিশু দেখা হলে সালাম দেবে এবং সালামের উত্তর দেবে।',
      en: 'Child greets with Salam and replies to Salam.',
    },
    materials: { bn: 'কিছু লাগবে না', en: 'Nothing needed' },
    difficulty: 1,
    durationMin: 4,
    skill: 'adab',
    guideLine: { bn: 'কারও সাথে দেখা হলে আমরা কী বলি?', en: 'What do we say when we meet someone?' },
    texts: [
      {
        arabic: 'السَّلَامُ عَلَيْكُمْ',
        transliteration: 'As-salamu alaykum',
        meaning: { bn: 'আপনার উপর শান্তি বর্ষিত হোক', en: 'Peace be upon you' },
        reference: 'Greeting taught in Sahih al-Bukhari 6227; spreading Salam: Sahih Muslim 54. (Reference numbers to be verified.)',
        audioUrl: null,
      },
      {
        arabic: 'وَعَلَيْكُمُ السَّلَامُ',
        transliteration: 'Wa alaykumus-salam',
        meaning: { bn: 'আপনার উপরও শান্তি বর্ষিত হোক', en: 'And upon you be peace' },
        reference: 'Standard reply to the Salam. (To be verified.)',
        audioUrl: null,
      },
    ],
    explanation: [
      { text: { bn: 'দেখা হলে আমরা বলি: আসসালামু আলাইকুম।', en: 'When we meet someone we say: As-salamu alaykum.' }, visual: '🙋' },
      { text: { bn: 'কেউ সালাম দিলে উত্তর দিই: ওয়া আলাইকুমুস সালাম।', en: 'When someone greets us, we reply: Wa alaykumus-salam.' }, visual: '😊' },
    ],
    interactiveQuestions: [
      {
        skill: 'adab',
        base: choice(
          'd4i-q1',
          { bn: 'কারও সাথে দেখা হলে আমরা কী বলি?', en: 'What do we say when we meet someone?' },
          [
            ['salam', '🙋', { bn: 'আসসালামু আলাইকুম', en: 'As-salamu alaykum' }],
            ['nothing', '🙈', { bn: 'কিছু না বলা', en: 'Say nothing' }],
            ['bye', '👋', { bn: 'টা-টা', en: 'Bye-bye' }],
          ],
          'salam',
          { bn: 'শান্তির শুভেচ্ছা…', en: 'The greeting of peace…' },
        ),
        simpler: choice(
          'd4i-q1s',
          { bn: 'দেখা হলে আমরা কী বলি?', en: 'What do we say when we meet?' },
          [
            ['salam', '🙋', { bn: 'আসসালামু আলাইকুম', en: 'As-salamu alaykum' }],
            ['nothing', '🙈', { bn: 'কিছু না বলা', en: 'Say nothing' }],
          ],
          'salam',
          { bn: 'হাত তুলে হাসিমুখ ছবিটা।', en: 'The smiling picture with a raised hand.' },
        ),
      },
      {
        skill: 'adab',
        base: choice(
          'd4i-q2',
          { bn: 'কেউ তোমাকে সালাম দিলে তুমি কী বলবে?', en: 'Someone says As-salamu alaykum to you. What do you reply?' },
          [
            ['reply', '😊', { bn: 'ওয়া আলাইকুমুস সালাম', en: 'Wa alaykumus-salam' }],
            ['bismillah', '🤲', { bn: 'বিসমিল্লাহ', en: 'Bismillah' }],
          ],
          'reply',
          { bn: 'উত্তরটা শুরু হয় "ওয়া" দিয়ে।', en: 'The reply begins with "Wa".' },
        ),
        simpler: confirm(
          'd4i-q2s',
          { bn: 'অভিভাবক সালাম দেবেন, তুমি তার সাথে উত্তর বলো।', en: 'Your parent greets you; say the reply together.' },
          { bn: 'ওয়া আলাইকুমুস সালাম — অভিভাবকের সাথে।', en: 'Wa alaykumus-salam — together with your parent.' },
          '😊',
          undefined,
          [1],
        ),
      },
      {
        skill: 'adab',
        base: confirm(
          'd4i-q3',
          { bn: 'অভিনয় করো: তুমি সালাম দাও, অভিভাবক উত্তর দেবেন। তারপর উল্টো।', en: 'Role-play: you give Salam, your parent replies. Then swap.' },
          { bn: 'হাসিমুখে বলো।', en: 'Say it with a smile.' },
          '🙋 😊',
          undefined,
          [0, 1],
        ),
        simpler: confirm(
          'd4i-q3s',
          { bn: 'অভিভাবককে একবার সালাম দাও।', en: 'Give Salam to your parent once.' },
          { bn: 'আসসালামু আলাইকুম।', en: 'As-salamu alaykum.' },
          '🙋',
          undefined,
          [0],
        ),
      },
    ],
    offlineActivity: {
      title: { bn: 'বাড়ির সবাইকে সালাম', en: 'Salam to everyone at home' },
      steps: {
        bn: 'আজ শিশু বাড়ির প্রত্যেককে প্রথম দেখায় সালাম দেবে। কেউ সালাম দিলে উত্তর দেবে।',
        en: 'Today your child greets everyone at home with Salam the first time they see them, and replies when greeted.',
      },
      durationMin: 4,
      extraPractice: {
        bn: 'অতিরিক্ত অনুশীলন: পুতুল বা খেলনা দিয়ে সালাম দেওয়া-নেওয়ার খেলা।',
        en: 'Extra practice: a Salam game with dolls or toys greeting each other.',
      },
    },
    parentInstructions: {
      bn: 'নিজে আগে সালাম দিয়ে উদাহরণ তৈরি করুন। রেফারেন্স নম্বর আলিম যাচাই করবেন।',
      en: 'Model it by giving Salam first yourself. Reference numbers are pending review by an alim.',
    },
    completionCriteria: { bn: 'সালাম দেওয়া ও উত্তর দেওয়া।', en: 'Gives Salam and replies to Salam.' },
    observationPrompt: { bn: 'শিশু কি নিজে থেকে কাউকে সালাম দিয়েছে?', en: 'Did your child give Salam to someone on their own?' },
    needsReview: true,
    source: 'Hadith: Sahih al-Bukhari 6227; Sahih Muslim 54. Needs review by an alim.',
  },
  {
    kind: 'islamic',
    id: 'd5-islamic',
    subject: 'islamic',
    day: 5,
    tts: false,
    title: { bn: 'সূরা আল-ইখলাস (শুনি ও পুনরাবৃত্তি করি)', en: 'Surah Al-Ikhlas (listen and repeat with parent)' },
    objective: {
      bn: 'শিশু অভিভাবকের তিলাওয়াত শুনে সূরা আল-ইখলাসের প্রতিটি আয়াত পুনরাবৃত্তি করবে।',
      en: 'Child listens to the parent recite Surah Al-Ikhlas and repeats each ayah.',
    },
    materials: { bn: 'শান্ত জায়গা', en: 'A quiet place' },
    difficulty: 2,
    durationMin: 5,
    skill: 'quran',
    guideLine: { bn: 'আজ আমরা একটি ছোট সূরা শুনব — অভিভাবকের কাছ থেকে।', en: 'Today we listen to a short surah — from your parent.' },
    texts: [ayah(112, 1), ayah(112, 2), ayah(112, 3), ayah(112, 4)],
    explanation: [
      { text: { bn: 'সূরা আল-ইখলাস একটি ছোট সূরা। এতে ৪টি আয়াত।', en: 'Surah Al-Ikhlas is a short surah with 4 ayat.' }, visual: '📖' },
      { text: { bn: 'অভিভাবক এক আয়াত করে তিলাওয়াত করবেন, তুমি শুনে পুনরাবৃত্তি করবে।', en: 'Your parent recites one ayah at a time; you listen and repeat.' }, visual: '👂 🗣️' },
    ],
    interactiveQuestions: [1, 2, 3, 4].map((n) => ({
      skill: 'quran',
      base: confirm(
        `d5i-q${n}`,
        { bn: `আয়াত ${['১', '২', '৩', '৪'][n - 1]}: অভিভাবকের তিলাওয়াত শোনো, তারপর পুনরাবৃত্তি করো।`, en: `Ayah ${n}: listen to your parent, then repeat.` },
        recite,
        '👂',
        undefined,
        [n - 1],
      ),
      simpler: confirm(
        `d5i-q${n}s`,
        { bn: `আয়াত ${['১', '২', '৩', '৪'][n - 1]}: আবার শোনো, শুধু প্রথম অংশটা একসাথে বলো।`, en: `Ayah ${n}: listen again and say just the first part together.` },
        recite,
        '👂',
        undefined,
        [n - 1],
      ),
    })),
    offlineActivity: {
      title: { bn: 'দিনে আরও দুইবার শোনা', en: 'Listen twice more today' },
      steps: {
        bn: 'আজ আরও দুইবার (যেমন ঘুমানোর আগে) অভিভাবক সূরাটি তিলাওয়াত করবেন, শিশু সাথে সাথে পুনরাবৃত্তি করবে।',
        en: 'Recite the surah twice more today (for example before sleep); your child repeats after you.',
      },
      durationMin: 4,
      extraPractice: {
        bn: 'অতিরিক্ত অনুশীলন: শুধু প্রথম আয়াতটি ৩ বার একসাথে।',
        en: 'Extra practice: just the first ayah, 3 times together.',
      },
    },
    parentInstructions: {
      bn: 'অ্যাপ কখনো কুরআন পড়ে শোনায় না। আপনার নিজের তিলাওয়াত বা যাচাইকৃত রেকর্ডিং ব্যবহার করুন।',
      en: 'The app never reads the Qur\'an aloud. Use your own recitation or a verified recording.',
    },
    completionCriteria: { bn: '৪টি আয়াত শুনে পুনরাবৃত্তি।', en: 'Listens to and repeats all 4 ayat.' },
    observationPrompt: { bn: 'কোন আয়াতটি শিশুর জন্য সবচেয়ে কঠিন ছিল?', en: 'Which ayah was hardest for your child?' },
    needsReview: true,
    source: "Qur'an 112:1–4, Uthmani text from Tanzil.net (placeholder until fetched). Needs review by an alim/Qur'an teacher.",
  },
];
