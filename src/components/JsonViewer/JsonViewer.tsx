import { forwardRef, useState, type HTMLAttributes } from 'react';
import { ChevronRight, Copy } from 'lucide-react';
import { cn } from '../../lib/cn';
import { childPath, kindOf, previewOf, type JsonValue } from './jsonPath';
import styles from './JsonViewer.module.scss';

export type { JsonValue } from './jsonPath';

export interface JsonViewerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onCopy'> {
  data: JsonValue;
  /** Levels expanded on first render (0 = only the root summary). */
  defaultExpandDepth?: number;
  /** Array items rendered before a "Show more" button. */
  pageSize?: number;
  rootLabel?: string;
  /** Called after a value or path is copied. */
  onCopyText?: (text: string, kind: 'value' | 'path') => void;
}

interface NodeProps {
  name: string | number | null;
  value: JsonValue;
  path: string;
  depth: number;
  expandDepth: number;
  pageSize: number;
  onCopyText?: JsonViewerProps['onCopyText'];
}

const copy = async (text: string, kind: 'value' | 'path', onCopyText: NodeProps['onCopyText']) => {
  try {
    await navigator.clipboard?.writeText(text);
    onCopyText?.(text, kind);
  } catch {
    // Clipboard can be denied (insecure context, permissions); copying is best-effort.
  }
};

const KeyLabel = ({ name }: { name: NodeProps['name'] }) =>
  name === null ? null : (
    <>
      <span className={typeof name === 'number' ? styles.index : styles.key}>
        {typeof name === 'number' ? name : JSON.stringify(name)}
      </span>
      <span className={styles.colon}>: </span>
    </>
  );

const CopyActions = ({ value, path, onCopyText }: Pick<NodeProps, 'value' | 'path' | 'onCopyText'>) => (
  <span className={styles.actions}>
    <button
      type="button"
      className={styles.action}
      aria-label={`Copy value at ${path}`}
      onClick={() => copy(JSON.stringify(value, null, 2), 'value', onCopyText)}
    >
      <Copy size={12} aria-hidden />
    </button>
    <button
      type="button"
      className={styles.action}
      aria-label={`Copy path ${path}`}
      onClick={() => copy(path, 'path', onCopyText)}
    >
      path
    </button>
  </span>
);

const JsonNode = ({ name, value, path, depth, expandDepth, pageSize, onCopyText }: NodeProps) => {
  const kind = kindOf(value);
  const branch = kind === 'object' || kind === 'array';
  const [open, setOpen] = useState(depth < expandDepth);
  const [limit, setLimit] = useState(pageSize);

  if (!branch) {
    return (
      <li className={styles.row}>
        <span className={styles.line}>
          <span className={styles.spacer} aria-hidden />
          <KeyLabel name={name} />
          <span className={styles[kind]}>{JSON.stringify(value)}</span>
          <CopyActions value={value} path={path} onCopyText={onCopyText} />
        </span>
      </li>
    );
  }

  const entries: [string | number, JsonValue][] = Array.isArray(value)
    ? value.map((item, index) => [index, item])
    : Object.entries(value as Record<string, JsonValue>);
  const shown = kind === 'array' ? entries.slice(0, limit) : entries;
  const label = name === null ? 'root' : String(name);

  return (
    <li className={styles.row}>
      <span className={styles.line}>
        <button
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-label={`${open ? 'Collapse' : 'Expand'} ${label}`}
          onClick={() => setOpen(current => !current)}
        >
          <ChevronRight size={12} aria-hidden data-open={open || undefined} />
        </button>
        <KeyLabel name={name} />
        <span className={styles.bracket}>{kind === 'array' ? '[' : '{'}</span>
        {open ? null : (
          <>
            <span className={styles.preview}>{previewOf(value)}</span>
            <span className={styles.bracket}>{kind === 'array' ? ']' : '}'}</span>
          </>
        )}
        <CopyActions value={value} path={path} onCopyText={onCopyText} />
      </span>
      {open ? (
        <>
          <ul className={styles.children}>
            {shown.map(([key, child]) => (
              <JsonNode
                key={key}
                name={key}
                value={child}
                path={childPath(path, key)}
                depth={depth + 1}
                expandDepth={expandDepth}
                pageSize={pageSize}
                onCopyText={onCopyText}
              />
            ))}
            {entries.length > shown.length ? (
              <li className={styles.row}>
                <button type="button" className={styles.more} onClick={() => setLimit(current => current + pageSize)}>
                  Show {Math.min(pageSize, entries.length - shown.length)} more of {entries.length - shown.length}
                </button>
              </li>
            ) : null}
          </ul>
          <span className={cn(styles.line, styles.closing)}>
            <span className={styles.bracket}>{kind === 'array' ? ']' : '}'}</span>
          </span>
        </>
      ) : null}
    </li>
  );
};

export const JsonViewer = forwardRef<HTMLDivElement, JsonViewerProps>(
  ({ data, defaultExpandDepth = 1, pageSize = 50, rootLabel = '$', onCopyText, className, ...props }, ref) => (
    <div ref={ref} data-slot="json-viewer" className={cn(styles.root, className)} {...props}>
      <ul className={styles.children}>
        <JsonNode
          name={null}
          value={data}
          path={rootLabel}
          depth={0}
          expandDepth={defaultExpandDepth}
          pageSize={pageSize}
          onCopyText={onCopyText}
        />
      </ul>
    </div>
  )
);

JsonViewer.displayName = 'JsonViewer';
