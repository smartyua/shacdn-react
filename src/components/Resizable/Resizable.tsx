import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import styles from './Resizable.module.scss';

type Orientation = 'horizontal' | 'vertical';

type GroupContextValue = {
  orientation: Orientation;
  sizes: number[];
  setSizes: (next: number[]) => void;
};

const GroupContext = createContext<GroupContextValue | null>(null);

const useGroupContext = (name: string): GroupContextValue => {
  const ctx = useContext(GroupContext);
  if (!ctx) {
    throw new Error(`${name} must be used within <ResizablePanelGroup>`);
  }
  return ctx;
};

const parseDefaultSize = (value?: string | number): number => {
  if (value === undefined) return 50;
  if (typeof value === 'number') return value;
  const trimmed = value.trim();
  if (trimmed.endsWith('%')) {
    return Number.parseFloat(trimmed) || 50;
  }
  return Number.parseFloat(trimmed) || 50;
};

const normalizeSizes = (sizes: number[]): number[] => {
  const total = sizes.reduce((sum, n) => sum + n, 0);
  if (total <= 0) return sizes.map(() => 100 / sizes.length);
  return sizes.map((n) => (n / total) * 100);
};

const isPanel = (child: ReactNode): child is ReactElement<ResizablePanelProps> =>
  isValidElement(child) && (child.type as { displayName?: string }).displayName === 'ResizablePanel';

const isHandle = (child: ReactNode): child is ReactElement<ResizableHandleProps> =>
  isValidElement(child) && (child.type as { displayName?: string }).displayName === 'ResizableHandle';

export type ResizablePanelGroupProps = HTMLAttributes<HTMLDivElement> & {
  orientation?: Orientation;
  children: ReactNode;
};

export const ResizablePanelGroup = ({
  orientation = 'horizontal',
  className = '',
  children,
  ...props
}: ResizablePanelGroupProps) => {
  const childArray = Children.toArray(children);
  const initialSizes = useMemo(
    () =>
      normalizeSizes(
        childArray.filter(isPanel).map((panel) => parseDefaultSize(panel.props.defaultSize))
      ),
    [childArray]
  );
  const [sizes, setSizes] = useState(initialSizes);

  const value = useMemo(
    () => ({ orientation, sizes, setSizes }),
    [orientation, sizes]
  );

  const { nodes: rendered } = childArray.reduce<{
    nodes: ReactNode[];
    panelIndex: number;
    lastPanelIndex: number;
  }>(
    (acc, child, i) => {
      if (isPanel(child)) {
        const panelIndex = acc.panelIndex + 1;
        const size = sizes[panelIndex] ?? 100 / sizes.length;
        return {
          panelIndex,
          lastPanelIndex: panelIndex,
          nodes: [
            ...acc.nodes,
            cloneElement(child, {
              key: child.key ?? `panel-${i}`,
              // Grow factors share leftover space after fixed handles — avoids
              // overflow when percentage flex-basis + handle px exceed 100%.
              style: { ...child.props.style, flex: `${size} 1 0px` },
            }),
          ],
        };
      }
      if (isHandle(child)) {
        return {
          ...acc,
          nodes: [
            ...acc.nodes,
            cloneElement(child, {
              key: child.key ?? `handle-${i}`,
              handleIndex: acc.lastPanelIndex < 0 ? 0 : acc.lastPanelIndex,
            }),
          ],
        };
      }
      return { ...acc, nodes: [...acc.nodes, child] };
    },
    { nodes: [], panelIndex: -1, lastPanelIndex: -1 }
  );

  return (
    <GroupContext.Provider value={value}>
      <div
        data-orientation={orientation}
        className={`${styles.group} ${styles[`group--${orientation}`]} ${className}`}
        {...props}
      >
        {rendered}
      </div>
    </GroupContext.Provider>
  );
};

ResizablePanelGroup.displayName = 'ResizablePanelGroup';

export type ResizablePanelProps = HTMLAttributes<HTMLDivElement> & {
  defaultSize?: string | number;
};

export const ResizablePanel = ({ className = '', children, ...props }: ResizablePanelProps) => {
  return (
    <div className={`${styles.panel} ${className}`} {...props}>
      <div className={styles.panelInner}>{children}</div>
    </div>
  );
};

ResizablePanel.displayName = 'ResizablePanel';

export type ResizableHandleProps = HTMLAttributes<HTMLButtonElement> & {
  withHandle?: boolean;
  handleIndex?: number;
};

export const ResizableHandle = ({
  withHandle = false,
  handleIndex = 0,
  className = '',
  ...props
}: ResizableHandleProps) => {
  const { orientation, sizes, setSizes } = useGroupContext('ResizableHandle');
  const activeRef = useRef(false);
  const startRef = useRef({ pointer: 0, sizes: [] as number[] });

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      activeRef.current = true;
      startRef.current = {
        pointer: orientation === 'horizontal' ? event.clientX : event.clientY,
        sizes: [...sizes],
      };
      event.currentTarget.setPointerCapture(event.pointerId);
      event.currentTarget.dataset.active = 'true';
    },
    [orientation, sizes]
  );

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (!activeRef.current) return;
      const group = event.currentTarget.parentElement;
      if (!group) return;

      const rect = group.getBoundingClientRect();
      const totalPx = orientation === 'horizontal' ? rect.width : rect.height;
      if (totalPx <= 0) return;

      const deltaPx =
        (orientation === 'horizontal' ? event.clientX : event.clientY) - startRef.current.pointer;
      const deltaPercent = (deltaPx / totalPx) * 100;
      const next = [...startRef.current.sizes];
      const i = Math.min(handleIndex, Math.max(0, next.length - 2));
      const pairSum = (startRef.current.sizes[i] ?? 50) + (startRef.current.sizes[i + 1] ?? 50);
      const left = Math.max(8, Math.min(pairSum - 8, (next[i] ?? 50) + deltaPercent));
      next[i] = left;
      next[i + 1] = pairSum - left;
      setSizes(normalizeSizes(next));
    },
    [handleIndex, orientation, setSizes]
  );

  const handlePointerUp = useCallback((event: ReactPointerEvent<HTMLButtonElement>) => {
    activeRef.current = false;
    delete event.currentTarget.dataset.active;
    event.currentTarget.releasePointerCapture(event.pointerId);
  }, []);

  return (
    <button
      type="button"
      aria-label="Resize panel"
      data-resize-handle=""
      className={`${styles.handle} ${styles[`handle--${orientation}`]} ${withHandle ? styles['handle--withGrip'] : ''} ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      {...props}
    />
  );
};

ResizableHandle.displayName = 'ResizableHandle';
