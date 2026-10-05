export const reorder = <T>(items: T[], from: number, to: number): T[] => {
  if (from === to || from < 0 || to < 0 || from >= items.length || to >= items.length) return items;
  const next = items.slice();
  const [item] = next.splice(from, 1);
  if (item === undefined) return items;
  next.splice(to, 0, item);
  return next;
};

export interface PointerBand {
  top: number;
  height: number;
}

/** Index whose midpoint is the first one below the pointer. */
export const indexFromPointer = (bands: PointerBand[], y: number): number => {
  if (bands.length === 0 || !Number.isFinite(y)) return 0;
  for (let index = 0; index < bands.length; index += 1) {
    const band = bands[index];
    if (!band) continue;
    const mid = band.top + band.height / 2;
    if (y < mid) return index;
  }
  return bands.length - 1;
};
