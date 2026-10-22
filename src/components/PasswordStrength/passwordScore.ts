export type PasswordRuleId = 'length' | 'case' | 'number' | 'symbol';

export interface PasswordRule {
  id: PasswordRuleId;
  label: string;
  test: (value: string) => boolean;
}

export const DEFAULT_PASSWORD_RULES: PasswordRule[] = [
  { id: 'length', label: 'At least 8 characters', test: value => value.length >= 8 },
  { id: 'case', label: 'Upper and lower case letters', test: value => /[a-z]/.test(value) && /[A-Z]/.test(value) },
  { id: 'number', label: 'A number', test: value => /\d/.test(value) },
  { id: 'symbol', label: 'A symbol', test: value => /[^A-Za-z0-9\s]/.test(value) },
];

export interface PasswordScore {
  /** 0 (empty) … 4 (strong). */
  score: 0 | 1 | 2 | 3 | 4;
  passed: PasswordRuleId[];
}

/** One point per rule; very long passphrases earn the top score even without symbols. */
export const scorePassword = (value: string, rules: PasswordRule[] = DEFAULT_PASSWORD_RULES): PasswordScore => {
  if (!value) return { score: 0, passed: [] };
  const passed = rules.filter(rule => rule.test(value)).map(rule => rule.id);
  const points = value.length >= 16 ? Math.max(passed.length, 4) : passed.length;
  const score = Math.min(4, Math.max(1, Math.round((points / Math.max(rules.length, 1)) * 4))) as PasswordScore['score'];
  return { score, passed };
};
