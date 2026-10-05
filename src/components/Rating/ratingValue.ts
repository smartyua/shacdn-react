export const ratingFromPointer = (
  index: number,
  localX: number,
  width: number,
  allowHalf: boolean
): number => {
  const star = index + 1;
  if (!allowHalf || !(width > 0) || !Number.isFinite(localX)) return star;
  return localX < width / 2 ? star - 0.5 : star;
};

export const clampRating = (value: number, max: number): number => {
  if (!Number.isFinite(value)) return 0;
  const ceiling = Number.isFinite(max) && max > 0 ? max : 1;
  return Math.min(Math.max(value, 0), ceiling);
};

export const fillForStar = (current: number, index: number): number => {
  const delta = current - index;
  if (delta >= 1) return 1;
  if (delta <= 0) return 0;
  return delta;
};
