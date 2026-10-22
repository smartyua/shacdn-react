/** Gauge sweep: a 240° arc opening downward, from 150° to 390° (SVG angles, clockwise from +x). */
export const GAUGE_START = 150;
export const GAUGE_SWEEP = 240;

export const clampRatio = (value: number, min: number, max: number): number => {
  if (!(max > min) || Number.isNaN(value)) return 0;
  return Math.min(1, Math.max(0, (value - min) / (max - min)));
};

const polar = (cx: number, cy: number, r: number, degrees: number) => {
  const rad = (degrees * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
};

/** SVG path for the arc covering ratio [from, to] of the sweep. */
export const arcPath = (cx: number, cy: number, r: number, from: number, to: number): string => {
  const a0 = GAUGE_START + GAUGE_SWEEP * from;
  const a1 = GAUGE_START + GAUGE_SWEEP * to;
  const start = polar(cx, cy, r, a0);
  const end = polar(cx, cy, r, a1);
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
};
