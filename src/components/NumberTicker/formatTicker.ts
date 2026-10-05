const finite = (amount: number, fallback: number): number => (Number.isFinite(amount) ? amount : fallback);

export const formatTicker = (
  amount: number,
  decimalPlaces: number,
  prefix: string,
  suffix: string
): string => {
  const places = Math.max(0, Math.floor(finite(decimalPlaces, 0)));
  const formatted = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: places,
    maximumFractionDigits: places,
  }).format(finite(amount, 0));
  return `${prefix}${formatted}${suffix}`;
};
