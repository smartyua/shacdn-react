import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from 'react';
import {
  composeRefs,
  FloatingPortal,
  useDismissLayer,
  useFloatingPosition,
  useInitialMenuFocus,
} from '../Floating/Floating';
import styles from './ContextMenu.module.scss';

type ContextMenuContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  point: { x: number; y: number };
  setPoint: (point: { x: number; y: number }) => void;
  triggerRef: RefObject<HTMLDivElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
  close: () => void;
};

const ContextMenuContext = createContext<ContextMenuContextValue | null>(null);

const useContextMenu = (): ContextMenuContextValue => {
  const context = useContext(ContextMenuContext);
  if (!context) {
    throw new Error('ContextMenu components must be used together');
  }
  return context;
};

const getEnabledMenuItems = (content: HTMLDivElement | null): HTMLElement[] => {
  if (!content) {
    return [];
  }
  return Array.from(
    content.querySelectorAll('[role="menuitem"]:not([aria-disabled="true"])')
  ) as HTMLElement[];
};

const focusMenuItem = (content: HTMLDivElement | null, index: number): void => {
  const items = getEnabledMenuItems(content);
  if (items.length === 0) {
    return;
  }
  const normalized = ((index % items.length) + items.length) % items.length;
  items[normalized]?.focus();
};

export interface ContextMenuProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const ContextMenu = ({ className = '', children, ...props }: ContextMenuProps) => {
  const [open, setOpen] = useState(false);
  const [point, setPoint] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  const value = useMemo(
    () => ({ open, setOpen, point, setPoint, triggerRef, contentRef, close }),
    [open, point, close]
  );

  return (
    <ContextMenuContext.Provider value={value}>
      <div className={`${styles.wrapper} ${className}`} {...props}>
        {children}
      </div>
    </ContextMenuContext.Provider>
  );
};

export type ContextMenuTriggerProps = HTMLAttributes<HTMLDivElement>;

export const ContextMenuTrigger = forwardRef<HTMLDivElement, ContextMenuTriggerProps>(
  ({ className = '', children, onContextMenu, ...props }, ref) => {
    const { setOpen, setPoint, triggerRef } = useContextMenu();

    const handleContextMenu = useCallback(
      (e: MouseEvent<HTMLDivElement>) => {
        onContextMenu?.(e);
        if (e.defaultPrevented) {
          return;
        }
        e.preventDefault();
        setPoint({ x: e.clientX, y: e.clientY });
        setOpen(true);
      },
      [onContextMenu, setOpen, setPoint]
    );

    return (
      <div
        ref={composeRefs(ref, triggerRef)}
        className={`${styles.trigger} ${className}`}
        onContextMenu={handleContextMenu}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ContextMenuTrigger.displayName = 'ContextMenuTrigger';

export type ContextMenuContentProps = HTMLAttributes<HTMLDivElement>;

export const ContextMenuContent = forwardRef<HTMLDivElement, ContextMenuContentProps>(
  ({ className = '', children, onKeyDown, ...props }, ref) => {
    const { open, point, triggerRef, contentRef, close } = useContextMenu();

    const { style, floatingProps, isPositioned } = useFloatingPosition({
      anchorRef: triggerRef,
      anchorPoint: point,
      floatingRef: contentRef,
      open,
      sideOffset: 0,
    });

    useDismissLayer({
      open,
      onDismiss: close,
      contentRef,
      excludeRefs: [triggerRef],
      dismissOnEscape: true,
      dismissOnOutsidePointer: true,
    });

    useInitialMenuFocus({
      open,
      isPositioned,
      containerRef: contentRef,
    });

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented) {
        return;
      }

      const items = getEnabledMenuItems(contentRef.current);
      if (items.length === 0) {
        return;
      }

      const activeIndex = items.findIndex(item => item === document.activeElement);

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          focusMenuItem(contentRef.current, activeIndex + 1);
          break;
        case 'ArrowUp':
          e.preventDefault();
          focusMenuItem(contentRef.current, activeIndex <= 0 ? items.length - 1 : activeIndex - 1);
          break;
        case 'Home':
          e.preventDefault();
          focusMenuItem(contentRef.current, 0);
          break;
        case 'End':
          e.preventDefault();
          focusMenuItem(contentRef.current, items.length - 1);
          break;
        default:
          break;
      }
    };

    if (!open) {
      return null;
    }

    return (
      <FloatingPortal>
        <div
          ref={composeRefs(ref, contentRef)}
          className={`${styles.content} ${className}`}
          role="menu"
          style={style}
          onClick={e => e.stopPropagation()}
          onKeyDown={handleKeyDown}
          {...floatingProps}
          {...props}
        >
          {children}
        </div>
      </FloatingPortal>
    );
  }
);

ContextMenuContent.displayName = 'ContextMenuContent';

export interface ContextMenuItemProps extends HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
}

export const ContextMenuItem = forwardRef<HTMLDivElement, ContextMenuItemProps>(
  ({ className = '', disabled, children, onClick, onKeyDown, ...props }, ref) => {
    const { close } = useContextMenu();

    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
      if (disabled) {
        return;
      }
      onClick?.(e);
      if (!e.defaultPrevented) {
        close();
      }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented || disabled) {
        return;
      }
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.currentTarget.click();
      }
    };

    return (
      <div
        ref={ref}
        role="menuitem"
        tabIndex={-1}
        className={`${styles.item} ${disabled ? styles.itemDisabled : ''} ${className}`}
        aria-disabled={disabled || undefined}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ContextMenuItem.displayName = 'ContextMenuItem';

export const ContextMenuSeparator = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={`${styles.separator} ${className}`} role="separator" {...props} />
  )
);

ContextMenuSeparator.displayName = 'ContextMenuSeparator';
