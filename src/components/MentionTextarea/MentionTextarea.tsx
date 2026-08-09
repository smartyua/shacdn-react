import { Link2 } from 'lucide-react';
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react';
import {
  FloatingPortal,
  useDismissLayer,
  useFloatingPosition,
} from '../Floating/Floating';
import {
  defaultFormatLinkLabel,
  extractMentions,
  filterCommands,
  filterUsers,
  findActiveTrigger,
  findDecorationRanges,
  replaceRange,
  type MentionRef,
  type MentionUser,
  type SlashCommand,
} from './mentionTextareaUtils';
import styles from './MentionTextarea.module.scss';

export type {
  MentionRef,
  MentionUser,
  SlashCommand,
} from './mentionTextareaUtils';

/** Any CSS color/gradient accepted by `background`. */
export interface MentionTextareaChipBackgrounds {
  mention?: string;
  command?: string;
  link?: string;
}

export interface MentionTextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'children'> {
  users?: MentionUser[];
  commands?: SlashCommand[];
  onMentionsChange?: (mentions: MentionRef[]) => void;
  onCommand?: (command: SlashCommand) => void;
  formatLinkLabel?: (url: string) => string;
  emptyMentionsText?: string;
  emptyCommandsText?: string;
  /** Single value styles every chip; an object targets each chip type. */
  chipBackground?: string | MentionTextareaChipBackgrounds;
}

const COPY_STYLES = [
  'boxSizing',
  'width',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'borderTopWidth',
  'borderRightWidth',
  'borderBottomWidth',
  'borderLeftWidth',
  'fontFamily',
  'fontSize',
  'fontWeight',
  'fontStyle',
  'letterSpacing',
  'textTransform',
  'textIndent',
  'lineHeight',
  'wordSpacing',
  'whiteSpace',
  'wordWrap',
  'overflowWrap',
  'tabSize',
] as const;

const getCaretPoint = (
  textarea: HTMLTextAreaElement,
  position: number
): { x: number; y: number } => {
  const mirror = document.createElement('div');
  const computed = window.getComputedStyle(textarea);
  mirror.setAttribute('aria-hidden', 'true');

  const mirrorStyle = mirror.style;
  mirrorStyle.position = 'fixed';
  mirrorStyle.top = '0';
  mirrorStyle.left = '0';
  mirrorStyle.visibility = 'hidden';
  mirrorStyle.overflow = 'hidden';
  mirrorStyle.whiteSpace = 'pre-wrap';
  mirrorStyle.wordWrap = 'break-word';
  mirrorStyle.height = 'auto';

  for (const key of COPY_STYLES) {
    mirrorStyle.setProperty(
      key.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`),
      computed[key]
    );
  }
  mirrorStyle.width = `${textarea.clientWidth}px`;

  const before = textarea.value.slice(0, position);
  const marker = document.createElement('span');
  marker.textContent = '\u200b';
  mirror.textContent = before;
  mirror.appendChild(marker);
  document.body.appendChild(mirror);

  const textareaRect = textarea.getBoundingClientRect();
  const markerRect = marker.getBoundingClientRect();
  const mirrorRect = mirror.getBoundingClientRect();

  const x =
    textareaRect.left +
    (markerRect.left - mirrorRect.left) -
    textarea.scrollLeft;
  const y =
    textareaRect.top +
    (markerRect.top - mirrorRect.top) -
    textarea.scrollTop +
    markerRect.height;

  document.body.removeChild(mirror);
  return { x, y };
};

export const MentionTextarea = forwardRef<HTMLTextAreaElement, MentionTextareaProps>(
  (
    {
      className = '',
      users = [],
      commands = [],
      onMentionsChange,
      onCommand,
      formatLinkLabel = defaultFormatLinkLabel,
      emptyMentionsText = 'No users found.',
      emptyCommandsText = 'No commands found.',
      chipBackground,
      value: valueControlled,
      defaultValue = '',
      onChange,
      disabled,
      id: idProp,
      onKeyDown,
      onSelect,
      onClick,
      onScroll,
      'aria-invalid': ariaInvalid,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = idProp ?? generatedId;
    const listboxId = `${id}-listbox`;

    const [internal, setInternal] = useState(String(defaultValue ?? ''));
    const value = valueControlled !== undefined ? String(valueControlled) : internal;

    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const backdropRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const rootRef = useRef<HTMLDivElement>(null);

    const [caret, setCaret] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);
    const [dismissedKey, setDismissedKey] = useState<string | null>(null);
    const [anchorPoint, setAnchorPoint] = useState<{ x: number; y: number } | null>(
      null
    );

    const setRefs = useCallback(
      (node: HTMLTextAreaElement | null) => {
        textareaRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    const trigger = useMemo(
      () => findActiveTrigger(value, caret),
      [value, caret]
    );

    const mentionItems = useMemo(
      () =>
        trigger?.type === 'mention' ? filterUsers(users, trigger.query) : [],
      [trigger, users]
    );

    const commandItems = useMemo(
      () =>
        trigger?.type === 'command'
          ? filterCommands(commands, trigger.query)
          : [],
      [trigger, commands]
    );

    const triggerKey = trigger
      ? `${trigger.type}:${trigger.start}:${trigger.query}`
      : null;
    const open = Boolean(trigger) && !disabled && triggerKey !== dismissedKey;
    const items = trigger?.type === 'mention' ? mentionItems : commandItems;
    const emptyText =
      trigger?.type === 'command' ? emptyCommandsText : emptyMentionsText;

    const resolvedActiveIndex =
      items.length === 0
        ? -1
        : Math.min(Math.max(activeIndex, 0), items.length - 1);
    const activeOptionId =
      open && resolvedActiveIndex >= 0
        ? `${id}-option-${resolvedActiveIndex}`
        : undefined;

    const emitMentions = useCallback(
      (nextValue: string) => {
        onMentionsChange?.(extractMentions(nextValue, users));
      },
      [onMentionsChange, users]
    );

    const applyValueFromEvent = useCallback(
      (e: ChangeEvent<HTMLTextAreaElement>) => {
        const next = e.target.value;
        if (valueControlled === undefined) {
          setInternal(next);
        }
        onChange?.(e);
        setCaret(e.target.selectionStart ?? next.length);
        setDismissedKey(null);
        emitMentions(next);
      },
      [valueControlled, onChange, emitMentions]
    );

    const closeSuggestion = useCallback(() => {
      if (triggerKey) {
        setDismissedKey(triggerKey);
      }
      setAnchorPoint(null);
      setActiveIndex(0);
    }, [triggerKey]);

    const syncCaretMetrics = useCallback(() => {
      const el = textareaRef.current;
      if (!el || !trigger) {
        setAnchorPoint(null);
        return;
      }
      setAnchorPoint(getCaretPoint(el, el.selectionStart ?? caret));
    }, [trigger, caret]);

    useLayoutEffect(() => {
      if (open) {
        syncCaretMetrics();
        setActiveIndex(0);
      } else {
        setAnchorPoint(null);
      }
    }, [open, trigger?.type, trigger?.start, trigger?.query, syncCaretMetrics]);

    const usersKey = users.map(u => `${u.id}:${u.handle}`).join('|');
    useEffect(() => {
      onMentionsChange?.(extractMentions(value, users));
      // Intentionally keyed by usersKey so typing emits from change handlers only.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [usersKey]);

    const { style, floatingProps } = useFloatingPosition({
      anchorRef: rootRef,
      anchorPoint,
      floatingRef: listRef,
      open: open && anchorPoint !== null,
      side: 'bottom',
      align: 'start',
      sideOffset: 4,
    });

    useDismissLayer({
      open,
      onDismiss: closeSuggestion,
      contentRef: listRef,
      excludeRefs: [rootRef, textareaRef],
      dismissOnEscape: false,
      dismissOnOutsidePointer: true,
    });

    const selectMention = useCallback(
      (user: MentionUser) => {
        if (!trigger || trigger.type !== 'mention') {
          return;
        }
        const insert = `@${user.handle} `;
        const next = replaceRange(value, trigger.start, caret, insert);
        const nextCaret = trigger.start + insert.length;
        if (valueControlled === undefined) {
          setInternal(next);
        }
        const el = textareaRef.current;
        if (el) {
          el.value = next;
          onChange?.({
            target: el,
            currentTarget: el,
          } as ChangeEvent<HTMLTextAreaElement>);
          requestAnimationFrame(() => {
            el.focus();
            el.setSelectionRange(nextCaret, nextCaret);
            setCaret(nextCaret);
          });
        }
        emitMentions(next);
        closeSuggestion();
      },
      [
        trigger,
        value,
        caret,
        valueControlled,
        onChange,
        emitMentions,
        closeSuggestion,
      ]
    );

    const selectCommand = useCallback(
      (command: SlashCommand) => {
        if (!trigger || trigger.type !== 'command') {
          return;
        }
        const next = replaceRange(value, trigger.start, caret, '');
        const nextCaret = trigger.start;
        if (valueControlled === undefined) {
          setInternal(next);
        }
        const el = textareaRef.current;
        if (el) {
          el.value = next;
          onChange?.({
            target: el,
            currentTarget: el,
          } as ChangeEvent<HTMLTextAreaElement>);
          requestAnimationFrame(() => {
            el.focus();
            el.setSelectionRange(nextCaret, nextCaret);
            setCaret(nextCaret);
          });
        }
        emitMentions(next);
        onCommand?.(command);
        closeSuggestion();
      },
      [
        trigger,
        value,
        caret,
        valueControlled,
        onChange,
        emitMentions,
        onCommand,
        closeSuggestion,
      ]
    );

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented || !open) {
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        closeSuggestion();
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (items.length > 0) {
          setActiveIndex(prev => (prev + 1) % items.length);
        }
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (items.length > 0) {
          setActiveIndex(prev => (prev <= 0 ? items.length - 1 : prev - 1));
        }
        return;
      }

      if (
        (e.key === 'Enter' || e.key === 'Tab') &&
        resolvedActiveIndex >= 0 &&
        items[resolvedActiveIndex]
      ) {
        e.preventDefault();
        if (trigger?.type === 'mention') {
          selectMention(mentionItems[resolvedActiveIndex]!);
        } else if (trigger?.type === 'command') {
          selectCommand(commandItems[resolvedActiveIndex]!);
        }
      }
    };

    const syncScroll = () => {
      const el = textareaRef.current;
      const backdrop = backdropRef.current;
      if (el && backdrop) {
        backdrop.scrollTop = el.scrollTop;
        backdrop.scrollLeft = el.scrollLeft;
      }
    };

    const decorations = useMemo(
      () => findDecorationRanges(value, users, commands),
      [value, users, commands]
    );

    const backdropContent = useMemo(() => {
      if (!value) {
        return null;
      }
      const nodes: ReactNode[] = [];
      let cursor = 0;
      decorations.forEach((range, index) => {
        if (range.start > cursor) {
          nodes.push(
            <span key={`t-${cursor}`} className={styles.plain}>
              {value.slice(cursor, range.start)}
            </span>
          );
        }

        const segment = value.slice(range.start, range.end);

        if (range.type === 'mention') {
          nodes.push(
            <span
              key={`m-${index}`}
              className={styles.mentionChip}
              data-decoration="mention"
              data-pad-start={range.padStart ? 'true' : undefined}
              data-pad-end={range.padEnd ? 'true' : undefined}
            >
              <span className={styles.chipPhantom}>{segment}</span>
              <span className={styles.mentionLabel} data-decoration-label="mention">
                {range.text}
              </span>
            </span>
          );
        } else if (range.type === 'command') {
          nodes.push(
            <span
              key={`c-${index}`}
              className={styles.commandChip}
              data-decoration="command"
            >
              {segment}
            </span>
          );
        } else {
          const label = formatLinkLabel(range.text);
          nodes.push(
            <span
              key={`u-${index}`}
              className={styles.linkChip}
              data-decoration="link"
            >
              <span className={styles.linkPhantom}>{segment}</span>
              <span className={styles.linkLabel}>
                <Link2 className={styles.linkIcon} aria-hidden />
                <span>{label}</span>
              </span>
            </span>
          );
        }
        cursor = range.end;
      });
      if (cursor < value.length) {
        nodes.push(
          <span key={`t-${cursor}`} className={styles.plain}>
            {value.slice(cursor)}
          </span>
        );
      }
      // Trailing newline needs a break to match textarea height.
      if (value.endsWith('\n')) {
        nodes.push(<br key="trailing-br" />);
      }
      return nodes;
    }, [value, decorations, formatLinkLabel]);

    const listStyle = {
      ...style,
      visibility: (style as CSSProperties).visibility,
    } as CSSProperties;

    const chipStyle = useMemo(() => {
      if (!chipBackground) {
        return undefined;
      }
      const vars: Record<string, string> = {};
      if (typeof chipBackground === 'string') {
        vars['--mention-textarea-chip-bg'] = chipBackground;
      } else {
        if (chipBackground.mention) {
          vars['--mention-textarea-mention-bg'] = chipBackground.mention;
        }
        if (chipBackground.command) {
          vars['--mention-textarea-command-bg'] = chipBackground.command;
        }
        if (chipBackground.link) {
          vars['--mention-textarea-link-bg'] = chipBackground.link;
        }
      }
      return vars as CSSProperties;
    }, [chipBackground]);

    return (
      <div
        ref={rootRef}
        className={`${styles.root} ${className}`}
        style={chipStyle}
        data-slot="mention-textarea"
      >
        <div
          className={styles.field}
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={open ? listboxId : undefined}
          data-disabled={disabled ? 'true' : undefined}
          data-invalid={ariaInvalid ? 'true' : undefined}
        >
          <div
            ref={backdropRef}
            className={styles.backdrop}
            aria-hidden="true"
            data-slot="mention-textarea-backdrop"
          >
            {backdropContent}
          </div>
          <textarea
            {...props}
            id={id}
            ref={setRefs}
            disabled={disabled}
            aria-invalid={ariaInvalid}
            aria-autocomplete="list"
            aria-controls={open ? listboxId : undefined}
            aria-activedescendant={activeOptionId}
            className={styles.textarea}
            value={value}
            onChange={applyValueFromEvent}
            onKeyDown={handleKeyDown}
            onClick={e => {
              onClick?.(e);
              setCaret(e.currentTarget.selectionStart ?? 0);
            }}
            onSelect={e => {
              onSelect?.(e);
              setCaret(e.currentTarget.selectionStart ?? 0);
            }}
            onScroll={e => {
              onScroll?.(e);
              syncScroll();
            }}
            data-slot="mention-textarea-input"
          />
        </div>

        {open && anchorPoint && (
          <FloatingPortal>
            <ul
              ref={listRef}
              id={listboxId}
              role="listbox"
              data-slot="mention-textarea-list"
              className={styles.list}
              style={listStyle}
              {...floatingProps}
            >
              {items.length === 0 ? (
                <li className={styles.empty} role="presentation">
                  {emptyText}
                </li>
              ) : trigger?.type === 'mention' ? (
                mentionItems.map((user, index) => (
                  <li key={user.id} role="presentation">
                    <button
                      type="button"
                      id={`${id}-option-${index}`}
                      role="option"
                      aria-selected={index === resolvedActiveIndex}
                      className={`${styles.option} ${
                        index === resolvedActiveIndex ? styles.optionActive : ''
                      }`}
                      onMouseDown={e => {
                        e.preventDefault();
                        selectMention(user);
                      }}
                    >
                      <span>{user.label}</span>
                      <span className={styles.optionMeta}>@{user.handle}</span>
                    </button>
                  </li>
                ))
              ) : (
                commandItems.map((command, index) => (
                  <li key={command.id} role="presentation">
                    <button
                      type="button"
                      id={`${id}-option-${index}`}
                      role="option"
                      aria-selected={index === resolvedActiveIndex}
                      className={`${styles.option} ${
                        index === resolvedActiveIndex ? styles.optionActive : ''
                      }`}
                      onMouseDown={e => {
                        e.preventDefault();
                        selectCommand(command);
                      }}
                    >
                      <span>/{command.name}</span>
                      {command.description ? (
                        <span className={styles.optionMeta}>
                          {command.description}
                        </span>
                      ) : null}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </FloatingPortal>
        )}
      </div>
    );
  }
);

MentionTextarea.displayName = 'MentionTextarea';
