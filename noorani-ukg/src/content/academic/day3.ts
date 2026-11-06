import type { AcademicLesson, Bi } from '../../types/content';
import { bnNum, choice, confirm, sourceOriginal } from '../helpers';

const plates = (id: string, prompt: Bi, emoji: string, a: number, b: number, answer: 'more' | 'less', hint: Bi) =>
  choice(
    id,
    prompt,
    [
      ['a', emoji.repeat(a)],
      ['b', emoji.repeat(b)],
    ],
    (answer === 'more') === a > b ? 'a' : 'b',
    hint,
  );

const MORE: Bi = { bn: 'কোন দিকে বেশি? চাপ দাও।', en: 'Which side has MORE? Tap it.' };
const LESS: Bi = { bn: 'কোন দিকে কম? চাপ দাও।', en: 'Which side has LESS? Tap it.' };
const MORE_HINT: Bi = { bn: 'দুই দিক গুনে দেখো — যেটার সংখ্যা বড়।', en: 'Count both sides — the bigger number.' };
const LESS_HINT: Bi = { bn: 'দুই দিক গুনে দেখো — যেটার সংখ্যা ছোট।', en: 'Count both sides — the smaller number.' };

const bigger = (id: string, a: number, b: number): ReturnType<typeof choice> =>
  choice(
    id,
    { bn: `কোন সংখ্যাটা বড়: ${bnNum(a)} না ${bnNum(b)}?`, en: `Which number is bigger: ${a} or ${b}?` },
    [
      [String(a), String(a)],
      [String(b), String(b)],
    ],
    String(Math.max(a, b)),
    { bn: 'যেটা গুনতে বেশি সময় লাগে, সেটাই বড়।', en: 'The one you reach later when counting is bigger.' },
  );

export const day3: AcademicLesson[] = [
  {
    kind: 'academic',
    id: 'd3-maths',
    subject: 'maths',
    day: 3,
    title: { bn: 'বেশি আর কম', en: 'More and less' },
    objective: { bn: 'শিশু দুটি দল তুলনা করে কোনটায় বেশি আর কোনটায় কম বলবে।', en: 'Child compares two groups and says which has more and which has less.' },
    materials: { bn: 'দুটি বাটি, কিছু ডাল বা বিস্কুট', en: 'Two bowls, some lentils or biscuits' },
    difficulty: 2,
    durationMin: 4,
    skill: 'compare',
    guideLine: { bn: 'কার প্লেটে বেশি বিস্কুট? চলো দেখি!', en: 'Whose plate has more biscuits? Let\'s see!' },
    explanation: [
      { text: { bn: 'এখানে ৪টা, ওখানে ২টা। ৪টা বেশি!', en: 'Here 4, there 2. 4 is MORE!' }, visual: '🍪🍪🍪🍪  |  🍪🍪' },
      { text: { bn: 'আর ২টা কম।', en: 'And 2 is LESS.' }, visual: '🍪🍪' },
    ],
    interactiveQuestions: [
      {
        skill: 'compare',
        base: plates('d3m-q1', MORE, '🍪', 4, 2, 'more', MORE_HINT),
        simpler: plates('d3m-q1s', MORE, '🍪', 5, 1, 'more', MORE_HINT),
        harder: plates('d3m-q1h', MORE, '🍪', 4, 5, 'more', MORE_HINT),
      },
      {
        skill: 'compare',
        base: plates('d3m-q2', LESS, '🍊', 3, 6, 'less', LESS_HINT),
        simpler: plates('d3m-q2s', LESS, '🍊', 1, 4, 'less', LESS_HINT),
        harder: plates('d3m-q2h', LESS, '🍊', 7, 6, 'less', LESS_HINT),
      },
      {
        skill: 'compare',
        base: bigger('d3m-q3', 2, 6),
        simpler: bigger('d3m-q3s', 1, 5),
        harder: bigger('d3m-q3h', 8, 6),
      },
    ],
    offlineActivity: {
      title: { bn: 'দুই বাটির খেলা', en: 'Two-bowl game' },
      steps: {
        bn: 'এক বাটিতে কয়েকটা, অন্য বাটিতে আরও কয়েকটা ডাল রাখুন। শিশু বলবে কোনটায় বেশি, তারপর গুনে মিলিয়ে দেখবে। ৩-৪ বার খেলুন।',
        en: 'Put a few lentils in one bowl and a different number in the other. Your child says which has more, then counts to check. Play 3–4 rounds.',
      },
      durationMin: 4,
      extraPractice: {
        bn: 'অতিরিক্ত অনুশীলন: খুব আলাদা সংখ্যা দিয়ে শুরু করুন (১ বনাম ৫), তারপর ধীরে ধীরে কাছাকাছি (৩ বনাম ৪)।',
        en: 'Extra practice: start with very different numbers (1 vs 5), then slowly move closer (3 vs 4).',
      },
    },
    parentInstructions: { bn: 'দেখতে বড় দল মানেই বেশি নয় — শিশুকে গুনে মিলিয়ে দেখতে উৎসাহ দিন।', en: 'A group that looks bigger is not always more — encourage counting to check.' },
    completionCriteria: { bn: 'তিনটি তুলনা সঠিক; বাটির খেলা সম্পন্ন।', en: 'Three comparisons correct; bowl game done.' },
    observationPrompt: { bn: 'শিশু কি দেখে বলেছে, নাকি গুনে মিলিয়েছে?', en: 'Did your child guess by looking, or count to check?' },
    needsReview: false,
    source: sourceOriginal(),
  },
  {
    kind: 'academic',
    id: 'd3-english',
    subject: 'english',
    day: 3,
    teachLang: 'en',
    title: { bn: 'ইংরেজি বর্ণ E, F ও তাদের ধ্বনি', en: 'Letters E, F and their sounds' },
    objective: { bn: 'শিশু E ও F চিনবে এবং /e/ (egg) ও /f/ (fish) ধ্বনি বলবে।', en: 'Child recognises E and F and says /e/ (egg) and /f/ (fish).' },
    materials: { bn: 'কয়েকটা কাঠি বা দেশলাই কাঠি (পোড়া নয়)', en: 'A few sticks or unused matchsticks' },
    difficulty: 1,
    durationMin: 4,
    skill: 'english-letters',
    guideLine: { bn: 'E আর F দেখতে প্রায় একই — চলো পার্থক্য খুঁজি!', en: 'E and F look almost the same — let\'s spot the difference!' },
    explanation: [
      { text: { bn: 'E — এর ধ্বনি /e/, যেমন egg (ডিম)।', en: 'E says /e/ — like egg.' }, visual: 'E e 🥚' },
      { text: { bn: 'F — এর ধ্বনি /f/, যেমন fish (মাছ)।', en: 'F says /f/ — like fish.' }, visual: 'F f 🐟' },
      { text: { bn: 'E-এর নিচে একটা দাগ আছে, F-এর নেই।', en: 'E has a line at the bottom; F does not.' }, visual: 'E  F' },
    ],
    interactiveQuestions: [
      {
        skill: 'english-letters',
        base: choice('d3e-q1', { bn: 'শিশুকে জিজ্ঞেস করুন: কোনটা F?', en: 'Which one is F?' }, [['E', 'E'], ['F', 'F'], ['T', 'T']], 'F', { bn: 'F-এর নিচে কোনো দাগ নেই।', en: 'F has no line at the bottom.' }),
        simpler: choice('d3e-q1s', { bn: 'একই রকম বর্ণটা খোঁজো।', en: 'Find the letter that matches.' }, [['F', 'F'], ['O', 'O']], 'F', { bn: 'উপরের বর্ণের মতো কোনটা?', en: 'Which looks like the letter at the top?' }, 'F'),
        harder: choice('d3e-q1h', { bn: 'ছোট হাতের f কোনটা?', en: 'Which one is small f?' }, [['t', 't'], ['f', 'f'], ['e', 'e']], 'f', { bn: 'f-এর মাথা বাঁকানো লাঠির মতো।', en: 'Small f has a hooked top like a walking stick.' }),
      },
      {
        skill: 'english-letters',
        base: choice('d3e-q2', { bn: 'কোন ছবিটা /e/ ধ্বনি দিয়ে শুরু?', en: 'Which picture starts with /e/?' }, [['egg', '🥚', 'egg'], ['fish', '🐟', 'fish'], ['dog', '🐶', 'dog']], 'egg', { bn: '/e/… e-e-egg।', en: '/e/… e-e-egg.' }),
        simpler: choice('d3e-q2s', { bn: 'কোনটা egg?', en: 'Which one is an egg?' }, [['egg', '🥚', 'egg'], ['ball', '⚽', 'ball']], 'egg', { bn: 'মুরগি যা পাড়ে।', en: 'What a hen lays.' }),
        harder: choice('d3e-q2h', { bn: 'কোন ছবিটা /f/ ধ্বনি দিয়ে শুরু?', en: 'Which picture starts with /f/?' }, [['egg', '🥚', 'egg'], ['cat', '🐱', 'cat'], ['flower', '🌸', 'flower']], 'flower', { bn: 'নিচের ঠোঁটে দাঁত রেখে /f/… f-f-flower।', en: 'Teeth on your bottom lip: /f/… f-f-flower.' }),
      },
      {
        skill: 'english-letters',
        base: confirm('d3e-q3', { bn: 'শিশুর সাথে বলুন: /e/ egg, /f/ fish।', en: 'Say with your grown-up: /e/ egg, /f/ fish.' }, { bn: 'আগে আপনি বলুন।', en: 'Grown-up says it first.' }, 'E 🥚   F 🐟'),
        simpler: confirm('d3e-q3s', { bn: 'শিশুর সাথে শুধু "fish" বলুন।', en: 'Say "fish" with your grown-up.' }, { bn: 'ধীরে: f-i-sh।', en: 'Slowly: f-i-sh.' }, '🐟'),
      },
    ],
    offlineActivity: {
      title: { bn: 'কাঠি দিয়ে E আর F', en: 'Build E and F with sticks' },
      steps: {
        bn: 'কাঠি দিয়ে শিশু E বানাবে (৪টি কাঠি), তারপর একটা কাঠি সরিয়ে F বানাবে। প্রতিবার ধ্বনি বলবে।',
        en: 'Your child builds E with 4 sticks, then removes one stick to make F, saying each sound.',
      },
      durationMin: 4,
      extraPractice: {
        bn: 'অতিরিক্ত অনুশীলন: আপনি কাঠি দিয়ে E বা F বানান, শিশু চিনে বলবে কোনটা — ৫ বার।',
        en: 'Extra practice: you build E or F with sticks and your child names it — 5 rounds.',
      },
    },
    parentInstructions: { bn: 'E আর F-এর পার্থক্য (নিচের দাগ) আঙুল দিয়ে দেখান।', en: 'Point to the difference between E and F (the bottom line).' },
    completionCriteria: { bn: 'E ও F চেনা; কাঠি দিয়ে বানানো।', en: 'Recognises E and F; builds both with sticks.' },
    observationPrompt: { bn: 'শিশু কি E আর F আলাদা করতে পেরেছে?', en: 'Could your child tell E and F apart?' },
    needsReview: false,
    source: sourceOriginal(),
  },
  {
    kind: 'academic',
    id: 'd3-bengali',
    subject: 'bengali',
    day: 3,
    teachLang: 'bn',
    title: { bn: 'স্বরবর্ণ উ, ঊ', en: 'Bengali vowels উ, ঊ' },
    objective: { bn: 'শিশু উ ও ঊ চিনবে: উ-তে উট, ঊ-তে ঊষা।', en: 'Child recognises উ and ঊ: উ for উট (camel), ঊ for ঊষা (dawn).' },
    materials: { bn: 'চালের থালা', en: 'A plate of rice' },
    difficulty: 1,
    durationMin: 4,
    skill: 'bangla-vowels',
    guideLine: { bn: 'আজ উ আর ঊ — একটা উটও আসবে!', en: 'Today উ and ঊ — and a camel is coming!' },
    explanation: [
      { text: { bn: 'উ — উ-তে উট।', en: 'উ (u) — উট, camel.' }, visual: 'উ 🐪' },
      { text: { bn: 'ঊ — ঊ-তে ঊষা (ভোরবেলা)।', en: 'ঊ (long u) — ঊষা, dawn.' }, visual: 'ঊ 🌅' },
      { text: { bn: 'ঊ-এর নিচে একটা বাড়তি লেজ আছে।', en: 'ঊ has an extra tail at the bottom.' }, visual: 'উ  ঊ' },
    ],
    interactiveQuestions: [
      {
        skill: 'bangla-vowels',
        base: choice('d3b-q1', { bn: 'কোনটা উ?', en: 'Which one is উ?' }, [['u', 'উ'], ['uu', 'ঊ'], ['i', 'ই']], 'u', { bn: 'উ-এর নিচে বাড়তি লেজ নেই।', en: 'উ has no extra tail.' }),
        simpler: choice('d3b-q1s', { bn: 'উপরের বর্ণের মতো কোনটা?', en: 'Which one matches the letter at the top?' }, [['u', 'উ'], ['k', 'ক']], 'u', { bn: 'একই রকম দেখতে বর্ণটা খোঁজো।', en: 'Look for the same shape.' }, 'উ'),
        harder: choice('d3b-q1h', { bn: 'উট কোন বর্ণ দিয়ে শুরু?', en: 'Which letter does উট (camel) start with?' }, [['uu', 'ঊ'], ['u', 'উ'], ['a', 'আ']], 'u', { bn: 'উ-তে উট!', en: 'উ for উট!' }, '🐪'),
      },
      {
        skill: 'bangla-vowels',
        base: choice('d3b-q2', { bn: 'উ-তে কী?', en: 'What starts with উ?' }, [['camel', '🐪', 'উট'], ['eagle', '🦅', 'ঈগল'], ['mango', '🥭', 'আম']], 'camel', { bn: 'মরুভূমির প্রাণী, পিঠে কুঁজ।', en: 'A desert animal with a hump.' }),
        simpler: choice('d3b-q2s', { bn: 'কোনটা উট?', en: 'Which one is উট (camel)?' }, [['camel', '🐪', 'উট'], ['fish', '🐟', 'মাছ']], 'camel', { bn: 'যার পিঠে কুঁজ।', en: 'The one with a hump.' }),
        harder: choice('d3b-q2h', { bn: 'ঈ-তে কী? (কালকের পড়া)', en: 'What starts with ঈ? (yesterday)' }, [['camel', '🐪', 'উট'], ['eagle', '🦅', 'ঈগল'], ['mouse', '🐭', 'ইঁদুর']], 'eagle', { bn: 'ঈ-তে ঈগল।', en: 'ঈ for ঈগল.' }),
      },
      {
        skill: 'bangla-vowels',
        base: confirm('d3b-q3', { bn: 'অভিভাবকের সাথে বলো: অ, আ, ই, ঈ, উ, ঊ।', en: 'Say with your grown-up: অ, আ, ই, ঈ, উ, ঊ.' }, { bn: 'আঙুলে গুনে গুনে বলো — ৬টা!', en: 'Count them on your fingers — 6!' }, 'অ আ ই ঈ উ ঊ'),
        simpler: confirm('d3b-q3s', { bn: 'অভিভাবকের সাথে বলো: উ-তে উট।', en: 'Say with your grown-up: উ-তে উট.' }, { bn: 'ধীরে ধীরে বলো।', en: 'Say it slowly.' }, 'উ 🐪'),
      },
    ],
    offlineActivity: {
      title: { bn: 'চালের থালায় উ, ঊ', en: 'উ and ঊ in a rice plate' },
      steps: {
        bn: 'চালের থালায় উ আর ঊ লিখুন; শিশু পাশে লিখবে। তারপর আপনি একটা বর্ণ বলবেন, শিশু খুঁজে আঙুল রাখবে।',
        en: 'Write উ and ঊ in the rice; your child copies them. Then you say a letter and your child points to it.',
      },
      durationMin: 4,
      extraPractice: {
        bn: 'অতিরিক্ত অনুশীলন: ৬টি কার্ডে অ থেকে ঊ লিখে "জোড়া মেলানো" খেলুন।',
        en: 'Extra practice: write অ to ঊ on 6 cards and play a matching game.',
      },
    },
    parentInstructions: { bn: 'ঊষা শব্দটি শিশুর কাছে নতুন হতে পারে — "ভোরবেলা, সূর্য ওঠার সময়" বলে বুঝিয়ে দিন।', en: 'ঊষা may be a new word — explain it as "early morning, when the sun rises".' },
    completionCriteria: { bn: 'উ ও ঊ চেনা; ৬টি স্বরবর্ণ পরপর বলা।', en: 'Recognises উ and ঊ; says the 6 vowels in order.' },
    observationPrompt: { bn: 'ছয়টি স্বরবর্ণের কোনটা শিশুর সবচেয়ে কঠিন লাগছে?', en: 'Which of the six vowels is hardest for your child?' },
    needsReview: true,
    source: sourceOriginal('Example words (উট, ঊষা) follow common primer convention — to be checked by a Bengali teacher.'),
  },
  {
    kind: 'academic',
    id: 'd3-world',
    subject: 'world',
    day: 3,
    title: { bn: 'আমার বাড়ির চারপাশের গাছ', en: 'Plants around my home' },
    objective: { bn: 'শিশু গাছ চিনবে এবং গাছের জল ও আলো লাগে বলবে।', en: 'Child identifies plants and says plants need water and light.' },
    materials: { bn: 'একটা ছোট গাছ বা টব, একটা মগে জল', en: 'A small plant or pot, a mug of water' },
    difficulty: 1,
    durationMin: 4,
    skill: 'world-nature',
    guideLine: { bn: 'তোমার বাড়ির পাশে কী কী গাছ আছে?', en: 'What plants grow near your home?' },
    explanation: [
      { text: { bn: 'ঘাস, আমগাছ, কলাগাছ — সবই গাছ।', en: 'Grass, a mango tree, a banana plant — all are plants.' }, visual: '🌱 🌳 🌴' },
      { text: { bn: 'গাছের বাঁচতে জল আর সূর্যের আলো লাগে।', en: 'Plants need water and sunlight to live.' }, visual: '💧 ☀️' },
    ],
    interactiveQuestions: [
      {
        skill: 'world-nature',
        base: choice('d3w-q1', { bn: 'কোনটা গাছ?', en: 'Which one is a plant?' }, [['plant', '🌱', { bn: 'চারাগাছ', en: 'Plant' }], ['ball', '⚽', { bn: 'বল', en: 'Ball' }], ['car', '🚗', { bn: 'গাড়ি', en: 'Car' }]], 'plant', { bn: 'যেটা মাটিতে জন্মায় আর বড় হয়।', en: 'The one that grows from the soil.' }),
        simpler: choice('d3w-q1s', { bn: 'কোনটা গাছ?', en: 'Which one is a plant?' }, [['tree', '🌳', { bn: 'গাছ', en: 'Tree' }], ['car', '🚗', { bn: 'গাড়ি', en: 'Car' }]], 'tree', { bn: 'যার সবুজ পাতা আছে।', en: 'The one with green leaves.' }),
      },
      {
        skill: 'world-nature',
        base: choice('d3w-q2', { bn: 'গাছ বড় হতে কী লাগে?', en: 'What does a plant need to grow?' }, [['water', '💧', { bn: 'জল', en: 'Water' }], ['candy', '🍬', { bn: 'লজেন্স', en: 'Sweets' }], ['phone', '📱', { bn: 'ফোন', en: 'Phone' }]], 'water', { bn: 'আমরা গাছে যা ঢালি।', en: 'What we pour on plants.' }),
        simpler: choice('d3w-q2s', { bn: 'গাছ কী খায়?', en: 'What does a plant drink?' }, [['water', '💧', { bn: 'জল', en: 'Water' }], ['candy', '🍬', { bn: 'লজেন্স', en: 'Sweets' }]], 'water', { bn: 'বৃষ্টিও এটাই দেয়।', en: 'Rain gives this too.' }),
        harder: choice('d3w-q2h', { bn: 'গাছকে আলো দেয় কে?', en: 'What gives plants light?' }, [['sun', '☀️', { bn: 'সূর্য', en: 'Sun' }], ['moon', '🌙', { bn: 'চাঁদ', en: 'Moon' }], ['tv', '📺', { bn: 'টিভি', en: 'TV' }]], 'sun', { bn: 'দিনের বেলা আকাশে যা জ্বলে।', en: 'What shines in the sky during the day.' }),
      },
      {
        skill: 'world-nature',
        base: choice('d3w-q3', { bn: 'কোনটা গাছে জন্মায়?', en: 'Which one grows on a tree?' }, [['mango', '🥭', { bn: 'আম', en: 'Mango' }], ['icecream', '🍦', { bn: 'আইসক্রিম', en: 'Ice cream' }], ['cake', '🧁', { bn: 'কেক', en: 'Cake' }]], 'mango', { bn: 'গরমকালের মিষ্টি ফল।', en: 'A sweet summer fruit.' }),
        simpler: choice('d3w-q3s', { bn: 'কোনটা ফল?', en: 'Which one is a fruit?' }, [['mango', '🥭', { bn: 'আম', en: 'Mango' }], ['cake', '🧁', { bn: 'কেক', en: 'Cake' }]], 'mango', { bn: 'যেটা গাছ থেকে পাড়া হয়।', en: 'The one picked from a tree.' }),
      },
    ],
    offlineActivity: {
      title: { bn: 'গাছ খুঁজি, জল দিই', en: 'Find plants, water one' },
      steps: {
        bn: 'বাড়ির চারপাশে ৩টি গাছ খুঁজুন (ঘাস, বড় গাছ, টবের গাছ)। একটি ছোট গাছে শিশু নিজে মগ দিয়ে জল দেবে।',
        en: 'Find 3 plants around your home (grass, a big tree, a potted plant). Your child waters one small plant with a mug.',
      },
      durationMin: 4,
      extraPractice: {
        bn: 'অতিরিক্ত অনুশীলন: দুটি পাতা কুড়িয়ে আনুন; কোনটা বড়, কোনটা ছোট বলুন।',
        en: 'Extra practice: collect two leaves and say which is bigger and which is smaller.',
      },
    },
    parentInstructions: { bn: 'শহরে থাকলে বারান্দার টব বা রাস্তার গাছ ব্যবহার করুন।', en: 'In a flat, use a balcony pot or a street tree.' },
    completionCriteria: { bn: '৩টি গাছ খোঁজা; একটি গাছে জল দেওয়া।', en: 'Finds 3 plants; waters one.' },
    observationPrompt: { bn: 'শিশু কি কোনো গাছের নাম নিজে থেকে বলেছে?', en: 'Did your child name any plant on their own?' },
    needsReview: false,
    source: sourceOriginal(),
  },
];
