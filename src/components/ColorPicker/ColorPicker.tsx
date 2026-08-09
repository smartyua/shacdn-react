import { useCallback, useId, useState, type ChangeEvent } from 'react';
import { Input } from '../Input/Input';
import { Popover, PopoverContent, PopoverTrigger } from '../Popover/Popover';
import styles from './ColorPicker.module.scss';

const normalizeHex = (value: string): string | null => {
  const trimmed = value.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) {
    return trimmed.toLowerCase();
  }
  if (/^[0-9a-fA-F]{6}$/.test(trimmed)) {
    return `#${trimmed.toLowerCase()}`;
  }
  return null;
};

export interface ColorPickerProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (hex: string) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export const ColorPicker = ({
  value: valueControlled,
  defaultValue = '#000000',
  onValueChange,
  disabled,
  className = '',
  id: idProp,
}: ColorPickerProps) => {
  const generatedId = useId();
  const id = idProp ?? generatedId;

  const [internal, setInternal] = useState(defaultValue);
  const [hexInput, setHexInput] = useState(defaultValue);

  const color = valueControlled ?? internal;

  const updateColor = useCallback(
    (next: string) => {
      if (valueControlled === undefined) {
        setInternal(next);
      }
      setHexInput(next);
      onValueChange?.(next);
    },
    [valueControlled, onValueChange]
  );

  const onColorInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateColor(e.target.value);
  };

  const onHexInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setHexInput(raw);
    const normalized = normalizeHex(raw);
    if (normalized) {
      updateColor(normalized);
    }
  };

  const onHexInputBlur = () => {
    const normalized = normalizeHex(hexInput);
    if (normalized) {
      setHexInput(normalized);
      if (normalized !== color) {
        updateColor(normalized);
      }
    } else {
      setHexInput(color);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          id={id}
          disabled={disabled}
          className={`${styles.trigger} ${className}`}
          aria-label={`Color picker, current color ${color}`}
          data-slot="color-picker-trigger"
        >
          <span className={styles.swatch} style={{ backgroundColor: color }} aria-hidden="true" />
          <span className={styles.hexLabel}>{color}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className={styles.content} align="start">
        <div className={styles.controls}>
          <input
            type="color"
            value={color}
            disabled={disabled}
            className={styles.colorInput}
            aria-label="Choose color"
            onChange={onColorInputChange}
            data-slot="color-picker-native"
          />
          <Input
            value={hexInput}
            disabled={disabled}
            className={styles.hexInput}
            aria-label="Hex color value"
            onChange={onHexInputChange}
            onBlur={onHexInputBlur}
            data-slot="color-picker-hex"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};
