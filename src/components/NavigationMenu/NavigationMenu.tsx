import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type AnchorHTMLAttributes,
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
import styles from './NavigationMenu.module.scss';

type NavContextValue = {
  openId: string | null;
  setOpenId: (id: string | null) => void;
  registerTrigger: (menuId: string, node: HTMLElement | null) => void;
  getTriggerRef: (menuId: string) => RefObject<HTMLElement | null>;
  close: () => void;
};

const NavContext = createContext<NavContextValue | null>(null);

const useNavContext = (): NavContextValue => {
  const ctx = useContext(NavContext);
  if (!ctx) {
    throw new Error('NavigationMenu parts must be used within NavigationMenu');
  }
  return ctx;
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

const getNavTriggers = (root: HTMLElement | null): HTMLButtonElement[] => {
  if (!root) {
    return [];
  }
  return Array.from(root.querySelectorAll('[data-nav-trigger]')) as HTMLButtonElement[];
};

export interface NavigationMenuProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
}

export const NavigationMenu = ({ className = '', children, ...props }: NavigationMenuProps) => {
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
    <NavContext.Provider value={value}>
      <nav className={`${styles.root} ${className}`} aria-label="Main" {...props}>
        {children}
      </nav>
    </NavContext.Provider>
  );
};

NavigationMenu.displayName = 'NavigationMenu';

export const NavigationMenuList = forwardRef<HTMLUListElement, HTMLAttributes<HTMLUListElement>>(
  ({ className = '', children, ...props }, ref) => (
    <ul ref={ref} className={`${styles.list} ${className}`} {...props}>
      {children}
    </ul>
  )
);

NavigationMenuList.displayName = 'NavigationMenuList';

export const NavigationMenuItem = forwardRef<HTMLLIElement, HTMLAttributes<HTMLLIElement>>(
  ({ className = '', children, ...props }, ref) => (
    <li ref={ref} className={`${styles.item} ${className}`} {...props}>
      {children}
    </li>
  )
);

NavigationMenuItem.displayName = 'NavigationMenuItem';

export interface NavigationMenuTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  menuId: string;
}

export const NavigationMenuTrigger = forwardRef<HTMLButtonElement, NavigationMenuTriggerProps>(
  ({ menuId, className = '', children, onClick, onKeyDown, ...props }, ref) => {
    const { openId, setOpenId, registerTrigger } = useNavContext();
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

      const root = e.currentTarget.closest('nav') as HTMLElement | null;
      const triggers = getNavTriggers(root);
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
        className={`${styles.trigger} ${className}`}
        data-state={open ? 'open' : 'closed'}
        data-nav-trigger
        aria-expanded={open}
        aria-haspopup="true"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </button>
    );
  }
);

NavigationMenuTrigger.displayName = 'NavigationMenuTrigger';

export interface NavigationMenuContentProps extends HTMLAttributes<HTMLDivElement> {
  menuId: string;
  align?: FloatingAlign;
  side?: FloatingSide;
  sideOffset?: number;
}

export const NavigationMenuContent = forwardRef<HTMLDivElement, NavigationMenuContentProps>(
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
    const { openId, getTriggerRef, close } = useNavContext();
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
      const root = anchorRef.current?.closest('nav') as HTMLElement | null;
      const triggers = getNavTriggers(root);
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
          className={`${styles.content} ${className}`}
          role="menu"
          style={style}
          onKeyDown={handleKeyDown}
          {...floatingProps}
          {...props}
        >
          <div className={styles.contentInner}>{children}</div>
        </div>
      </FloatingPortal>
    );
  }
);

NavigationMenuContent.displayName = 'NavigationMenuContent';

export const NavigationMenuLink = forwardRef<
  HTMLAnchorElement,
  AnchorHTMLAttributes<HTMLAnchorElement>
>(({ className = '', children, ...props }, ref) => (
  <a ref={ref} className={`${styles.link} ${className}`} {...props}>
    {children}
  </a>
));

NavigationMenuLink.displayName = 'NavigationMenuLink';

export const NavigationMenuContentLink = forwardRef<
  HTMLAnchorElement,
  AnchorHTMLAttributes<HTMLAnchorElement>
>(({ className = '', children, onClick, ...props }, ref) => {
  const { close } = useNavContext();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (!e.defaultPrevented) {
      close();
    }
  };

  return (
    <a
      ref={ref}
      className={`${styles.contentLink} ${className}`}
      role="menuitem"
      tabIndex={-1}
      onClick={handleClick}
      {...props}
    >
      {children}
    </a>
  );
});

NavigationMenuContentLink.displayName = 'NavigationMenuContentLink';

export const NavigationMenuIndicator = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={`${styles.indicator} ${className}`} aria-hidden {...props} />
  )
);

NavigationMenuIndicator.displayName = 'NavigationMenuIndicator';
