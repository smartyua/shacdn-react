import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import styles from './NavigationMenu.module.scss';

type NavCtx = { openId: string | null; setOpenId: (id: string | null) => void };

const NavContext = createContext<NavCtx | null>(null);

const useNavContext = (): NavCtx => {
  const ctx = useContext(NavContext);
  if (!ctx) {
    throw new Error('NavigationMenu parts must be used within NavigationMenu');
  }
  return ctx;
};

export interface NavigationMenuProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
}

export const NavigationMenu = ({ className = '', children, ...props }: NavigationMenuProps) => {
  const [openId, setOpenId] = useState<string | null>(null);
  const value = useMemo(() => ({ openId, setOpenId }), [openId]);
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!openId) return;
    const close = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpenId(null);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [openId]);

  return (
    <NavContext.Provider value={value}>
      <nav
        ref={rootRef}
        className={`${styles.root} ${className}`}
        aria-label="Main"
        {...props}
      >
        {children}
      </nav>
    </NavContext.Provider>
  );
};

NavigationMenu.displayName = 'NavigationMenu';

export const NavigationMenuList = ({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLUListElement>) => (
  <ul className={`${styles.list} ${className}`} {...props}>
    {children}
  </ul>
);

NavigationMenuList.displayName = 'NavigationMenuList';

export const NavigationMenuItem = ({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLLIElement>) => (
  <li className={`${styles.item} ${className}`} {...props}>
    {children}
  </li>
);

NavigationMenuItem.displayName = 'NavigationMenuItem';

export interface NavigationMenuTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  menuId: string;
}

export const NavigationMenuTrigger = ({
  menuId,
  className = '',
  children,
  ...props
}: NavigationMenuTriggerProps) => {
  const { openId, setOpenId } = useNavContext();
  const open = openId === menuId;

  return (
    <button
      type="button"
      className={`${styles.trigger} ${className}`}
      data-state={open ? 'open' : 'closed'}
      aria-expanded={open}
      aria-haspopup="true"
      onClick={() => setOpenId(open ? null : menuId)}
      {...props}
    >
      {children}
    </button>
  );
};

NavigationMenuTrigger.displayName = 'NavigationMenuTrigger';

export interface NavigationMenuContentProps extends HTMLAttributes<HTMLDivElement> {
  menuId: string;
}

export const NavigationMenuContent = ({
  menuId,
  className = '',
  children,
  ...props
}: NavigationMenuContentProps) => {
  const { openId } = useNavContext();
  if (openId !== menuId) return null;

  return (
    <div className={`${styles.content} ${className}`} role="menu" {...props}>
      <div className={styles.contentInner}>{children}</div>
    </div>
  );
};

NavigationMenuContent.displayName = 'NavigationMenuContent';

export const NavigationMenuLink = ({
  className = '',
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <a className={`${styles.link} ${className}`} {...props}>
    {children}
  </a>
);

NavigationMenuLink.displayName = 'NavigationMenuLink';

export const NavigationMenuContentLink = ({
  className = '',
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <a className={`${styles.contentLink} ${className}`} role="menuitem" {...props}>
    {children}
  </a>
);

NavigationMenuContentLink.displayName = 'NavigationMenuContentLink';

export const NavigationMenuIndicator = ({
  className = '',
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={`${styles.indicator} ${className}`} aria-hidden {...props} />
);

NavigationMenuIndicator.displayName = 'NavigationMenuIndicator';
