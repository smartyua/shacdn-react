import { forwardRef, useState, type ChangeEvent, type InputHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import { applyMask } from './applyMask';
import styles from './InputMask.module.scss';

export interface InputMaskProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange'> {
  mask: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (masked: string, raw: string) => void;
}

export const InputMask = forwardRef<HTMLInputElement, InputMaskProps>(
  ({ mask, value, defaultValue = '', onValueChange, className, ...props }, ref) => {
    const [uncontrolled, setUncontrolled] = useState(() => applyMask(defaultValue, mask).masked);
    const shown = value !== undefined ? applyMask(value, mask).masked : uncontrolled;

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
      const next = applyMask(event.target.value, mask);
      if (value === undefined) setUncontrolled(next.masked);
      onValueChange?.(next.masked, next.raw);
    };

    return (
      <input
        ref={ref}
        className={cn(styles.input, className)}
        data-slot="input-mask"
        value={shown}
        onChange={onChange}
        inputMode={mask.includes('#') && !mask.includes('A') && !mask.includes('*') ? 'numeric' : 'text'}
        {...props}
      />
    );
  }
);

InputMask.displayName = 'InputMask';
