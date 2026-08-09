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
  type FocusEvent,
  type HTMLAttributes,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type RefObject,
} from 'react';
import {
  composeRefs,
  FloatingPortal,
  useFloatingPosition,
  type FloatingSide,
} from '../Floating/Floating';
import styles from './Tooltip.module.scss';

export interface TooltipProps {
  children: ReactNode;
}

export interface TooltipTriggerProps {
  children: ReactElement;
  asChild?: boolean;
}

export interface TooltipContentProps extends HTMLAttributes<HTMLDivElement> {
  side?: FloatingSide;
  sideOffset?: number;
}

type TooltipContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: RefObject<HTMLElement | null>;
};

const TooltipContext = createContext<TooltipContextValue | null>(null);

const useTooltip = (): TooltipContextValue => {
  const context = useContext(TooltipContext);
  if (!context) {
    throw new Error('Tooltip components must be used within Tooltip');
  }
  return context;
};

export const TooltipProvider = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export const Tooltip = ({ children }: TooltipProps) => {
  const [open, setOpenState] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);

  const setOpen = useCallback((next: boolean) => {
    setOpenState(next);
  }, []);

  const contextValue = useMemo(
    () => ({ open, setOpen, triggerRef }),
    [open, setOpen]
  );

  return (
    <TooltipContext.Provider value={contextValue}>
      {children}
    </TooltipContext.Provider>
  );
};

export const TooltipTrigger = forwardRef<HTMLElement, TooltipTriggerProps>(
  ({ children, asChild = false }, ref) => {
    const { setOpen, triggerRef } = useTooltip();

    const handleMouseEnter = useCallback(() => setOpen(true), [setOpen]);
    const handleMouseLeave = useCallback(() => setOpen(false), [setOpen]);
    const handleFocus = useCallback(() => setOpen(true), [setOpen]);
    const handleBlur = useCallback(() => setOpen(false), [setOpen]);

    if (asChild && isValidElement(children)) {
      const child = children as ReactElement<{
        className?: string;
        onMouseEnter?: (e: MouseEvent<HTMLElement>) => void;
        onMouseLeave?: (e: MouseEvent<HTMLElement>) => void;
        onFocus?: (e: FocusEvent<HTMLElement>) => void;
        onBlur?: (e: FocusEvent<HTMLElement>) => void;
        ref?: RefObject<HTMLElement | null>;
      }>;
      const childRef = child.props.ref;
      const mergedRef = (node: HTMLElement | null) => {
        composeRefs(ref, triggerRef, childRef)(node);
      };

      // eslint-disable-next-line react-hooks/refs -- asChild ref merge runs on commit, not during render
      return cloneElement(child, {
        ref: mergedRef as unknown as RefObject<HTMLElement | null>,
        onMouseEnter: (e: MouseEvent<HTMLElement>) => {
          child.props.onMouseEnter?.(e);
          handleMouseEnter();
        },
        onMouseLeave: (e: MouseEvent<HTMLElement>) => {
          child.props.onMouseLeave?.(e);
          handleMouseLeave();
        },
        onFocus: (e: FocusEvent<HTMLElement>) => {
          child.props.onFocus?.(e);
          handleFocus();
        },
        onBlur: (e: FocusEvent<HTMLElement>) => {
          child.props.onBlur?.(e);
          handleBlur();
        },
      });
    }

    if (isValidElement(children)) {
      const child = children as ReactElement<{
        onMouseEnter?: (e: MouseEvent<HTMLElement>) => void;
        onMouseLeave?: (e: MouseEvent<HTMLElement>) => void;
        onFocus?: (e: FocusEvent<HTMLElement>) => void;
        onBlur?: (e: FocusEvent<HTMLElement>) => void;
        ref?: RefObject<HTMLElement | null>;
      }>;
      const childRef = child.props.ref;
      const mergedRef = (node: HTMLElement | null) => {
        composeRefs(ref, triggerRef, childRef)(node);
      };

      // eslint-disable-next-line react-hooks/refs -- asChild ref merge runs on commit, not during render
      return cloneElement(child, {
        ref: mergedRef as unknown as RefObject<HTMLElement | null>,
        onMouseEnter: (e: MouseEvent<HTMLElement>) => {
          child.props.onMouseEnter?.(e);
          handleMouseEnter();
        },
        onMouseLeave: (e: MouseEvent<HTMLElement>) => {
          child.props.onMouseLeave?.(e);
          handleMouseLeave();
        },
        onFocus: (e: FocusEvent<HTMLElement>) => {
          child.props.onFocus?.(e);
          handleFocus();
        },
        onBlur: (e: FocusEvent<HTMLElement>) => {
          child.props.onBlur?.(e);
          handleBlur();
        },
      });
    }

    return (
      <span
        ref={composeRefs(ref as RefObject<HTMLSpanElement>, triggerRef as RefObject<HTMLSpanElement>)}
        style={{ display: 'inline-flex' }}
      >
        {children}
      </span>
    );
  }
);

TooltipTrigger.displayName = 'TooltipTrigger';

type TooltipContentPositionedProps = TooltipContentProps;

const TooltipContentPositioned = ({
  className = '',
  side = 'top',
  sideOffset = 4,
  children,
  ...props
}: TooltipContentPositionedProps) => {
  const { triggerRef } = useTooltip();
  const contentRef = useRef<HTMLDivElement>(null);

  const { style, floatingProps } = useFloatingPosition({
    anchorRef: triggerRef,
    floatingRef: contentRef,
    open: true,
    side,
    align: 'center',
    sideOffset,
  });

  return (
    <FloatingPortal>
      <div
        ref={contentRef}
        role="tooltip"
        data-slot="tooltip-content"
        className={`${styles.tooltipContent} ${styles[floatingProps['data-side']]} ${className}`}
        style={style}
        {...floatingProps}
        {...props}
      >
        {children}
      </div>
    </FloatingPortal>
  );
};

TooltipContentPositioned.displayName = 'TooltipContentPositioned';

export const TooltipContent = ({
  className = '',
  side = 'top',
  sideOffset = 4,
  children,
  ...props
}: TooltipContentProps) => {
  const { open } = useTooltip();

  if (!open) {
    return null;
  }

  return (
    <TooltipContentPositioned
      className={className}
      side={side}
      sideOffset={sideOffset}
      {...props}
    >
      {children}
    </TooltipContentPositioned>
  );
};

TooltipContent.displayName = 'TooltipContent';
