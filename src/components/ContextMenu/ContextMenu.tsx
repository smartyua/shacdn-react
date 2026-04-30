import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react';
import styles from './ContextMenu.module.scss';

type Ctx = {
  open: boolean;
  setOpen: (v: boolean) => void;
  point: { x: number; y: number };
  setPoint: (p: { x: number; y: number }) => void;
};

const ContextMenuContext = createContext<Ctx | null>(null);

function useCtx(): Ctx {
  const c = useContext(ContextMenuContext);
  if (!c) {
    throw new Error('ContextMenu components must be used together');
  }
  return c;
}

export interface ContextMenuProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function ContextMenu({ className = '', children, ...props }: ContextMenuProps) {
  const [open, setOpen] = useState(false);
  const [point, setPoint] = useState({ x: 0, y: 0 });
  const value = useMemo(() => ({ open, setOpen, point, setPoint }), [open, point]);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    let clickAttached = false;
    const attachClick = () => {
      document.addEventListener('click', close);
      clickAttached = true;
    };
    const t = window.setTimeout(attachClick, 0);
    document.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(t);
      if (clickAttached) {
        document.removeEventListener('click', close);
      }
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <ContextMenuContext.Provider value={value}>
      <div className={`${styles.wrapper} ${className}`} {...props}>
        {children}
      </div>
    </ContextMenuContext.Provider>
  );
}

export type ContextMenuTriggerProps = HTMLAttributes<HTMLDivElement>;

export function ContextMenuTrigger({ className = '', children, onContextMenu, ...props }: ContextMenuTriggerProps) {
  const { setOpen, setPoint } = useCtx();

  const handleContextMenu = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      onContextMenu?.(e);
      if (e.defaultPrevented) return;
      e.preventDefault();
      setPoint({ x: e.clientX, y: e.clientY });
      setOpen(true);
    },
    [onContextMenu, setOpen, setPoint]
  );

  return (
    <div className={`${styles.trigger} ${className}`} onContextMenu={handleContextMenu} {...props}>
      {children}
    </div>
  );
}

export type ContextMenuContentProps = HTMLAttributes<HTMLDivElement>;

export function ContextMenuContent({ className = '', children, ...props }: ContextMenuContentProps) {
  const { open, point } = useCtx();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !ref.current) return;
    const el = ref.current;
    const rect = el.getBoundingClientRect();
    let x = point.x;
    let y = point.y;
    if (x + rect.width > window.innerWidth) {
      x = window.innerWidth - rect.width - 8;
    }
    if (y + rect.height > window.innerHeight) {
      y = window.innerHeight - rect.height - 8;
    }
    el.style.left = `${Math.max(8, x)}px`;
    el.style.top = `${Math.max(8, y)}px`;
  }, [open, point]);

  if (!open) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={`${styles.content} ${className}`}
      role="menu"
      onClick={e => e.stopPropagation()}
      {...props}
    >
      {children}
    </div>
  );
}

export interface ContextMenuItemProps extends HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
}

export function ContextMenuItem({
  className = '',
  disabled,
  children,
  onClick,
  ...props
}: ContextMenuItemProps) {
  const { setOpen } = useCtx();
  return (
    <div
      role="menuitem"
      tabIndex={-1}
      className={`${styles.item} ${disabled ? styles.itemDisabled : ''} ${className}`}
      aria-disabled={disabled || undefined}
      onClick={e => {
        if (disabled) return;
        onClick?.(e);
        if (!e.defaultPrevented) {
          setOpen(false);
        }
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export function ContextMenuSeparator({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`${styles.separator} ${className}`} role="separator" {...props} />;
}
