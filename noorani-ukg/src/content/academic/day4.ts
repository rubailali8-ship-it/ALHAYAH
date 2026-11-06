import type { AcademicLesson, Bi } from '../../types/content';
import { choice, confirm, sourceOriginal, type Opt } from '../helpers';

// Geometric characters instead of colour emoji so shapes render on every phone.
const CIRCLE: Opt = ['circle', '●', { bn: 'বৃত্ত', en: 'circle' }];
const SQUARE: Opt = ['square', '■', { bn: 'বর্গ', en: 'square' }];
const TRIANGLE: Opt = ['triangle', '▲', { bn: 'ত্রিভুজ', en: 'triangle' }];
const unlabelled = (o: Opt): Opt => [o[0], o[1]];
const SHAPE_HINT: Bi = { bn: 'কোণগুলো গুনে দেখো: বৃত্তে কোনো কোণ নেই, ত্রিভুজে ৩টা, বর্গে ৪টা।', en: 'Count the corners: a circle has none, a triangle 3, a square 4.' };

const WORD_HINT: Bi = { bn: 'প্রথম ধ্বনিটা শোনো: c-at, b-at, h-at।', en: 'Listen to the first sound: c-at, b-at, h-at.' };

export const day4: AcademicLesson[] = [
  {
    kind: 'academic',
    id: 'd4-maths',
    subject: 'maths',
    day: 4,
    title: { bn: 'আকার: বৃত্ত, বর্গ, ত্রিভুজ', en: 'Shapes: circle, square, triangle' },
    objective: { bn: 'শিশু বৃত্ত, বর্গ ও ত্রিভুজ চিনবে এবং চারপাশে খুঁজে পাবে।', en: 'Child names circle, square and triangle and finds them around the home.' },
    materials: { bn: 'রুটি, বই, সমুচা বা কাগজ কেটে বানানো আকার', en: 'A roti, a book, a samosa or paper cut-out shapes' },
    difficulty: 1,
    durationMin: 4,
    skill: 'shapes',
    guideLine: { bn: 'গোল, চারকোনা, তিনকোনা — চলো আকার খুঁজি!', en: "Round, four corners, three corners — let's find shapes!" },
    explanation: [
      { text: { bn: 'বৃত্ত — গোল, কোনো কোণ নেই। যেমন রুটি।', en: 'Circle — round, no corners. Like a roti.' }, visual: '●' },
      { text: { bn: 'বর্গ — ৪টি সমান বাহু, ৪টি কোণ।', en: 'Square — 4 equal sides, 4 corners.' }, visual: '■' },
      { text: { bn: 'ত্রিভুজ — ৩টি বাহু, ৩টি কোণ। যেমন সমুচা।', en: 'Triangle — 3 sides, 3 corners. Like a samosa.' }, visual: '▲' },
    ],
    interactiveQuestions: [
      {
        skill: 'shapes',
        base: choice('d4m-q1', { bn: 'কোনটা বৃত্ত?', en: 'Which one is a circle?' }, [unlabelled(SQUARE), unlabelled(CIRCLE), unlabelled(TRIANGLE)], 'circle', SHAPE_HINT),
        simpler: choice('d4m-q1s', { bn: 'কোনটা গোল?', en: 'Which one is round?' }, [CIRCLE, TRIANGLE], 'circle', SHAPE_HINT),
        harder: choice('d4m-q1h', { bn: 'কোন আকারের ৩টি কোণ?', en: 'Which shape has 3 corners?' }, [unlabelled(SQUARE), unlabelled(TRIANGLE), unlabelled(CIRCLE)], 'triangle', SHAPE_HINT),
      },
      {
        skill: 'shapes',
        base: choice('d4m-q2', { bn: 'কোনটা বর্গ?', en: 'Which one is a square?' }, [unlabelled(TRIANGLE), unlabelled(CIRCLE), unlabelled(SQUARE)], 'square', SHAPE_HINT),
        simpler: choice('d4m-q2s', { bn: 'কোনটা বর্গ?', en: 'Which one is a square?' }, [SQUARE, CIRCLE], 'square', SHAPE_HINT),
        harder: choice('d4m-q2h', { bn: 'কোন আকারের কোনো কোণ নেই?', en: 'Which shape has no corners?' }, [unlabelled(TRIANGLE), unlabelled(SQUARE), unlabelled(CIRCLE)], 'circle', SHAPE_HINT),
      },
      {
        skill: 'shapes',
        base: choice('d4m-q3', { bn: 'রুটি দেখতে কোন আকারের?', en: 'A roti is shaped like a…' }, [CIRCLE, SQUARE, TRIANGLE], 'circle', { bn: 'তাওয়ায় রুটি কেমন দেখায়?', en: 'How does a roti look on the tawa?' }),
        simpler: choice('d4m-q3s', { bn: 'বল দেখতে কোন আকারের?', en: 'A ball is shaped like a…' }, [CIRCLE, SQUARE], 'circle', { bn: 'বল গড়িয়ে যায় — কারণ এটা গোল।', en: 'A ball rolls because it is round.' }, '⚽'),
        harder: choice('d4m-q3h', { bn: 'সমুচা দেখতে কোন আকারের?', en: 'A samosa looks like a…' }, [CIRCLE, SQUARE, TRIANGLE], 'triangle', { bn: 'সমুচার কয়টা কোণা?', en: 'How many corners does a samosa have?' }),
      },
    ],
    offlineActivity: {
      title: { bn: 'বাড়িতে আকার শিকার', en: 'Shape hunt at home' },
      steps: {
        bn: 'বাড়িতে একটা গোল (থালা), একটা চারকোনা (বই/জানালা) আর একটা তিনকোনা জিনিস খুঁজুন। প্রতিটির কোণ গুনুন।',
        en: 'Find something round (a plate), something square (a book/window) and something triangular at home. Count the corners of each.',
      },
      durationMin: 4,
      extraPractice: {
        bn: 'অতিরিক্ত অনুশীলন: কাগজ কেটে তিনটি আকার বানিয়ে শিশুর হাতে দিন; আপনি নাম বলবেন, শিশু তুলে দেখাবে।',
        en: 'Extra practice: cut the three shapes from paper; you name one and your child holds it up.',
      },
    },
    parentInstructions: { bn: 'অনেক রুটি পুরো গোল হয় না — "প্রায় গোল" বলাও ঠিক আছে।', en: 'Many rotis are not perfectly round — "nearly a circle" is fine.' },
    completionCriteria: { bn: 'তিনটি আকার চেনা; বাড়িতে তিনটি খুঁজে পাওয়া।', en: 'Names three shapes; finds three at home.' },
    observationPrompt: { bn: 'শিশু কি কোণ গুনে আকার চিনেছে?', en: 'Did your child count corners to decide?' },
    needsReview: false,
    source: sourceOriginal(),
  },
  {
    kind: 'academic',
    id: 'd4-english',
    subject: 'english',
    day: 4,
    teachLang: 'en',
    title: { bn: 'সহজ ইংরেজি শব্দ: cat, bat, hat', en: 'Simple words: cat, bat, hat' },
    objective: { bn: 'শিশু -at শব্দ পরিবারের cat, bat, hat ছবির সাথে মেলাবে।', en: 'Child matches the -at family words cat, bat, hat to pictures.' },
    materials: { bn: 'কাগজে লেখা cat, bat, hat কার্ড', en: 'Paper cards with cat, bat, hat written on them' },
    difficulty: 2,
    durationMin: 4,
    skill: 'english-words',
    guideLine: { bn: 'আজ আমরা প্রথম শব্দ পড়ব!', en: "Today we read our first words!" },
    explanation: [
      { text: { bn: 'c + at = cat (বিড়াল)', en: 'c + at = cat' }, visual: 'cat 🐱' },
      { text: { bn: 'b + at = bat (বাদুড়)', en: 'b + at = bat' }, visual: 'bat 🦇' },
      { text: { bn: 'h + at = hat (টুপি)', en: 'h + at = hat' }, visual: 'hat 🎩' },
    ],
    interactiveQuestions: [
      {
        skill: 'english-words',
        base: choice('d4e-q1', { bn: 'কোন ছবিটা "cat"?', en: 'Which picture is "cat"?' }, [['cat', '🐱'], ['bat', '🦇'], ['hat', '🎩']], 'cat', WORD_HINT, 'cat'),
        simpler: choice('d4e-q1s', { bn: 'কোন ছবিটা "cat"?', en: 'Which picture is "cat"?' }, [['cat', '🐱'], ['hat', '🎩']], 'cat', { bn: 'বিড়াল মিয়াও বলে।', en: 'A cat says meow.' }, 'cat'),
        harder: choice('d4e-q1h', { bn: 'কোন শব্দটা "bat"?', en: 'Which word says "bat"?' }, [['cat', 'cat'], ['bat', 'bat'], ['hat', 'hat']], 'bat', WORD_HINT, '🦇'),
      },
      {
        skill: 'english-words',
        base: choice('d4e-q2', { bn: 'এই ছবির শব্দ কোনটা?', en: 'Which word is this picture?' }, [['hat', 'hat'], ['cat', 'cat'], ['bat', 'bat']], 'hat', WORD_HINT, '🎩'),
        simpler: choice('d4e-q2s', { bn: 'এই ছবির শব্দ কোনটা?', en: 'Which word is this picture?' }, [['hat', 'hat'], ['cat', 'cat']], 'hat', { bn: 'h-h-hat — মাথায় পরি।', en: 'h-h-hat — we wear it on our head.' }, '🎩'),
        harder: choice('d4e-q2h', { bn: 'কোন শব্দ "at" দিয়ে শেষ হয় না?', en: 'Which word does NOT end in "at"?' }, [['mat', 'mat'], ['dog', 'dog'], ['sat', 'sat']], 'dog', { bn: 'শব্দের শেষটা দেখো।', en: 'Look at the end of each word.' }),
      },
      {
        skill: 'english-words',
        base: confirm('d4e-q3', { bn: 'শিশুর সাথে ধ্বনি জুড়ে বলুন: c-a-t cat, b-a-t bat।', en: 'Sound out with your grown-up: c-a-t cat, b-a-t bat.' }, { bn: 'প্রতিটি ধ্বনিতে একবার হাততালি দিন।', en: 'Clap once for each sound.' }, 'c a t'),
        simpler: confirm('d4e-q3s', { bn: 'শিশুর সাথে বলুন: c-at, cat।', en: 'Say with your grown-up: c-at, cat.' }, { bn: 'ধীরে ধীরে।', en: 'Slowly.' }, '🐱'),
      },
    ],
    offlineActivity: {
      title: { bn: 'শব্দ কার্ড মেলানো', en: 'Word-card match' },
      steps: {
        bn: 'cat, bat, hat তিনটি কার্ড লিখুন। আপনি শব্দ বলবেন, শিশু কার্ড তুলবে। তারপর শিশু টুপি (hat) পরে "hat" কার্ড দেখাবে।',
        en: 'Write cat, bat, hat cards. You say a word, your child picks the card. Then your child wears a hat and shows the "hat" card.',
      },
      durationMin: 4,
      extraPractice: {
        bn: 'অতিরিক্ত অনুশীলন: শুধু প্রথম ধ্বনি — আপনি /k/ বললে শিশু cat দেখাবে, /h/ বললে hat।',
        en: 'Extra practice: first sounds only — you say /k/ and your child shows cat, /h/ for hat.',
      },
    },
    parentInstructions: { bn: 'পুরো বানান নয়, শুরুর ধ্বনিতে জোর দিন — এটাই পড়ার প্রথম ধাপ।', en: 'Focus on the first sound, not spelling — this is the first step of reading.' },
    completionCriteria: { bn: 'তিনটি শব্দ ছবির সাথে মেলানো।', en: 'Matches all three words to pictures.' },
    observationPrompt: { bn: 'শিশু কি শুরুর ধ্বনি দেখে শব্দ চিনেছে?', en: 'Did your child use the first letter to recognise the word?' },
    needsReview: false,
    source: sourceOriginal(),
  },
  {
    kind: 'academic',
    id: 'd4-bengali',
    subject: 'bengali',
    day: 4,
    teachLang: 'bn',
    title: { bn: 'সহজ বাংলা শব্দ: আম, ইট, উট', en: 'Simple Bengali words: আম, ইট, উট' },
    objective: { bn: 'শিশু শেখা স্বরবর্ণ দিয়ে শুরু তিনটি শব্দ ছবির সাথে মেলাবে।', en: 'Child matches three words that begin with learned vowels to pictures.' },
    materials: { bn: 'আম, ইট, উট লেখা কার্ড', en: 'Cards with আম, ইট, উট' },
    difficulty: 2,
    durationMin: 4,
    skill: 'bangla-words',
    guideLine: { bn: 'যে বর্ণগুলো শিখেছি, সেগুলো দিয়ে শব্দ পড়ি!', en: "Let's read words made from the letters we learned!" },
    explanation: [
      { text: { bn: 'আ + ম = আম', en: 'আ + ম = আম (mango)' }, visual: 'আম 🥭' },
      { text: { bn: 'ই + ট = ইট', en: 'ই + ট = ইট (brick)' }, visual: 'ইট 🧱' },
      { text: { bn: 'উ + ট = উট', en: 'উ + ট = উট (camel)' }, visual: 'উট 🐪' },
    ],
    interactiveQuestions: [
      {
        skill: 'bangla-words',
        base: choice('d4b-q1', { bn: 'কোন ছবিটা "আম"?', en: 'Which picture is "আম"?' }, [['mango', '🥭'], ['camel', '🐪'], ['brick', '🧱']], 'mango', { bn: 'আ দিয়ে শুরু — আ-ম।', en: 'Starts with আ — আ-ম.' }, 'আম'),
        simpler: choice('d4b-q1s', { bn: 'কোন ছবিটা "আম"?', en: 'Which picture is "আম"?' }, [['mango', '🥭'], ['camel', '🐪']], 'mango', { bn: 'মিষ্টি ফল।', en: 'A sweet fruit.' }, 'আম'),
        harder: choice('d4b-q1h', { bn: 'কোন শব্দটা "ইট"?', en: 'Which word is "ইট" (brick)?' }, [['am', 'আম'], ['it', 'ইট'], ['ut', 'উট']], 'it', { bn: 'ই দিয়ে শুরু।', en: 'Starts with ই.' }, '🧱'),
      },
      {
        skill: 'bangla-words',
        base: choice('d4b-q2', { bn: 'ছবিটা কী? শব্দটা খোঁজো।', en: 'What is this? Find the word.' }, [['ut', 'উট'], ['am', 'আম'], ['it', 'ইট']], 'ut', { bn: 'উ দিয়ে শুরু।', en: 'Starts with উ.' }, '🐪'),
        simpler: choice('d4b-q2s', { bn: 'ছবিটা কী? শব্দটা খোঁজো।', en: 'What is this? Find the word.' }, [['ut', 'উট'], ['am', 'আম']], 'ut', { bn: 'উ-তে উট।', en: 'উ for উট.' }, '🐪'),
        harder: choice('d4b-q2h', { bn: '"উট" আর "ইট" — কোনটা প্রাণী?', en: '"উট" or "ইট" — which one is an animal?' }, [['ut', 'উট'], ['it', 'ইট']], 'ut', { bn: 'ইট দিয়ে বাড়ি বানায়।', en: 'ইট is used to build houses.' }),
      },
      {
        skill: 'bangla-words',
        base: confirm('d4b-q3', { bn: 'অভিভাবকের সাথে ধ্বনি জুড়ে বলো: আ-ম আম, উ-ট উট।', en: 'Blend the sounds with your grown-up: আ-ম আম, উ-ট উট.' }, { bn: 'প্রতিটি ধ্বনিতে একবার হাততালি।', en: 'One clap per sound.' }, 'আ ম'),
        simpler: confirm('d4b-q3s', { bn: 'অভিভাবকের সাথে বলো: আ-ম, আম।', en: 'Say with your grown-up: আ-ম, আম.' }, { bn: 'ধীরে ধীরে।', en: 'Slowly.' }, '🥭'),
      },
    ],
    offlineActivity: {
      title: { bn: 'শব্দ কার্ড ও আসল জিনিস', en: 'Word cards and real things' },
      steps: {
        bn: 'আম, ইট, উট কার্ড বানান। শিশু "আম" কার্ড রান্নাঘরের ফলের কাছে রাখবে; বাকিগুলো ছবির পাশে।',
        en: 'Make cards for আম, ইট, উট. Your child places the "আম" card next to fruit in the kitchen and the others next to drawings.',
      },
      durationMin: 4,
      extraPractice: {
        bn: 'অতিরিক্ত অনুশীলন: শুধু প্রথম বর্ণ — আপনি "আ" বললে শিশু আম কার্ড তুলবে।',
        en: 'Extra practice: first letters only — you say "আ" and your child picks the আম card.',
      },
    },
    parentInstructions: { bn: 'ম ও ট এখনও শেখানো হয়নি; শিশু প্রথম স্বরবর্ণ দেখে চিনলেই যথেষ্ট।', en: 'ম and ট have not been taught yet; recognising the first vowel is enough.' },
    completionCriteria: { bn: 'তিনটি শব্দ ছবির সাথে মেলানো।', en: 'Matches three words to pictures.' },
    observationPrompt: { bn: 'শিশু কি প্রথম বর্ণ দেখে শব্দ চিনেছে?', en: 'Did your child use the first letter to recognise the word?' },
    needsReview: true,
    source: sourceOriginal('Word choice (আম, ইট, উট) reuses the vowels taught on Days 1–3 — to be checked by a Bengali teacher.'),
  },
  {
    kind: 'academic',
    id: 'd4-world',
    subject: 'world',
    day: 4,
    title: { bn: 'আমাদের সাহায্যকারী মানুষ', en: 'Community helpers' },
    objective: { bn: 'শিশু ডাক্তার, কৃষক, দমকলকর্মী ও ডাকপিয়নের কাজ বলবে।', en: 'Child says what a doctor, farmer, firefighter and postal worker do.' },
    materials: { bn: 'কিছু লাগবে না', en: 'Nothing needed' },
    difficulty: 1,
    durationMin: 4,
    skill: 'world-community',
    guideLine: { bn: 'অনেক মানুষ আমাদের সাহায্য করেন। চলো চিনি!', en: "Many people help us every day. Let's meet them!" },
    explanation: [
      { text: { bn: 'ডাক্তার অসুখ সারাতে সাহায্য করেন।', en: 'A doctor helps us get better when we are sick.' }, visual: '🩺' },
      { text: { bn: 'কৃষক ধান আর সবজি ফলান।', en: 'A farmer grows rice and vegetables.' }, visual: '🌾' },
      { text: { bn: 'দমকলকর্মী আগুন নেভান; ডাকপিয়ন চিঠি আনেন।', en: 'Firefighters put out fires; postal workers bring letters.' }, visual: '🚒 📬' },
    ],
    interactiveQuestions: [
      {
        skill: 'world-community',
        base: choice('d4w-q1', { bn: 'অসুখ হলে কে সাহায্য করেন?', en: 'Who helps us when we are sick?' }, [['doctor', '🩺', { bn: 'ডাক্তার', en: 'Doctor' }], ['farmer', '🌾', { bn: 'কৃষক', en: 'Farmer' }], ['post', '📬', { bn: 'ডাকপিয়ন', en: 'Postal worker' }]], 'doctor', { bn: 'যিনি বুক পরীক্ষা করেন।', en: 'The one who listens to your heartbeat.' }),
        simpler: choice('d4w-q1s', { bn: 'অসুখ হলে কে সাহায্য করেন?', en: 'Who helps us when we are sick?' }, [['doctor', '🩺', { bn: 'ডাক্তার', en: 'Doctor' }], ['farmer', '🌾', { bn: 'কৃষক', en: 'Farmer' }]], 'doctor', { bn: 'যার কাছে স্টেথোস্কোপ থাকে।', en: 'The one with a stethoscope.' }),
        harder: choice('d4w-q1h', { bn: 'ডাক্তার কোথায় কাজ করেন?', en: 'Where does a doctor work?' }, [['school', '🏫', { bn: 'স্কুল', en: 'School' }], ['hospital', '🏥', { bn: 'হাসপাতাল', en: 'Hospital' }], ['shop', '🏪', { bn: 'দোকান', en: 'Shop' }]], 'hospital', { bn: 'যেখানে অসুস্থ মানুষ যান।', en: 'Where sick people go.' }),
      },
      {
        skill: 'world-community',
        base: choice('d4w-q2', { bn: 'ধান কে ফলান?', en: 'Who grows rice?' }, [['farmer', '🌾', { bn: 'কৃষক', en: 'Farmer' }], ['fire', '🚒', { bn: 'দমকলকর্মী', en: 'Firefighter' }], ['doctor', '🩺', { bn: 'ডাক্তার', en: 'Doctor' }]], 'farmer', { bn: 'যিনি মাঠে কাজ করেন।', en: 'The one who works in the fields.' }),
        simpler: choice('d4w-q2s', { bn: 'ধান কে ফলান?', en: 'Who grows rice?' }, [['farmer', '🌾', { bn: 'কৃষক', en: 'Farmer' }], ['fire', '🚒', { bn: 'দমকলকর্মী', en: 'Firefighter' }]], 'farmer', { bn: 'ধানের শীষের ছবিটা।', en: 'The picture of rice stalks.' }),
      },
      {
        skill: 'world-community',
        base: choice('d4w-q3', { bn: 'আগুন লাগলে কে আসেন?', en: 'Who comes when there is a fire?' }, [['post', '📬', { bn: 'ডাকপিয়ন', en: 'Postal worker' }], ['fire', '🚒', { bn: 'দমকলকর্মী', en: 'Firefighter' }], ['farmer', '🌾', { bn: 'কৃষক', en: 'Farmer' }]], 'fire', { bn: 'লাল গাড়ি, জোরে ঘণ্টা বাজে।', en: 'A red truck with a loud bell.' }),
        simpler: choice('d4w-q3s', { bn: 'আগুন লাগলে কে আসেন?', en: 'Who comes when there is a fire?' }, [['fire', '🚒', { bn: 'দমকলকর্মী', en: 'Firefighter' }], ['post', '📬', { bn: 'ডাকপিয়ন', en: 'Postal worker' }]], 'fire', { bn: 'লাল গাড়িটা।', en: 'The red truck.' }),
      },
    ],
    offlineActivity: {
      title: { bn: '"আমি কে?" অভিনয় খেলা', en: '"Who am I?" acting game' },
      steps: {
        bn: 'আপনি একজন সাহায্যকারীর অভিনয় করুন (যেমন ধান কাটা), শিশু বলবে কে। তারপর শিশু অভিনয় করবে, আপনি বলবেন।',
        en: 'Act out a helper (e.g. cutting rice) and your child guesses who. Then swap.',
      },
      durationMin: 4,
      extraPractice: {
        bn: 'অতিরিক্ত অনুশীলন: পাড়ার কোনো সাহায্যকারীকে (দোকানদার, রিকশাওয়ালা) সালাম দিয়ে ধন্যবাদ বলা।',
        en: 'Extra practice: greet and thank a local helper (shopkeeper, rickshaw driver).',
      },
    },
    parentInstructions: { bn: 'আপনার এলাকার সাহায্যকারীদের উদাহরণ দিন — যাদের শিশু রোজ দেখে।', en: 'Use helpers from your own neighbourhood that your child sees every day.' },
    completionCriteria: { bn: 'তিনজন সাহায্যকারীর কাজ বলা; অভিনয় খেলা।', en: 'Says what three helpers do; plays the acting game.' },
    observationPrompt: { bn: 'শিশু কি নিজের এলাকার কোনো সাহায্যকারীর কথা বলেছে?', en: 'Did your child mention a helper from your neighbourhood?' },
    needsReview: false,
    source: sourceOriginal(),
  },
];
