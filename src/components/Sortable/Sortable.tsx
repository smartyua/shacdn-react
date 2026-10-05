import { GripVertical } from 'lucide-react';
import {
  createContext,
  forwardRef,
  useContext,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from 'react';
import { cn } from '../../lib/cn';
import { indexFromPointer, reorder } from './reorder';
import styles from './Sortable.module.scss';

interface SortableContextValue {
  value: string[];
  draggingId: string | null;
  move: (id: string, delta: -1 | 1) => void;
  onPointerDown: (id: string, event: PointerEvent<HTMLLIElement>) => void;
  onPointerMove: (event: PointerEvent<HTMLLIElement>) => void;
  onPointerUp: (event: PointerEvent<HTMLLIElement>) => void;
}

const SortableContext = createContext<SortableContextValue | null>(null);

const useSortable = (): SortableContextValue => {
  const context = useContext(SortableContext);
  if (!context) throw new Error('SortableItem must be used within Sortable');
  return context;
};

export interface SortableProps extends Omit<HTMLAttributes<HTMLUListElement>, 'onChange'> {
  value: string[];
  onValueChange: (value: string[]) => void;
  children: ReactNode;
}

export const Sortable = forwardRef<HTMLUListElement, SortableProps>(
  ({ value, onValueChange, className, children, ...props }, ref) => {
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const [overIndex, setOverIndex] = useState<number | null>(null);

    const move = (id: string, delta: -1 | 1) => {
      const from = value.indexOf(id);
      if (from < 0) return;
      const next = reorder(value, from, from + delta);
      if (next !== value) onValueChange(next);
    };

    const onPointerDown = (id: string, event: PointerEvent<HTMLLIElement>) => {
      if (event.button !== 0) return;
      event.currentTarget.setPointerCapture(event.pointerId);
      setDraggingId(id);
      setOverIndex(value.indexOf(id));
    };

    const onPointerMove = (event: PointerEvent<HTMLLIElement>) => {
      if (!draggingId) return;
      const nodes = event.currentTarget.parentElement?.querySelectorAll<HTMLElement>('[data-sortable-id]') ?? [];
      const bands = Array.from(nodes).map(node => {
        const rect = node.getBoundingClientRect();
        return { top: rect.top, height: rect.height };
      });
      setOverIndex(indexFromPointer(bands, event.clientY));
    };

    const onPointerUp = (event: PointerEvent<HTMLLIElement>) => {
      if (draggingId != null && overIndex != null) {
        const from = value.indexOf(draggingId);
        const next = reorder(value, from, overIndex);
        if (next !== value) onValueChange(next);
      }
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      setDraggingId(null);
      setOverIndex(null);
    };

    return (
      <SortableContext.Provider value={{ value, draggingId, move, onPointerDown, onPointerMove, onPointerUp }}>
        <ul ref={ref} className={cn(styles.list, className)} data-slot="sortable" {...props}>
          {children}
        </ul>
      </SortableContext.Provider>
    );
  }
);

Sortable.displayName = 'Sortable';

export interface SortableItemProps extends HTMLAttributes<HTMLLIElement> {
  id: string;
}

export const SortableItem = forwardRef<HTMLLIElement, SortableItemProps>(
  ({ id, className, children, onKeyDown, ...props }, ref) => {
    const sortable = useSortable();

    const onKey = (event: KeyboardEvent<HTMLLIElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        sortable.move(id, -1);
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        sortable.move(id, 1);
      }
    };

    return (
      <li
        ref={ref}
        className={cn(styles.item, className)}
        data-sortable-id={id}
        data-dragging={sortable.draggingId === id ? 'true' : 'false'}
        tabIndex={0}
        {...props}
        onKeyDown={onKey}
        onPointerDown={event => sortable.onPointerDown(id, event)}
        onPointerMove={sortable.onPointerMove}
        onPointerUp={sortable.onPointerUp}
      >
        <GripVertical className={styles.grip} size={16} aria-hidden />
        {children}
      </li>
    );
  }
);

SortableItem.displayName = 'SortableItem';
