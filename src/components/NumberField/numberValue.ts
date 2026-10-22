/** Parse user input in the given locale ("1 234,5" in de, "1,234.5" in en). Blank → null, junk → NaN. */
export const parseLocaleNumber = (input: string, locale?: string): number | null => {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const parts = new Intl.NumberFormat(locale).formatToParts(12345.6);
  const group = parts.find(part => part.type === 'group')?.value ?? ',';
  const decimal = parts.find(part => part.type === 'decimal')?.value ?? '.';
  const normalized = trimmed
    .replace(/[\s\u00a0\u202f]/g, '')
    .split(group)
    .join('')
    .replace(decimal, '.')
    .replace(/[^\d.+-]/g, '');
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
};

interface StepBounds {
  min: number;
  max: number;
  step: number;
}

/** Clamp into [min, max] and snap to the step grid anchored at min (or 0). NaN → null. */
export const clampToStep = (value: number, { min, max, step }: StepBounds): number | null => {
  if (Number.isNaN(value)) return null;
  const anchor = Number.isFinite(min) ? min : 0;
  const decimals = (String(step).split('.')[1] ?? '').length;
  const snapped = step > 0 ? anchor + Math.round((value - anchor) / step) * step : value;
  const clamped = Math.min(max, Math.max(min, snapped));
  return Number(clamped.toFixed(decimals));
};
