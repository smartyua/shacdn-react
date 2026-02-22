import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './Tooltip.module.scss';

export interface TooltipProps {
  children: React.ReactNode;
}

export interface TooltipTriggerProps {
  children: React.ReactElement;
  asChild?: boolean;
}

export interface TooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
}

type TooltipContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerElement: HTMLElement | null;
  setTriggerElement: (el: HTMLElement | null) => void;
};

const TooltipContext = React.createContext<TooltipContextValue | null>(null);

export const TooltipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export const Tooltip: React.FC<TooltipProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [triggerElement, setTriggerElement] = useState<HTMLElement | null>(null);

  return (
    <TooltipContext.Provider value={{ open, setOpen, triggerElement, setTriggerElement }}>
      {children}
    </TooltipContext.Provider>
  );
};

export const TooltipTrigger: React.FC<TooltipTriggerProps> = ({ children }) => {
  const context = React.useContext(TooltipContext);
  if (!context) throw new Error('TooltipTrigger must be used within Tooltip');
  const triggerElementRef = useRef<HTMLElement | null>(null);

  const handleMouseEnter = () => context.setOpen(true);
  const handleMouseLeave = () => context.setOpen(false);
  const handleFocus = () => context.setOpen(true);
  const handleBlur = () => context.setOpen(false);

  useEffect(() => {
    if (triggerElementRef.current) {
      context.setTriggerElement(triggerElementRef.current);
    }
  }, [context]);

  const childProps = {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onFocus: handleFocus,
    onBlur: handleBlur,
  };

  return (
    <span
      ref={triggerElementRef as React.RefObject<HTMLSpanElement>}
      style={{ display: 'inline-flex' }}
    >
      {React.cloneElement(children, childProps)}
    </span>
  );
};

TooltipTrigger.displayName = 'TooltipTrigger';

export const TooltipContent: React.FC<TooltipContentProps> = ({ 
  className = '', 
  side = 'top', 
  sideOffset = 4, 
  children, 
  ...props 
}) => {
  const context = React.useContext(TooltipContext);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!context?.open || !context.triggerElement || !contentRef.current) return;

    const triggerRect = context.triggerElement.getBoundingClientRect();
    const contentRect = contentRef.current.getBoundingClientRect();
    
    let top = 0;
    let left = 0;

    switch (side) {
      case 'top':
        top = triggerRect.top - contentRect.height - sideOffset;
        left = triggerRect.left + (triggerRect.width - contentRect.width) / 2;
        break;
      case 'bottom':
        top = triggerRect.bottom + sideOffset;
        left = triggerRect.left + (triggerRect.width - contentRect.width) / 2;
        break;
      case 'left':
        top = triggerRect.top + (triggerRect.height - contentRect.height) / 2;
        left = triggerRect.left - contentRect.width - sideOffset;
        break;
      case 'right':
        top = triggerRect.top + (triggerRect.height - contentRect.height) / 2;
        left = triggerRect.right + sideOffset;
        break;
    }

    requestAnimationFrame(() => {
      setPosition({ top, left });
    });
  }, [context?.open, context?.triggerElement, side, sideOffset]);

  if (!context?.open) return null;

  return createPortal(
    <div
      ref={contentRef}
      className={`${styles.tooltipContent} ${styles[side]} ${className}`}
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
      {...props}
    >
      {children}
    </div>,
    document.body
  );
};

TooltipContent.displayName = 'TooltipContent';
