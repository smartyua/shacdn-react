import {
  forwardRef,
  useId,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '../../lib/cn';
import { flattenVisible, type TreeNode } from './treeModel';
import styles from './TreeView.module.scss';

export type { TreeNode } from './treeModel';

export interface TreeViewProps extends Omit<HTMLAttributes<HTMLUListElement>, 'onSelect'> {
  items: TreeNode[];
  expanded?: string[];
  defaultExpanded?: string[];
  onExpandedChange?: (expanded: string[]) => void;
  selected?: string | null;
  defaultSelected?: string | null;
  onSelect?: (id: string, node: TreeNode) => void;
  /** Rendered after the label, e.g. a count or badge. */
  renderMeta?: (node: TreeNode) => ReactNode;
}

export const TreeView = forwardRef<HTMLUListElement, TreeViewProps>(
  (
    {
      items,
      expanded,
      defaultExpanded = [],
      onExpandedChange,
      selected,
      defaultSelected = null,
      onSelect,
      renderMeta,
      className,
      ...props
    },
    ref
  ) => {
    const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
    const [internalSelected, setInternalSelected] = useState(defaultSelected);
    const openIds = useMemo(() => new Set(expanded ?? internalExpanded), [expanded, internalExpanded]);
    const selectedId = selected === undefined ? internalSelected : selected;
    const visible = useMemo(() => flattenVisible(items, openIds), [items, openIds]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const focusId = visible.some(row => row.node.id === activeId)
      ? activeId
      : visible.find(row => row.node.id === selectedId)?.node.id ?? visible[0]?.node.id;
    const itemRefs = useRef(new Map<string, HTMLLIElement>());
    const baseId = useId();

    const setOpen = (id: string, open: boolean) => {
      if (openIds.has(id) === open) return;
      const next = open ? [...openIds, id] : [...openIds].filter(openId => openId !== id);
      if (expanded === undefined) setInternalExpanded(next);
      onExpandedChange?.(next);
    };

    const choose = (node: TreeNode) => {
      if (node.disabled) return;
      if (selected === undefined) setInternalSelected(node.id);
      onSelect?.(node.id, node);
    };

    const moveTo = (id: string | undefined) => {
      if (!id) return;
      setActiveId(id);
      itemRefs.current.get(id)?.focus();
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
      const index = visible.findIndex(row => row.node.id === focusId);
      const row = visible[index];
      if (!row) return;
      const hasChildren = Boolean(row.node.children?.length);
      const isOpen = openIds.has(row.node.id);

      const actions: Record<string, () => void> = {
        ArrowDown: () => moveTo(visible[index + 1]?.node.id),
        ArrowUp: () => moveTo(visible[index - 1]?.node.id),
        Home: () => moveTo(visible[0]?.node.id),
        End: () => moveTo(visible[visible.length - 1]?.node.id),
        ArrowRight: () => {
          if (!hasChildren) return;
          if (isOpen) moveTo(visible[index + 1]?.node.id);
          else setOpen(row.node.id, true);
        },
        ArrowLeft: () => {
          if (hasChildren && isOpen) setOpen(row.node.id, false);
          else moveTo(row.parentId ?? undefined);
        },
        Enter: () => choose(row.node),
        ' ': () => choose(row.node),
      };

      const action = actions[event.key];
      if (!action) return;
      event.preventDefault();
      action();
    };

    const renderLevel = (nodes: TreeNode[], level: number): ReactNode =>
      nodes.map((node, index) => {
        const hasChildren = Boolean(node.children?.length);
        const isOpen = openIds.has(node.id);
        return (
          <li
            key={node.id}
            ref={element => {
              if (element) itemRefs.current.set(node.id, element);
              else itemRefs.current.delete(node.id);
            }}
            role="treeitem"
            aria-labelledby={`${baseId}-${node.id}`}
            aria-level={level}
            aria-setsize={nodes.length}
            aria-posinset={index + 1}
            aria-expanded={hasChildren ? isOpen : undefined}
            aria-selected={selectedId === node.id}
            aria-disabled={node.disabled || undefined}
            tabIndex={focusId === node.id ? 0 : -1}
            className={styles.item}
            onFocus={event => {
              if (event.target === event.currentTarget) setActiveId(node.id);
            }}
          >
            <div
              className={styles.row}
              style={{ paddingInlineStart: `calc(${level - 1} * var(--tree-indent) + var(--tree-pad))` }}
              onClick={() => {
                setActiveId(node.id);
                if (hasChildren) setOpen(node.id, !isOpen);
                choose(node);
              }}
            >
              <span className={styles.chevron} data-open={isOpen || undefined} aria-hidden>
                {hasChildren ? <ChevronRight size={14} /> : null}
              </span>
              {node.icon ? (
                <span className={styles.icon} aria-hidden>
                  {node.icon}
                </span>
              ) : null}
              <span id={`${baseId}-${node.id}`} className={styles.label}>
                {node.label}
              </span>
              {renderMeta ? <span className={styles.meta}>{renderMeta(node)}</span> : null}
            </div>
            {hasChildren && isOpen ? (
              <ul role="group" className={styles.group}>
                {renderLevel(node.children ?? [], level + 1)}
              </ul>
            ) : null}
          </li>
        );
      });

    return (
      <ul
        ref={ref}
        role="tree"
        data-slot="tree-view"
        className={cn(styles.tree, className)}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {renderLevel(items, 1)}
      </ul>
    );
  }
);

TreeView.displayName = 'TreeView';
