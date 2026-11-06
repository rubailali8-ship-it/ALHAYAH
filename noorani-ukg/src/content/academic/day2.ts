import type { AcademicLesson } from '../../types/content';
import { choice, confirm, countQ, groupQ, sourceOriginal } from '../helpers';

const STARS = { bn: 'তারা', en: 'stars' };
const FISH = { bn: 'মাছ', en: 'fish' };
const DOTS = { bn: 'ফোঁটা', en: 'dots' };

export const day2: AcademicLesson[] = [
  {
    kind: 'academic',
    id: 'd2-maths',
    subject: 'maths',
    day: 2,
    title: { bn: 'গুনতে শিখি ৬–১০', en: 'Counting 6–10' },
    objective: { bn: 'শিশু ১০ পর্যন্ত জিনিস গুনবে এবং ৯-এর পরে ১০ আসে জানবে।', en: 'Child counts up to 10 objects and knows 10 comes after 9.' },
    materials: { bn: '১০টি ছোট জিনিস (ডাল, বোতাম, পাথর)', en: '10 small objects (lentils, buttons, pebbles)' },
    difficulty: 2,
    durationMin: 4,
    skill: 'counting',
    guideLine: { bn: 'কাল আমরা ৫ পর্যন্ত গুনেছি। আজ ১০ পর্যন্ত!', en: 'Yesterday we counted to 5. Today, all the way to 10!' },
    explanation: [
      { text: { bn: 'ছয়, সাত, আট, নয়, দশ।', en: 'Six, seven, eight, nine, ten.' }, visual: '6 7 8 9 10' },
      { text: { bn: 'দুই হাতে মোট ১০টি আঙুল!', en: 'Two hands have 10 fingers altogether!' }, visual: '🖐️🖐️' },
    ],
    interactiveQuestions: [
      {
        skill: 'counting',
        base: countQ('d2m-q1', '⭐', STARS, 6, [5, 6, 7]),
        simpler: countQ('d2m-q1s', '⭐', STARS, 4, [4, 5]),
        harder: countQ('d2m-q1h', '⭐', STARS, 8, [7, 8, 9]),
      },
      {
        skill: 'counting',
        base: countQ('d2m-q2', '🐟', FISH, 7, [6, 7, 8]),
        simpler: countQ('d2m-q2s', '🐟', FISH, 5, [5, 6]),
        harder: countQ('d2m-q2h', '🐟', FISH, 9, [8, 9, 10]),
      },
      {
        skill: 'counting',
        base: choice(
          'd2m-q3',
          { bn: '৯-এর পরে কোন সংখ্যা?', en: 'Which number comes after 9?' },
          [['10', '10'], ['8', '8'], ['6', '6']],
          '10',
          { bn: 'আঙুলে গোনো: ...আট, নয়, তারপর?', en: 'Count on your fingers: …eight, nine, then?' },
          '7 8 9 ?',
        ),
        simpler: choice(
          'd2m-q3s',
          { bn: '৫-এর পরে কোন সংখ্যা?', en: 'Which number comes after 5?' },
          [['6', '6'], ['4', '4']],
          '6',
          { bn: 'এক হাতের পরে আরেকটা আঙুল।', en: 'One hand, then one more finger.' },
          '3 4 5 ?',
        ),
        harder: groupQ('d2m-q3h', '●', DOTS, 10, [9, 10, 8]),
      },
    ],
    offlineActivity: {
      title: { bn: 'দশটা ডাল গুনি', en: 'Count ten lentils' },
      steps: {
        bn: 'এক মুঠো ডাল বা বোতাম থেকে শিশু ১০টি আলাদা করে একটা বাটিতে রাখবে, প্রতিটা রাখার সময় জোরে গুনবে।',
        en: 'From a handful of lentils or buttons, your child moves 10 into a bowl one by one, counting aloud.',
      },
      durationMin: 4,
      extraPractice: {
        bn: 'অতিরিক্ত অনুশীলন: আঙুল গোনা — আপনি কয়েকটা আঙুল দেখাবেন (৬–১০), শিশু গুনে বলবে।',
        en: 'Extra practice: finger counting — show 6 to 10 fingers and your child counts them.',
      },
    },
    parentInstructions: {
      bn: '৬-এর পর শিশু অনেক সময় সংখ্যা লাফিয়ে যায়। প্রতিটি জিনিস একবার ছোঁয়া হচ্ছে কিনা দেখুন।',
      en: 'After 6 children often skip numbers. Check that each object is touched exactly once.',
    },
    completionCriteria: { bn: '১০ পর্যন্ত সঠিক গোনা; ১০টি ডাল আলাদা করা।', en: 'Counts correctly to 10; separates 10 lentils.' },
    observationPrompt: { bn: 'কোন সংখ্যার পরে শিশু থেমে গেছে বা লাফিয়েছে?', en: 'After which number did your child pause or skip?' },
    needsReview: false,
    source: sourceOriginal(),
  },
  {
    kind: 'academic',
    id: 'd2-english',
    subject: 'english',
    day: 2,
    teachLang: 'en',
    title: { bn: 'ইংরেজি বর্ণ C, D ও তাদের ধ্বনি', en: 'Letters C, D and their sounds' },
    objective: { bn: 'শিশু C ও D চিনবে এবং /k/ (cat) ও /d/ (dog) ধ্বনি বলবে।', en: 'Child recognises C and D and says /k/ (cat) and /d/ (dog).' },
    materials: { bn: 'কাগজ ও রঙ পেন্সিল', en: 'Paper and crayons' },
    difficulty: 1,
    durationMin: 4,
    skill: 'english-letters',
    guideLine: { bn: 'চলো দুটি নতুন বর্ণ — C আর D!', en: "Two new letters — C and D!" },
    explanation: [
      { text: { bn: 'C — এর ধ্বনি /k/, যেমন cat (বিড়াল)।', en: 'C says /k/ — like cat.' }, visual: 'C c 🐱' },
      { text: { bn: 'D — এর ধ্বনি /d/, যেমন dog (কুকুর)।', en: 'D says /d/ — like dog.' }, visual: 'D d 🐶' },
    ],
    interactiveQuestions: [
      {
        skill: 'english-letters',
        base: choice('d2e-q1', { bn: 'শিশুকে জিজ্ঞেস করুন: কোনটা C?', en: 'Which one is C?' }, [['C', 'C'], ['D', 'D'], ['O', 'O']], 'C', { bn: 'C একটা খোলা গোল, ডান দিকে ফাঁকা।', en: 'C is an open circle, open on the right.' }),
        simpler: choice('d2e-q1s', { bn: 'একই রকম বর্ণটা খোঁজো।', en: 'Find the letter that matches.' }, [['C', 'C'], ['D', 'D']], 'C', { bn: 'উপরের বর্ণের মতো কোনটা?', en: 'Which looks like the letter at the top?' }, 'C'),
        harder: choice('d2e-q1h', { bn: 'ছোট হাতের d কোনটা?', en: 'Which one is small d?' }, [['b', 'b'], ['d', 'd'], ['p', 'p']], 'd', { bn: 'd-এর গোলটা বাঁ দিকে, লম্বা দাগটা ডানে।', en: 'Small d has its circle on the left and tall line on the right.' }),
      },
      {
        skill: 'english-letters',
        base: choice('d2e-q2', { bn: 'কোন ছবিটা /d/ ধ্বনি দিয়ে শুরু?', en: 'Which picture starts with /d/?' }, [['dog', '🐶', 'dog'], ['cat', '🐱', 'cat'], ['ball', '⚽', 'ball']], 'dog', { bn: 'জিভ দাঁতের পেছনে রেখে বলুন /d/… d-d-dog।', en: 'Tongue behind your teeth: /d/… d-d-dog.' }),
        simpler: choice('d2e-q2s', { bn: 'কোনটা dog?', en: 'Which one is a dog?' }, [['dog', '🐶', 'dog'], ['apple', '🍎', 'apple']], 'dog', { bn: 'কুকুর ঘেউ ঘেউ করে।', en: 'A dog says woof.' }),
        harder: choice('d2e-q2h', { bn: 'কোন ছবিটা /k/ ধ্বনি দিয়ে শুরু?', en: 'Which picture starts with /k/?' }, [['dog', '🐶', 'dog'], ['cup', '☕', 'cup'], ['egg', '🥚', 'egg']], 'cup', { bn: 'c-c-cup!', en: 'c-c-cup!' }),
      },
      {
        skill: 'english-letters',
        base: confirm('d2e-q3', { bn: 'শিশুর সাথে বলুন: /k/ cat, /d/ dog।', en: 'Say with your grown-up: /k/ cat, /d/ dog.' }, { bn: 'আগে আপনি বলুন।', en: 'Grown-up says it first.' }, 'C 🐱   D 🐶'),
        simpler: confirm('d2e-q3s', { bn: 'শিশুর সাথে শুধু "dog" বলুন।', en: 'Say "dog" with your grown-up.' }, { bn: 'ধীরে: d-o-g।', en: 'Slowly: d-o-g.' }, '🐶'),
      },
    ],
    offlineActivity: {
      title: { bn: 'C-এর বিড়াল, D-এর কুকুর আঁকি', en: 'Draw a C-cat and a D-dog' },
      steps: {
        bn: 'আপনি কাগজে বড় C আর D লিখুন। শিশু C-কে বিড়ালের মুখ আর D-কে কুকুরের মুখ বানিয়ে আঁকবে (চোখ, কান যোগ করে)।',
        en: 'Write a big C and D on paper. Your child turns C into a cat face and D into a dog face by adding eyes and ears.',
      },
      durationMin: 4,
      extraPractice: {
        bn: 'অতিরিক্ত অনুশীলন: বাড়িতে /k/ বা /d/ দিয়ে শুরু ২টি জিনিস খুঁজুন (cup, door)।',
        en: 'Extra practice: find 2 things at home starting with /k/ or /d/ (cup, door).',
      },
    },
    parentInstructions: { bn: 'C-এর ধ্বনি এখানে /k/ (cat) — "সি" নয়।', en: 'Here C makes the /k/ sound (cat), not "see".' },
    completionCriteria: { bn: 'C ও D চেনা, দুটি ধ্বনি বলা।', en: 'Recognises C and D; says both sounds.' },
    observationPrompt: { bn: 'শিশু কি b আর d গুলিয়ে ফেলছে?', en: 'Is your child mixing up b and d?' },
    needsReview: false,
    source: sourceOriginal(),
  },
  {
    kind: 'academic',
    id: 'd2-bengali',
    subject: 'bengali',
    day: 2,
    teachLang: 'bn',
    title: { bn: 'স্বরবর্ণ ই, ঈ', en: 'Bengali vowels ই, ঈ' },
    objective: { bn: 'শিশু ই ও ঈ চিনবে: ই-তে ইঁদুর, ঈ-তে ঈগল।', en: 'Child recognises ই and ঈ: ই for ইঁদুর (mouse), ঈ for ঈগল (eagle).' },
    materials: { bn: 'চালের থালা', en: 'A plate of rice' },
    difficulty: 1,
    durationMin: 4,
    skill: 'bangla-vowels',
    guideLine: { bn: 'আজ আরও দুটি স্বরবর্ণ — ই আর ঈ!', en: 'Two more vowels today — ই and ঈ!' },
    explanation: [
      { text: { bn: 'ই — ই-তে ইঁদুর।', en: 'ই (i) — ইঁদুর, mouse.' }, visual: 'ই 🐭' },
      { text: { bn: 'ঈ — ঈ-তে ঈগল।', en: 'ঈ (long i) — ঈগল, eagle.' }, visual: 'ঈ 🦅' },
      { text: { bn: 'ঈ-এর মাথায় একটা বাড়তি প্যাঁচ আছে।', en: 'ঈ has an extra curl at the top.' }, visual: 'ই  ঈ' },
    ],
    interactiveQuestions: [
      {
        skill: 'bangla-vowels',
        base: choice('d2b-q1', { bn: 'কোনটা ই?', en: 'Which one is ই?' }, [['i', 'ই'], ['ii', 'ঈ'], ['a', 'আ']], 'i', { bn: 'ই-এর মাথায় বাড়তি প্যাঁচ নেই।', en: 'ই has no extra curl on top.' }),
        simpler: choice('d2b-q1s', { bn: 'উপরের বর্ণের মতো কোনটা?', en: 'Which one matches the letter at the top?' }, [['i', 'ই'], ['k', 'ক']], 'i', { bn: 'একই রকম দেখতে বর্ণটা খোঁজো।', en: 'Look for the same shape.' }, 'ই'),
        harder: choice('d2b-q1h', { bn: 'ঈগল কোন বর্ণ দিয়ে শুরু?', en: 'Which letter does ঈগল (eagle) start with?' }, [['i', 'ই'], ['ii', 'ঈ'], ['u', 'উ']], 'ii', { bn: 'ঈ-তে ঈগল!', en: 'ঈ for ঈগল!' }, '🦅'),
      },
      {
        skill: 'bangla-vowels',
        base: choice('d2b-q2', { bn: 'ই-তে কী?', en: 'What starts with ই?' }, [['mouse', '🐭', 'ইঁদুর'], ['eagle', '🦅', 'ঈগল'], ['mango', '🥭', 'আম']], 'mouse', { bn: 'ই-ই-ইঁদুর! ছোট্ট প্রাণী।', en: 'ই-ই-ইঁদুর! A tiny animal.' }),
        simpler: choice('d2b-q2s', { bn: 'কোনটা ইঁদুর?', en: 'Which one is ইঁদুর (mouse)?' }, [['mouse', '🐭', 'ইঁদুর'], ['car', '🚗', 'গাড়ি']], 'mouse', { bn: 'ইঁদুরের লম্বা লেজ।', en: 'A mouse has a long tail.' }),
        harder: choice('d2b-q2h', { bn: 'অ-তে কী? (কালকের পড়া)', en: 'What starts with অ? (yesterday)' }, [['python', '🐍', 'অজগর'], ['mouse', '🐭', 'ইঁদুর'], ['eagle', '🦅', 'ঈগল']], 'python', { bn: 'অ-তে অজগর।', en: 'অ for অজগর.' }),
      },
      {
        skill: 'bangla-vowels',
        base: confirm('d2b-q3', { bn: 'অভিভাবকের সাথে বলো: ই-তে ইঁদুর, ঈ-তে ঈগল।', en: 'Say with your grown-up: ই-তে ইঁদুর, ঈ-তে ঈগল.' }, { bn: 'আগে অভিভাবক বলবেন।', en: 'Grown-up says it first.' }, 'ই 🐭  ঈ 🦅'),
        simpler: confirm('d2b-q3s', { bn: 'অভিভাবকের সাথে বলো: ই-তে ইঁদুর।', en: 'Say with your grown-up: ই-তে ইঁদুর.' }, { bn: 'ধীরে ধীরে বলো।', en: 'Say it slowly.' }, 'ই 🐭'),
      },
    ],
    offlineActivity: {
      title: { bn: 'চালের থালায় ই, ঈ', en: 'ই and ঈ in a rice plate' },
      steps: {
        bn: 'চালের থালায় আপনি ই লিখুন, শিশু পাশে লিখবে; তারপর ঈ। শেষে অ, আ, ই, ঈ চারটিই একবার করে।',
        en: 'Write ই in the rice; your child copies it. Then ঈ. Finish by writing all four: অ, আ, ই, ঈ.',
      },
      durationMin: 4,
      extraPractice: {
        bn: 'অতিরিক্ত অনুশীলন: কাগজে বড় করে ই আর ঈ লিখে দিন, শিশু রঙ দিয়ে ঈ-এর বাড়তি প্যাঁচটা আলাদা রঙে আঁকবে।',
        en: 'Extra practice: write big ই and ঈ; your child colours the extra curl of ঈ in a different colour.',
      },
    },
    parentInstructions: { bn: 'ই আর ঈ-এর উচ্চারণ কাছাকাছি; এই বয়সে আকারের পার্থক্য চেনাই যথেষ্ট।', en: 'ই and ঈ sound similar; at this age, telling the shapes apart is enough.' },
    completionCriteria: { bn: 'ই ও ঈ চেনা; চালে লেখা।', en: 'Recognises ই and ঈ; writes both in rice.' },
    observationPrompt: { bn: 'শিশু কি কালকের অ, আ মনে রেখেছে?', en: 'Did your child remember অ and আ from yesterday?' },
    needsReview: true,
    source: sourceOriginal('Example words (ইঁদুর, ঈগল) follow common primer convention — to be checked by a Bengali teacher.'),
  },
  {
    kind: 'academic',
    id: 'd2-world',
    subject: 'world',
    day: 2,
    title: { bn: 'হাত ধোয়া', en: 'Handwashing' },
    objective: { bn: 'শিশু সাবান দিয়ে হাত ধোয়ার ধাপগুলো জানবে এবং কখন ধুতে হয় বলবে।', en: 'Child knows the steps of washing hands with soap and when to do it.' },
    materials: { bn: 'সাবান, জল, তোয়ালে', en: 'Soap, water, towel' },
    difficulty: 1,
    durationMin: 4,
    skill: 'world-health',
    guideLine: { bn: 'পরিষ্কার হাত, সুস্থ শরীর! চলো শিখি।', en: "Clean hands, healthy body! Let's learn." },
    explanation: [
      { text: { bn: 'খাওয়ার আগে আর টয়লেটের পরে সাবান দিয়ে হাত ধুই।', en: 'We wash hands with soap before eating and after the toilet.' }, visual: '🧼 💧' },
      { text: { bn: 'ভেজাও, সাবান লাগাও, ২০ গোনা পর্যন্ত ঘষো, ধুয়ে ফেলো, মুছে ফেলো।', en: 'Wet, soap, rub while counting to 20, rinse, dry.' }, visual: '💧 → 🧼 → 🙌 → 💧 → 🧻' },
    ],
    interactiveQuestions: [
      {
        skill: 'world-health',
        base: choice('d2w-q1', { bn: 'হাত ধুতে আমরা কী ব্যবহার করি?', en: 'What do we use to wash our hands?' }, [['soap', '🧼', { bn: 'সাবান', en: 'Soap' }], ['candy', '🍭', { bn: 'লজেন্স', en: 'Candy' }], ['toy', '🧸', { bn: 'খেলনা', en: 'Toy' }]], 'soap', { bn: 'যেটা দিয়ে ফেনা হয়।', en: 'The one that makes bubbles.' }),
        simpler: choice('d2w-q1s', { bn: 'হাত ধুতে কোনটা লাগে?', en: 'Which one do we need to wash hands?' }, [['soap', '🧼', { bn: 'সাবান', en: 'Soap' }], ['candy', '🍭', { bn: 'লজেন্স', en: 'Candy' }]], 'soap', { bn: 'লজেন্স তো খাওয়ার জিনিস!', en: 'Candy is for eating!' }),
        harder: choice('d2w-q1h', { bn: 'কখন হাত ধোয়া সবচেয়ে জরুরি?', en: 'When is it most important to wash hands?' }, [['eat', '🍚', { bn: 'খাওয়ার আগে', en: 'Before eating' }], ['sing', '🎵', { bn: 'গান গাওয়ার আগে', en: 'Before singing' }], ['sleep', '🌙', { bn: 'চাঁদ দেখার আগে', en: 'Before looking at the moon' }]], 'eat', { bn: 'হাত দিয়ে যখন খাবার মুখে দিই।', en: 'When our hands touch our food.' }),
      },
      {
        skill: 'world-health',
        base: choice('d2w-q2', { bn: 'সাবান লাগানোর আগে কী করি?', en: 'What do we do before using soap?' }, [['wet', '💧', { bn: 'হাত ভেজাই', en: 'Wet hands' }], ['dry', '🧻', { bn: 'হাত মুছি', en: 'Dry hands' }]], 'wet', { bn: 'প্রথম ধাপ জল দিয়ে।', en: 'The first step uses water.' }),
        simpler: choice('d2w-q2s', { bn: 'হাত ভেজাতে কী লাগে?', en: 'What do we use to wet our hands?' }, [['water', '💧', { bn: 'জল', en: 'Water' }], ['book', '📚', { bn: 'বই', en: 'Book' }]], 'water', { bn: 'কল থেকে যা পড়ে।', en: 'What comes out of the tap.' }),
        harder: choice('d2w-q2h', { bn: 'সাবান দিয়ে কতক্ষণ ঘষব?', en: 'How long do we rub with soap?' }, [['20', '20', { bn: '২০ গোনা পর্যন্ত', en: 'Count to 20' }], ['1', '1', { bn: '১ গোনা', en: 'Count to 1' }], ['2', '2', { bn: '২ গোনা', en: 'Count to 2' }]], '20', { bn: 'অনেকক্ষণ — দুই হাতের আঙুল দুইবার গোনা।', en: 'A long time — count all your fingers twice.' }),
      },
      {
        skill: 'world-health',
        base: confirm('d2w-q3', { bn: 'অভিভাবককে দেখাও কীভাবে আঙুলের ফাঁকে ঘষো, আর ২০ পর্যন্ত গোনো।', en: 'Show your grown-up how you rub between your fingers while counting to 20.' }, { bn: 'হাতের পেছনেও ঘষতে ভুলো না।', en: "Don't forget the backs of your hands." }, '🙌'),
        simpler: confirm('d2w-q3s', { bn: 'অভিভাবকের সাথে হাত ঘষার অভিনয় করো আর ১০ পর্যন্ত গোনো।', en: 'Pretend to rub your hands with your grown-up and count to 10.' }, { bn: 'একসাথে গোনো।', en: 'Count together.' }, '🙌'),
      },
    ],
    offlineActivity: {
      title: { bn: 'সত্যিকারের হাত ধোয়া', en: 'Real handwashing' },
      steps: {
        bn: 'বেসিনে গিয়ে শিশু নিজে পাঁচটি ধাপে হাত ধোবে, আপনি ২০ পর্যন্ত গুনবেন। আজ খাওয়ার আগে আবার করুন।',
        en: 'At the sink, your child washes hands in five steps while you count to 20. Repeat before the next meal.',
      },
      durationMin: 4,
      extraPractice: {
        bn: 'অতিরিক্ত অনুশীলন: পাঁচটি ধাপের ছবি এঁকে বেসিনের পাশে লাগান।',
        en: 'Extra practice: draw the five steps and stick them near the sink.',
      },
    },
    parentInstructions: { bn: 'জল কম থাকলে মগ থেকে জল ঢালুন — ধাপগুলোই আসল।', en: 'If water is scarce, pour from a mug — the steps are what matter.' },
    completionCriteria: { bn: 'পাঁচ ধাপে সাবান দিয়ে হাত ধোয়া।', en: 'Washes hands with soap in five steps.' },
    observationPrompt: { bn: 'শিশু কি নিজে থেকে আঙুলের ফাঁক ও নখ ঘষেছে?', en: 'Did your child rub between fingers and nails without reminders?' },
    needsReview: false,
    source: sourceOriginal('Steps simplified from widely published public-health handwashing guidance.'),
  },
];
