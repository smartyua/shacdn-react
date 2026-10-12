import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';
import { AlertCircle, Check, ChevronDown, Copy, Wrench } from 'lucide-react';
import {
  formatDuration,
  formatPayload,
  tokenizeJson,
  usedToolsLabel,
  type JsonToken,
} from './payload';
import styles from './ToolCallCard.module.scss';

export type ToolCallStatus = 'running' | 'success' | 'error';

export interface ToolCallCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  name: string;
  status: ToolCallStatus;
  summary?: ReactNode;
  icon?: ReactNode;
  args?: unknown;
  result?: unknown;
  error?: string;
  startedAt?: number;
  duration?: number;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  openOnError?: boolean;
  onRetry?: () => void;
  maxCodeHeight?: number;
  grouped?: boolean;
}

export interface ToolCallGroupProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
  runningLabel?: string;
  duration?: number;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}

const announcementFor = (name: string, status: ToolCallStatus, error?: string): string => {
  if (status === 'running') return `${name} running`;
  if (status === 'success') return `${name} finished`;
  return `${name} failed${error ? `: ${error}` : ''}`;
};

const isToolCallCard = (child: ReactNode): child is ReactElement<ToolCallCardProps> =>
  isValidElement(child) && child.type === ToolCallCard;

const JsonText = ({ text, json }: { text: string; json: boolean }) => {
  if (!json) return text;
  const tokens: JsonToken[] = tokenizeJson(text);
  return tokens.map((token, index) => (
    <span key={`${token.kind}-${index}`} className={styles[token.kind]}>
      {token.value}
    </span>
  ));
};

const PayloadBlock = ({
  title,
  value,
  copyLabel,
  maxCodeHeight,
}: {
  title: string;
  value: unknown;
  copyLabel: string;
  maxCodeHeight: number;
}) => {
  const formatted = formatPayload(value);
  const preRef = useRef<HTMLPreElement>(null);
  const [overflows, setOverflows] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [copiedAt, setCopiedAt] = useState<number | null>(null);
  const [copyFailed, setCopyFailed] = useState(false);
  const copied = copiedAt !== null;

  useLayoutEffect(() => {
    const node = preRef.current;
    if (!node) return;
    setOverflows(node.scrollHeight > maxCodeHeight + 1);
  }, [formatted.text, maxCodeHeight]);

  useEffect(() => {
    if (copiedAt === null) return;
    const id = window.setTimeout(() => setCopiedAt(null), 1400);
    return () => window.clearTimeout(id);
  }, [copiedAt]);

  const copy = () => {
    const write = navigator.clipboard?.writeText(formatted.text);
    if (!write) {
      setCopyFailed(true);
      return;
    }
    void write.then(
      () => {
        setCopyFailed(false);
        setCopiedAt(Date.now());
      },
      () => setCopyFailed(true)
    );
  };

  return (
    <section className={styles.block}>
      <div className={styles.blockHead}>
        <h3 className={styles.blockTitle}>{title}</h3>
        <button
          type="button"
          className={styles.iconButton}
          aria-label={copied ? 'Copied' : copyFailed ? 'Copy failed' : copyLabel}
          data-invalid={copyFailed ? 'true' : undefined}
          onClick={copy}
        >
          {copied ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />}
        </button>
      </div>
      <pre
        ref={preRef}
        className={expanded ? styles.code : `${styles.code} ${styles.capped}`}
        style={expanded ? undefined : { maxHeight: maxCodeHeight }}
      >
        <code>
          <JsonText text={formatted.text} json={formatted.json} />
        </code>
      </pre>
      {overflows ? (
        <button type="button" className={styles.textButton} onClick={() => setExpanded(current => !current)}>
          {expanded ? 'Show less' : 'Show all'}
        </button>
      ) : null}
    </section>
  );
};

const StatusMark = ({ status }: { status: ToolCallStatus }) => {
  if (status === 'error') {
    return <AlertCircle size={14} aria-hidden className={styles.errorIcon} />;
  }
  if (status === 'success') {
    return (
      <svg className={styles.miniCheck} viewBox="0 0 16 16" aria-hidden>
        <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
      </svg>
    );
  }
  return (
    <svg className={styles.spin} viewBox="0 0 16 16" aria-hidden>
      <circle cx="8" cy="8" r="6" />
      <path d="M8 2a6 6 0 0 1 6 6" />
    </svg>
  );
};

export const ToolCallCard = forwardRef<HTMLDivElement, ToolCallCardProps>(
  (
    {
      name,
      status,
      summary,
      icon,
      args,
      result,
      error,
      startedAt,
      duration,
      defaultOpen = false,
      open,
      onOpenChange,
      openOnError = true,
      onRetry,
      maxCodeHeight = 220,
      grouped = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const contentId = useId();
    const controlled = open !== undefined;
    const [openState, setOpenState] = useState(
      () => defaultOpen || (status === 'error' && openOnError)
    );
    const [elapsed, setElapsed] = useState(0);
    const [manual, setManual] = useState(false);
    const [trackedStatus, setTrackedStatus] = useState(status);
    const running = status === 'running';
    const expanded = controlled ? open : openState;

    if (status !== trackedStatus) {
      setTrackedStatus(status);
      if (!controlled && !manual) {
        if (status === 'error' && openOnError) setOpenState(true);
        if (status === 'running') setOpenState(false);
      }
    }

    useEffect(() => {
      if (!running) return;
      const origin = startedAt ?? Date.now();
      const tick = () => setElapsed(Math.max(0, Date.now() - origin));
      const kick = window.setTimeout(tick, 0);
      const id = window.setInterval(tick, 100);
      return () => {
        window.clearTimeout(kick);
        window.clearInterval(id);
        setElapsed(Math.max(0, Date.now() - origin));
      };
    }, [running, startedAt]);
    const statusText =
      status === 'error' ? 'Failed' : formatDuration(running ? elapsed : (duration ?? elapsed));
    const glyph = icon ?? <Wrench size={14} aria-hidden />;

    const toggle = () => {
      const next = !expanded;
      if (!controlled) {
        setManual(true);
        setOpenState(next);
      }
      onOpenChange?.(next);
    };

    return (
      <div
        ref={ref}
        className={`${styles.card} ${grouped ? styles.grouped : ''} ${className}`}
        data-status={status}
        data-state={expanded ? 'open' : 'closed'}
        data-grouped={grouped ? 'true' : undefined}
        {...props}
      >
        <button
          type="button"
          className={styles.header}
          aria-expanded={expanded}
          aria-controls={contentId}
          onClick={toggle}
        >
          <span className={styles.tile} aria-hidden>
            {glyph}
          </span>
          <span className={styles.headline}>
            <span className={styles.name}>{name}</span>
            {summary ? <span className={styles.summary}>{summary}</span> : null}
          </span>
          <span key={status} className={styles.status}>
            <StatusMark status={status} />
            <span>{statusText}</span>
          </span>
          <ChevronDown size={16} aria-hidden className={styles.chevron} />
        </button>
        <span className={styles.srOnly} role="status" aria-live="polite">
          {announcementFor(name, status, error)}
        </span>
        <div
          id={contentId}
          className={expanded ? `${styles.body} ${styles.bodyOpen}` : styles.body}
          inert={!expanded ? true : undefined}
          aria-hidden={expanded ? undefined : true}
        >
          <div className={styles.bodyInner}>
            {args !== undefined ? (
              <PayloadBlock title="Arguments" value={args} copyLabel="Copy arguments" maxCodeHeight={maxCodeHeight} />
            ) : null}
            {status === 'error' && error ? (
              <div className={styles.errorBox}>
                <AlertCircle size={16} aria-hidden />
                <p>{error}</p>
                {onRetry ? (
                  <button type="button" className={styles.textButton} onClick={onRetry}>
                    Retry
                  </button>
                ) : null}
              </div>
            ) : null}
            {result !== undefined ? (
              <PayloadBlock title="Result" value={result} copyLabel="Copy result" maxCodeHeight={maxCodeHeight} />
            ) : null}
            {running && result === undefined ? <p className={styles.waiting}>Waiting for result…</p> : null}
          </div>
        </div>
      </div>
    );
  }
);

ToolCallCard.displayName = 'ToolCallCard';

export const ToolCallGroup = forwardRef<HTMLDivElement, ToolCallGroupProps>(
  (
    {
      label,
      runningLabel = 'Using tools…',
      duration,
      defaultOpen = false,
      open,
      onOpenChange,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const contentId = useId();
    const controlled = open !== undefined;
    const [openState, setOpenState] = useState(defaultOpen);
    const [live, setLive] = useState(0);
    const cards = Children.toArray(children).filter(isToolCallCard);
    const anyRunning = cards.some(card => card.props.status === 'running');
    const runningStarts = cards
      .map(card => (card.props.status === 'running' ? card.props.startedAt : undefined))
      .filter((value): value is number => typeof value === 'number');
    const originToken = runningStarts.length > 0 ? String(Math.min(...runningStarts)) : 'now';
    const durations = cards
      .map(card => card.props.duration)
      .filter((value): value is number => typeof value === 'number');
    const summed = durations.reduce((total, value) => total + value, 0);
    const shown = anyRunning ? live : (duration ?? (durations.length > 0 ? summed : live));
    const settled = label ?? usedToolsLabel(cards.length);

    useEffect(() => {
      if (!anyRunning) return;
      const origin = originToken === 'now' ? Date.now() : Number(originToken);
      const tick = () => setLive(Math.max(0, Date.now() - origin));
      const kick = window.setTimeout(tick, 0);
      const id = window.setInterval(tick, 100);
      return () => {
        window.clearTimeout(kick);
        window.clearInterval(id);
        setLive(Math.max(0, Date.now() - origin));
      };
    }, [anyRunning, originToken]);
    const headerLabel = anyRunning ? runningLabel : settled;
    const expanded = controlled ? open : openState;

    const toggle = () => {
      const next = !expanded;
      if (!controlled) setOpenState(next);
      onOpenChange?.(next);
    };

    return (
      <div
        ref={ref}
        className={`${styles.group} ${className}`}
        data-state={expanded ? 'open' : 'closed'}
        {...props}
      >
        <button
          type="button"
          className={styles.groupHeader}
          aria-expanded={expanded}
          aria-controls={contentId}
          onClick={toggle}
        >
          <span className={styles.iconStack} aria-hidden>
            {cards.slice(0, 3).map((card, index) => (
              <span key={card.key ?? card.props.name ?? index} className={styles.stackTile}>
                {card.props.icon ?? <Wrench size={12} aria-hidden />}
              </span>
            ))}
          </span>
          <span className={anyRunning ? styles.groupLabelShimmer : styles.groupLabel}>{headerLabel}</span>
          <span className={styles.groupTime}>{formatDuration(shown)}</span>
          <ChevronDown size={16} aria-hidden className={styles.chevron} />
        </button>
        <span className={styles.srOnly} role="status" aria-live="polite">
          {headerLabel}
        </span>
        <div
          id={contentId}
          className={expanded ? `${styles.body} ${styles.bodyOpen}` : styles.body}
          inert={!expanded ? true : undefined}
          aria-hidden={expanded ? undefined : true}
        >
          <div className={styles.bodyInner}>
            {Children.map(children, child =>
              isToolCallCard(child) ? cloneElement(child, { grouped: true }) : child
            )}
          </div>
        </div>
      </div>
    );
  }
);

ToolCallGroup.displayName = 'ToolCallGroup';
