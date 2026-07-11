import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import styles from './Popover.module.scss';

type PopoverCtx = {
  open: boolean;
  closing: boolean;
  setOpen: (v: boolean) => void;
};

const PopoverContext = createContext<PopoverCtx | null>(null);

function usePopover(): PopoverCtx {
  const c = useContext(PopoverContext);
  if (!c) {
    throw new Error('Popover components must be used within Popover');
  }
  return c;
}

export interface PopoverProps extends HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

const POPOVER_EXIT_DURATION = 120;

export function Popover({
  open: openControlled,
  defaultOpen = false,
  onOpenChange,
  className = '',
  children,
  ...props
}: PopoverProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [visible, setVisible] = useState(defaultOpen);
  const [closing, setClosing] = useState(false);
  const open = openControlled ?? internalOpen;

  const setOpen = useCallback(
    (v: boolean) => {
      if (v) {
        setVisible(true);
        setClosing(false);
        if (openControlled === undefined) setInternalOpen(true);
        onOpenChange?.(true);
      } else {
        setClosing(true);
        setTimeout(() => {
          setVisible(false);
          setClosing(false);
          if (openControlled === undefined) setInternalOpen(false);
          onOpenChange?.(false);
        }, POPOVER_EXIT_DURATION);
      }
    },
    [openControlled, onOpenChange]
  );

  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible || closing) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [visible, closing, setOpen]);

  return (
    <PopoverContext.Provider value={{ open: visible, closing, setOpen }}>
      <div ref={rootRef} className={`${styles.root} ${className}`} {...props}>
        {children}
      </div>
    </PopoverContext.Provider>
  );
}

export interface PopoverTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export function PopoverTrigger({ className = '', children, onClick, ...props }: PopoverTriggerProps) {
  const { open, setOpen } = usePopover();
  return (
    <button
      type="button"
      className={`${styles.trigger} ${className}`}
      aria-expanded={open}
      onClick={e => {
        onClick?.(e);
        if (!e.defaultPrevented) {
          setOpen(!open);
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export interface PopoverContentProps extends HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'center' | 'end';
}

export function PopoverContent({
  className = '',
  align = 'center',
  children,
  ...props
}: PopoverContentProps) {
  const { open, closing } = usePopover();
  if (!open) {
    return null;
  }
  const alignClass =
    align === 'start' ? styles.alignStart : align === 'end' ? styles.alignEnd : styles.alignCenter;

  return (
    <div className={`${styles.content} ${alignClass} ${closing ? styles.closing : ''} ${className}`} {...props}>
      {children}
    </div>
  );
}
