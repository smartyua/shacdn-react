import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type LiHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { PanelLeft } from 'lucide-react';
import styles from './Sidebar.module.scss';

type SidebarContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  collapsed: boolean;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

const useSidebar = (name: string): SidebarContextValue => {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error(`${name} must be used within <SidebarProvider>`);
  }
  return ctx;
};

export type SidebarProviderProps = HTMLAttributes<HTMLDivElement> & {
  defaultOpen?: boolean;
  children: ReactNode;
};

export const SidebarProvider = ({
  defaultOpen = true,
  className = '',
  children,
  ...props
}: SidebarProviderProps) => {
  const [open, setOpen] = useState(defaultOpen);
  const collapsed = !open;
  const value = useMemo(() => ({ open, setOpen, collapsed }), [open, collapsed]);

  return (
    <SidebarContext.Provider value={value}>
      <div className={`${styles.provider} ${className}`} {...props}>
        {children}
      </div>
    </SidebarContext.Provider>
  );
};

SidebarProvider.displayName = 'SidebarProvider';

export type SidebarProps = HTMLAttributes<HTMLElement>;

export const Sidebar = forwardRef<HTMLElement, SidebarProps>(({ className = '', ...props }, ref) => {
  const { collapsed } = useSidebar('Sidebar');
  return (
    <aside
      ref={ref}
      className={`${styles.sidebar} ${collapsed ? styles['sidebar--collapsed'] : ''} ${className}`}
      data-collapsed={collapsed ? 'true' : 'false'}
      {...props}
    />
  );
});

Sidebar.displayName = 'Sidebar';

export const SidebarHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={`${styles.header} ${className}`} {...props} />
  )
);

SidebarHeader.displayName = 'SidebarHeader';

export const SidebarFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={`${styles.footer} ${className}`} {...props} />
  )
);

SidebarFooter.displayName = 'SidebarFooter';

export const SidebarContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={`${styles.content} ${className}`} {...props} />
  )
);

SidebarContent.displayName = 'SidebarContent';

export const SidebarInset = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={`${styles.inset} ${className}`} {...props} />
  )
);

SidebarInset.displayName = 'SidebarInset';

export const SidebarMenu = forwardRef<HTMLUListElement, HTMLAttributes<HTMLUListElement>>(
  ({ className = '', ...props }, ref) => (
    <ul ref={ref} className={`${styles.menu} ${className}`} {...props} />
  )
);

SidebarMenu.displayName = 'SidebarMenu';

export type SidebarMenuItemProps = LiHTMLAttributes<HTMLLIElement>;

export const SidebarMenuItem = forwardRef<HTMLLIElement, SidebarMenuItemProps>(
  ({ className = '', ...props }, ref) => (
    <li ref={ref} className={`${styles.menuItem} ${className}`} {...props} />
  )
);

SidebarMenuItem.displayName = 'SidebarMenuItem';

export type SidebarMenuButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isActive?: boolean;
};

export const SidebarMenuButton = forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ className = '', isActive = false, children, ...props }, ref) => {
    const { collapsed } = useSidebar('SidebarMenuButton');
    return (
      <button
        ref={ref}
        type="button"
        className={`${styles.menuButton} ${collapsed ? styles.collapsed : ''} ${className}`}
        data-active={isActive ? 'true' : undefined}
        {...props}
      >
        {children}
      </button>
    );
  }
);

SidebarMenuButton.displayName = 'SidebarMenuButton';

export const SidebarMenuButtonLabel = ({ className = '', ...props }: HTMLAttributes<HTMLSpanElement>) => (
  <span className={`${styles.menuButtonLabel} ${className}`} {...props} />
);

export const SidebarTrigger = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className = '', onClick, ...props }, ref) => {
    const { open, setOpen } = useSidebar('SidebarTrigger');
    const handleClick = useCallback(
      (event: MouseEvent<HTMLButtonElement>) => {
        setOpen(!open);
        onClick?.(event);
      },
      [onClick, open, setOpen]
    );

    return (
      <button
        ref={ref}
        type="button"
        className={`${styles.trigger} ${className}`}
        aria-label={open ? 'Collapse sidebar' : 'Expand sidebar'}
        aria-pressed={!open}
        onClick={handleClick}
        {...props}
      >
        <PanelLeft size={16} aria-hidden />
      </button>
    );
  }
);

SidebarTrigger.displayName = 'SidebarTrigger';
