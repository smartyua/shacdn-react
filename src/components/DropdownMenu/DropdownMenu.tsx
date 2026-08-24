import { Check, ChevronRight } from 'lucide-react';
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
  excludeRefs: Array<RefObject<HTMLElement | null>>;
  registerExcludeRef: (ref: RefObject<HTMLElement | null>) => () => void;
};

const DropdownMenuContext = createContext<DropdownMenuContextValue | null>(null);

const useDropdownMenu = (): DropdownMenuContextValue => {
  const context = useContext(DropdownMenuContext);
  if (!context) {
    throw new Error('DropdownMenu components must be used within DropdownMenu');
  }
  return context;
};

const MENU_ITEM_SELECTOR =
  '[role="menuitem"]:not([aria-disabled="true"]), [role="menuitemradio"]:not([aria-disabled="true"]), [role="menuitemcheckbox"]:not([aria-disabled="true"])';

const getEnabledMenuItems = (content: HTMLDivElement | null): HTMLElement[] => {
  if (!content) {
    return [];
  }
  return Array.from(content.querySelectorAll(MENU_ITEM_SELECTOR)).filter(
    item => item.closest('[role="menu"]') === content
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
  const [excludeRefs, setExcludeRefs] = useState<Array<RefObject<HTMLElement | null>>>([]);
  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const requestInitialFocus = useCallback(() => {
    setInitialFocusRequested(true);
  }, []);

  const clearInitialFocus = useCallback(() => {
    setInitialFocusRequested(false);
  }, []);

  const registerExcludeRef = useCallback((ref: RefObject<HTMLElement | null>) => {
    setExcludeRefs(prev => (prev.includes(ref) ? prev : [...prev, ref]));
    return () => {
      setExcludeRefs(prev => prev.filter(entry => entry !== ref));
    };
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
      excludeRefs,
      registerExcludeRef,
    }),
    [
      open,
      close,
      initialFocusRequested,
      requestInitialFocus,
      clearInitialFocus,
      excludeRefs,
      registerExcludeRef,
    ]
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
    const {
      open,
      triggerRef,
      contentRef,
      close,
      initialFocusRequested,
      clearInitialFocus,
      excludeRefs,
    } = useDropdownMenu();

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
      excludeRefs: [triggerRef, ...excludeRefs],
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
  inset?: boolean;
}

export const DropdownMenuItem = forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  ({ className = '', disabled, inset, onClick, onKeyDown, children, ...props }, ref) => {
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
        data-inset={inset || undefined}
        className={`${styles.dropdownMenuItem} ${inset ? styles.inset : ''} ${disabled ? styles.disabled : ''} ${className}`}
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

const activateOnKey = (e: KeyboardEvent<HTMLDivElement>, disabled?: boolean): void => {
  if (e.defaultPrevented || disabled) {
    return;
  }
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    e.currentTarget.click();
  }
};

export const DropdownMenuGroup = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      role="group"
      data-slot="dropdown-menu-group"
      className={`${styles.dropdownMenuGroup} ${className}`}
      {...props}
    />
  )
);

DropdownMenuGroup.displayName = 'DropdownMenuGroup';

export const DropdownMenuShortcut = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  ({ className = '', ...props }, ref) => (
    <span
      ref={ref}
      data-slot="dropdown-menu-shortcut"
      className={`${styles.dropdownMenuShortcut} ${className}`}
      {...props}
    />
  )
);

DropdownMenuShortcut.displayName = 'DropdownMenuShortcut';

export interface DropdownMenuCheckboxItemProps extends HTMLAttributes<HTMLDivElement> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export const DropdownMenuCheckboxItem = forwardRef<HTMLDivElement, DropdownMenuCheckboxItemProps>(
  (
    {
      className = '',
      checked: checkedControlled,
      defaultChecked = false,
      onCheckedChange,
      disabled,
      onClick,
      onKeyDown,
      children,
      ...props
    },
    ref
  ) => {
    const [internal, setInternal] = useState(defaultChecked);
    const checked = checkedControlled ?? internal;

    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
      if (disabled) {
        return;
      }
      onClick?.(e);
      if (e.defaultPrevented) {
        return;
      }
      const next = !checked;
      if (checkedControlled === undefined) {
        setInternal(next);
      }
      onCheckedChange?.(next);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(e);
      activateOnKey(e, disabled);
    };

    return (
      <div
        ref={ref}
        role="menuitemcheckbox"
        tabIndex={-1}
        aria-checked={checked}
        aria-disabled={disabled || undefined}
        data-slot="dropdown-menu-checkbox-item"
        data-state={checked ? 'checked' : 'unchecked'}
        className={`${styles.dropdownMenuItem} ${styles.indicatored} ${disabled ? styles.disabled : ''} ${className}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...props}
      >
        <span className={styles.itemIndicator} aria-hidden>
          {checked ? <Check size={14} strokeWidth={2} /> : null}
        </span>
        {children}
      </div>
    );
  }
);

DropdownMenuCheckboxItem.displayName = 'DropdownMenuCheckboxItem';

type DropdownMenuRadioGroupContextValue = {
  value: string;
  onValueChange: (value: string) => void;
};

const DropdownMenuRadioGroupContext = createContext<DropdownMenuRadioGroupContextValue | null>(
  null
);

const useDropdownMenuRadioGroup = (): DropdownMenuRadioGroupContextValue => {
  const context = useContext(DropdownMenuRadioGroupContext);
  if (!context) {
    throw new Error('DropdownMenuRadioItem must be used within DropdownMenuRadioGroup');
  }
  return context;
};

export interface DropdownMenuRadioGroupProps extends HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export const DropdownMenuRadioGroup = forwardRef<HTMLDivElement, DropdownMenuRadioGroupProps>(
  (
    {
      className = '',
      value: valueControlled,
      defaultValue = '',
      onValueChange,
      children,
      ...props
    },
    ref
  ) => {
    const [internal, setInternal] = useState(defaultValue);
    const value = valueControlled ?? internal;

    const handleValueChange = useCallback(
      (next: string) => {
        if (valueControlled === undefined) {
          setInternal(next);
        }
        onValueChange?.(next);
      },
      [onValueChange, valueControlled]
    );

    const contextValue = useMemo(
      () => ({ value, onValueChange: handleValueChange }),
      [value, handleValueChange]
    );

    return (
      <DropdownMenuRadioGroupContext.Provider value={contextValue}>
        <div
          ref={ref}
          role="group"
          data-slot="dropdown-menu-radio-group"
          className={`${styles.dropdownMenuGroup} ${className}`}
          {...props}
        >
          {children}
        </div>
      </DropdownMenuRadioGroupContext.Provider>
    );
  }
);

DropdownMenuRadioGroup.displayName = 'DropdownMenuRadioGroup';

export interface DropdownMenuRadioItemProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean;
}

export const DropdownMenuRadioItem = forwardRef<HTMLDivElement, DropdownMenuRadioItemProps>(
  ({ className = '', value, disabled, onClick, onKeyDown, children, ...props }, ref) => {
    const { value: selected, onValueChange } = useDropdownMenuRadioGroup();
    const checked = selected === value;

    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
      if (disabled) {
        return;
      }
      onClick?.(e);
      if (!e.defaultPrevented) {
        onValueChange(value);
      }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(e);
      activateOnKey(e, disabled);
    };

    return (
      <div
        ref={ref}
        role="menuitemradio"
        tabIndex={-1}
        aria-checked={checked}
        aria-disabled={disabled || undefined}
        data-slot="dropdown-menu-radio-item"
        data-state={checked ? 'checked' : 'unchecked'}
        className={`${styles.dropdownMenuItem} ${styles.indicatored} ${disabled ? styles.disabled : ''} ${className}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...props}
      >
        <span className={styles.itemIndicator} aria-hidden>
          {checked ? <span className={styles.radioDot} /> : null}
        </span>
        {children}
      </div>
    );
  }
);

DropdownMenuRadioItem.displayName = 'DropdownMenuRadioItem';

type DropdownMenuSubContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: RefObject<HTMLElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
  scheduleOpen: () => void;
  scheduleClose: () => void;
  clearTimers: () => void;
};

const DropdownMenuSubContext = createContext<DropdownMenuSubContextValue | null>(null);

const useDropdownMenuSub = (): DropdownMenuSubContextValue => {
  const context = useContext(DropdownMenuSubContext);
  if (!context) {
    throw new Error('DropdownMenuSub parts must be used within DropdownMenuSub');
  }
  return context;
};

const SUB_CLOSE_DELAY = 80;

export interface DropdownMenuSubProps {
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const DropdownMenuSub = ({
  children,
  open: openControlled,
  defaultOpen = false,
  onOpenChange,
}: DropdownMenuSubProps) => {
  const [internal, setInternal] = useState(defaultOpen);
  const open = openControlled ?? internal;
  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const setOpen = useCallback(
    (next: boolean) => {
      if (openControlled === undefined) {
        setInternal(next);
      }
      onOpenChange?.(next);
    },
    [onOpenChange, openControlled]
  );

  const scheduleOpen = useCallback(() => {
    clearTimers();
    setOpen(true);
  }, [clearTimers, setOpen]);

  const scheduleClose = useCallback(() => {
    clearTimers();
    closeTimer.current = setTimeout(() => setOpen(false), SUB_CLOSE_DELAY);
  }, [clearTimers, setOpen]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const value = useMemo(
    () => ({
      open,
      setOpen,
      triggerRef,
      contentRef,
      scheduleOpen,
      scheduleClose,
      clearTimers,
    }),
    [open, setOpen, scheduleOpen, scheduleClose, clearTimers]
  );

  return (
    <DropdownMenuSubContext.Provider value={value}>
      <div className={styles.dropdownMenuSub} data-slot="dropdown-menu-sub">
        {children}
      </div>
    </DropdownMenuSubContext.Provider>
  );
};

export interface DropdownMenuSubTriggerProps extends HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
  inset?: boolean;
}

export const DropdownMenuSubTrigger = forwardRef<HTMLDivElement, DropdownMenuSubTriggerProps>(
  (
    { className = '', disabled, inset, onClick, onKeyDown, onPointerEnter, onPointerLeave, children, ...props },
    ref
  ) => {
    const { open, setOpen, triggerRef, scheduleOpen, scheduleClose } = useDropdownMenuSub();

    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
      if (disabled) {
        return;
      }
      onClick?.(e);
      if (!e.defaultPrevented) {
        setOpen(true);
      }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented || disabled) {
        return;
      }
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
        e.preventDefault();
        setOpen(true);
      }
    };

    return (
      <div
        ref={composeRefs(ref, triggerRef)}
        role="menuitem"
        tabIndex={-1}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-disabled={disabled || undefined}
        data-slot="dropdown-menu-sub-trigger"
        data-state={open ? 'open' : 'closed'}
        data-inset={inset || undefined}
        className={`${styles.dropdownMenuItem} ${styles.subTrigger} ${inset ? styles.inset : ''} ${disabled ? styles.disabled : ''} ${className}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onPointerEnter={e => {
          onPointerEnter?.(e);
          if (!disabled) {
            scheduleOpen();
          }
        }}
        onPointerLeave={e => {
          onPointerLeave?.(e);
          if (!disabled) {
            scheduleClose();
          }
        }}
        {...props}
      >
        {children}
        <ChevronRight size={14} strokeWidth={2} className={styles.subChevron} aria-hidden />
      </div>
    );
  }
);

DropdownMenuSubTrigger.displayName = 'DropdownMenuSubTrigger';

export interface DropdownMenuSubContentProps extends HTMLAttributes<HTMLDivElement> {
  sideOffset?: number;
}

export const DropdownMenuSubContent = forwardRef<HTMLDivElement, DropdownMenuSubContentProps>(
  (
    {
      className = '',
      sideOffset = 2,
      children,
      onKeyDown,
      onPointerEnter,
      onPointerLeave,
      ...props
    },
    ref
  ) => {
    const { open, setOpen, triggerRef, contentRef, scheduleOpen, scheduleClose } =
      useDropdownMenuSub();
    const { registerExcludeRef } = useDropdownMenu();

    const { style, isPositioned, floatingProps } = useFloatingPosition({
      anchorRef: triggerRef,
      floatingRef: contentRef,
      open,
      side: 'right',
      align: 'start',
      sideOffset,
    });

    useInitialMenuFocus({
      open,
      isPositioned,
      containerRef: contentRef,
    });

    useEffect(() => registerExcludeRef(contentRef), [registerExcludeRef, contentRef]);

    useEffect(() => {
      if (!open) {
        return;
      }

      const onDocumentKeyDown = (event: globalThis.KeyboardEvent) => {
        if (event.key !== 'Escape') {
          return;
        }
        event.preventDefault();
        event.stopImmediatePropagation();
        setOpen(false);
        triggerRef.current?.focus();
      };

      document.addEventListener('keydown', onDocumentKeyDown, true);
      return () => document.removeEventListener('keydown', onDocumentKeyDown, true);
    }, [open, setOpen, triggerRef]);

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented) {
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
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
          data-slot="dropdown-menu-sub-content"
          className={`${styles.dropdownMenuContent} ${styles.dropdownMenuSubContent} ${className}`}
          style={style}
          onKeyDown={handleKeyDown}
          onPointerEnter={e => {
            onPointerEnter?.(e);
            scheduleOpen();
          }}
          onPointerLeave={e => {
            onPointerLeave?.(e);
            scheduleClose();
          }}
          {...floatingProps}
          {...props}
        >
          {children}
        </div>
      </FloatingPortal>
    );
  }
);

DropdownMenuSubContent.displayName = 'DropdownMenuSubContent';

export interface DropdownMenuPortalProps {
  children: ReactNode;
}

export const DropdownMenuPortal = ({ children }: DropdownMenuPortalProps) => <>{children}</>;

