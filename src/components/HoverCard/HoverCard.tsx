import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import styles from './HoverCard.module.scss';

type HoverCtx = {
  open: boolean;
  scheduleOpen: () => void;
  scheduleClose: () => void;
};

const HoverCardContext = createContext<HoverCtx | null>(null);

function useHoverCardCtx(): HoverCtx {
  const c = useContext(HoverCardContext);
  if (!c) {
    throw new Error('HoverCard subcomponents must be used within HoverCard');
  }
  return c;
}

const DEFAULT_OPEN = 700;
const DEFAULT_CLOSE = 300;

export interface HoverCardProps extends HTMLAttributes<HTMLDivElement> {
  openDelay?: number;
  closeDelay?: number;
  children: ReactNode;
}

export function HoverCard({
  className = '',
  openDelay = DEFAULT_OPEN,
  closeDelay = DEFAULT_CLOSE,
  children,
  ...props
}: HoverCardProps) {
  const [open, setOpen] = useState(false);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearOpen = useCallback(() => {
    if (openTimer.current) {
      clearTimeout(openTimer.current);
      openTimer.current = null;
    }
  }, []);

  const clearClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const scheduleOpen = useCallback(() => {
    clearClose();
    clearOpen();
    openTimer.current = setTimeout(() => setOpen(true), openDelay);
  }, [clearClose, clearOpen, openDelay]);

  const scheduleClose = useCallback(() => {
    clearOpen();
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
    }
    closeTimer.current = setTimeout(() => setOpen(false), closeDelay);
  }, [clearOpen, closeDelay]);

  useEffect(
    () => () => {
      clearOpen();
      clearClose();
    },
    [clearOpen, clearClose]
  );

  const value = useMemo(
    () => ({ open, scheduleOpen, scheduleClose }),
    [open, scheduleOpen, scheduleClose]
  );

  return (
    <HoverCardContext.Provider value={value}>
      <div className={`${styles.root} ${className}`} {...props}>
        {children}
      </div>
    </HoverCardContext.Provider>
  );
}

export type HoverCardTriggerProps = HTMLAttributes<HTMLDivElement>;

export function HoverCardTrigger({ className = '', children, ...props }: HoverCardTriggerProps) {
  const { scheduleOpen, scheduleClose } = useHoverCardCtx();
  return (
    <div
      className={`${styles.trigger} ${className}`}
      onMouseEnter={scheduleOpen}
      onMouseLeave={scheduleClose}
      {...props}
    >
      {children}
    </div>
  );
}

export interface HoverCardContentProps extends HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'center' | 'end';
}

export function HoverCardContent({
  className = '',
  align = 'center',
  children,
  ...props
}: HoverCardContentProps) {
  const { open, scheduleOpen, scheduleClose } = useHoverCardCtx();
  if (!open) {
    return null;
  }

  const alignClass =
    align === 'start' ? styles.alignStart : align === 'end' ? styles.alignEnd : styles.alignCenter;

  return (
    <div
      className={`${styles.content} ${alignClass} ${className}`}
      onMouseEnter={scheduleOpen}
      onMouseLeave={scheduleClose}
      {...props}
    >
      {children}
    </div>
  );
}
