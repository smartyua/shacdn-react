import { X } from 'lucide-react';
import {
  useCallback,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from 'react';
import styles from './TokenField.module.scss';

export interface TokenFieldProps {
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (tokens: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  delimiters?: string[];
  'aria-label'?: string;
}

export const TokenField = ({
  value: valueControlled,
  defaultValue = [],
  onValueChange,
  placeholder = 'Add tokens...',
  disabled,
  className = '',
  delimiters = [',', 'Enter'],
  'aria-label': ariaLabel = 'Tokens',
}: TokenFieldProps) => {
  const [internal, setInternal] = useState<string[]>(defaultValue);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const tokens = valueControlled ?? internal;

  const updateTokens = useCallback(
    (next: string[]) => {
      if (valueControlled === undefined) {
        setInternal(next);
      }
      onValueChange?.(next);
    },
    [valueControlled, onValueChange]
  );

  const commitToken = useCallback(
    (raw: string) => {
      const token = raw.trim();
      if (!token || tokens.includes(token)) {
        setInputValue('');
        return;
      }
      updateTokens([...tokens, token]);
      setInputValue('');
    },
    [tokens, updateTokens]
  );

  const removeToken = useCallback(
    (index: number) => {
      updateTokens(tokens.filter((_, i) => i !== index));
    },
    [tokens, updateTokens]
  );

  const onInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (delimiters.includes(e.key)) {
      e.preventDefault();
      commitToken(inputValue);
      return;
    }

    if (e.key === 'Backspace' && inputValue === '' && tokens.length > 0) {
      e.preventDefault();
      removeToken(tokens.length - 1);
    }
  };

  const onInputBlur = () => {
    if (inputValue.trim()) {
      commitToken(inputValue);
    }
  };

  const onContainerClick = () => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  };

  const onChipRemove = (index: number, e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    removeToken(index);
  };

  return (
    <div
      role="group"
      className={`${styles.root} ${disabled ? styles.disabled : ''} ${className}`}
      data-slot="token-field"
      onClick={onContainerClick}
    >
      {tokens.map((token, index) => (
        <span key={`${token}-${index}`} className={styles.chip}>
          <span className={styles.chipLabel}>{token}</span>
          <button
            type="button"
            className={styles.chipRemove}
            aria-label={`Remove ${token}`}
            disabled={disabled}
            onClick={e => onChipRemove(index, e)}
            tabIndex={-1}
          >
            <X size={12} aria-hidden="true" />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        type="text"
        className={styles.input}
        value={inputValue}
        disabled={disabled}
        placeholder={tokens.length === 0 ? placeholder : undefined}
        aria-label={ariaLabel}
        onChange={e => setInputValue(e.target.value)}
        onKeyDown={onInputKeyDown}
        onBlur={onInputBlur}
        data-slot="token-field-input"
      />
    </div>
  );
};
