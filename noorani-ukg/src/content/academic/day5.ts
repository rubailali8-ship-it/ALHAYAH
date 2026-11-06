import type { AcademicLesson, Bi } from '../../types/content';
import { choice, confirm, sourceOriginal } from '../helpers';

const NEXT: Bi = { bn: 'এরপর কী আসবে?', en: 'What comes next?' };
const PATTERN_HINT: Bi = { bn: 'জোরে জোরে বলো: আপেল, কলা, আপেল, কলা…', en: 'Say it out loud: apple, banana, apple, banana…' };

export const day5: AcademicLesson[] = [
  {
    kind: 'academic',
    id: 'd5-maths',
    subject: 'maths',
    day: 5,
    title: { bn: 'নকশা (প্যাটার্ন)', en: 'Patterns' },
    objective: { bn: 'শিশু AB নকশা চিনে পরের জিনিসটি বলবে এবং নিজে নকশা বানাবে।', en: 'Child continues an AB pattern and makes one of their own.' },
    materials: { bn: 'দুই রঙের বোতাম বা চামচ ও কাপ', en: 'Buttons of two colours, or spoons and cups' },
    difficulty: 2,
    durationMin: 4,
    skill: 'patterns',
    guideLine: { bn: 'আপেল, কলা, আপেল, কলা… এরপর কী? চলো খেলি!', en: 'Apple, banana, apple, banana… what next? Let\'s play!' },
    explanation: [
      { text: { bn: 'নকশা মানে একই জিনিস বারবার একই ক্রমে আসা।', en: 'A pattern is when things repeat in the same order.' }, visual: '🍎🍌🍎🍌🍎🍌' },
      { text: { bn: 'হাততালি, পা ঠোকা, হাততালি, পা ঠোকা — এটাও নকশা!', en: 'Clap, stamp, clap, stamp — that\'s a pattern too!' }, visual: '👏 🦶 👏 🦶' },
    ],
    interactiveQuestions: [
      {
        skill: 'patterns',
        base: choice('d5m-q1', NEXT, [['banana', '🍌'], ['apple', '🍎'], ['grape', '🍇']], 'banana', PATTERN_HINT, '🍎🍌🍎🍌🍎 ?'),
        simpler: choice('d5m-q1s', NEXT, [['apple', '🍎'], ['banana', '🍌']], 'apple', { bn: 'সবগুলো একই!', en: 'They are all the same!' }, '🍎🍎🍎 ?'),
        harder: choice('d5m-q1h', NEXT, [['apple', '🍎'], ['banana', '🍌'], ['grape', '🍇']], 'banana', { bn: 'এক আপেল, দুই কলা — আবার শুরু।', en: 'One apple, two bananas — then again.' }, '🍎🍌🍌🍎🍌 ?'),
      },
      {
        skill: 'patterns',
        base: choice('d5m-q2', NEXT, [['circle', '●'], ['triangle', '▲'], ['square', '■']], 'triangle', { bn: 'বৃত্ত, ত্রিভুজ, বৃত্ত…', en: 'Circle, triangle, circle…' }, '● ▲ ● ▲ ● ?'),
        simpler: choice('d5m-q2s', NEXT, [['circle', '●'], ['triangle', '▲']], 'triangle', { bn: 'বৃত্তের পরে ত্রিভুজ।', en: 'After a circle comes a triangle.' }, '● ▲ ● ?'),
        harder: choice('d5m-q2h', { bn: 'ফাঁকা জায়গায় কী বসবে?', en: 'What goes in the gap?' }, [['square', '■'], ['circle', '●'], ['triangle', '▲']], 'square', { bn: 'বৃত্ত, বর্গ, বৃত্ত, বর্গ…', en: 'Circle, square, circle, square…' }, '● ■ ● ? ● ■'),
      },
      {
        skill: 'patterns',
        base: confirm('d5m-q3', { bn: 'অভিভাবকের সাথে নকশা করো: হাততালি, পা ঠোকা, হাততালি, পা ঠোকা…', en: 'Make a pattern with your grown-up: clap, stamp, clap, stamp…' }, { bn: 'অভিভাবক শুরু করবেন, তুমি চালিয়ে যাবে।', en: 'Grown-up starts, you continue.' }, '👏 🦶 👏 🦶'),
        simpler: confirm('d5m-q3s', { bn: 'অভিভাবকের সাথে ৪ বার হাততালি দাও।', en: 'Clap 4 times with your grown-up.' }, { bn: 'একসাথে গোনো।', en: 'Count together.' }, '👏👏👏👏'),
      },
    ],
    offlineActivity: {
      title: { bn: 'বোতামের মালা', en: 'Button necklace pattern' },
      steps: {
        bn: 'দুই রঙের বোতাম (বা চামচ-কাপ) দিয়ে আপনি নকশা শুরু করুন: লাল, নীল, লাল… শিশু বাকিটা সাজাবে। তারপর শিশু নিজে একটা নকশা বানাবে।',
        en: 'Start a pattern with buttons of two colours (or spoon, cup): red, blue, red… your child continues. Then your child invents their own.',
      },
      durationMin: 4,
      extraPractice: {
        bn: 'অতিরিক্ত অনুশীলন: শুধু ২টা জিনিস দিয়ে ছোট নকশা (চামচ, কাপ, চামচ, ?) — ৩ বার।',
        en: 'Extra practice: tiny patterns with 2 items (spoon, cup, spoon, ?) — 3 times.',
      },
    },
    parentInstructions: { bn: 'শিশু নকশা জোরে বললে সহজ হয় — "আপেল, কলা" বলে বলে সাজাতে দিন।', en: 'Saying the pattern aloud helps — let your child chant "apple, banana" while arranging.' },
    completionCriteria: { bn: 'দুটি নকশা সম্পূর্ণ; নিজে একটি নকশা বানানো।', en: 'Completes two patterns; makes one of their own.' },
    observationPrompt: { bn: 'শিশু কি নিজে নতুন নকশা বানাতে পেরেছে?', en: 'Could your child invent a new pattern?' },
    needsReview: false,
    source: sourceOriginal(),
  },
  {
    kind: 'academic',
    id: 'd5-english',
    subject: 'english',
    day: 5,
    teachLang: 'en',
    title: { bn: 'পুনরালোচনার খেলা: A থেকে F', en: 'Review game: A to F' },
    objective: { bn: 'শিশু A–F বর্ণ চিনবে এবং ছবির প্রথম ধ্বনির সাথে মেলাবে।', en: 'Child recognises A–F and matches them to first sounds of pictures.' },
    materials: { bn: 'A থেকে F লেখা ৬টি কার্ড', en: '6 cards with A to F' },
    difficulty: 2,
    durationMin: 4,
    skill: 'english-letters',
    guideLine: { bn: 'এই সপ্তাহে ৬টা বর্ণ শিখেছ! চলো খেলি।', en: "You learned 6 letters this week! Let's play." },
    explanation: [{ text: { bn: 'A, B, C, D, E, F — মনে আছে?', en: 'A, B, C, D, E, F — remember them?' }, visual: 'A B C D E F' }],
    interactiveQuestions: [
      {
        skill: 'english-letters',
        base: choice('d5e-q1', { bn: 'dog কোন বর্ণ দিয়ে শুরু?', en: 'Which letter does dog start with?' }, [['B', 'B'], ['D', 'D'], ['C', 'C']], 'D', { bn: '/d/… d-d-dog।', en: '/d/… d-d-dog.' }, '🐶'),
        simpler: choice('d5e-q1s', { bn: 'dog কোন বর্ণ দিয়ে শুরু?', en: 'Which letter does dog start with?' }, [['D', 'D'], ['A', 'A']], 'D', { bn: 'd-d-dog।', en: 'd-d-dog.' }, '🐶'),
        harder: choice('d5e-q1h', { bn: 'cat কোন বর্ণ দিয়ে শুরু?', en: 'Which letter does cat start with?' }, [['K', 'K'], ['C', 'C'], ['E', 'E']], 'C', { bn: 'আমরা Day 2-তে শিখেছি: C-এর ধ্বনি /k/।', en: 'We learned on Day 2: C says /k/.' }, '🐱'),
      },
      {
        skill: 'english-letters',
        base: choice('d5e-q2', { bn: 'কোনটা E?', en: 'Which one is E?' }, [['F', 'F'], ['E', 'E'], ['B', 'B']], 'E', { bn: 'E-এর নিচে দাগ আছে।', en: 'E has a line at the bottom.' }),
        simpler: choice('d5e-q2s', { bn: 'একই রকম বর্ণটা খোঁজো।', en: 'Find the letter that matches.' }, [['E', 'E'], ['A', 'A']], 'E', { bn: 'উপরের বর্ণের মতো কোনটা?', en: 'Which looks like the top letter?' }, 'E'),
        harder: choice('d5e-q2h', { bn: 'কোনটা ছোট হাতের b?', en: 'Which one is small b?' }, [['d', 'd'], ['b', 'b'], ['p', 'p']], 'b', { bn: 'b-এর লম্বা দাগ বাঁ দিকে, গোল ডানে।', en: 'Small b: tall line on the left, circle on the right.' }),
      },
      {
        skill: 'english-letters',
        base: choice('d5e-q3', { bn: 'কোন ছবিটা /f/ দিয়ে শুরু?', en: 'Which picture starts with /f/?' }, [['fish', '🐟', 'fish'], ['egg', '🥚', 'egg'], ['apple', '🍎', 'apple']], 'fish', { bn: 'নিচের ঠোঁটে দাঁত: /f/।', en: 'Teeth on your bottom lip: /f/.' }),
        simpler: choice('d5e-q3s', { bn: 'কোনটা fish?', en: 'Which one is a fish?' }, [['fish', '🐟', 'fish'], ['cat', '🐱', 'cat']], 'fish', { bn: 'যে জলে সাঁতার কাটে।', en: 'It swims in water.' }),
        harder: choice('d5e-q3h', { bn: 'কোন ছবিটা /a/ দিয়ে শুরু?', en: 'Which picture starts with /a/?' }, [['egg', '🥚', 'egg'], ['ant', '🐜', 'ant'], ['dog', '🐶', 'dog']], 'ant', { bn: '/a/… a-a-ant (পিঁপড়ে)।', en: '/a/… a-a-ant.' }),
      },
    ],
    offlineActivity: {
      title: { bn: 'বর্ণ কার্ড লুকোচুরি', en: 'Letter-card hide and seek' },
      steps: {
        bn: 'A–F কার্ড ঘরে লুকিয়ে রাখুন। শিশু প্রতিটা খুঁজে বর্ণের ধ্বনি আর একটি শব্দ বলবে (যেমন "D — /d/ — dog")।',
        en: 'Hide the A–F cards in the room. Your child finds each one and says its sound and a word (e.g. "D — /d/ — dog").',
      },
      durationMin: 4,
      extraPractice: {
        bn: 'অতিরিক্ত অনুশীলন: শুধু যে দুটি বর্ণ কঠিন লাগছে, সেগুলো নিয়ে আবার খেলুন।',
        en: 'Extra practice: replay with just the two letters your child finds hardest.',
      },
    },
    parentInstructions: { bn: 'এটা পরীক্ষা নয়, খেলা। ভুল হলে সঠিক ধ্বনিটা বলে দিন এবং এগিয়ে যান।', en: "This is a game, not a test. If wrong, say the correct sound and move on." },
    completionCriteria: { bn: '৬টি বর্ণের অন্তত ৪টি ধ্বনিসহ চেনা।', en: 'Recognises at least 4 of the 6 letters with their sounds.' },
    observationPrompt: { bn: 'কোন দুটি বর্ণ এখনও কঠিন লাগছে?', en: 'Which two letters are still tricky?' },
    needsReview: false,
    source: sourceOriginal(),
  },
  {
    kind: 'academic',
    id: 'd5-bengali',
    subject: 'bengali',
    day: 5,
    teachLang: 'bn',
    title: { bn: 'ছড়া ও পুনরালোচনা', en: 'Rhyme and review' },
    objective: { bn: 'শিশু একটি লোকছড়ার প্রথম লাইন বলবে এবং অ–ঊ ছয়টি স্বরবর্ণ চিনবে।', en: 'Child says the first line of a folk rhyme and recognises the six vowels অ–ঊ.' },
    materials: { bn: 'অ–ঊ লেখা কার্ড', en: 'Cards with অ to ঊ' },
    difficulty: 2,
    durationMin: 4,
    skill: 'bangla-vowels',
    guideLine: { bn: 'চলো একটা পুরনো ছড়া বলি, আর বর্ণগুলো মনে করি!', en: "Let's say an old rhyme and remember our letters!" },
    explanation: [
      { text: { bn: 'আয় আয় চাঁদ মামা, টিপ দিয়ে যা।', en: 'আয় আয় চাঁদ মামা, টিপ দিয়ে যা। (Come, come, Uncle Moon…) — a traditional folk rhyme.' }, visual: '🌙' },
      { text: { bn: 'অ আ ই ঈ উ ঊ — ছয়টি স্বরবর্ণ শিখেছি!', en: 'অ আ ই ঈ উ ঊ — we learned six vowels!' }, visual: 'অ আ ই ঈ উ ঊ' },
    ],
    interactiveQuestions: [
      {
        skill: 'bangla-vowels',
        base: choice('d5b-q1', { bn: 'ছড়ায় কাকে ডাকা হচ্ছে?', en: 'Who is called in the rhyme?' }, [['moon', '🌙', 'চাঁদ'], ['sun', '☀️', 'সূর্য'], ['cat', '🐱', 'বিড়াল']], 'moon', { bn: '"আয় আয় চাঁদ মামা…"', en: '"আয় আয় চাঁদ মামা…"' }),
        simpler: choice('d5b-q1s', { bn: 'কোনটা চাঁদ?', en: 'Which one is the moon (চাঁদ)?' }, [['moon', '🌙', 'চাঁদ'], ['sun', '☀️', 'সূর্য']], 'moon', { bn: 'রাতের আকাশে থাকে।', en: 'It is in the night sky.' }),
      },
      {
        skill: 'bangla-vowels',
        base: choice('d5b-q2', { bn: 'কোনটা ঈ?', en: 'Which one is ঈ?' }, [['i', 'ই'], ['ii', 'ঈ'], ['u', 'উ']], 'ii', { bn: 'ঈ-এর মাথায় বাড়তি প্যাঁচ।', en: 'ঈ has the extra curl on top.' }),
        simpler: choice('d5b-q2s', { bn: 'উপরের বর্ণের মতো কোনটা?', en: 'Which one matches the letter at the top?' }, [['ii', 'ঈ'], ['a', 'আ']], 'ii', { bn: 'একই রকম দেখতে বর্ণটা খোঁজো।', en: 'Look for the same shape.' }, 'ঈ'),
        harder: choice('d5b-q2h', { bn: 'ঊষা কোন বর্ণ দিয়ে শুরু?', en: 'Which letter does ঊষা start with?' }, [['u', 'উ'], ['uu', 'ঊ'], ['o', 'অ']], 'uu', { bn: 'ঊ-এর নিচে বাড়তি লেজ।', en: 'ঊ has the extra tail.' }, '🌅'),
      },
      {
        skill: 'bangla-vowels',
        base: choice('d5b-q3', { bn: 'উট কোন বর্ণ দিয়ে শুরু?', en: 'Which letter does উট start with?' }, [['u', 'উ'], ['uu', 'ঊ'], ['o', 'অ']], 'u', { bn: 'উ-তে উট।', en: 'উ for উট.' }, '🐪'),
        simpler: choice('d5b-q3s', { bn: 'আম কোন বর্ণ দিয়ে শুরু?', en: 'Which letter does আম start with?' }, [['a', 'আ'], ['u', 'উ']], 'a', { bn: 'আ-তে আম।', en: 'আ for আম.' }, '🥭'),
      },
    ],
    offlineActivity: {
      title: { bn: 'ছড়া ও বর্ণ কার্ড', en: 'Rhyme and letter cards' },
      steps: {
        bn: 'একসাথে "আয় আয় চাঁদ মামা" বলুন, হাততালি দিয়ে। তারপর অ–ঊ কার্ড ক্রম অনুযায়ী সাজান।',
        en: 'Say "আয় আয় চাঁদ মামা" together with claps. Then put the অ–ঊ cards in order.',
      },
      durationMin: 4,
      extraPractice: {
        bn: 'অতিরিক্ত অনুশীলন: শুধু অ, আ, ই — তিনটি কার্ড ক্রমে সাজানো।',
        en: 'Extra practice: order just three cards — অ, আ, ই.',
      },
    },
    parentInstructions: { bn: 'ছড়ার যে সংস্করণ আপনার পরিবারে প্রচলিত, সেটাই ব্যবহার করুন।', en: 'Use whichever version of the rhyme your family knows.' },
    completionCriteria: { bn: 'ছড়ার প্রথম লাইন বলা; ছয়টি কার্ড ক্রমে সাজানো।', en: 'Says the first line of the rhyme; orders the six cards.' },
    observationPrompt: { bn: 'শিশু কি ছড়াটা উপভোগ করেছে? কোন বর্ণ এখনও কঠিন?', en: 'Did your child enjoy the rhyme? Which letter is still hard?' },
    needsReview: true,
    source: sourceOriginal('Rhyme line "আয় আয় চাঁদ মামা, টিপ দিয়ে যা" is a traditional Bengali folk rhyme (public domain), quoted from common memory — wording to be checked by a Bengali teacher.'),
  },
  {
    kind: 'academic',
    id: 'd5-world',
    subject: 'world',
    day: 5,
    title: { bn: 'নিজের জিনিস গুছিয়ে রাখি', en: 'Tidying my things' },
    objective: { bn: 'শিশু খেলার পরে খেলনা ও বই নির্দিষ্ট জায়গায় রাখবে।', en: 'Child puts toys and books back in their place after playing.' },
    materials: { bn: 'একটা ঝুড়ি বা বাক্স', en: 'A basket or box' },
    difficulty: 1,
    durationMin: 4,
    skill: 'world-self',
    guideLine: { bn: 'খেলা শেষ? চলো সব গুছিয়ে রাখি!', en: "Finished playing? Let's tidy up!" },
    explanation: [
      { text: { bn: 'প্রতিটা জিনিসের একটা নিজের জায়গা আছে।', en: 'Every thing has its own place.' }, visual: '🧸 → 📦' },
      { text: { bn: 'বই তাকে, খেলনা বাক্সে, জুতো দরজার পাশে।', en: 'Books on the shelf, toys in the box, shoes by the door.' }, visual: '📚 🧸 👟' },
    ],
    interactiveQuestions: [
      {
        skill: 'world-self',
        base: choice('d5w-q1', { bn: 'খেলার পরে খেলনা কোথায় রাখব?', en: 'Where do toys go after playing?' }, [['box', '📦', { bn: 'খেলনার বাক্সে', en: 'In the toy box' }], ['floor', '🚪', { bn: 'দরজার সামনে', en: 'In front of the door' }], ['bed', '🛏️', { bn: 'বিছানায়', en: 'On the bed' }]], 'box', { bn: 'যেখানে খেলনারা ঘুমায়।', en: 'Where the toys sleep.' }),
        simpler: choice('d5w-q1s', { bn: 'খেলনা কোথায় রাখব?', en: 'Where do toys go?' }, [['box', '📦', { bn: 'খেলনার বাক্সে', en: 'In the toy box' }], ['floor', '🚪', { bn: 'দরজার সামনে', en: 'In front of the door' }]], 'box', { bn: 'বাক্সের ছবিটা।', en: 'The box picture.' }),
      },
      {
        skill: 'world-self',
        base: choice('d5w-q2', { bn: 'বই কোথায় রাখব?', en: 'Where do books go?' }, [['kitchen', '🍳', { bn: 'রান্নাঘরে', en: 'In the kitchen' }], ['shelf', '📚', { bn: 'বইয়ের তাকে', en: 'On the bookshelf' }], ['bath', '🛁', { bn: 'বাথরুমে', en: 'In the bathroom' }]], 'shelf', { bn: 'যেখানে আরও বই আছে।', en: 'Where the other books are.' }),
        simpler: choice('d5w-q2s', { bn: 'বই কোথায় রাখব?', en: 'Where do books go?' }, [['shelf', '📚', { bn: 'বইয়ের তাকে', en: 'On the bookshelf' }], ['bath', '🛁', { bn: 'বাথরুমে', en: 'In the bathroom' }]], 'shelf', { bn: 'বাথরুমে বই ভিজে যাবে!', en: 'Books would get wet in the bathroom!' }),
        harder: choice('d5w-q2h', { bn: 'গোছানোর পরে ঘর কেমন লাগে?', en: 'How does the room feel after tidying?' }, [['happy', '😊', { bn: 'সুন্দর, খুশি', en: 'Nice and happy' }], ['sad', '😢', { bn: 'দুঃখী', en: 'Sad' }]], 'happy', { bn: 'পরিষ্কার ঘরে খেলতে ভালো লাগে।', en: 'A clean room is nice to play in.' }),
      },
      {
        skill: 'world-self',
        base: confirm('d5w-q3', { bn: 'অভিভাবকের সাথে ৩টি জিনিস তার জায়গায় রেখে এসো।', en: 'Put 3 things back in their places with your grown-up.' }, { bn: 'এক, দুই, তিন — গুনে গুনে!', en: 'One, two, three — count them!' }, '🧸 📚 👟'),
        simpler: confirm('d5w-q3s', { bn: 'অভিভাবকের সাথে ১টি খেলনা বাক্সে রেখে এসো।', en: 'Put 1 toy in the box with your grown-up.' }, { bn: 'একসাথে যাও।', en: 'Go together.' }, '🧸'),
      },
    ],
    offlineActivity: {
      title: { bn: '৫ মিনিটের গোছানো খেলা', en: '5-minute tidy-up game' },
      steps: {
        bn: 'একটা গান গাইতে গাইতে বা ২০ গুনতে গুনতে শিশু তার খেলনা ঝুড়িতে তুলবে। শেষে একসাথে ঘরটা দেখুন।',
        en: 'While you sing or count to 20, your child puts toys in the basket. Look at the tidy room together at the end.',
      },
      durationMin: 4,
      extraPractice: {
        bn: 'অতিরিক্ত অনুশীলন: রাতে ঘুমানোর আগে নিজের জুতো জোড়া দরজার পাশে রাখা।',
        en: 'Extra practice: before bed, put own shoes by the door.',
      },
    },
    parentInstructions: { bn: 'প্রশংসা করুন কাজের জন্য, পুরস্কার নয়: "তুমি নিজে বইটা তাকে রেখেছ!"', en: 'Praise the action, not with rewards: "You put the book on the shelf yourself!"' },
    completionCriteria: { bn: 'অন্তত ৩টি জিনিস নিজে গুছিয়ে রাখা।', en: 'Puts away at least 3 things independently.' },
    observationPrompt: { bn: 'শিশু কি মনে করিয়ে দেওয়া ছাড়াই গুছিয়েছে?', en: 'Did your child tidy without being reminded?' },
    needsReview: false,
    source: sourceOriginal(),
  },
];
