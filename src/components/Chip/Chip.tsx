import { forwardRef, type ButtonHTMLAttributes, type MouseEvent } from 'react';
import { X } from 'lucide-react';
import styles from './Chip.module.scss';

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  size?: 'sm' | 'default';
  selected?: boolean;
  onRemove?: () => void;
}

export const Chip = forwardRef<HTMLButtonElement, ChipProps>(
  (
    {
      variant = 'default',
      size = 'default',
      selected = false,
      onRemove,
      className,
      children,
      disabled,
      onClick,
      ...props
    },
    ref
  ) => {
    const sizeClass = size === 'sm' ? styles.sm : styles.defaultSize;
    const chipClasses = `${styles.chip} ${styles[variant]} ${sizeClass} ${selected ? styles.selected : ''}`;

    const handleRemoveClick = (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onRemove?.();
    };

    if (onRemove) {
      return (
        <div
          className={`${styles.group} ${chipClasses} ${className || ''}`}
          data-state={selected ? 'selected' : 'default'}
        >
          <button
            ref={ref}
            type="button"
            disabled={disabled}
            aria-pressed={selected || undefined}
            className={styles.mainButton}
            onClick={onClick}
            {...props}
          >
            {children}
          </button>
          <button
            type="button"
            className={styles.remove}
            aria-label="Remove"
            disabled={disabled}
            onClick={handleRemoveClick}
          >
            <X size={12} strokeWidth={2.5} />
          </button>
        </div>
      );
    }

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        aria-pressed={selected || undefined}
        data-state={selected ? 'selected' : 'default'}
        className={`${chipClasses} ${className || ''}`}
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Chip.displayName = 'Chip';
