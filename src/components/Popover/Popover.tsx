import {
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
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
  type FloatingAlign,
  type FloatingSide,
} from '../Floating/Floating';
import styles from './Popover.module.scss';

type PopoverCtx = {
  open: boolean;
  setOpen: (v: boolean) => void;
  triggerRef: RefObject<HTMLElement | null>;
};

const PopoverContext = createContext<PopoverCtx | null>(null);

const usePopover = (): PopoverCtx => {
  const c = useContext(PopoverContext);
  if (!c) {
    throw new Error('Popover components must be used within Popover');
  }
  return c;
};

export interface PopoverProps extends HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

export const Popover = ({
  open: openControlled,
  defaultOpen = false,
  onOpenChange,
  className = '',
  children,
  ...props
}: PopoverProps) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = openControlled ?? internalOpen;
  const triggerRef = useRef<HTMLElement | null>(null);

  const setOpen = useCallback(
    (v: boolean) => {
      if (openControlled === undefined) {
        setInternalOpen(v);
      }
      onOpenChange?.(v);
    },
    [openControlled, onOpenChange]
  );

  const value = useMemo(() => ({ open, setOpen, triggerRef }), [open, setOpen]);

  return (
    <PopoverContext.Provider value={value}>
      <div className={`${styles.root} ${className}`} data-slot="popover" {...props}>
        {children}
      </div>
    </PopoverContext.Provider>
  );
};

export interface PopoverTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const PopoverTrigger = forwardRef<HTMLElement, PopoverTriggerProps>(
  ({ asChild = false, className = '', children, onClick, ...props }, ref) => {
    const { open, setOpen, triggerRef } = usePopover();

    const handleClick = (e: MouseEvent<HTMLElement>) => {
      onClick?.(e as MouseEvent<HTMLButtonElement>);
      if (!e.defaultPrevented) {
        setOpen(!open);
      }
    };

    if (asChild && isValidElement(children)) {
      const child = children as ReactElement<{
        className?: string;
        onClick?: (e: MouseEvent<HTMLElement>) => void;
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
        className: `${styles.trigger} ${child.props.className ?? ''} ${className}`.trim(),
        'aria-expanded': open,
        'aria-haspopup': 'dialog',
        'data-slot': 'popover-trigger',
        onClick: (e: MouseEvent<HTMLElement>) => {
          child.props.onClick?.(e);
          handleClick(e);
        },
      } as Record<string, unknown>);
    }

    return (
      <button
        ref={composeRefs(ref as RefObject<HTMLButtonElement>, triggerRef as RefObject<HTMLButtonElement>)}
        type="button"
        className={`${styles.trigger} ${className}`}
        aria-expanded={open}
        aria-haspopup="dialog"
        data-slot="popover-trigger"
        onClick={handleClick as (e: MouseEvent<HTMLButtonElement>) => void}
        {...props}
      >
        {children}
      </button>
    );
  }
);

PopoverTrigger.displayName = 'PopoverTrigger';

export interface PopoverContentProps extends HTMLAttributes<HTMLDivElement> {
  align?: FloatingAlign;
  side?: FloatingSide;
  sideOffset?: number;
  sameWidth?: boolean;
}

export const PopoverContent = ({
  className = '',
  align = 'center',
  side = 'bottom',
  sideOffset = 4,
  sameWidth = false,
  children,
  ...props
}: PopoverContentProps) => {
  const { open, setOpen, triggerRef } = usePopover();
  const contentRef = useRef<HTMLDivElement>(null);

  const { style, floatingProps } = useFloatingPosition({
    anchorRef: triggerRef,
    floatingRef: contentRef,
    open,
    side,
    align,
    sideOffset,
    sameWidth,
  });

  useDismissLayer({
    open,
    onDismiss: () => setOpen(false),
    contentRef,
    excludeRefs: [triggerRef],
    dismissOnEscape: true,
    dismissOnOutsidePointer: true,
  });

  if (!open) {
    return null;
  }

  return (
    <FloatingPortal>
      <div
        ref={contentRef}
        role="dialog"
        data-slot="popover-content"
        className={`${styles.content} ${className}`}
        style={style}
        {...floatingProps}
        {...props}
      >
        {children}
      </div>
    </FloatingPortal>
  );
};
