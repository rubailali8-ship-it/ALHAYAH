import type { AcademicLesson } from '../../types/content';
import { choice, confirm, countQ, groupQ, sourceOriginal } from '../helpers';

const APPLES = { bn: 'আপেল', en: 'apples' };
const BALLS = { bn: 'বল', en: 'balls' };
const BANANAS = { bn: 'কলা', en: 'bananas' };
const STARS = { bn: 'তারা', en: 'stars' };

export const day1: AcademicLesson[] = [
  {
    kind: 'academic',
    id: 'd1-maths',
    subject: 'maths',
    day: 1,
    title: { bn: 'গুনতে শিখি ১–৫', en: 'Counting 1–5' },
    objective: {
      bn: 'শিশু ৫ পর্যন্ত জিনিস একটা একটা করে গুনে সঠিক সংখ্যা বলতে পারবে।',
      en: 'Child counts up to 5 objects one by one and says how many.',
    },
    materials: { bn: '৫টি ছোট জিনিস (চামচ, বোতাম বা পাথর)', en: '5 small objects (spoons, buttons or pebbles)' },
    difficulty: 1,
    durationMin: 4,
    skill: 'counting',
    guideLine: { bn: 'আসসালামু আলাইকুম! আমি মিঠু। চলো, আপেল গুনি!', en: "Assalamu alaikum! I'm Mithu. Let's count some apples!" },
    explanation: [
      { text: { bn: 'চলো গুনি: এক, দুই, তিন, চার, পাঁচ।', en: "Let's count: one, two, three, four, five." }, visual: '1 2 3 4 5' },
      { text: { bn: 'একটা আপেল — ১', en: 'One apple — 1' }, visual: '🍎' },
      { text: { bn: 'তিনটা আপেল — ১, ২, ৩', en: 'Three apples — 1, 2, 3' }, visual: '🍎🍎🍎' },
    ],
    interactiveQuestions: [
      {
        skill: 'counting',
        base: countQ('d1m-q1', '🍎', APPLES, 3, [2, 3, 4]),
        simpler: countQ('d1m-q1s', '🍎', APPLES, 2, [1, 2]),
        harder: countQ('d1m-q1h', '⭐', STARS, 5, [3, 4, 5]),
      },
      {
        skill: 'counting',
        base: countQ('d1m-q2', '⚽', BALLS, 4, [3, 4, 5]),
        simpler: countQ('d1m-q2s', '⚽', BALLS, 2, [2, 3]),
        harder: countQ('d1m-q2h', '⚽', BALLS, 5, [4, 5, 3]),
      },
      {
        skill: 'counting',
        base: groupQ('d1m-q3', '🍌', BANANAS, 5, [3, 5, 2]),
        simpler: groupQ('d1m-q3s', '🍌', BANANAS, 1, [1, 3]),
        harder: groupQ('d1m-q3h', '🍌', BANANAS, 4, [5, 3, 4]),
      },
    ],
    offlineActivity: {
      title: { bn: 'আসল জিনিস গুনি', en: 'Count real things' },
      steps: {
        bn: '৫টি চামচ বা বোতাম সামনে রাখুন। শিশু প্রতিটি ছুঁয়ে জোরে জোরে গুনবে। তারপর আপনি ২টা বা ৪টা সরিয়ে রেখে জিজ্ঞেস করুন, "এখন কয়টা?"',
        en: 'Put 5 spoons or buttons in front of your child. They touch each one and count aloud. Then hide 2 or 4 and ask, "How many now?"',
      },
      durationMin: 4,
      extraPractice: {
        bn: 'অতিরিক্ত অনুশীলন: ১, ২ আর ৩টা জিনিসের তিনটি ছোট স্তূপ বানান। শিশু প্রতিটি স্তূপ দেখিয়ে গুনবে।',
        en: 'Extra practice: make three small piles of 1, 2 and 3 objects. Your child points to each pile and counts it.',
      },
    },
    parentInstructions: {
      bn: 'শিশুকে নিজে চাপ দিতে দিন। ভুল হলে উত্তর বলে দেবেন না — বলুন "চলো আবার আঙুল দিয়ে গুনি"।',
      en: 'Let your child tap by themselves. If they get it wrong, don\'t give the answer — say "Let\'s count again with our finger".',
    },
    completionCriteria: {
      bn: 'স্ক্রিনে ৩টি প্রশ্ন শেষ এবং আসল জিনিস দিয়ে গোনা সম্পন্ন।',
      en: 'All 3 screen questions finished and real-object counting done with the parent.',
    },
    observationPrompt: {
      bn: 'শিশু কি প্রতিটি জিনিস ছুঁয়ে গুনেছে, নাকি শুধু তাকিয়ে?',
      en: 'Did your child touch each object while counting, or just look?',
    },
    needsReview: false,
    source: sourceOriginal(),
  },
  {
    kind: 'academic',
    id: 'd1-english',
    subject: 'english',
    day: 1,
    teachLang: 'en',
    title: { bn: 'ইংরেজি বর্ণ A, B ও তাদের ধ্বনি', en: 'Letters A, B and their sounds' },
    objective: {
      bn: 'শিশু A ও B চিনবে এবং /a/ (apple) ও /b/ (ball) ধ্বনি বলবে।',
      en: 'Child recognises A and B and says the sounds /a/ (apple) and /b/ (ball).',
    },
    materials: { bn: 'একটি থালায় একটু চাল বা আটা', en: 'A plate with a little rice or flour' },
    difficulty: 1,
    durationMin: 4,
    skill: 'english-letters',
    guideLine: { bn: 'চলো ইংরেজির প্রথম দুটি বর্ণ শিখি!', en: "Let's meet our first two English letters!" },
    explanation: [
      { text: { bn: 'A — এর ধ্বনি /a/, যেমন apple (আপেল)।', en: 'A says /a/ — like apple.' }, visual: 'A a 🍎' },
      { text: { bn: 'B — এর ধ্বনি /b/, যেমন ball (বল)।', en: 'B says /b/ — like ball.' }, visual: 'B b ⚽' },
    ],
    interactiveQuestions: [
      {
        skill: 'english-letters',
        base: choice(
          'd1e-q1',
          { bn: 'শিশুকে জিজ্ঞেস করুন: কোনটা A?', en: 'Which one is A?' },
          [['A', 'A'], ['B', 'B'], ['S', 'S']],
          'A',
          { bn: 'A দেখতে একটা পাহাড়ের মতো, মাঝখানে একটা দাগ।', en: 'A looks like a mountain with a line across the middle.' },
        ),
        simpler: choice(
          'd1e-q1s',
          { bn: 'একই রকম বর্ণটা খুঁজে বের করো।', en: 'Find the letter that matches.' },
          [['A', 'A'], ['B', 'B']],
          'A',
          { bn: 'উপরের বর্ণটার মতো দেখতে কোনটা?', en: 'Which one looks like the letter at the top?' },
          'A',
        ),
        harder: choice(
          'd1e-q1h',
          { bn: 'ছোট হাতের a কোনটা?', en: 'Which one is small a?' },
          [['a', 'a'], ['b', 'b'], ['d', 'd']],
          'a',
          { bn: 'ছোট a গোল, ডান পাশে একটা ছোট লেজ।', en: 'Small a is round with a little tail on the right.' },
        ),
      },
      {
        skill: 'english-letters',
        base: choice(
          'd1e-q2',
          { bn: 'কোন ছবিটা /b/ ধ্বনি দিয়ে শুরু?', en: 'Which picture starts with /b/?' },
          [['ball', '⚽', 'ball'], ['apple', '🍎', 'apple'], ['fish', '🐟', 'fish']],
          'ball',
          { bn: 'ঠোঁট বন্ধ করে বলুন /b/… b-b-ball।', en: 'Close your lips and say /b/… b-b-ball.' },
        ),
        simpler: choice(
          'd1e-q2s',
          { bn: 'কোনটা ball?', en: 'Which one is a ball?' },
          [['ball', '⚽', 'ball'], ['apple', '🍎', 'apple']],
          'ball',
          { bn: 'বল দিয়ে আমরা খেলি।', en: 'We play with a ball.' },
        ),
        harder: choice(
          'd1e-q2h',
          { bn: 'কোন ছবিটা /b/ ধ্বনি দিয়ে শুরু?', en: 'Which picture starts with /b/?' },
          [['apple', '🍎', 'apple'], ['banana', '🍌', 'banana'], ['cat', '🐱', 'cat']],
          'banana',
          { bn: 'b-b-banana!', en: 'b-b-banana!' },
        ),
      },
      {
        skill: 'english-letters',
        base: confirm(
          'd1e-q3',
          { bn: 'শিশুর সাথে বলুন: /a/ apple, /b/ ball।', en: 'Say the sounds with your grown-up: /a/ apple, /b/ ball.' },
          { bn: 'আগে আপনি বলুন, তারপর শিশু বলবে।', en: 'Grown-up says it first, then you repeat.' },
          'A 🍎   B ⚽',
        ),
        simpler: confirm(
          'd1e-q3s',
          { bn: 'শিশুর সাথে শুধু "apple" শব্দটা বলুন।', en: 'Say "apple" with your grown-up.' },
          { bn: 'ধীরে ধীরে: a-p-ple।', en: 'Slowly: a-p-ple.' },
          '🍎',
        ),
      },
    ],
    offlineActivity: {
      title: { bn: 'বর্ণ খোঁজা ও চালে লেখা', en: 'Letter hunt and rice tracing' },
      steps: {
        bn: 'বাড়িতে /a/ বা /b/ দিয়ে শুরু ২টি জিনিস খুঁজুন (bag, bottle, book)। তারপর চালের থালায় আঙুল দিয়ে A আর B লিখুন।',
        en: 'Find 2 things at home that start with /a/ or /b/ (bag, bottle, book). Then trace A and B with a finger in a plate of rice.',
      },
      durationMin: 4,
      extraPractice: {
        bn: 'অতিরিক্ত অনুশীলন: আপনি চালে A লিখুন, শিশু আঙুল দিয়ে তার উপর আবার টানবে — ৩ বার।',
        en: 'Extra practice: you write A in the rice and your child traces over it with a finger — 3 times.',
      },
    },
    parentInstructions: {
      bn: 'বর্ণের নামের চেয়ে ধ্বনিতে জোর দিন (/a/, /b/)। প্রশ্নগুলো ইংরেজিতে; বাংলা লাইনটি আপনার সাহায্যের জন্য।',
      en: 'Focus on the sound (/a/, /b/) more than the letter name. Questions are in English; the Bengali line is support for you.',
    },
    completionCriteria: {
      bn: 'A ও B চেনা এবং দুটি ধ্বনি বলা; চালে লেখা সম্পন্ন।',
      en: 'Recognises A and B, says both sounds; rice tracing done.',
    },
    observationPrompt: {
      bn: 'শিশু কি ধ্বনি (/b/) বলেছে, নাকি শুধু বর্ণের নাম ("বি")?',
      en: 'Did your child say the sound (/b/) or only the letter name ("bee")?',
    },
    needsReview: false,
    source: sourceOriginal(),
  },
  {
    kind: 'academic',
    id: 'd1-bengali',
    subject: 'bengali',
    day: 1,
    teachLang: 'bn',
    title: { bn: 'স্বরবর্ণ অ, আ', en: 'Bengali vowels অ, আ' },
    objective: {
      bn: 'শিশু অ ও আ চিনবে এবং অ-তে অজগর, আ-তে আম বলবে।',
      en: 'Child recognises অ and আ and says অ for অজগর (python), আ for আম (mango).',
    },
    materials: { bn: 'একটি থালায় একটু চাল বা আটা', en: 'A plate with a little rice or flour' },
    difficulty: 1,
    durationMin: 4,
    skill: 'bangla-vowels',
    guideLine: { bn: 'চলো বাংলার প্রথম দুটি বর্ণ শিখি!', en: "Let's learn the first two Bengali letters!" },
    explanation: [
      { text: { bn: 'অ — অ-তে অজগর।', en: 'অ (ô) — অজগর, python.' }, visual: 'অ 🐍' },
      { text: { bn: 'আ — আ-তে আম।', en: 'আ (a) — আম, mango.' }, visual: 'আ 🥭' },
      { text: { bn: 'অ আর আ দেখতে কাছাকাছি। আ-তে একটা দাঁড়ি বেশি আছে।', en: 'অ and আ look alike. আ has one extra standing line.' }, visual: 'অ  আ' },
    ],
    interactiveQuestions: [
      {
        skill: 'bangla-vowels',
        base: choice(
          'd1b-q1',
          { bn: 'কোনটা অ?', en: 'Which one is অ?' },
          [['o', 'অ'], ['a', 'আ'], ['k', 'ক']],
          'o',
          { bn: 'অ-তে কোনো বাড়তি দাঁড়ি নেই।', en: 'অ has no extra standing line.' },
        ),
        simpler: choice(
          'd1b-q1s',
          { bn: 'উপরের বর্ণের মতো কোনটা?', en: 'Which one matches the letter at the top?' },
          [['o', 'অ'], ['k', 'ক']],
          'o',
          { bn: 'একই রকম দেখতে বর্ণটা খোঁজো।', en: 'Look for the one that looks the same.' },
          'অ',
        ),
        harder: choice(
          'd1b-q1h',
          { bn: 'আম কোন বর্ণ দিয়ে শুরু?', en: 'Which letter does আম (mango) start with?' },
          [['o', 'অ'], ['a', 'আ'], ['i', 'ই']],
          'a',
          { bn: 'আ-তে আম!', en: 'আ for আম!' },
          '🥭',
        ),
      },
      {
        skill: 'bangla-vowels',
        base: choice(
          'd1b-q2',
          { bn: 'আ-তে কী?', en: 'What starts with আ?' },
          [['mango', '🥭', 'আম'], ['python', '🐍', 'অজগর'], ['cat', '🐱', 'বিড়াল']],
          'mango',
          { bn: 'আ-আ-আম! মিষ্টি ফল।', en: 'আ-আ-আম! A sweet fruit.' },
        ),
        simpler: choice(
          'd1b-q2s',
          { bn: 'কোনটা আম?', en: 'Which one is আম (mango)?' },
          [['mango', '🥭', 'আম'], ['car', '🚗', 'গাড়ি']],
          'mango',
          { bn: 'আম একটা ফল।', en: 'A mango is a fruit.' },
        ),
        harder: choice(
          'd1b-q2h',
          { bn: 'অ-তে কী?', en: 'What starts with অ?' },
          [['mango', '🥭', 'আম'], ['python', '🐍', 'অজগর'], ['eagle', '🦅', 'ঈগল']],
          'python',
          { bn: 'অ-তে অজগর — লম্বা সাপ।', en: 'অ for অজগর — a long snake.' },
        ),
      },
      {
        skill: 'bangla-vowels',
        base: confirm(
          'd1b-q3',
          { bn: 'অভিভাবকের সাথে আঙুল দিয়ে বাতাসে অ আর আ লেখো।', en: 'With your grown-up, write অ and আ in the air with your finger.' },
          { bn: 'আগে অভিভাবক দেখাবেন, তারপর তুমি।', en: 'Grown-up shows first, then you.' },
          'অ  আ',
        ),
        simpler: confirm(
          'd1b-q3s',
          { bn: 'অভিভাবকের সাথে বলো: অ-তে অজগর।', en: 'Say with your grown-up: অ-তে অজগর.' },
          { bn: 'ধীরে ধীরে বলো।', en: 'Say it slowly.' },
          'অ 🐍',
        ),
      },
    ],
    offlineActivity: {
      title: { bn: 'চালের থালায় অ, আ', en: 'অ and আ in a rice plate' },
      steps: {
        bn: 'চালের থালায় আপনি অ লিখুন, শিশু পাশে লিখবে। তারপর আ। প্রতিবার বলুন "অ-তে অজগর", "আ-তে আম"।',
        en: 'Write অ in the rice plate; your child writes it next to yours. Then আ. Say "অ-তে অজগর", "আ-তে আম" each time.',
      },
      durationMin: 4,
      extraPractice: {
        bn: 'অতিরিক্ত অনুশীলন: কাগজে বড় করে অ লিখে দিন, শিশু রঙ পেন্সিল দিয়ে তার উপর টানবে।',
        en: 'Extra practice: write a large অ on paper; your child traces over it with a crayon.',
      },
    },
    parentInstructions: {
      bn: 'অ আর আ-এর পার্থক্য (বাড়তি দাঁড়ি) আঙুল দিয়ে দেখিয়ে দিন।',
      en: 'Point out the difference between অ and আ (the extra standing line) with your finger.',
    },
    completionCriteria: { bn: 'অ ও আ চেনা; চালে দুটি বর্ণ লেখা।', en: 'Recognises অ and আ; writes both in rice.' },
    observationPrompt: { bn: 'শিশু কি অ আর আ গুলিয়ে ফেলছে?', en: 'Is your child mixing up অ and আ?' },
    needsReview: true,
    source: sourceOriginal('Bengali vowel order and example words (অজগর, আম) follow common primer convention — to be checked by a Bengali teacher.'),
  },
  {
    kind: 'academic',
    id: 'd1-world',
    subject: 'world',
    day: 1,
    title: { bn: 'আমার পরিবার', en: 'My family' },
    objective: {
      bn: 'শিশু পরিবারের সদস্যদের নাম বলবে এবং বাড়িতে কীভাবে সাহায্য করা যায় বলবে।',
      en: 'Child names family members and one way to help at home.',
    },
    materials: { bn: 'কাগজ ও রঙ পেন্সিল', en: 'Paper and crayons' },
    difficulty: 1,
    durationMin: 4,
    skill: 'world-self',
    guideLine: { bn: 'তোমার পরিবারে কে কে আছে? চলো দেখি!', en: "Who is in your family? Let's see!" },
    explanation: [
      { text: { bn: 'পরিবারে থাকতে পারে মা, বাবা, ভাই, বোন, দাদা-দাদি বা নানা-নানি।', en: 'A family can have mother, father, brothers, sisters and grandparents.' }, visual: '👩 👨 👧 👦 👵 👴' },
      { text: { bn: 'পরিবারের সবাই একে অপরকে সাহায্য করে।', en: 'People in a family help each other.' }, visual: '🤝' },
    ],
    interactiveQuestions: [
      {
        skill: 'world-self',
        base: choice(
          'd1w-q1',
          { bn: 'কোনজন দাদি বা নানি?', en: 'Which one is a grandmother?' },
          [['grandma', '👵'], ['baby', '👶'], ['boy', '👦']],
          'grandma',
          { bn: 'দাদি-নানির চুল অনেক সময় সাদা হয়।', en: 'Grandmothers often have white hair.' },
        ),
        simpler: choice(
          'd1w-q1s',
          { bn: 'কোনজন দাদি বা নানি?', en: 'Which one is a grandmother?' },
          [['grandma', '👵'], ['baby', '👶']],
          'grandma',
          { bn: 'ছোট্ট শিশুটি নয়।', en: 'Not the little baby.' },
        ),
        harder: choice(
          'd1w-q1h',
          { bn: 'সবচেয়ে ছোট কে?', en: 'Who is the youngest?' },
          [['man', '👨'], ['boy', '👦'], ['baby', '👶']],
          'baby',
          { bn: 'যে এখনো হাঁটতে শেখেনি।', en: 'The one who cannot walk yet.' },
        ),
      },
      {
        skill: 'world-self',
        base: choice(
          'd1w-q2',
          { bn: 'বাড়িতে সাহায্য করতে তুমি কী করতে পারো?', en: 'How can you help your family at home?' },
          [
            ['sweep', '🧹', { bn: 'ঝাড়ু দিতে সাহায্য', en: 'Help sweep' }],
            ['angry', '😠', { bn: 'রাগ করা', en: 'Get angry' }],
            ['hide', '🙈', { bn: 'লুকিয়ে থাকা', en: 'Hide' }],
          ],
          'sweep',
          { bn: 'কোনটায় পরিবারের কাজ হয়?', en: 'Which one helps with the housework?' },
        ),
        simpler: choice(
          'd1w-q2s',
          { bn: 'কোনটা সাহায্য করা?', en: 'Which one is helping?' },
          [
            ['sweep', '🧹', { bn: 'ঝাড়ু দিতে সাহায্য', en: 'Help sweep' }],
            ['angry', '😠', { bn: 'রাগ করা', en: 'Get angry' }],
          ],
          'sweep',
          { bn: 'ঝাড়ু দিয়ে ঘর পরিষ্কার হয়।', en: 'Sweeping makes the house clean.' },
        ),
      },
      {
        skill: 'world-self',
        base: confirm(
          'd1w-q3',
          { bn: 'অভিভাবককে তোমার পরিবারের ৩ জনের নাম বলো।', en: 'Tell your grown-up the names of 3 people in your family.' },
          { bn: 'আঙুলে গুনে গুনে বলো।', en: 'Count them on your fingers.' },
          '👩 👨 👵',
        ),
        simpler: confirm(
          'd1w-q3s',
          { bn: 'অভিভাবককে পরিবারের ১ জনের নাম বলো।', en: 'Tell your grown-up the name of 1 person in your family.' },
          { bn: 'মায়ের বা বাবার নাম বলতে পারো।', en: 'You can say your mother\'s or father\'s name.' },
          '👩',
        ),
      },
    ],
    offlineActivity: {
      title: { bn: 'পরিবারের ছবি আঁকি', en: 'Draw my family' },
      steps: {
        bn: 'শিশু পরিবারের সদস্যদের ছবি আঁকবে (গোল মাথা আর দাগ দিলেই চলবে)। প্রতিটি ছবি দেখিয়ে নাম বলবে।',
        en: 'Your child draws their family (circle heads and stick bodies are fine) and names each person.',
      },
      durationMin: 4,
      extraPractice: {
        bn: 'অতিরিক্ত অনুশীলন: পরিবারের একটি পুরনো ছবি দেখে প্রত্যেককে চিনে নাম বলা।',
        en: 'Extra practice: look at a family photo together and name each person.',
      },
    },
    parentInstructions: {
      bn: 'পরিবারের গঠন সব বাড়িতে আলাদা — শিশুর নিজের পরিবারকেই সঠিক উত্তর ধরুন।',
      en: 'Every family looks different — accept your child\'s own family as the right answer.',
    },
    completionCriteria: { bn: 'পরিবারের ৩ জনের নাম বলা ও ছবি আঁকা।', en: 'Names 3 family members and draws them.' },
    observationPrompt: { bn: 'শিশু কি নিজে থেকে কাউকে সাহায্য করার কথা বলেছে?', en: 'Did your child mention helping someone on their own?' },
    needsReview: false,
    source: sourceOriginal(),
  },
];
