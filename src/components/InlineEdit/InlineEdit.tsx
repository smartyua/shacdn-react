import {
  forwardRef,
  useLayoutEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
} from 'react';
import { Pencil } from 'lucide-react';
import { cn } from '../../lib/cn';
import styles from './InlineEdit.module.scss';

export interface InlineEditProps extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  value?: string;
  defaultValue?: string;
  /** Fires when an edit is committed (Enter or blur), never on every keystroke. */
  onValueChange?: (value: string) => void;
  placeholder?: string;
  /** Reject blank commits and restore the previous value. */
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
  /** Accessible name for both the display button and the field. */
  'aria-label': string;
}

export const InlineEdit = forwardRef<HTMLDivElement, InlineEditProps>(
  (
    {
      value,
      defaultValue = '',
      onValueChange,
      placeholder = 'Untitled',
      required = true,
      disabled = false,
      maxLength,
      'aria-label': ariaLabel,
      className,
      ...props
    },
    ref
  ) => {
    const [internal, setInternal] = useState(defaultValue);
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const displayRef = useRef<HTMLButtonElement>(null);
    const returnFocus = useRef(false);
    const editingRef = useRef(false);
    const current = value ?? internal;

    useLayoutEffect(() => {
      if (editing) {
        inputRef.current?.focus();
        inputRef.current?.select();
      } else if (returnFocus.current) {
        returnFocus.current = false;
        displayRef.current?.focus();
      }
    }, [editing]);

    const begin = () => {
      if (disabled) return;
      editingRef.current = true;
      setDraft(current);
      setEditing(true);
    };

    const finish = (commit: boolean, refocus: boolean) => {
      if (!editingRef.current) return;
      editingRef.current = false;
      returnFocus.current = refocus;
      setEditing(false);
      if (!commit) return;
      const next = draft.trim();
      if ((required && !next) || next === current) return;
      if (value === undefined) setInternal(next);
      onValueChange?.(next);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        finish(true, true);
      } else if (event.key === 'Escape') {
        event.preventDefault();
        finish(false, true);
      }
    };

    return (
      <div
        ref={ref}
        data-slot="inline-edit"
        data-editing={editing || undefined}
        className={cn(styles.root, className)}
        {...props}
      >
        {editing ? (
          <input
            ref={inputRef}
            className={styles.input}
            aria-label={ariaLabel}
            value={draft}
            maxLength={maxLength}
            placeholder={placeholder}
            size={Math.max(draft.length, placeholder.length, 1)}
            onChange={event => setDraft(event.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => finish(true, false)}
          />
        ) : (
          <button
            ref={displayRef}
            type="button"
            className={styles.display}
            disabled={disabled}
            aria-label={`${ariaLabel}: ${current || placeholder}. Edit`}
            onClick={begin}
          >
            <span className={cn(styles.text, !current && styles.placeholder)}>{current || placeholder}</span>
            <Pencil className={styles.icon} size={14} aria-hidden />
          </button>
        )}
      </div>
    );
  }
);

InlineEdit.displayName = 'InlineEdit';
