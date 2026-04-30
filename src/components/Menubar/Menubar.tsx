import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import styles from './Menubar.module.scss';

type MenuCtx = { openId: string | null; setOpenId: (id: string | null) => void };
const MenuCtx = createContext<MenuCtx | null>(null);

function useMenuCtx(): MenuCtx {
  const c = useContext(MenuCtx);
  if (!c) {
    throw new Error('Menubar parts must be within Menubar');
  }
  return c;
}

export interface MenubarProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Menubar({ className = '', children, ...props }: MenubarProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const value = useMemo(() => ({ openId, setOpenId }), [openId]);

  const rootRef = useRef<HTMLDivElement>(null);
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
    <MenuCtx.Provider value={value}>
      <div ref={rootRef} role="menubar" className={`${styles.menubar} ${className}`} {...props}>
        {children}
      </div>
    </MenuCtx.Provider>
  );
}

export interface MenubarMenuProps extends HTMLAttributes<HTMLDivElement> {
  menuId: string;
}

export function MenubarMenu({ menuId, className = '', children, ...props }: MenubarMenuProps) {
  return (
    <div className={`${styles.menu} ${className}`} data-menu-id={menuId} {...props}>
      {children}
    </div>
  );
}

export interface MenubarTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  menuId: string;
}

export function MenubarTrigger({ menuId, className = '', children, ...props }: MenubarTriggerProps) {
  const { openId, setOpenId } = useMenuCtx();
  const open = openId === menuId;
  return (
    <button
      type="button"
      role="menuitem"
      aria-haspopup="true"
      aria-expanded={open}
      className={`${styles.trigger} ${className}`}
      onClick={() => setOpenId(open ? null : menuId)}
      {...props}
    >
      {children}
    </button>
  );
}

export interface MenubarContentProps extends HTMLAttributes<HTMLDivElement> {
  menuId: string;
}

export function MenubarContent({ menuId, className = '', children, ...props }: MenubarContentProps) {
  const { openId } = useMenuCtx();
  if (openId !== menuId) {
    return null;
  }
  return (
    <div role="menu" className={`${styles.content} ${className}`} {...props}>
      {children}
    </div>
  );
}

export function MenubarItem({ className = '', children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div role="menuitem" className={`${styles.item} ${className}`} tabIndex={-1} {...props}>
      {children}
    </div>
  );
}

export function MenubarSeparator({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`${styles.separator} ${className}`} role="separator" {...props} />;
}
