// Fetches the exact Uthmani text of the verses used in the prototype from Tanzil.net
// and writes them, unmodified, with Tanzil's licence notice, to
// src/content/islamic/quran-text.json. Never edit the verse text by hand.
//
// Usage: npm run fetch-quran   (needs internet access to tanzil.net)
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const OUT = fileURLToPath(new URL('../src/content/islamic/quran-text.json', import.meta.url));
const URLS = [
  'https://tanzil.net/pub/download/index.php?marks=true&sajdah=true&rub=true&tatweel=true&quranType=uthmani&outType=txt-2&agree=true',
];

const data = JSON.parse(await readFile(OUT, 'utf8'));
const wanted = Object.keys(data.verses);

let text = null;
for (const url of URLS) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    text = await res.text();
    break;
  } catch (err) {
    console.error(`Could not fetch ${url}: ${err.message}`);
  }
}
if (!text) {
  console.error('Tanzil unreachable. quran-text.json left unchanged; the app keeps showing marked placeholders.');
  process.exit(1);
}

const lines = text.split(/\r?\n/);
const licence = lines.filter((l) => l.startsWith('#')).map((l) => l.replace(/^#\s?/, '')).join('\n').trim();
const verses = {};
for (const line of lines) {
  const m = line.match(/^(\d+)\|(\d+)\|(.+)$/);
  if (m) verses[`${m[1]}:${m[2]}`] = m[3];
}
for (const key of wanted) {
  if (!verses[key]) {
    console.error(`Verse ${key} not found in Tanzil output — aborting without changes.`);
    process.exit(1);
  }
  data.verses[key] = verses[key];
}
data.fetched = true;
data.fetchedAt = new Date().toISOString();
data.license = licence || 'Tanzil Quran Text — Copyright (C) 2007-present Tanzil Project. License: Creative Commons Attribution 3.0. Do not modify the text.';
data.note = 'Fetched verbatim from Tanzil.net. Do not modify.';
await writeFile(OUT, JSON.stringify(data, null, 2) + '\n');
console.log(`Wrote ${wanted.length} verses from Tanzil to ${OUT}`);
