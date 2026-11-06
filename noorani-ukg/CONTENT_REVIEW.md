# Content review checklist

_Generated from `src/content` by `npm run content-review` — do not edit by hand; edit the lesson files and regenerate._

Items needing review: **10 lessons** (5 Islamic → alim, 5 Bengali → Bengali teacher).

## Qur'anic text status

**NOT FETCHED.** Tanzil.net was blocked from the build environment. The app shows `[QURAN TEXT — INSERT FROM VERIFIED SOURCE]` for Qur'an 1:1 and 112:1–4. Run `npm run fetch-quran` on a machine with internet, then have the alim confirm the rendered text against a printed mushaf.

## Hadith references to verify

- [ ] Sahih al-Bukhari 5376 / Sahih Muslim 2022 — boy told to say Bismillah, eat with right hand, eat from what is near (used in d3-islamic).
- [ ] Sahih al-Bukhari 6227 — greeting of Salam (used in d4-islamic).
- [ ] Sahih Muslim 54 — spreading Salam (used in d4-islamic).
- [ ] Reply wording "وَعَلَيْكُمُ السَّلَامُ" and transliterations (d4-islamic).
- [ ] Bengali transliteration of Arabic letter names (আলিফ, বা, তা, ছা) — note: ث shown as "ছা" follows common Bengali madrasa convention; confirm preferred spelling.

## Islamic lessons (reviewer: alim)

### d1-islamic — Arabic letters ا (Alif) and ب (Ba)

**Reviewer:** Alim / Qur'an teacher  
**Source:** Standard Arabic alphabet letter forms and names (transliterated). No pronunciation guide given — to be taught by parent/teacher. Needs review by an alim/Qur'an teacher.

- [ ] Title: আরবি বর্ণ ا (আলিফ), ب (বা)  
  _EN:_ Arabic letters ا (Alif) and ب (Ba)
- [ ] Objective: শিশু ا আলিফ ও ب বা চিনবে এবং নাম বলবে।  
  _EN:_ Child recognises ا Alif and ب Ba and says their names.
- [ ] Guide line: চলো আরবির প্রথম দুটি বর্ণ দেখি!  
  _EN:_ Let's look at the first two Arabic letters!
- [ ] Explanation 1: এটি আলিফ (Alif)। সোজা দাঁড়ানো একটা দাগ।  
  _EN:_ This is Alif. A straight standing line.  
  visual: `ا`
- [ ] Explanation 2: এটি বা (Ba)। নিচে একটা বিন্দু।  
  _EN:_ This is Ba. It has one dot below.  
  visual: `ب`
- [ ] Explanation 3: নামগুলো অভিভাবক বলবেন, শিশু পুনরাবৃত্তি করবে।  
  _EN:_ Your parent says the names; you repeat.  
  visual: `ا  ب`
- [ ] **d1i-q1** (base) — prompt: কোনটা আলিফ?  
  _EN:_ Which one is Alif?
  - options: ✅ ا · ب
  - hint: আলিফ সোজা দাঁড়িয়ে থাকে, কোনো বিন্দু নেই।  
  _EN:_ Alif stands straight and has no dot.
- [ ] **d1i-q1s** (simpler) — prompt: একই রকম বর্ণটা খোঁজো।  
  _EN:_ Find the same letter.
  - visual: `ا`
  - options: ✅ ا · ب
  - hint: উপরের বর্ণের মতো দেখতে কোনটা?  
  _EN:_ Which one looks like the letter at the top?
- [ ] **d1i-q1h** (harder) — prompt: কোনটা বা?  
  _EN:_ Which one is Ba?
  - options: ت · ✅ ب · ا
  - hint: বা-এর বিন্দু নিচে।  
  _EN:_ Ba has its dot below.
- [ ] **d1i-q2** (base) — prompt: কোন বর্ণের নিচে একটা বিন্দু আছে?  
  _EN:_ Which letter has one dot below?
  - options: ✅ ب · ا
  - hint: বর্ণের নিচের দিকে তাকাও।  
  _EN:_ Look underneath each letter.
- [ ] **d1i-q2s** (simpler) — prompt: একই রকম বর্ণটা খোঁজো।  
  _EN:_ Find the same letter.
  - visual: `ب`
  - options: ا · ✅ ب
  - hint: উপরের বর্ণের মতো দেখতে কোনটা?  
  _EN:_ Which one looks like the letter at the top?
- [ ] **d1i-q3** (base) — prompt: অভিভাবকের সাথে বর্ণ দুটি দেখিয়ে নাম বলো: আলিফ, বা।  
  _EN:_ Point to each letter and say its name with your parent: Alif, Ba.
  - visual: `ا  ب`
  - parent-confirmed step
  - hint: আগে অভিভাবক বলবেন।  
  _EN:_ Parent says it first.
- [ ] **d1i-q3s** (simpler) — prompt: অভিভাবকের সাথে শুধু আলিফ দেখিয়ে নাম বলো।  
  _EN:_ Point to Alif and say its name with your parent.
  - visual: `ا`
  - parent-confirmed step
  - hint: আগে অভিভাবক বলবেন।  
  _EN:_ Parent says it first.
- [ ] Offline activity: কাগজে আলিফ ও বা  
  _EN:_ Alif and Ba on paper — আপনি কাগজে বড় করে ا আর ب লিখুন (আরবি ডান থেকে বাঁয়ে লেখা হয়)। শিশু আঙুল দিয়ে তার উপর টানবে এবং নাম বলবে।  
  _EN:_ Write a large ا and ب on paper (Arabic is written right to left). Your child traces each with a finger and says its name.
- [ ] Extra practice: অতিরিক্ত অনুশীলন: ঘরের মধ্যে ৩টি জায়গায় ا আর ب লেখা কাগজ লুকিয়ে রাখুন; শিশু খুঁজে নাম বলবে।  
  _EN:_ Extra practice: hide 3 cards with ا or ب around the room; your child finds each one and names it.
- [ ] Parent instructions: বর্ণের সঠিক উচ্চারণ আপনি বা শিক্ষক শেখাবেন — অ্যাপ কোনো উচ্চারণ নির্দেশিকা দেয় না।  
  _EN:_ You or a teacher teach the correct pronunciation — the app does not give a pronunciation guide.
- [ ] Completion criteria: ا ও ب চেনা ও নাম বলা।  
  _EN:_ Recognises and names ا and ب.
- [ ] Observation prompt: শিশু কি বিন্দু দেখে বা চিনতে পেরেছে?  
  _EN:_ Did your child use the dot to recognise Ba?

### d2-islamic — Arabic letters ت (Ta), ث (Tha) and Bismillah

**Reviewer:** Alim / Qur'an teacher  
**Source:** Standard Arabic alphabet letter forms and names (transliterated). No pronunciation guide given — to be taught by parent/teacher. Needs review by an alim/Qur'an teacher. Bismillah text: Qur'an 1:1 via Tanzil.net (placeholder until fetched).

- [ ] Title: আরবি বর্ণ ت (তা), ث (ছা) ও বিসমিল্লাহ  
  _EN:_ Arabic letters ت (Ta), ث (Tha) and Bismillah
- [ ] Objective: শিশু ت ও ث চিনবে (বিন্দু গুনে) এবং অভিভাবকের সাথে বিসমিল্লাহ বলবে।  
  _EN:_ Child recognises ت and ث (by counting dots) and says Bismillah with the parent.
- [ ] Guide line: আজ আরও দুটি বর্ণ — আর একটি সুন্দর শুরু!  
  _EN:_ Two more letters today — and a beautiful way to begin!
- [ ] Explanation 1: এটি তা (Ta)। উপরে দুটি বিন্দু।  
  _EN:_ This is Ta. Two dots above.  
  visual: `ت`
- [ ] Explanation 2: এটি ছা (Tha)। উপরে তিনটি বিন্দু।  
  _EN:_ This is Tha. Three dots above.  
  visual: `ث`
- [ ] Explanation 3: ভালো কাজ শুরু করার আগে আমরা বিসমিল্লাহ বলি। অভিভাবক বলবেন, তুমি পুনরাবৃত্তি করবে।  
  _EN:_ Before starting something good we say Bismillah. Your parent says it, you repeat.  
  visual: `🤲`
- [ ] **Arabic text #1:** **[QURAN TEXT — INSERT FROM VERIFIED SOURCE]** (not yet filled)
  - meaning: অর্থ: একটি যাচাইকৃত অনুবাদ থেকে যোগ করতে হবে।  
  _EN:_ Meaning: to be added from a verified translation.
  - reference: Qur'an 1:1 — Uthmani text from Tanzil.net (not yet fetched)
- [ ] **d2i-q1** (base) — prompt: কোন বর্ণের উপরে দুটি বিন্দু?  
  _EN:_ Which letter has two dots above?
  - options: ✅ ت · ث · ب
  - hint: উপরের বিন্দুগুলো গুনে দেখো: এক, দুই।  
  _EN:_ Count the dots on top: one, two.
- [ ] **d2i-q1s** (simpler) — prompt: একই রকম বর্ণটা খোঁজো।  
  _EN:_ Find the same letter.
  - visual: `ت`
  - options: ✅ ت · ا
  - hint: উপরের বর্ণের মতো দেখতে কোনটা?  
  _EN:_ Which one looks like the letter at the top?
- [ ] **d2i-q1h** (harder) — prompt: কোনটা ছা (Tha)?  
  _EN:_ Which one is Tha?
  - options: ب · ت · ✅ ث
  - hint: ছা-এর উপরে তিনটি বিন্দু।  
  _EN:_ Tha has three dots above.
- [ ] **d2i-q2** (base) — prompt: এই বর্ণে কয়টি বিন্দু?  
  _EN:_ How many dots does this letter have?
  - visual: `ث`
  - options: 1 · 2 · ✅ 3
  - hint: আঙুল দিয়ে প্রতিটি বিন্দু ছুঁয়ে গোনো।  
  _EN:_ Touch each dot and count.
- [ ] **d2i-q2s** (simpler) — prompt: এই বর্ণে কয়টি বিন্দু?  
  _EN:_ How many dots does this letter have?
  - visual: `ب`
  - options: ✅ 1 · 2
  - hint: নিচে তাকাও — একটা বিন্দু।  
  _EN:_ Look below — one dot.
- [ ] **d2i-q2h** (harder) — prompt: কোন বর্ণের বিন্দু নিচে?  
  _EN:_ Which letter has its dot below?
  - options: ت · ✅ ب · ث
  - hint: বা-এর বিন্দু নিচে থাকে।  
  _EN:_ Ba keeps its dot underneath.
- [ ] **d2i-q3** (base) — prompt: অভিভাবকের সাথে বিসমিল্লাহ বলো।  
  _EN:_ Say Bismillah together with your parent.
  - visual: `🤲`
  - parent-confirmed step (shows text #1)
  - hint: অভিভাবক তিলাওয়াত করবেন, শিশু শুনে পুনরাবৃত্তি করবে। অ্যাপ এটি পড়ে শোনায় না।  
  _EN:_ The parent recites, the child listens and repeats. The app does not read this aloud.
- [ ] **d2i-q3s** (simpler) — prompt: অভিভাবক বলবেন, তুমি শুনবে — তারপর একসাথে বলো।  
  _EN:_ Listen to your parent first, then say it together.
  - visual: `🤲`
  - parent-confirmed step (shows text #1)
  - hint: অভিভাবক তিলাওয়াত করবেন, শিশু শুনে পুনরাবৃত্তি করবে। অ্যাপ এটি পড়ে শোনায় না।  
  _EN:_ The parent recites, the child listens and repeats. The app does not read this aloud.
- [ ] Offline activity: বিন্দু গোনার খেলা ও বিসমিল্লাহ  
  _EN:_ Dot game and Bismillah — কাগজে ب ت ث লিখুন (বিন্দু ছাড়া)। শিশু সঠিক সংখ্যক বিন্দু বসাবে। আঁকা শুরুর আগে একসাথে বিসমিল্লাহ বলুন।  
  _EN:_ Write ب ت ث on paper without dots. Your child adds the right number of dots. Say Bismillah together before drawing.
- [ ] Extra practice: অতিরিক্ত অনুশীলন: আঙুলের ছাপ দিয়ে বিন্দু বসানো — ত-তে ২টি, ছা-তে ৩টি।  
  _EN:_ Extra practice: use fingerprints as dots — 2 for Ta, 3 for Tha.
- [ ] Parent instructions: বিসমিল্লাহ আপনি নিজে তিলাওয়াত করে শোনান। অ্যাপে কুরআনের লেখা যাচাইকৃত উৎস (Tanzil) থেকে না আসা পর্যন্ত একটি চিহ্নিত স্থানধারক দেখাবে।  
  _EN:_ Recite Bismillah yourself. The Qur'anic text shows a marked placeholder until it is filled from a verified source (Tanzil).
- [ ] Completion criteria: ت ও ث চেনা; অভিভাবকের সাথে বিসমিল্লাহ বলা।  
  _EN:_ Recognises ت and ث; says Bismillah with the parent.
- [ ] Observation prompt: শিশু কি বিন্দু গুনে বর্ণ আলাদা করতে পেরেছে?  
  _EN:_ Could your child tell the letters apart by counting dots?

### d3-islamic — Dua before eating

**Reviewer:** Alim / Qur'an teacher  
**Source:** Hadith: Sahih al-Bukhari 5376; Sahih Muslim 2022 (wording "Bismillah"). Needs review by an alim.

- [ ] Title: খাওয়ার আগের দোয়া  
  _EN:_ Dua before eating
- [ ] Objective: শিশু খাওয়ার আগে "বিসমিল্লাহ" বলবে এবং ডান হাতে খাবে।  
  _EN:_ Child says "Bismillah" before eating and eats with the right hand.
- [ ] Guide line: খাওয়ার আগে আমরা কী বলি? চলো শিখি!  
  _EN:_ What do we say before we eat? Let's learn!
- [ ] Explanation 1: খাওয়ার আগে আমরা বলি: বিসমিল্লাহ।  
  _EN:_ Before eating we say: Bismillah.  
  visual: `🍚 🤲`
- [ ] Explanation 2: আমরা ডান হাতে খাই।  
  _EN:_ We eat with our right hand.  
  visual: `👉 🍚`
- [ ] **Arabic text #1:** `بِسْمِ اللَّهِ`
  - transliteration: Bismillah
  - meaning: আল্লাহর নামে  
  _EN:_ In the name of Allah
  - reference: Sahih al-Bukhari 5376; Sahih Muslim 2022 — the Prophet ﷺ told a boy (Umar ibn Abi Salamah) to mention Allah's name, eat with his right hand and eat from what is near him. (Reference numbers to be verified.)
- [ ] **d3i-q1** (base) — prompt: খাওয়া শুরুর আগে আমরা কী বলি?  
  _EN:_ What do we say before we start eating?
  - options: ✅ 🤲 — বিসমিল্লাহ / Bismillah · 👋 — টা-টা / Bye-bye · 🤐 — কিছু না / Nothing
  - hint: আল্লাহর নামে শুরু করি…  
  _EN:_ We begin in the name of Allah…
- [ ] **d3i-q1s** (simpler) — prompt: খাওয়ার আগে আমরা কী বলি?  
  _EN:_ What do we say before eating?
  - options: ✅ 🤲 — বিসমিল্লাহ / Bismillah · 👋 — টা-টা / Bye-bye
  - hint: দুই হাত তোলা ছবিটা দেখো।  
  _EN:_ Look at the picture with raised hands.
- [ ] **d3i-q2** (base) — prompt: আমরা কোন হাতে খাই?  
  _EN:_ Which hand do we eat with?
  - options: ✅ 👉 — ডান হাত / Right hand · 👈 — বাঁ হাত / Left hand
  - hint: অভিভাবক তোমার ডান হাত ধরে দেখাবেন।  
  _EN:_ Your parent will hold up your right hand.
- [ ] **d3i-q2s** (simpler) — prompt: অভিভাবক যে হাত তুলেছেন, সেটা দেখাও।  
  _EN:_ Tap the hand your parent is holding up (right).
  - options: ✅ 👉 — ডান হাত / Right hand · 👈 — বাঁ হাত / Left hand
  - hint: ডান দিকে আঙুল দেখানো ছবিটা।  
  _EN:_ The picture pointing right.
- [ ] **d3i-q3** (base) — prompt: অভিভাবকের সাথে বলো: বিসমিল্লাহ।  
  _EN:_ Say with your parent: Bismillah.
  - visual: `🤲`
  - parent-confirmed step (shows text #1)
  - hint: অভিভাবক তিলাওয়াত করবেন, শিশু শুনে পুনরাবৃত্তি করবে। অ্যাপ এটি পড়ে শোনায় না।  
  _EN:_ The parent recites, the child listens and repeats. The app does not read this aloud.
- [ ] **d3i-q3s** (simpler) — prompt: অভিভাবকের কথা শুনে আস্তে আস্তে বলো।  
  _EN:_ Listen to your parent and say it slowly.
  - visual: `🤲`
  - parent-confirmed step (shows text #1)
  - hint: অভিভাবক তিলাওয়াত করবেন, শিশু শুনে পুনরাবৃত্তি করবে। অ্যাপ এটি পড়ে শোনায় না।  
  _EN:_ The parent recites, the child listens and repeats. The app does not read this aloud.
- [ ] Offline activity: খাবারের সময় অনুশীলন  
  _EN:_ Practise at mealtime — পরের খাবারে খাওয়ার আগে একসাথে বিসমিল্লাহ বলুন এবং শিশু ডান হাতে খাবে। প্লেটের কাছের দিক থেকে খেতে মনে করিয়ে দিন।  
  _EN:_ At the next meal, say Bismillah together before eating and your child eats with the right hand. Remind them to eat from the side of the plate nearest to them.
- [ ] Extra practice: অতিরিক্ত অনুশীলন: খেলনা রান্নাবাটি দিয়ে "খাওয়ার খেলা" — খেলার আগে বিসমিল্লাহ বলা।  
  _EN:_ Extra practice: pretend-play a meal with toy dishes and say Bismillah before "eating".
- [ ] Parent instructions: দোয়াটি আপনি নিজে উচ্চারণ করে শেখান। রেফারেন্স নম্বরগুলো একজন আলিম যাচাই করবেন।  
  _EN:_ Say the dua yourself to teach it. The hadith reference numbers are pending review by an alim.
- [ ] Completion criteria: খাওয়ার আগে বিসমিল্লাহ বলা ও ডান হাতে খাওয়া।  
  _EN:_ Says Bismillah before a meal and eats with the right hand.
- [ ] Observation prompt: শিশু কি নিজে থেকে বিসমিল্লাহ বলেছে?  
  _EN:_ Did your child say Bismillah without being reminded?

### d4-islamic — Adab: greeting with Salam

**Reviewer:** Alim / Qur'an teacher  
**Source:** Hadith: Sahih al-Bukhari 6227; Sahih Muslim 54. Needs review by an alim.

- [ ] Title: আদব: সালাম দেওয়া  
  _EN:_ Adab: greeting with Salam
- [ ] Objective: শিশু দেখা হলে সালাম দেবে এবং সালামের উত্তর দেবে।  
  _EN:_ Child greets with Salam and replies to Salam.
- [ ] Guide line: কারও সাথে দেখা হলে আমরা কী বলি?  
  _EN:_ What do we say when we meet someone?
- [ ] Explanation 1: দেখা হলে আমরা বলি: আসসালামু আলাইকুম।  
  _EN:_ When we meet someone we say: As-salamu alaykum.  
  visual: `🙋`
- [ ] Explanation 2: কেউ সালাম দিলে উত্তর দিই: ওয়া আলাইকুমুস সালাম।  
  _EN:_ When someone greets us, we reply: Wa alaykumus-salam.  
  visual: `😊`
- [ ] **Arabic text #1:** `السَّلَامُ عَلَيْكُمْ`
  - transliteration: As-salamu alaykum
  - meaning: আপনার উপর শান্তি বর্ষিত হোক  
  _EN:_ Peace be upon you
  - reference: Greeting taught in Sahih al-Bukhari 6227; spreading Salam: Sahih Muslim 54. (Reference numbers to be verified.)
- [ ] **Arabic text #2:** `وَعَلَيْكُمُ السَّلَامُ`
  - transliteration: Wa alaykumus-salam
  - meaning: আপনার উপরও শান্তি বর্ষিত হোক  
  _EN:_ And upon you be peace
  - reference: Standard reply to the Salam. (To be verified.)
- [ ] **d4i-q1** (base) — prompt: কারও সাথে দেখা হলে আমরা কী বলি?  
  _EN:_ What do we say when we meet someone?
  - options: ✅ 🙋 — আসসালামু আলাইকুম / As-salamu alaykum · 🙈 — কিছু না বলা / Say nothing · 👋 — টা-টা / Bye-bye
  - hint: শান্তির শুভেচ্ছা…  
  _EN:_ The greeting of peace…
- [ ] **d4i-q1s** (simpler) — prompt: দেখা হলে আমরা কী বলি?  
  _EN:_ What do we say when we meet?
  - options: ✅ 🙋 — আসসালামু আলাইকুম / As-salamu alaykum · 🙈 — কিছু না বলা / Say nothing
  - hint: হাত তুলে হাসিমুখ ছবিটা।  
  _EN:_ The smiling picture with a raised hand.
- [ ] **d4i-q2** (base) — prompt: কেউ তোমাকে সালাম দিলে তুমি কী বলবে?  
  _EN:_ Someone says As-salamu alaykum to you. What do you reply?
  - options: ✅ 😊 — ওয়া আলাইকুমুস সালাম / Wa alaykumus-salam · 🤲 — বিসমিল্লাহ / Bismillah
  - hint: উত্তরটা শুরু হয় "ওয়া" দিয়ে।  
  _EN:_ The reply begins with "Wa".
- [ ] **d4i-q2s** (simpler) — prompt: অভিভাবক সালাম দেবেন, তুমি তার সাথে উত্তর বলো।  
  _EN:_ Your parent greets you; say the reply together.
  - visual: `😊`
  - parent-confirmed step (shows text #2)
  - hint: ওয়া আলাইকুমুস সালাম — অভিভাবকের সাথে।  
  _EN:_ Wa alaykumus-salam — together with your parent.
- [ ] **d4i-q3** (base) — prompt: অভিনয় করো: তুমি সালাম দাও, অভিভাবক উত্তর দেবেন। তারপর উল্টো।  
  _EN:_ Role-play: you give Salam, your parent replies. Then swap.
  - visual: `🙋 😊`
  - parent-confirmed step (shows text #1, #2)
  - hint: হাসিমুখে বলো।  
  _EN:_ Say it with a smile.
- [ ] **d4i-q3s** (simpler) — prompt: অভিভাবককে একবার সালাম দাও।  
  _EN:_ Give Salam to your parent once.
  - visual: `🙋`
  - parent-confirmed step (shows text #1)
  - hint: আসসালামু আলাইকুম।  
  _EN:_ As-salamu alaykum.
- [ ] Offline activity: বাড়ির সবাইকে সালাম  
  _EN:_ Salam to everyone at home — আজ শিশু বাড়ির প্রত্যেককে প্রথম দেখায় সালাম দেবে। কেউ সালাম দিলে উত্তর দেবে।  
  _EN:_ Today your child greets everyone at home with Salam the first time they see them, and replies when greeted.
- [ ] Extra practice: অতিরিক্ত অনুশীলন: পুতুল বা খেলনা দিয়ে সালাম দেওয়া-নেওয়ার খেলা।  
  _EN:_ Extra practice: a Salam game with dolls or toys greeting each other.
- [ ] Parent instructions: নিজে আগে সালাম দিয়ে উদাহরণ তৈরি করুন। রেফারেন্স নম্বর আলিম যাচাই করবেন।  
  _EN:_ Model it by giving Salam first yourself. Reference numbers are pending review by an alim.
- [ ] Completion criteria: সালাম দেওয়া ও উত্তর দেওয়া।  
  _EN:_ Gives Salam and replies to Salam.
- [ ] Observation prompt: শিশু কি নিজে থেকে কাউকে সালাম দিয়েছে?  
  _EN:_ Did your child give Salam to someone on their own?

### d5-islamic — Surah Al-Ikhlas (listen and repeat with parent)

**Reviewer:** Alim / Qur'an teacher  
**Source:** Qur'an 112:1–4, Uthmani text from Tanzil.net (placeholder until fetched). Needs review by an alim/Qur'an teacher.

- [ ] Title: সূরা আল-ইখলাস (শুনি ও পুনরাবৃত্তি করি)  
  _EN:_ Surah Al-Ikhlas (listen and repeat with parent)
- [ ] Objective: শিশু অভিভাবকের তিলাওয়াত শুনে সূরা আল-ইখলাসের প্রতিটি আয়াত পুনরাবৃত্তি করবে।  
  _EN:_ Child listens to the parent recite Surah Al-Ikhlas and repeats each ayah.
- [ ] Guide line: আজ আমরা একটি ছোট সূরা শুনব — অভিভাবকের কাছ থেকে।  
  _EN:_ Today we listen to a short surah — from your parent.
- [ ] Explanation 1: সূরা আল-ইখলাস একটি ছোট সূরা। এতে ৪টি আয়াত।  
  _EN:_ Surah Al-Ikhlas is a short surah with 4 ayat.  
  visual: `📖`
- [ ] Explanation 2: অভিভাবক এক আয়াত করে তিলাওয়াত করবেন, তুমি শুনে পুনরাবৃত্তি করবে।  
  _EN:_ Your parent recites one ayah at a time; you listen and repeat.  
  visual: `👂 🗣️`
- [ ] **Arabic text #1:** **[QURAN TEXT — INSERT FROM VERIFIED SOURCE]** (not yet filled)
  - meaning: অর্থ: একটি যাচাইকৃত অনুবাদ থেকে যোগ করতে হবে।  
  _EN:_ Meaning: to be added from a verified translation.
  - reference: Qur'an 112:1 — Uthmani text from Tanzil.net (not yet fetched)
- [ ] **Arabic text #2:** **[QURAN TEXT — INSERT FROM VERIFIED SOURCE]** (not yet filled)
  - meaning: অর্থ: একটি যাচাইকৃত অনুবাদ থেকে যোগ করতে হবে।  
  _EN:_ Meaning: to be added from a verified translation.
  - reference: Qur'an 112:2 — Uthmani text from Tanzil.net (not yet fetched)
- [ ] **Arabic text #3:** **[QURAN TEXT — INSERT FROM VERIFIED SOURCE]** (not yet filled)
  - meaning: অর্থ: একটি যাচাইকৃত অনুবাদ থেকে যোগ করতে হবে।  
  _EN:_ Meaning: to be added from a verified translation.
  - reference: Qur'an 112:3 — Uthmani text from Tanzil.net (not yet fetched)
- [ ] **Arabic text #4:** **[QURAN TEXT — INSERT FROM VERIFIED SOURCE]** (not yet filled)
  - meaning: অর্থ: একটি যাচাইকৃত অনুবাদ থেকে যোগ করতে হবে।  
  _EN:_ Meaning: to be added from a verified translation.
  - reference: Qur'an 112:4 — Uthmani text from Tanzil.net (not yet fetched)
- [ ] **d5i-q1** (base) — prompt: আয়াত ১: অভিভাবকের তিলাওয়াত শোনো, তারপর পুনরাবৃত্তি করো।  
  _EN:_ Ayah 1: listen to your parent, then repeat.
  - visual: `👂`
  - parent-confirmed step (shows text #1)
  - hint: অভিভাবক তিলাওয়াত করবেন, শিশু শুনে পুনরাবৃত্তি করবে। অ্যাপ এটি পড়ে শোনায় না।  
  _EN:_ The parent recites, the child listens and repeats. The app does not read this aloud.
- [ ] **d5i-q1s** (simpler) — prompt: আয়াত ১: আবার শোনো, শুধু প্রথম অংশটা একসাথে বলো।  
  _EN:_ Ayah 1: listen again and say just the first part together.
  - visual: `👂`
  - parent-confirmed step (shows text #1)
  - hint: অভিভাবক তিলাওয়াত করবেন, শিশু শুনে পুনরাবৃত্তি করবে। অ্যাপ এটি পড়ে শোনায় না।  
  _EN:_ The parent recites, the child listens and repeats. The app does not read this aloud.
- [ ] **d5i-q2** (base) — prompt: আয়াত ২: অভিভাবকের তিলাওয়াত শোনো, তারপর পুনরাবৃত্তি করো।  
  _EN:_ Ayah 2: listen to your parent, then repeat.
  - visual: `👂`
  - parent-confirmed step (shows text #2)
  - hint: অভিভাবক তিলাওয়াত করবেন, শিশু শুনে পুনরাবৃত্তি করবে। অ্যাপ এটি পড়ে শোনায় না।  
  _EN:_ The parent recites, the child listens and repeats. The app does not read this aloud.
- [ ] **d5i-q2s** (simpler) — prompt: আয়াত ২: আবার শোনো, শুধু প্রথম অংশটা একসাথে বলো।  
  _EN:_ Ayah 2: listen again and say just the first part together.
  - visual: `👂`
  - parent-confirmed step (shows text #2)
  - hint: অভিভাবক তিলাওয়াত করবেন, শিশু শুনে পুনরাবৃত্তি করবে। অ্যাপ এটি পড়ে শোনায় না।  
  _EN:_ The parent recites, the child listens and repeats. The app does not read this aloud.
- [ ] **d5i-q3** (base) — prompt: আয়াত ৩: অভিভাবকের তিলাওয়াত শোনো, তারপর পুনরাবৃত্তি করো।  
  _EN:_ Ayah 3: listen to your parent, then repeat.
  - visual: `👂`
  - parent-confirmed step (shows text #3)
  - hint: অভিভাবক তিলাওয়াত করবেন, শিশু শুনে পুনরাবৃত্তি করবে। অ্যাপ এটি পড়ে শোনায় না।  
  _EN:_ The parent recites, the child listens and repeats. The app does not read this aloud.
- [ ] **d5i-q3s** (simpler) — prompt: আয়াত ৩: আবার শোনো, শুধু প্রথম অংশটা একসাথে বলো।  
  _EN:_ Ayah 3: listen again and say just the first part together.
  - visual: `👂`
  - parent-confirmed step (shows text #3)
  - hint: অভিভাবক তিলাওয়াত করবেন, শিশু শুনে পুনরাবৃত্তি করবে। অ্যাপ এটি পড়ে শোনায় না।  
  _EN:_ The parent recites, the child listens and repeats. The app does not read this aloud.
- [ ] **d5i-q4** (base) — prompt: আয়াত ৪: অভিভাবকের তিলাওয়াত শোনো, তারপর পুনরাবৃত্তি করো।  
  _EN:_ Ayah 4: listen to your parent, then repeat.
  - visual: `👂`
  - parent-confirmed step (shows text #4)
  - hint: অভিভাবক তিলাওয়াত করবেন, শিশু শুনে পুনরাবৃত্তি করবে। অ্যাপ এটি পড়ে শোনায় না।  
  _EN:_ The parent recites, the child listens and repeats. The app does not read this aloud.
- [ ] **d5i-q4s** (simpler) — prompt: আয়াত ৪: আবার শোনো, শুধু প্রথম অংশটা একসাথে বলো।  
  _EN:_ Ayah 4: listen again and say just the first part together.
  - visual: `👂`
  - parent-confirmed step (shows text #4)
  - hint: অভিভাবক তিলাওয়াত করবেন, শিশু শুনে পুনরাবৃত্তি করবে। অ্যাপ এটি পড়ে শোনায় না।  
  _EN:_ The parent recites, the child listens and repeats. The app does not read this aloud.
- [ ] Offline activity: দিনে আরও দুইবার শোনা  
  _EN:_ Listen twice more today — আজ আরও দুইবার (যেমন ঘুমানোর আগে) অভিভাবক সূরাটি তিলাওয়াত করবেন, শিশু সাথে সাথে পুনরাবৃত্তি করবে।  
  _EN:_ Recite the surah twice more today (for example before sleep); your child repeats after you.
- [ ] Extra practice: অতিরিক্ত অনুশীলন: শুধু প্রথম আয়াতটি ৩ বার একসাথে।  
  _EN:_ Extra practice: just the first ayah, 3 times together.
- [ ] Parent instructions: অ্যাপ কখনো কুরআন পড়ে শোনায় না। আপনার নিজের তিলাওয়াত বা যাচাইকৃত রেকর্ডিং ব্যবহার করুন।  
  _EN:_ The app never reads the Qur'an aloud. Use your own recitation or a verified recording.
- [ ] Completion criteria: ৪টি আয়াত শুনে পুনরাবৃত্তি।  
  _EN:_ Listens to and repeats all 4 ayat.
- [ ] Observation prompt: কোন আয়াতটি শিশুর জন্য সবচেয়ে কঠিন ছিল?  
  _EN:_ Which ayah was hardest for your child?

## Bengali lessons (reviewer: Bengali teacher)

### d1-bengali — Bengali vowels অ, আ

**Reviewer:** Bengali teacher  
**Source:** Original content written for this prototype. Informally aligned with NCF-FS 2022 goal areas; not an official or affiliated curriculum. Bengali vowel order and example words (অজগর, আম) follow common primer convention — to be checked by a Bengali teacher.

- [ ] Title: স্বরবর্ণ অ, আ  
  _EN:_ Bengali vowels অ, আ
- [ ] Objective: শিশু অ ও আ চিনবে এবং অ-তে অজগর, আ-তে আম বলবে।  
  _EN:_ Child recognises অ and আ and says অ for অজগর (python), আ for আম (mango).
- [ ] Guide line: চলো বাংলার প্রথম দুটি বর্ণ শিখি!  
  _EN:_ Let's learn the first two Bengali letters!
- [ ] Explanation 1: অ — অ-তে অজগর।  
  _EN:_ অ (ô) — অজগর, python.  
  visual: `অ 🐍`
- [ ] Explanation 2: আ — আ-তে আম।  
  _EN:_ আ (a) — আম, mango.  
  visual: `আ 🥭`
- [ ] Explanation 3: অ আর আ দেখতে কাছাকাছি। আ-তে একটা দাঁড়ি বেশি আছে।  
  _EN:_ অ and আ look alike. আ has one extra standing line.  
  visual: `অ  আ`
- [ ] **d1b-q1** (base) — prompt: কোনটা অ?  
  _EN:_ Which one is অ?
  - options: ✅ অ · আ · ক
  - hint: অ-তে কোনো বাড়তি দাঁড়ি নেই।  
  _EN:_ অ has no extra standing line.
- [ ] **d1b-q1s** (simpler) — prompt: উপরের বর্ণের মতো কোনটা?  
  _EN:_ Which one matches the letter at the top?
  - visual: `অ`
  - options: ✅ অ · ক
  - hint: একই রকম দেখতে বর্ণটা খোঁজো।  
  _EN:_ Look for the one that looks the same.
- [ ] **d1b-q1h** (harder) — prompt: আম কোন বর্ণ দিয়ে শুরু?  
  _EN:_ Which letter does আম (mango) start with?
  - visual: `🥭`
  - options: অ · ✅ আ · ই
  - hint: আ-তে আম!  
  _EN:_ আ for আম!
- [ ] **d1b-q2** (base) — prompt: আ-তে কী?  
  _EN:_ What starts with আ?
  - options: ✅ 🥭 — আম · 🐍 — অজগর · 🐱 — বিড়াল
  - hint: আ-আ-আম! মিষ্টি ফল।  
  _EN:_ আ-আ-আম! A sweet fruit.
- [ ] **d1b-q2s** (simpler) — prompt: কোনটা আম?  
  _EN:_ Which one is আম (mango)?
  - options: ✅ 🥭 — আম · 🚗 — গাড়ি
  - hint: আম একটা ফল।  
  _EN:_ A mango is a fruit.
- [ ] **d1b-q2h** (harder) — prompt: অ-তে কী?  
  _EN:_ What starts with অ?
  - options: 🥭 — আম · ✅ 🐍 — অজগর · 🦅 — ঈগল
  - hint: অ-তে অজগর — লম্বা সাপ।  
  _EN:_ অ for অজগর — a long snake.
- [ ] **d1b-q3** (base) — prompt: অভিভাবকের সাথে আঙুল দিয়ে বাতাসে অ আর আ লেখো।  
  _EN:_ With your grown-up, write অ and আ in the air with your finger.
  - visual: `অ  আ`
  - parent-confirmed step
  - hint: আগে অভিভাবক দেখাবেন, তারপর তুমি।  
  _EN:_ Grown-up shows first, then you.
- [ ] **d1b-q3s** (simpler) — prompt: অভিভাবকের সাথে বলো: অ-তে অজগর।  
  _EN:_ Say with your grown-up: অ-তে অজগর.
  - visual: `অ 🐍`
  - parent-confirmed step
  - hint: ধীরে ধীরে বলো।  
  _EN:_ Say it slowly.
- [ ] Offline activity: চালের থালায় অ, আ  
  _EN:_ অ and আ in a rice plate — চালের থালায় আপনি অ লিখুন, শিশু পাশে লিখবে। তারপর আ। প্রতিবার বলুন "অ-তে অজগর", "আ-তে আম"।  
  _EN:_ Write অ in the rice plate; your child writes it next to yours. Then আ. Say "অ-তে অজগর", "আ-তে আম" each time.
- [ ] Extra practice: অতিরিক্ত অনুশীলন: কাগজে বড় করে অ লিখে দিন, শিশু রঙ পেন্সিল দিয়ে তার উপর টানবে।  
  _EN:_ Extra practice: write a large অ on paper; your child traces over it with a crayon.
- [ ] Parent instructions: অ আর আ-এর পার্থক্য (বাড়তি দাঁড়ি) আঙুল দিয়ে দেখিয়ে দিন।  
  _EN:_ Point out the difference between অ and আ (the extra standing line) with your finger.
- [ ] Completion criteria: অ ও আ চেনা; চালে দুটি বর্ণ লেখা।  
  _EN:_ Recognises অ and আ; writes both in rice.
- [ ] Observation prompt: শিশু কি অ আর আ গুলিয়ে ফেলছে?  
  _EN:_ Is your child mixing up অ and আ?

### d2-bengali — Bengali vowels ই, ঈ

**Reviewer:** Bengali teacher  
**Source:** Original content written for this prototype. Informally aligned with NCF-FS 2022 goal areas; not an official or affiliated curriculum. Example words (ইঁদুর, ঈগল) follow common primer convention — to be checked by a Bengali teacher.

- [ ] Title: স্বরবর্ণ ই, ঈ  
  _EN:_ Bengali vowels ই, ঈ
- [ ] Objective: শিশু ই ও ঈ চিনবে: ই-তে ইঁদুর, ঈ-তে ঈগল।  
  _EN:_ Child recognises ই and ঈ: ই for ইঁদুর (mouse), ঈ for ঈগল (eagle).
- [ ] Guide line: আজ আরও দুটি স্বরবর্ণ — ই আর ঈ!  
  _EN:_ Two more vowels today — ই and ঈ!
- [ ] Explanation 1: ই — ই-তে ইঁদুর।  
  _EN:_ ই (i) — ইঁদুর, mouse.  
  visual: `ই 🐭`
- [ ] Explanation 2: ঈ — ঈ-তে ঈগল।  
  _EN:_ ঈ (long i) — ঈগল, eagle.  
  visual: `ঈ 🦅`
- [ ] Explanation 3: ঈ-এর মাথায় একটা বাড়তি প্যাঁচ আছে।  
  _EN:_ ঈ has an extra curl at the top.  
  visual: `ই  ঈ`
- [ ] **d2b-q1** (base) — prompt: কোনটা ই?  
  _EN:_ Which one is ই?
  - options: ✅ ই · ঈ · আ
  - hint: ই-এর মাথায় বাড়তি প্যাঁচ নেই।  
  _EN:_ ই has no extra curl on top.
- [ ] **d2b-q1s** (simpler) — prompt: উপরের বর্ণের মতো কোনটা?  
  _EN:_ Which one matches the letter at the top?
  - visual: `ই`
  - options: ✅ ই · ক
  - hint: একই রকম দেখতে বর্ণটা খোঁজো।  
  _EN:_ Look for the same shape.
- [ ] **d2b-q1h** (harder) — prompt: ঈগল কোন বর্ণ দিয়ে শুরু?  
  _EN:_ Which letter does ঈগল (eagle) start with?
  - visual: `🦅`
  - options: ই · ✅ ঈ · উ
  - hint: ঈ-তে ঈগল!  
  _EN:_ ঈ for ঈগল!
- [ ] **d2b-q2** (base) — prompt: ই-তে কী?  
  _EN:_ What starts with ই?
  - options: ✅ 🐭 — ইঁদুর · 🦅 — ঈগল · 🥭 — আম
  - hint: ই-ই-ইঁদুর! ছোট্ট প্রাণী।  
  _EN:_ ই-ই-ইঁদুর! A tiny animal.
- [ ] **d2b-q2s** (simpler) — prompt: কোনটা ইঁদুর?  
  _EN:_ Which one is ইঁদুর (mouse)?
  - options: ✅ 🐭 — ইঁদুর · 🚗 — গাড়ি
  - hint: ইঁদুরের লম্বা লেজ।  
  _EN:_ A mouse has a long tail.
- [ ] **d2b-q2h** (harder) — prompt: অ-তে কী? (কালকের পড়া)  
  _EN:_ What starts with অ? (yesterday)
  - options: ✅ 🐍 — অজগর · 🐭 — ইঁদুর · 🦅 — ঈগল
  - hint: অ-তে অজগর।  
  _EN:_ অ for অজগর.
- [ ] **d2b-q3** (base) — prompt: অভিভাবকের সাথে বলো: ই-তে ইঁদুর, ঈ-তে ঈগল।  
  _EN:_ Say with your grown-up: ই-তে ইঁদুর, ঈ-তে ঈগল.
  - visual: `ই 🐭  ঈ 🦅`
  - parent-confirmed step
  - hint: আগে অভিভাবক বলবেন।  
  _EN:_ Grown-up says it first.
- [ ] **d2b-q3s** (simpler) — prompt: অভিভাবকের সাথে বলো: ই-তে ইঁদুর।  
  _EN:_ Say with your grown-up: ই-তে ইঁদুর.
  - visual: `ই 🐭`
  - parent-confirmed step
  - hint: ধীরে ধীরে বলো।  
  _EN:_ Say it slowly.
- [ ] Offline activity: চালের থালায় ই, ঈ  
  _EN:_ ই and ঈ in a rice plate — চালের থালায় আপনি ই লিখুন, শিশু পাশে লিখবে; তারপর ঈ। শেষে অ, আ, ই, ঈ চারটিই একবার করে।  
  _EN:_ Write ই in the rice; your child copies it. Then ঈ. Finish by writing all four: অ, আ, ই, ঈ.
- [ ] Extra practice: অতিরিক্ত অনুশীলন: কাগজে বড় করে ই আর ঈ লিখে দিন, শিশু রঙ দিয়ে ঈ-এর বাড়তি প্যাঁচটা আলাদা রঙে আঁকবে।  
  _EN:_ Extra practice: write big ই and ঈ; your child colours the extra curl of ঈ in a different colour.
- [ ] Parent instructions: ই আর ঈ-এর উচ্চারণ কাছাকাছি; এই বয়সে আকারের পার্থক্য চেনাই যথেষ্ট।  
  _EN:_ ই and ঈ sound similar; at this age, telling the shapes apart is enough.
- [ ] Completion criteria: ই ও ঈ চেনা; চালে লেখা।  
  _EN:_ Recognises ই and ঈ; writes both in rice.
- [ ] Observation prompt: শিশু কি কালকের অ, আ মনে রেখেছে?  
  _EN:_ Did your child remember অ and আ from yesterday?

### d3-bengali — Bengali vowels উ, ঊ

**Reviewer:** Bengali teacher  
**Source:** Original content written for this prototype. Informally aligned with NCF-FS 2022 goal areas; not an official or affiliated curriculum. Example words (উট, ঊষা) follow common primer convention — to be checked by a Bengali teacher.

- [ ] Title: স্বরবর্ণ উ, ঊ  
  _EN:_ Bengali vowels উ, ঊ
- [ ] Objective: শিশু উ ও ঊ চিনবে: উ-তে উট, ঊ-তে ঊষা।  
  _EN:_ Child recognises উ and ঊ: উ for উট (camel), ঊ for ঊষা (dawn).
- [ ] Guide line: আজ উ আর ঊ — একটা উটও আসবে!  
  _EN:_ Today উ and ঊ — and a camel is coming!
- [ ] Explanation 1: উ — উ-তে উট।  
  _EN:_ উ (u) — উট, camel.  
  visual: `উ 🐪`
- [ ] Explanation 2: ঊ — ঊ-তে ঊষা (ভোরবেলা)।  
  _EN:_ ঊ (long u) — ঊষা, dawn.  
  visual: `ঊ 🌅`
- [ ] Explanation 3: ঊ-এর নিচে একটা বাড়তি লেজ আছে।  
  _EN:_ ঊ has an extra tail at the bottom.  
  visual: `উ  ঊ`
- [ ] **d3b-q1** (base) — prompt: কোনটা উ?  
  _EN:_ Which one is উ?
  - options: ✅ উ · ঊ · ই
  - hint: উ-এর নিচে বাড়তি লেজ নেই।  
  _EN:_ উ has no extra tail.
- [ ] **d3b-q1s** (simpler) — prompt: উপরের বর্ণের মতো কোনটা?  
  _EN:_ Which one matches the letter at the top?
  - visual: `উ`
  - options: ✅ উ · ক
  - hint: একই রকম দেখতে বর্ণটা খোঁজো।  
  _EN:_ Look for the same shape.
- [ ] **d3b-q1h** (harder) — prompt: উট কোন বর্ণ দিয়ে শুরু?  
  _EN:_ Which letter does উট (camel) start with?
  - visual: `🐪`
  - options: ঊ · ✅ উ · আ
  - hint: উ-তে উট!  
  _EN:_ উ for উট!
- [ ] **d3b-q2** (base) — prompt: উ-তে কী?  
  _EN:_ What starts with উ?
  - options: ✅ 🐪 — উট · 🦅 — ঈগল · 🥭 — আম
  - hint: মরুভূমির প্রাণী, পিঠে কুঁজ।  
  _EN:_ A desert animal with a hump.
- [ ] **d3b-q2s** (simpler) — prompt: কোনটা উট?  
  _EN:_ Which one is উট (camel)?
  - options: ✅ 🐪 — উট · 🐟 — মাছ
  - hint: যার পিঠে কুঁজ।  
  _EN:_ The one with a hump.
- [ ] **d3b-q2h** (harder) — prompt: ঈ-তে কী? (কালকের পড়া)  
  _EN:_ What starts with ঈ? (yesterday)
  - options: 🐪 — উট · ✅ 🦅 — ঈগল · 🐭 — ইঁদুর
  - hint: ঈ-তে ঈগল।  
  _EN:_ ঈ for ঈগল.
- [ ] **d3b-q3** (base) — prompt: অভিভাবকের সাথে বলো: অ, আ, ই, ঈ, উ, ঊ।  
  _EN:_ Say with your grown-up: অ, আ, ই, ঈ, উ, ঊ.
  - visual: `অ আ ই ঈ উ ঊ`
  - parent-confirmed step
  - hint: আঙুলে গুনে গুনে বলো — ৬টা!  
  _EN:_ Count them on your fingers — 6!
- [ ] **d3b-q3s** (simpler) — prompt: অভিভাবকের সাথে বলো: উ-তে উট।  
  _EN:_ Say with your grown-up: উ-তে উট.
  - visual: `উ 🐪`
  - parent-confirmed step
  - hint: ধীরে ধীরে বলো।  
  _EN:_ Say it slowly.
- [ ] Offline activity: চালের থালায় উ, ঊ  
  _EN:_ উ and ঊ in a rice plate — চালের থালায় উ আর ঊ লিখুন; শিশু পাশে লিখবে। তারপর আপনি একটা বর্ণ বলবেন, শিশু খুঁজে আঙুল রাখবে।  
  _EN:_ Write উ and ঊ in the rice; your child copies them. Then you say a letter and your child points to it.
- [ ] Extra practice: অতিরিক্ত অনুশীলন: ৬টি কার্ডে অ থেকে ঊ লিখে "জোড়া মেলানো" খেলুন।  
  _EN:_ Extra practice: write অ to ঊ on 6 cards and play a matching game.
- [ ] Parent instructions: ঊষা শব্দটি শিশুর কাছে নতুন হতে পারে — "ভোরবেলা, সূর্য ওঠার সময়" বলে বুঝিয়ে দিন।  
  _EN:_ ঊষা may be a new word — explain it as "early morning, when the sun rises".
- [ ] Completion criteria: উ ও ঊ চেনা; ৬টি স্বরবর্ণ পরপর বলা।  
  _EN:_ Recognises উ and ঊ; says the 6 vowels in order.
- [ ] Observation prompt: ছয়টি স্বরবর্ণের কোনটা শিশুর সবচেয়ে কঠিন লাগছে?  
  _EN:_ Which of the six vowels is hardest for your child?

### d4-bengali — Simple Bengali words: আম, ইট, উট

**Reviewer:** Bengali teacher  
**Source:** Original content written for this prototype. Informally aligned with NCF-FS 2022 goal areas; not an official or affiliated curriculum. Word choice (আম, ইট, উট) reuses the vowels taught on Days 1–3 — to be checked by a Bengali teacher.

- [ ] Title: সহজ বাংলা শব্দ: আম, ইট, উট  
  _EN:_ Simple Bengali words: আম, ইট, উট
- [ ] Objective: শিশু শেখা স্বরবর্ণ দিয়ে শুরু তিনটি শব্দ ছবির সাথে মেলাবে।  
  _EN:_ Child matches three words that begin with learned vowels to pictures.
- [ ] Guide line: যে বর্ণগুলো শিখেছি, সেগুলো দিয়ে শব্দ পড়ি!  
  _EN:_ Let's read words made from the letters we learned!
- [ ] Explanation 1: আ + ম = আম  
  _EN:_ আ + ম = আম (mango)  
  visual: `আম 🥭`
- [ ] Explanation 2: ই + ট = ইট  
  _EN:_ ই + ট = ইট (brick)  
  visual: `ইট 🧱`
- [ ] Explanation 3: উ + ট = উট  
  _EN:_ উ + ট = উট (camel)  
  visual: `উট 🐪`
- [ ] **d4b-q1** (base) — prompt: কোন ছবিটা "আম"?  
  _EN:_ Which picture is "আম"?
  - visual: `আম`
  - options: ✅ 🥭 · 🐪 · 🧱
  - hint: আ দিয়ে শুরু — আ-ম।  
  _EN:_ Starts with আ — আ-ম.
- [ ] **d4b-q1s** (simpler) — prompt: কোন ছবিটা "আম"?  
  _EN:_ Which picture is "আম"?
  - visual: `আম`
  - options: ✅ 🥭 · 🐪
  - hint: মিষ্টি ফল।  
  _EN:_ A sweet fruit.
- [ ] **d4b-q1h** (harder) — prompt: কোন শব্দটা "ইট"?  
  _EN:_ Which word is "ইট" (brick)?
  - visual: `🧱`
  - options: আম · ✅ ইট · উট
  - hint: ই দিয়ে শুরু।  
  _EN:_ Starts with ই.
- [ ] **d4b-q2** (base) — prompt: ছবিটা কী? শব্দটা খোঁজো।  
  _EN:_ What is this? Find the word.
  - visual: `🐪`
  - options: ✅ উট · আম · ইট
  - hint: উ দিয়ে শুরু।  
  _EN:_ Starts with উ.
- [ ] **d4b-q2s** (simpler) — prompt: ছবিটা কী? শব্দটা খোঁজো।  
  _EN:_ What is this? Find the word.
  - visual: `🐪`
  - options: ✅ উট · আম
  - hint: উ-তে উট।  
  _EN:_ উ for উট.
- [ ] **d4b-q2h** (harder) — prompt: "উট" আর "ইট" — কোনটা প্রাণী?  
  _EN:_ "উট" or "ইট" — which one is an animal?
  - options: ✅ উট · ইট
  - hint: ইট দিয়ে বাড়ি বানায়।  
  _EN:_ ইট is used to build houses.
- [ ] **d4b-q3** (base) — prompt: অভিভাবকের সাথে ধ্বনি জুড়ে বলো: আ-ম আম, উ-ট উট।  
  _EN:_ Blend the sounds with your grown-up: আ-ম আম, উ-ট উট.
  - visual: `আ ম`
  - parent-confirmed step
  - hint: প্রতিটি ধ্বনিতে একবার হাততালি।  
  _EN:_ One clap per sound.
- [ ] **d4b-q3s** (simpler) — prompt: অভিভাবকের সাথে বলো: আ-ম, আম।  
  _EN:_ Say with your grown-up: আ-ম, আম.
  - visual: `🥭`
  - parent-confirmed step
  - hint: ধীরে ধীরে।  
  _EN:_ Slowly.
- [ ] Offline activity: শব্দ কার্ড ও আসল জিনিস  
  _EN:_ Word cards and real things — আম, ইট, উট কার্ড বানান। শিশু "আম" কার্ড রান্নাঘরের ফলের কাছে রাখবে; বাকিগুলো ছবির পাশে।  
  _EN:_ Make cards for আম, ইট, উট. Your child places the "আম" card next to fruit in the kitchen and the others next to drawings.
- [ ] Extra practice: অতিরিক্ত অনুশীলন: শুধু প্রথম বর্ণ — আপনি "আ" বললে শিশু আম কার্ড তুলবে।  
  _EN:_ Extra practice: first letters only — you say "আ" and your child picks the আম card.
- [ ] Parent instructions: ম ও ট এখনও শেখানো হয়নি; শিশু প্রথম স্বরবর্ণ দেখে চিনলেই যথেষ্ট।  
  _EN:_ ম and ট have not been taught yet; recognising the first vowel is enough.
- [ ] Completion criteria: তিনটি শব্দ ছবির সাথে মেলানো।  
  _EN:_ Matches three words to pictures.
- [ ] Observation prompt: শিশু কি প্রথম বর্ণ দেখে শব্দ চিনেছে?  
  _EN:_ Did your child use the first letter to recognise the word?

### d5-bengali — Rhyme and review

**Reviewer:** Bengali teacher  
**Source:** Original content written for this prototype. Informally aligned with NCF-FS 2022 goal areas; not an official or affiliated curriculum. Rhyme line "আয় আয় চাঁদ মামা, টিপ দিয়ে যা" is a traditional Bengali folk rhyme (public domain), quoted from common memory — wording to be checked by a Bengali teacher.

- [ ] Title: ছড়া ও পুনরালোচনা  
  _EN:_ Rhyme and review
- [ ] Objective: শিশু একটি লোকছড়ার প্রথম লাইন বলবে এবং অ–ঊ ছয়টি স্বরবর্ণ চিনবে।  
  _EN:_ Child says the first line of a folk rhyme and recognises the six vowels অ–ঊ.
- [ ] Guide line: চলো একটা পুরনো ছড়া বলি, আর বর্ণগুলো মনে করি!  
  _EN:_ Let's say an old rhyme and remember our letters!
- [ ] Explanation 1: আয় আয় চাঁদ মামা, টিপ দিয়ে যা।  
  _EN:_ আয় আয় চাঁদ মামা, টিপ দিয়ে যা। (Come, come, Uncle Moon…) — a traditional folk rhyme.  
  visual: `🌙`
- [ ] Explanation 2: অ আ ই ঈ উ ঊ — ছয়টি স্বরবর্ণ শিখেছি!  
  _EN:_ অ আ ই ঈ উ ঊ — we learned six vowels!  
  visual: `অ আ ই ঈ উ ঊ`
- [ ] **d5b-q1** (base) — prompt: ছড়ায় কাকে ডাকা হচ্ছে?  
  _EN:_ Who is called in the rhyme?
  - options: ✅ 🌙 — চাঁদ · ☀️ — সূর্য · 🐱 — বিড়াল
  - hint: "আয় আয় চাঁদ মামা…"  
  _EN:_ "আয় আয় চাঁদ মামা…"
- [ ] **d5b-q1s** (simpler) — prompt: কোনটা চাঁদ?  
  _EN:_ Which one is the moon (চাঁদ)?
  - options: ✅ 🌙 — চাঁদ · ☀️ — সূর্য
  - hint: রাতের আকাশে থাকে।  
  _EN:_ It is in the night sky.
- [ ] **d5b-q2** (base) — prompt: কোনটা ঈ?  
  _EN:_ Which one is ঈ?
  - options: ই · ✅ ঈ · উ
  - hint: ঈ-এর মাথায় বাড়তি প্যাঁচ।  
  _EN:_ ঈ has the extra curl on top.
- [ ] **d5b-q2s** (simpler) — prompt: উপরের বর্ণের মতো কোনটা?  
  _EN:_ Which one matches the letter at the top?
  - visual: `ঈ`
  - options: ✅ ঈ · আ
  - hint: একই রকম দেখতে বর্ণটা খোঁজো।  
  _EN:_ Look for the same shape.
- [ ] **d5b-q2h** (harder) — prompt: ঊষা কোন বর্ণ দিয়ে শুরু?  
  _EN:_ Which letter does ঊষা start with?
  - visual: `🌅`
  - options: উ · ✅ ঊ · অ
  - hint: ঊ-এর নিচে বাড়তি লেজ।  
  _EN:_ ঊ has the extra tail.
- [ ] **d5b-q3** (base) — prompt: উট কোন বর্ণ দিয়ে শুরু?  
  _EN:_ Which letter does উট start with?
  - visual: `🐪`
  - options: ✅ উ · ঊ · অ
  - hint: উ-তে উট।  
  _EN:_ উ for উট.
- [ ] **d5b-q3s** (simpler) — prompt: আম কোন বর্ণ দিয়ে শুরু?  
  _EN:_ Which letter does আম start with?
  - visual: `🥭`
  - options: ✅ আ · উ
  - hint: আ-তে আম।  
  _EN:_ আ for আম.
- [ ] Offline activity: ছড়া ও বর্ণ কার্ড  
  _EN:_ Rhyme and letter cards — একসাথে "আয় আয় চাঁদ মামা" বলুন, হাততালি দিয়ে। তারপর অ–ঊ কার্ড ক্রম অনুযায়ী সাজান।  
  _EN:_ Say "আয় আয় চাঁদ মামা" together with claps. Then put the অ–ঊ cards in order.
- [ ] Extra practice: অতিরিক্ত অনুশীলন: শুধু অ, আ, ই — তিনটি কার্ড ক্রমে সাজানো।  
  _EN:_ Extra practice: order just three cards — অ, আ, ই.
- [ ] Parent instructions: ছড়ার যে সংস্করণ আপনার পরিবারে প্রচলিত, সেটাই ব্যবহার করুন।  
  _EN:_ Use whichever version of the rhyme your family knows.
- [ ] Completion criteria: ছড়ার প্রথম লাইন বলা; ছয়টি কার্ড ক্রমে সাজানো।  
  _EN:_ Says the first line of the rhyme; orders the six cards.
- [ ] Observation prompt: শিশু কি ছড়াটা উপভোগ করেছে? কোন বর্ণ এখনও কঠিন?  
  _EN:_ Did your child enjoy the rhyme? Which letter is still hard?

## Also worth a Bengali proofread (not flagged `needsReview`)

All Bengali UI strings (`src/i18n/bn.ts`) and the Bengali lines of maths/English/world lessons were written without a native-speaker review. They are not flagged per the brief (only Bengali and Islamic lessons are), but a quick read-through by the same teacher is recommended.
