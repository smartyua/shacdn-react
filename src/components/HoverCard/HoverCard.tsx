import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
  type RefObject,
} from 'react';
import {
  composeRefs,
  FloatingPortal,
  useDismissLayer,
  useFloatingPosition,
  type FloatingAlign,
  type FloatingSide,
} from '../Floating/Floating';
import styles from './HoverCard.module.scss';

type HoverCtx = {
  open: boolean;
  setOpen: (v: boolean) => void;
  triggerRef: RefObject<HTMLElement | null>;
  scheduleOpen: () => void;
  scheduleClose: () => void;
};

const HoverCardContext = createContext<HoverCtx | null>(null);

const useHoverCardCtx = (): HoverCtx => {
  const c = useContext(HoverCardContext);
  if (!c) {
    throw new Error('HoverCard subcomponents must be used within HoverCard');
  }
  return c;
};

const DEFAULT_OPEN = 700;
const DEFAULT_CLOSE = 300;

export interface HoverCardProps extends HTMLAttributes<HTMLDivElement> {
  openDelay?: number;
  closeDelay?: number;
  children: ReactNode;
}

export const HoverCard = ({
  className = '',
  openDelay = DEFAULT_OPEN,
  closeDelay = DEFAULT_CLOSE,
  children,
  ...props
}: HoverCardProps) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);
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
    () => ({ open, setOpen, triggerRef, scheduleOpen, scheduleClose }),
    [open, scheduleOpen, scheduleClose]
  );

  return (
    <HoverCardContext.Provider value={value}>
      <div className={`${styles.root} ${className}`} data-slot="hover-card" {...props}>
        {children}
      </div>
    </HoverCardContext.Provider>
  );
};

export type HoverCardTriggerProps = HTMLAttributes<HTMLDivElement>;

export const HoverCardTrigger = forwardRef<HTMLDivElement, HoverCardTriggerProps>(
  ({ className = '', children, onMouseEnter, onMouseLeave, onFocus, onBlur, ...props }, ref) => {
    const { triggerRef, scheduleOpen, scheduleClose } = useHoverCardCtx();

    return (
      <div
        ref={composeRefs(ref, triggerRef)}
        className={`${styles.trigger} ${className}`}
        data-slot="hover-card-trigger"
        tabIndex={0}
        onMouseEnter={e => {
          onMouseEnter?.(e);
          scheduleOpen();
        }}
        onMouseLeave={e => {
          onMouseLeave?.(e);
          scheduleClose();
        }}
        onFocus={e => {
          onFocus?.(e);
          scheduleOpen();
        }}
        onBlur={e => {
          onBlur?.(e);
          scheduleClose();
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

HoverCardTrigger.displayName = 'HoverCardTrigger';

export interface HoverCardContentProps extends HTMLAttributes<HTMLDivElement> {
  align?: FloatingAlign;
  side?: FloatingSide;
  sideOffset?: number;
}

export const HoverCardContent = ({
  className = '',
  align = 'center',
  side = 'bottom',
  sideOffset = 4,
  children,
  onMouseEnter,
  onMouseLeave,
  ...props
}: HoverCardContentProps) => {
  const { open, setOpen, triggerRef, scheduleOpen, scheduleClose } = useHoverCardCtx();
  const contentRef = useRef<HTMLDivElement>(null);

  const { style, floatingProps } = useFloatingPosition({
    anchorRef: triggerRef,
    floatingRef: contentRef,
    open,
    side,
    align,
    sideOffset,
  });

  useDismissLayer({
    open,
    onDismiss: () => setOpen(false),
    contentRef,
    excludeRefs: [triggerRef],
    dismissOnEscape: true,
    dismissOnOutsidePointer: false,
  });

  if (!open) {
    return null;
  }

  return (
    <FloatingPortal>
      <div
        ref={contentRef}
        data-slot="hover-card-content"
        className={`${styles.content} ${className}`}
        style={style}
        onMouseEnter={e => {
          onMouseEnter?.(e);
          scheduleOpen();
        }}
        onMouseLeave={e => {
          onMouseLeave?.(e);
          scheduleClose();
        }}
        {...floatingProps}
        {...props}
      >
        {children}
      </div>
    </FloatingPortal>
  );
};
