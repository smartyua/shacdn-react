const isSlot = (token: string): boolean => token === '#' || token === 'A' || token === '*';

const fits = (token: string, char: string): boolean => {
  if (token === '#') return /\d/.test(char);
  if (token === 'A') return /[A-Za-z]/.test(char);
  if (token === '*') return /[0-9A-Za-z]/.test(char);
  return false;
};

export interface MaskedValue {
  masked: string;
  raw: string;
}

/** Apply a mask. `#` digit, `A` letter, `*` alphanumeric. Other characters are literals. */
export const applyMask = (input: string, mask: string): MaskedValue => {
  if (mask.length === 0) {
    return { masked: input, raw: input };
  }

  const chars = input.replace(/[^0-9A-Za-z]/g, '').split('');
  let index = 0;
  let masked = '';
  let raw = '';

  for (const token of mask) {
    if (!isSlot(token)) {
      if (index < chars.length) masked += token;
      continue;
    }

    while (index < chars.length && !fits(token, chars[index] ?? '')) index += 1;
    if (index >= chars.length) break;

    const char = chars[index] ?? '';
    const next = token === 'A' ? char.toUpperCase() : char;
    masked += next;
    raw += next;
    index += 1;
  }

  return { masked, raw };
};
