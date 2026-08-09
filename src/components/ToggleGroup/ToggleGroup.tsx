import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { Toggle, type ToggleProps } from '../Toggle/Toggle';
import styles from './ToggleGroup.module.scss';

type Ctx = {
  type: 'single' | 'multiple';
  value: string | string[];
  toggleItem: (itemValue: string, pressed: boolean) => void;
};

const ToggleGroupContext = createContext<Ctx | null>(null);

function useToggleGroup(): Ctx {
  const c = useContext(ToggleGroupContext);
  if (!c) {
    throw new Error('ToggleGroupItem must be used within ToggleGroup');
  }
  return c;
}

export interface ToggleGroupProps extends HTMLAttributes<HTMLDivElement> {
  type?: 'single' | 'multiple';
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  children: ReactNode;
}

export function ToggleGroup({
  type = 'single',
  value: valueControlled,
  defaultValue,
  onValueChange,
  className = '',
  children,
  ...props
}: ToggleGroupProps) {
  const [internal, setInternal] = useState<string | string[]>(() => {
    if (type === 'multiple') {
      if (Array.isArray(defaultValue)) return defaultValue;
      if (typeof defaultValue === 'string') return [defaultValue];
      return [];
    }
    return typeof defaultValue === 'string' ? defaultValue : '';
  });

  const value = valueControlled ?? internal;

  const toggleItem = useCallback(
    (itemValue: string, pressed: boolean) => {
      if (type === 'single') {
        const next = pressed ? itemValue : '';
        if (valueControlled === undefined) {
          setInternal(next);
        }
        onValueChange?.(next);
        return;
      }

      const list = Array.isArray(value) ? [...value] : value ? [value] : [];
      const next = pressed
        ? list.includes(itemValue)
          ? list
          : [...list, itemValue]
        : list.filter(v => v !== itemValue);
      if (valueControlled === undefined) {
        setInternal(next);
      }
      onValueChange?.(next);
    },
    [type, value, valueControlled, onValueChange]
  );

  const ctx = useMemo(() => ({ type, value, toggleItem }), [type, value, toggleItem]);

  return (
    <ToggleGroupContext.Provider value={ctx}>
      <div
        role="group"
        className={`${styles.group} ${className}`}
        data-type={type}
        {...props}
      >
        {children}
      </div>
    </ToggleGroupContext.Provider>
  );
}

export type ToggleGroupItemProps = Omit<ToggleProps, 'pressed' | 'defaultPressed' | 'onPressedChange'> & {
  value: string;
};

export function ToggleGroupItem({ value: itemValue, ...toggleProps }: ToggleGroupItemProps) {
  const { type, value, toggleItem } = useToggleGroup();
  const pressed =
    type === 'single'
      ? value === itemValue
      : Array.isArray(value) && value.includes(itemValue);

  return (
    <Toggle
      {...toggleProps}
      pressed={pressed}
      onPressedChange={next => toggleItem(itemValue, next)}
    />
  );
}
