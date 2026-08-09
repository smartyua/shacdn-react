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
  type FloatingAlign,
  type FloatingSide,
} from '../Floating/Floating';
import styles from './Menubar.module.scss';

type MenubarContextValue = {
  openId: string | null;
  setOpenId: (id: string | null) => void;
  registerTrigger: (menuId: string, node: HTMLElement | null) => void;
  getTriggerRef: (menuId: string) => RefObject<HTMLElement | null>;
  close: () => void;
};

const MenubarContext = createContext<MenubarContextValue | null>(null);

const useMenubar = (): MenubarContextValue => {
  const context = useContext(MenubarContext);
  if (!context) {
    throw new Error('Menubar parts must be within Menubar');
  }
  return context;
};

const getEnabledMenuItems = (content: HTMLDivElement | null): HTMLElement[] => {
  if (!content) {
    return [];
  }
  return Array.from(content.querySelectorAll('[role="menuitem"]')) as HTMLElement[];
};

const focusMenuItem = (content: HTMLDivElement | null, index: number): void => {
  const items = getEnabledMenuItems(content);
  if (items.length === 0) {
    return;
  }
  const normalized = ((index % items.length) + items.length) % items.length;
  items[normalized]?.focus();
};

const getMenubarTriggers = (root: HTMLElement | null): HTMLButtonElement[] => {
  if (!root) {
    return [];
  }
  return Array.from(root.querySelectorAll('[data-menubar-trigger]')) as HTMLButtonElement[];
};

export interface MenubarProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const Menubar = ({ className = '', children, ...props }: MenubarProps) => {
  const [openId, setOpenId] = useState<string | null>(null);
  const triggerNodes = useRef<Map<string, HTMLElement | null>>(new Map());

  const registerTrigger = useCallback((menuId: string, node: HTMLElement | null) => {
    if (node) {
      triggerNodes.current.set(menuId, node);
    } else {
      triggerNodes.current.delete(menuId);
    }
  }, []);

  const getTriggerRef = useCallback(
    (menuId: string): RefObject<HTMLElement | null> => ({
      get current() {
        return triggerNodes.current.get(menuId) ?? null;
      },
    }),
    []
  );

  const close = useCallback(() => {
    setOpenId(currentOpenId => {
      if (currentOpenId) {
        triggerNodes.current.get(currentOpenId)?.focus();
      }
      return null;
    });
  }, []);

  const value = useMemo(
    () => ({ openId, setOpenId, registerTrigger, getTriggerRef, close }),
    [openId, registerTrigger, getTriggerRef, close]
  );

  return (
    <MenubarContext.Provider value={value}>
      <div role="menubar" className={`${styles.menubar} ${className}`} {...props}>
        {children}
      </div>
    </MenubarContext.Provider>
  );
};

export interface MenubarMenuProps extends HTMLAttributes<HTMLDivElement> {
  menuId: string;
}

export const MenubarMenu = ({ menuId, className = '', children, ...props }: MenubarMenuProps) => (
  <div className={`${styles.menu} ${className}`} data-menu-id={menuId} {...props}>
    {children}
  </div>
);

export interface MenubarTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  menuId: string;
}

export const MenubarTrigger = forwardRef<HTMLButtonElement, MenubarTriggerProps>(
  ({ menuId, className = '', children, onClick, onKeyDown, ...props }, ref) => {
    const { openId, setOpenId, registerTrigger } = useMenubar();
    const open = openId === menuId;

    const setTriggerRef = useCallback(
      (node: HTMLButtonElement | null) => {
        registerTrigger(menuId, node);
      },
      [menuId, registerTrigger]
    );

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      if (!e.defaultPrevented) {
        setOpenId(open ? null : menuId);
      }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented) {
        return;
      }

      const root = e.currentTarget.closest('[role="menubar"]') as HTMLElement | null;
      const triggers = getMenubarTriggers(root);
      const currentIndex = triggers.findIndex(trigger => trigger === e.currentTarget);

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          triggers[(currentIndex + 1) % triggers.length]?.focus();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          triggers[(currentIndex - 1 + triggers.length) % triggers.length]?.focus();
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (!open) {
            setOpenId(menuId);
          }
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          setOpenId(open ? null : menuId);
          break;
        default:
          break;
      }
    };

    return (
      <button
        ref={composeRefs(ref, setTriggerRef)}
        type="button"
        role="menuitem"
        aria-haspopup="true"
        aria-expanded={open}
        data-menubar-trigger
        className={`${styles.trigger} ${className}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </button>
    );
  }
);

MenubarTrigger.displayName = 'MenubarTrigger';

export interface MenubarContentProps extends HTMLAttributes<HTMLDivElement> {
  menuId: string;
  align?: FloatingAlign;
  side?: FloatingSide;
  sideOffset?: number;
}

export const MenubarContent = forwardRef<HTMLDivElement, MenubarContentProps>(
  (
    {
      menuId,
      className = '',
      align = 'start',
      side = 'bottom',
      sideOffset = 4,
      children,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const { openId, getTriggerRef, close } = useMenubar();
    const contentRef = useRef<HTMLDivElement | null>(null);
    const anchorRef = useMemo(() => getTriggerRef(menuId), [getTriggerRef, menuId]);
    const open = openId === menuId;

    const { style, floatingProps, isPositioned } = useFloatingPosition({
      anchorRef,
      floatingRef: contentRef,
      open,
      side,
      align,
      sideOffset,
    });

    useDismissLayer({
      open,
      onDismiss: close,
      contentRef,
      excludeRefs: [anchorRef],
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
      const root = anchorRef.current?.closest('[role="menubar"]') as HTMLElement | null;
      const triggers = getMenubarTriggers(root);
      const triggerIndex = triggers.findIndex(trigger => trigger === anchorRef.current);

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
        case 'ArrowRight':
          e.preventDefault();
          close();
          triggers[(triggerIndex + 1) % triggers.length]?.click();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          close();
          triggers[(triggerIndex - 1 + triggers.length) % triggers.length]?.click();
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
          data-menubar-content={menuId}
          className={`${styles.content} ${className}`}
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

MenubarContent.displayName = 'MenubarContent';

export const MenubarItem = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', onClick, onKeyDown, children, ...props }, ref) => {
    const { close } = useMenubar();

    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
      onClick?.(e);
      if (!e.defaultPrevented) {
        close();
      }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented) {
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
        className={`${styles.item} ${className}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </div>
    );
  }
);

MenubarItem.displayName = 'MenubarItem';

export const MenubarSeparator = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={`${styles.separator} ${className}`} role="separator" {...props} />
  )
);

MenubarSeparator.displayName = 'MenubarSeparator';
