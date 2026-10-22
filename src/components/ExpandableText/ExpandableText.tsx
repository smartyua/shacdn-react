import {
  forwardRef,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
} from 'react';
import { cn } from '../../lib/cn';
import styles from './ExpandableText.module.scss';

export interface ExpandableTextProps extends HTMLAttributes<HTMLDivElement> {
  /** Visible lines while collapsed. */
  lines?: number;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  moreLabel?: string;
  lessLabel?: string;
}

const resolveLineHeight = (computed: CSSStyleDeclaration): number => {
  const rawSize = computed.fontSize;
  const fontSize = (Number.parseFloat(rawSize) || 16) * (/r?em$/.test(rawSize) ? 16 : 1);
  const raw = computed.lineHeight;
  if (!raw || raw === 'normal') return fontSize * 1.2;
  const parsed = Number.parseFloat(raw);
  if (!Number.isFinite(parsed)) return fontSize * 1.2;
  return raw.endsWith('px') ? parsed : parsed * fontSize;
};

export const ExpandableText = forwardRef<HTMLDivElement, ExpandableTextProps>(
  (
    {
      lines = 3,
      expanded,
      defaultExpanded = false,
      onExpandedChange,
      moreLabel = 'Read more',
      lessLabel = 'Show less',
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const [internal, setInternal] = useState(defaultExpanded);
    const open = expanded ?? internal;
    const [overflowing, setOverflowing] = useState(false);
    const [fullHeight, setFullHeight] = useState<number | null>(null);
    const bodyRef = useRef<HTMLDivElement>(null);
    const contentId = useId();

    useLayoutEffect(() => {
      const node = bodyRef.current;
      if (!node) return;
      const measure = () => {
        const collapsedHeight = resolveLineHeight(getComputedStyle(node)) * lines;
        setFullHeight(node.scrollHeight);
        setOverflowing(node.scrollHeight > collapsedHeight + 1);
      };
      measure();
      if (typeof ResizeObserver === 'undefined') return;
      const observer = new ResizeObserver(measure);
      observer.observe(node);
      return () => observer.disconnect();
    }, [lines, children]);

    const toggle = () => {
      const next = !open;
      if (expanded === undefined) setInternal(next);
      onExpandedChange?.(next);
    };

    const clamped = overflowing && !open;

    return (
      <div ref={ref} data-slot="expandable-text" className={cn(styles.root, className)} style={style} {...props}>
        <div
          ref={bodyRef}
          id={contentId}
          className={styles.body}
          data-clamped={clamped || undefined}
          style={
            {
              '--lines': lines,
              '--full-height': fullHeight ? `${fullHeight}px` : 'none',
            } as CSSProperties
          }
        >
          {children}
        </div>
        {overflowing ? (
          <button
            type="button"
            className={styles.toggle}
            aria-expanded={open}
            aria-controls={contentId}
            onClick={toggle}
          >
            {open ? lessLabel : moreLabel}
          </button>
        ) : null}
      </div>
    );
  }
);

ExpandableText.displayName = 'ExpandableText';
