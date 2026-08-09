import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../Collapsible/Collapsible';
import styles from './Accordion.module.scss';

type AccordionContextValue = {
  type: 'single' | 'multiple';
  value: string | string[] | undefined;
  onItemOpen: (itemValue: string, open: boolean) => void;
};

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordionContext(component: string): AccordionContextValue {
  const ctx = useContext(AccordionContext);
  if (!ctx) {
    throw new Error(`${component} must be used within <Accordion>`);
  }
  return ctx;
}

type ItemContextValue = { value: string };
const ItemContext = createContext<ItemContextValue | null>(null);

export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  type?: 'single' | 'multiple';
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[] | undefined) => void;
  collapsible?: boolean;
  children: ReactNode;
}

export function Accordion({
  type = 'single',
  value: valueControlled,
  defaultValue,
  onValueChange,
  collapsible = true,
  className = '',
  children,
  ...props
}: AccordionProps) {
  const [internal, setInternal] = useState<string | string[] | undefined>(() => {
    if (type === 'multiple') {
      if (Array.isArray(defaultValue)) return defaultValue;
      if (typeof defaultValue === 'string') return [defaultValue];
      return [];
    }
    return typeof defaultValue === 'string' ? defaultValue : undefined;
  });

  const value = valueControlled ?? internal;

  const onItemOpen = useCallback(
    (itemValue: string, nextOpen: boolean) => {
      if (type === 'single') {
        const current = typeof value === 'string' ? value : undefined;
        let next: string | undefined;
        if (nextOpen) {
          next = itemValue;
        } else if (collapsible && current === itemValue) {
          next = undefined;
        } else {
          next = current;
        }
        if (valueControlled === undefined) {
          setInternal(next);
        }
        onValueChange?.(next);
        return;
      }

      const list = Array.isArray(value) ? [...value] : typeof value === 'string' ? [value] : [];
      const nextList = nextOpen
        ? list.includes(itemValue)
          ? list
          : [...list, itemValue]
        : list.filter(v => v !== itemValue);
      if (valueControlled === undefined) {
        setInternal(nextList);
      }
      onValueChange?.(nextList);
    },
    [type, value, valueControlled, collapsible, onValueChange]
  );

  const ctx = useMemo(() => ({ type, value, onItemOpen }), [type, value, onItemOpen]);

  return (
    <AccordionContext.Provider value={ctx}>
      <div className={`${styles.accordion} ${className}`} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function AccordionItem({ value: itemValue, className = '', children, ...props }: AccordionItemProps) {
  const accordion = useAccordionContext('AccordionItem');

  const open =
    accordion.type === 'single'
      ? accordion.value === itemValue
      : Array.isArray(accordion.value) && accordion.value.includes(itemValue);

  return (
    <ItemContext.Provider value={{ value: itemValue }}>
      <Collapsible
        open={open}
        onOpenChange={next => accordion.onItemOpen(itemValue, next)}
        className={`${styles.item} ${className}`}
        {...props}
      >
        {children}
      </Collapsible>
    </ItemContext.Provider>
  );
}

export type AccordionTriggerProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function AccordionTrigger({ className = '', children, ...props }: AccordionTriggerProps) {
  const ctx = useContext(ItemContext);
  if (!ctx) {
    throw new Error('AccordionTrigger must be inside AccordionItem');
  }

  const accordion = useAccordionContext('AccordionTrigger');
  const open =
    accordion.type === 'single'
      ? accordion.value === ctx.value
      : Array.isArray(accordion.value) && accordion.value.includes(ctx.value);

  return (
    <CollapsibleTrigger className={`${styles.trigger} ${className}`} {...props}>
      <span className={styles.triggerLabel}>{children}</span>
      <ChevronIcon className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`} />
    </CollapsibleTrigger>
  );
}

export type AccordionContentProps = HTMLAttributes<HTMLDivElement>;

export function AccordionContent({ className = '', children, ...props }: AccordionContentProps) {
  return (
    <CollapsibleContent className={`${styles.content} ${className}`} {...props}>
      {children}
    </CollapsibleContent>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
