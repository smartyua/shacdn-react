import {
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type RefObject,
} from 'react';
import {
  composeRefs,
  FloatingPortal,
  useDismissLayer,
  useFloatingPosition,
  useInitialMenuFocus,
  type FloatingAlign,
  type FloatingSide,
} from '../Floating/Floating';
import styles from './DropdownMenu.module.scss';

type DropdownMenuContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: RefObject<HTMLElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
  close: () => void;
  initialFocusRequested: boolean;
  requestInitialFocus: () => void;
  clearInitialFocus: () => void;
};

const DropdownMenuContext = createContext<DropdownMenuContextValue | null>(null);

const useDropdownMenu = (): DropdownMenuContextValue => {
  const context = useContext(DropdownMenuContext);
  if (!context) {
    throw new Error('DropdownMenu components must be used within DropdownMenu');
  }
  return context;
};

const getEnabledMenuItems = (content: HTMLDivElement | null): HTMLElement[] => {
  if (!content) {
    return [];
  }
  return Array.from(
    content.querySelectorAll(
      '[role="menuitem"]:not([aria-disabled="true"]), [role="menuitemradio"]:not([aria-disabled="true"]), [role="menuitemcheckbox"]:not([aria-disabled="true"])'
    )
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

export interface DropdownMenuProps {
  children: ReactNode;
}

export const DropdownMenu = ({ children }: DropdownMenuProps) => {
  const [open, setOpen] = useState(false);
  const [initialFocusRequested, setInitialFocusRequested] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const requestInitialFocus = useCallback(() => {
    setInitialFocusRequested(true);
  }, []);

  const clearInitialFocus = useCallback(() => {
    setInitialFocusRequested(false);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setInitialFocusRequested(false);
    triggerRef.current?.focus();
  }, []);

  const value = useMemo(
    () => ({
      open,
      setOpen,
      triggerRef,
      contentRef,
      close,
      initialFocusRequested,
      requestInitialFocus,
      clearInitialFocus,
    }),
    [open, close, initialFocusRequested, requestInitialFocus, clearInitialFocus]
  );

  return (
    <DropdownMenuContext.Provider value={value}>
      <div className={styles.dropdownMenu} data-slot="dropdown-menu">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
};

export type DropdownMenuTriggerProps = HTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
};

export const DropdownMenuTrigger = forwardRef<HTMLElement, DropdownMenuTriggerProps>(
  ({ asChild = false, className = '', children, onClick, onKeyDown, ...props }, ref) => {
    const { open, setOpen, triggerRef, clearInitialFocus, requestInitialFocus } = useDropdownMenu();

    const handleClick = (e: MouseEvent<HTMLElement>) => {
      onClick?.(e as MouseEvent<HTMLButtonElement>);
      if (!e.defaultPrevented) {
        clearInitialFocus();
        setOpen(!open);
      }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
      onKeyDown?.(e as KeyboardEvent<HTMLButtonElement>);
      if (e.defaultPrevented) {
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        requestInitialFocus();
        if (!open) {
          setOpen(true);
        }
      }
    };

    if (asChild && isValidElement(children)) {
      const child = children as ReactElement<{
        className?: string;
        onClick?: (e: MouseEvent<HTMLElement>) => void;
        onKeyDown?: (e: KeyboardEvent<HTMLElement>) => void;
        ref?: RefObject<HTMLElement | null>;
      }>;
      const childRef = child.props.ref;
      const mergedRef = (node: HTMLElement | null) => {
        composeRefs(ref, triggerRef, childRef)(node);
      };
      // eslint-disable-next-line react-hooks/refs -- asChild ref merge runs on commit, not during render
      return cloneElement(child, {
        ...props,
        ref: mergedRef,
        className: `${styles.dropdownMenuTrigger} ${child.props.className ?? ''} ${className}`.trim(),
        'aria-expanded': open,
        'aria-haspopup': 'menu',
        'data-slot': 'dropdown-menu-trigger',
        onClick: (e: MouseEvent<HTMLElement>) => {
          child.props.onClick?.(e);
          handleClick(e);
        },
        onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
          child.props.onKeyDown?.(e);
          handleKeyDown(e);
        },
      } as Record<string, unknown>);
    }

    return (
      <button
        ref={composeRefs(ref as RefObject<HTMLButtonElement>, triggerRef as RefObject<HTMLButtonElement>)}
        type="button"
        className={`${styles.dropdownMenuTrigger} ${className}`}
        aria-expanded={open}
        aria-haspopup="menu"
        data-slot="dropdown-menu-trigger"
        onClick={handleClick as (e: MouseEvent<HTMLButtonElement>) => void}
        onKeyDown={handleKeyDown as (e: KeyboardEvent<HTMLButtonElement>) => void}
        {...props}
      >
        {children}
      </button>
    );
  }
);

DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';

export interface DropdownMenuContentProps extends HTMLAttributes<HTMLDivElement> {
  align?: FloatingAlign;
  side?: FloatingSide;
  sideOffset?: number;
}

export const DropdownMenuContent = forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  (
    {
      className = '',
      align = 'end',
      side = 'bottom',
      sideOffset = 4,
      children,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const { open, triggerRef, contentRef, close, initialFocusRequested, clearInitialFocus } =
      useDropdownMenu();

    const { style, isPositioned, floatingProps } = useFloatingPosition({
      anchorRef: triggerRef,
      floatingRef: contentRef,
      open,
      side,
      align,
      sideOffset,
    });

    useInitialMenuFocus({
      open: open && initialFocusRequested,
      isPositioned,
      containerRef: contentRef,
    });

    useEffect(() => {
      if (open && initialFocusRequested && isPositioned) {
        queueMicrotask(() => {
          clearInitialFocus();
        });
      }
    }, [open, initialFocusRequested, isPositioned, clearInitialFocus]);

    useDismissLayer({
      open,
      onDismiss: close,
      contentRef,
      excludeRefs: [triggerRef],
      dismissOnEscape: true,
      dismissOnOutsidePointer: true,
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
          role="menu"
          data-slot="dropdown-menu-content"
          className={`${styles.dropdownMenuContent} ${className}`}
          style={style}
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

DropdownMenuContent.displayName = 'DropdownMenuContent';

export interface DropdownMenuItemProps extends HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
}

export const DropdownMenuItem = forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  ({ className = '', disabled, onClick, onKeyDown, children, ...props }, ref) => {
    const { close } = useDropdownMenu();

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
        aria-disabled={disabled || undefined}
        data-slot="dropdown-menu-item"
        className={`${styles.dropdownMenuItem} ${disabled ? styles.disabled : ''} ${className}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </div>
    );
  }
);

DropdownMenuItem.displayName = 'DropdownMenuItem';

export const DropdownMenuSeparator = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      role="separator"
      data-slot="dropdown-menu-separator"
      className={`${styles.dropdownMenuSeparator} ${className}`}
      {...props}
    />
  )
);

DropdownMenuSeparator.displayName = 'DropdownMenuSeparator';

export const DropdownMenuLabel = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      role="presentation"
      data-slot="dropdown-menu-label"
      className={`${styles.dropdownMenuLabel} ${className}`}
      {...props}
    />
  )
);

DropdownMenuLabel.displayName = 'DropdownMenuLabel';
