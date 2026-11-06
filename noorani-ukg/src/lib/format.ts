export const fmtClock = (ms: number) => {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
};
export const minutes = (ms: number) => Math.round(ms / 60000);
export const minutes1 = (ms: number) => Math.round(ms / 6000) / 10;
