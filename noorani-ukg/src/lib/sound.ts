// Tiny synthesized feedback sounds (no audio files, no network).
let ctx: AudioContext | null = null;

function tone(freqs: number[], dur = 0.12, type: OscillatorType = 'sine', gain = 0.08) {
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    ctx = ctx ?? new AC();
    const start = ctx.currentTime;
    freqs.forEach((f, i) => {
      const osc = ctx!.createOscillator();
      const g = ctx!.createGain();
      osc.type = type;
      osc.frequency.value = f;
      g.gain.setValueAtTime(gain, start + i * dur);
      g.gain.exponentialRampToValueAtTime(0.0001, start + (i + 1) * dur);
      osc.connect(g).connect(ctx!.destination);
      osc.start(start + i * dur);
      osc.stop(start + (i + 1) * dur);
    });
  } catch {
    /* sound is optional */
  }
}

export const playCorrect = () => tone([523, 659, 784], 0.11);
export const playTryAgain = () => tone([330, 294], 0.14, 'triangle', 0.05);
