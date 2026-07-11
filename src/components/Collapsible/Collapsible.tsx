import {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import styles from './Collapsible.module.scss';

type CollapsibleContextValue = {
  open: boolean;
  setOpen: (next: boolean) => void;
  contentId: string;
};

const CollapsibleContext = createContext<CollapsibleContextValue | null>(null);

function useCollapsibleContext(component: string): CollapsibleContextValue {
  const ctx = useContext(CollapsibleContext);
  if (!ctx) {
    throw new Error(`${component} must be used within <Collapsible>`);
  }
  return ctx;
}

export interface CollapsibleProps extends HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

export function Collapsible({
  open: openControlled,
  defaultOpen = false,
  onOpenChange,
  className = '',
  children,
  ...props
}: CollapsibleProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const contentId = useId();
  const open = openControlled ?? internalOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (openControlled === undefined) {
        setInternalOpen(next);
      }
      onOpenChange?.(next);
    },
    [openControlled, onOpenChange]
  );

  const value = useMemo(() => ({ open, setOpen, contentId }), [open, setOpen, contentId]);

  return (
    <CollapsibleContext.Provider value={value}>
      <div className={`${styles.root} ${className}`} data-state={open ? 'open' : 'closed'} {...props}>
        {children}
      </div>
    </CollapsibleContext.Provider>
  );
}

export interface CollapsibleTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export function CollapsibleTrigger({ className = '', children, ...props }: CollapsibleTriggerProps) {
  const { open, setOpen, contentId } = useCollapsibleContext('CollapsibleTrigger');
  return (
    <button
      type="button"
      className={`${styles.trigger} ${className}`}
      aria-expanded={open}
      aria-controls={contentId}
      data-state={open ? 'open' : 'closed'}
      onClick={() => setOpen(!open)}
      {...props}
    >
      {children}
    </button>
  );
}

export type CollapsibleContentProps = HTMLAttributes<HTMLDivElement>;

export function CollapsibleContent({ className = '', children, ...props }: CollapsibleContentProps) {
  const { open, contentId } = useCollapsibleContext('CollapsibleContent');
  return (
    <div
      id={contentId}
      role="region"
      className={`${styles.content} ${open ? styles.contentOpen : ''} ${className}`}
      data-state={open ? 'open' : 'closed'}
      {...props}
    >
      <div className={styles.contentInner}>{children}</div>
    </div>
  );
}
