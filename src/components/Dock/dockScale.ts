/** Scale for one dock icon from pointer distance along the dock axis. */
export const dockScale = (
  pointer: number,
  center: number,
  range: number,
  size: number,
  magnification: number
): number => {
  if (!(range > 0) || !(size > 0) || !(magnification > 0)) return 1;
  const influence = Math.max(0, 1 - Math.abs(pointer - center) / range);
  return 1 + influence * (magnification / size - 1);
};
