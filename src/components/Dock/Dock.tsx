import {
  forwardRef,
  useCallback,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type HTMLAttributes,
  type PointerEvent,
} from 'react';
import { cn } from '../../lib/cn';
import { dockScale } from './dockScale';
import styles from './Dock.module.scss';

export type DockOrientation = 'horizontal' | 'vertical';

export interface DockProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: DockOrientation;
  /** Resting icon size in pixels. */
  size?: number;
  /** Icon size at the pointer, in pixels. */
  magnification?: number;
  /** Distance in pixels over which magnification falls off. */
  distance?: number;
}

const orientationClass = (orientation: DockOrientation): string => {
  switch (orientation) {
    case 'horizontal':
      return '';
    case 'vertical':
      return styles.vertical;
    default: {
      const exhaustive: never = orientation;
      return exhaustive;
    }
  }
};

const applyScales = (
  dock: HTMLDivElement,
  pointer: number,
  orientation: DockOrientation,
  size: number,
  magnification: number,
  distance: number
) => {
  const items = dock.querySelectorAll<HTMLElement>('[data-slot="dock-item"]');
  items.forEach(item => {
    const rect = item.getBoundingClientRect();
    const center = orientation === 'vertical' ? rect.top + rect.height / 2 : rect.left + rect.width / 2;
    const scale = dockScale(pointer, center, distance, size, magnification);
    item.style.setProperty('--dock-scale', scale.toFixed(3));
  });
};

export const Dock = forwardRef<HTMLDivElement, DockProps>(
  (
    {
      orientation = 'horizontal',
      size = 40,
      magnification = 64,
      distance = 120,
      className,
      children,
      onPointerMove,
      onPointerLeave,
      style,
      ...props
    },
    ref
  ) => {
    const restSize = Number.isFinite(size) && size > 0 ? size : 40;

    const move = useCallback(
      (event: PointerEvent<HTMLDivElement>) => {
        onPointerMove?.(event);
        const dock = event.currentTarget;
        const pointer = orientation === 'vertical' ? event.clientY : event.clientX;
        applyScales(dock, pointer, orientation, restSize, magnification, distance);
      },
      [distance, magnification, onPointerMove, orientation, restSize]
    );

    const leave = useCallback(
      (event: PointerEvent<HTMLDivElement>) => {
        onPointerLeave?.(event);
        event.currentTarget.querySelectorAll<HTMLElement>('[data-slot="dock-item"]').forEach(item => {
          item.style.setProperty('--dock-scale', '1');
        });
      },
      [onPointerLeave]
    );

    return (
      <div
        ref={ref}
        className={cn(styles.dock, orientationClass(orientation), className)}
        data-slot="dock"
        data-orientation={orientation}
        style={{ ...style, '--dock-size': `${restSize}px` } as CSSProperties}
        {...props}
        onPointerMove={move}
        onPointerLeave={leave}
      >
        {children}
      </div>
    );
  }
);

Dock.displayName = 'Dock';

export interface DockItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export const DockItem = forwardRef<HTMLButtonElement, DockItemProps>(
  ({ label, className, type = 'button', children, ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(styles.item, className)}
      data-slot="dock-item"
      aria-label={label}
      {...props}
    >
      {children}
    </button>
  )
);

DockItem.displayName = 'DockItem';
