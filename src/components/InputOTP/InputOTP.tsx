import { useCallback, useState, type ClipboardEvent, type KeyboardEvent } from 'react';
import styles from './InputOTP.module.scss';

const padDigits = (s: string, length: number): string => {
  const d = s.replace(/\D/g, '').slice(0, length);
  return d.padEnd(length, ' ');
};

export interface InputOTPProps {
  length?: number;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
  'aria-invalid'?: boolean | 'true' | 'false';
}

export const InputOTP = ({
  length = 6,
  value: valueControlled,
  defaultValue = '',
  onChange,
  disabled,
  className = '',
  id,
  'aria-invalid': ariaInvalid,
}: InputOTPProps) => {
  const baseId = id ?? 'otp';
  const [internal, setInternal] = useState(() => padDigits(defaultValue, length));

  const padded = valueControlled !== undefined ? padDigits(valueControlled, length) : internal;

  const emit = useCallback(
    (nextPadded: string) => {
      if (valueControlled === undefined) {
        setInternal(nextPadded);
      }
      onChange?.(nextPadded.replace(/\s/g, ''));
    },
    [valueControlled, onChange]
  );

  const focusSlot = useCallback(
    (index: number) => {
      document.getElementById(`${baseId}-${index}`)?.focus();
    },
    [baseId]
  );

  const setChar = (index: number, ch: string) => {
    const arr = padded.split('');
    const digit = ch === '' ? ' ' : ch.slice(-1).replace(/\D/g, '') || ' ';
    arr[index] = digit;
    emit(arr.join(''));
    if (digit !== ' ' && index < length - 1) {
      focusSlot(index + 1);
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      const el = e.target as HTMLInputElement;
      if (el.value === '') {
        if (index > 0) {
          setChar(index - 1, '');
          focusSlot(index - 1);
        }
      } else {
        setChar(index, '');
      }
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      focusSlot(index - 1);
    }
    if (e.key === 'ArrowRight' && index < length - 1) {
      focusSlot(index + 1);
    }
  };

  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    emit(padDigits(text, length));
    focusSlot(Math.min(text.length, length - 1));
  };

  return (
    <div
      className={`${styles.root} ${className}`}
      data-slot="input-otp"
      role="group"
      aria-label="One-time code"
    >
      {Array.from({ length }, (_, index) => {
        const c = padded[index] === ' ' ? '' : padded[index];
        return (
          <input
            key={index}
            id={`${baseId}-${index}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            disabled={disabled}
            data-slot="input-otp-slot"
            className={styles.slot}
            value={c}
            aria-invalid={ariaInvalid === true || ariaInvalid === 'true' ? true : undefined}
            onChange={e => setChar(index, e.target.value)}
            onKeyDown={e => onKeyDown(e, index)}
            onPaste={index === 0 ? onPaste : undefined}
          />
        );
      })}
    </div>
  );
};

InputOTP.displayName = 'InputOTP';
