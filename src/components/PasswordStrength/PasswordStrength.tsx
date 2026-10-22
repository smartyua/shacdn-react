import { forwardRef, type HTMLAttributes } from 'react';
import { Check, Circle } from 'lucide-react';
import { cn } from '../../lib/cn';
import { DEFAULT_PASSWORD_RULES, scorePassword, type PasswordRule } from './passwordScore';
import styles from './PasswordStrength.module.scss';

export type { PasswordRule, PasswordRuleId, PasswordScore } from './passwordScore';

const DEFAULT_LEVELS = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'] as const;
const TONES = ['empty', 'weak', 'weak', 'fair', 'strong'] as const;

export interface PasswordStrengthProps extends HTMLAttributes<HTMLDivElement> {
  /** The password being typed. */
  value: string;
  rules?: PasswordRule[];
  /** Labels for scores 0–4. */
  levels?: readonly [string, string, string, string, string];
  showRules?: boolean;
}

export const PasswordStrength = forwardRef<HTMLDivElement, PasswordStrengthProps>(
  ({ value, rules = DEFAULT_PASSWORD_RULES, levels = DEFAULT_LEVELS, showRules = true, className, ...props }, ref) => {
    const { score, passed } = scorePassword(value, rules);
    const level = levels[score];

    return (
      <div
        ref={ref}
        data-slot="password-strength"
        data-tone={TONES[score]}
        className={cn(styles.root, className)}
        {...props}
      >
        <div className={styles.header}>
          <div
            className={styles.meter}
            role="meter"
            aria-label="Password strength"
            aria-valuemin={0}
            aria-valuemax={4}
            aria-valuenow={score}
            aria-valuetext={level}
          >
            {[1, 2, 3, 4].map(segment => (
              <span key={segment} className={styles.segment} data-filled={segment <= score || undefined} />
            ))}
          </div>
          <span className={styles.level} aria-live="polite">
            {value ? level : ''}
          </span>
        </div>
        {showRules ? (
          <ul className={styles.rules}>
            {rules.map(rule => {
              const ok = passed.includes(rule.id);
              return (
                <li key={rule.id} className={styles.rule} data-passed={ok || undefined}>
                  {ok ? <Check size={14} aria-hidden /> : <Circle size={14} aria-hidden />}
                  <span>{rule.label}</span>
                  <span className={styles.srOnly}>{ok ? '(met)' : '(not met)'}</span>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    );
  }
);

PasswordStrength.displayName = 'PasswordStrength';
