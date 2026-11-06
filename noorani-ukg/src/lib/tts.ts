// Text-to-speech via the Web Speech API — only when a voice for the language exists.
// Never used for Qur'anic recitation, duas or Arabic letters. Failure never blocks a lesson.
type SpeakLang = 'bn' | 'en';

let voices: SpeechSynthesisVoice[] = [];
const listeners = new Set<() => void>();

function refresh() {
  try {
    voices = window.speechSynthesis?.getVoices() ?? [];
  } catch {
    voices = [];
  }
  listeners.forEach((l) => l());
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  refresh();
  try {
    window.speechSynthesis.addEventListener('voiceschanged', refresh);
  } catch {
    /* older browsers */
  }
}

export function onVoicesChanged(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

export function voiceFor(lang: SpeakLang): SpeechSynthesisVoice | undefined {
  return voices.find((v) => v.lang.toLowerCase().replace('_', '-').startsWith(lang));
}

export function hasVoice(lang: SpeakLang) {
  return !!voiceFor(lang);
}

/** Returns true if speech started. Silently returns false otherwise. */
export function speak(text: string, lang: SpeakLang): boolean {
  try {
    const voice = voiceFor(lang);
    if (!voice || !window.speechSynthesis) return false;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.voice = voice;
    u.lang = voice.lang;
    u.rate = 0.9;
    window.speechSynthesis.speak(u);
    return true;
  } catch {
    return false;
  }
}

export function stopSpeaking() {
  try {
    window.speechSynthesis?.cancel();
  } catch {
    /* ignore */
  }
}
