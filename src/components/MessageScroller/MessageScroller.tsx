import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type MutableRefObject,
  type ReactNode,
  type Ref,
} from 'react';
import styles from './MessageScroller.module.scss';

const SCROLL_EDGE_THRESHOLD = 8;
const SCROLL_MARGIN = 0;
const SCROLL_PREVIOUS_ITEM_PEEK = 64;

export type MessageScrollerScrollAlign = 'start' | 'center' | 'end' | 'nearest';

export type MessageScrollerScrollOptions = {
  align?: MessageScrollerScrollAlign;
  behavior?: ScrollBehavior;
  scrollMargin?: number;
};

/** Map of messageId → whether the row intersects the viewport. */
export type MessageScrollerVisibility = Readonly<Record<string, boolean>>;

type ItemEntry = {
  element: HTMLElement;
  scrollAnchor: boolean;
};

type ScrollableState = {
  start: boolean;
  end: boolean;
};

type MessageScrollerContextValue = {
  autoScroll: boolean;
  initialScroll?: 'start' | 'end';
  viewportRef: React.RefObject<HTMLDivElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  scrollToMessage: (messageId: string, options?: MessageScrollerScrollOptions) => boolean;
  scrollToStart: (options?: MessageScrollerScrollOptions) => boolean;
  scrollToEnd: (options?: MessageScrollerScrollOptions) => boolean;
  registerItem: (messageId: string, element: HTMLElement, scrollAnchor: boolean) => void;
  unregisterItem: (messageId: string) => void;
  notifyViewportChange: () => void;
  subscribeScrollable: (listener: () => void) => () => void;
  getScrollable: () => ScrollableState;
  subscribeVisibility: (listener: () => void) => () => void;
  getVisibility: () => MessageScrollerVisibility;
  subscribeVisibilityTracking: (listener: () => void) => () => void;
  getVisibilityTrackingActive: () => boolean;
  patchVisibilityFromIntersection: (updates: Readonly<Record<string, boolean>>) => void;
  scheduleGeometryUpdate: (beforeRead?: () => void) => void;
  setPinnedToEnd: (pinned: boolean) => void;
  getPinnedToEnd: () => boolean;
  setAutoScrolling: (active: boolean) => void;
  initialScrollAppliedRef: MutableRefObject<boolean>;
};

const MessageScrollerContext = createContext<MessageScrollerContextValue | null>(null);

const useMessageScrollerContext = (): MessageScrollerContextValue => {
  const context = useContext(MessageScrollerContext);
  if (!context) {
    throw new Error('MessageScroller parts must be used within MessageScrollerProvider');
  }
  return context;
};

const composeRefs =
  <T,>(...refs: Array<Ref<T> | undefined>) =>
  (node: T | null) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        (ref as MutableRefObject<T | null>).current = node;
      }
    });
  };

const getRelativeTop = (viewport: HTMLElement, element: HTMLElement): number => {
  const viewportRect = viewport.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();
  return elementRect.top - viewportRect.top + viewport.scrollTop;
};

const scrollElementIntoView = (
  viewport: HTMLElement,
  element: HTMLElement,
  options: MessageScrollerScrollOptions = {},
  defaultMargin = SCROLL_MARGIN
): void => {
  const { align = 'start', behavior = 'auto', scrollMargin = defaultMargin } = options;
  const relativeTop = getRelativeTop(viewport, element);
  const elementHeight = element.offsetHeight;
  const viewportHeight = viewport.clientHeight;
  let targetScrollTop = viewport.scrollTop;

  switch (align) {
    case 'start':
      targetScrollTop = relativeTop - scrollMargin;
      break;
    case 'center':
      targetScrollTop = relativeTop - (viewportHeight - elementHeight) / 2;
      break;
    case 'end':
      targetScrollTop = relativeTop - viewportHeight + elementHeight + scrollMargin;
      break;
    case 'nearest': {
      const visibleTop = relativeTop - viewport.scrollTop;
      const visibleBottom = visibleTop + elementHeight;
      if (visibleTop < 0) {
        targetScrollTop = relativeTop - scrollMargin;
      } else if (visibleBottom > viewportHeight) {
        targetScrollTop = relativeTop - viewportHeight + elementHeight + scrollMargin;
      }
      break;
    }
  }

  viewport.scrollTo({
    top: Math.max(0, targetScrollTop),
    behavior,
  });
};

const isAtScrollEnd = (
  scrollTop: number,
  scrollHeight: number,
  clientHeight: number
): boolean => scrollHeight - scrollTop - clientHeight <= SCROLL_EDGE_THRESHOLD;

const computeScrollableFromMetrics = (
  scrollTop: number,
  scrollHeight: number,
  clientHeight: number,
  pinnedToEnd: boolean
): ScrollableState => {
  const fits = scrollHeight <= clientHeight + SCROLL_EDGE_THRESHOLD;

  if (fits) {
    return { start: false, end: false };
  }

  const atStart = scrollTop <= SCROLL_EDGE_THRESHOLD;
  const atEnd = isAtScrollEnd(scrollTop, scrollHeight, clientHeight);

  return {
    start: !atStart,
    end: pinnedToEnd && atEnd ? false : !atEnd,
  };
};

const elementIntersectsViewport = (
  elementRect: DOMRectReadOnly,
  viewportRect: DOMRectReadOnly
): boolean =>
  elementRect.bottom > viewportRect.top &&
  elementRect.top < viewportRect.bottom &&
  elementRect.right > viewportRect.left &&
  elementRect.left < viewportRect.right;

const buildVisibilitySnapshot = (
  viewport: HTMLElement,
  items: Map<string, ItemEntry>
): Record<string, boolean> => {
  const viewportRect = viewport.getBoundingClientRect();
  const next: Record<string, boolean> = {};

  items.forEach((entry, messageId) => {
    next[messageId] = elementIntersectsViewport(entry.element.getBoundingClientRect(), viewportRect);
  });

  return next;
};

const visibilityChanged = (
  prev: MessageScrollerVisibility,
  next: Record<string, boolean>
): boolean => {
  const prevKeys = Object.keys(prev);
  const nextKeys = Object.keys(next);
  return (
    prevKeys.length !== nextKeys.length || nextKeys.some((key) => prev[key] !== next[key])
  );
};

const buildScrollableAttr = (scrollable: ScrollableState): string | undefined => {
  const values: string[] = [];
  if (scrollable.start) values.push('start');
  if (scrollable.end) values.push('end');
  return values.length > 0 ? values.join(' ') : undefined;
};

const resolveMessageItem = (node: Node, content: HTMLElement): HTMLElement | null => {
  if (!(node instanceof HTMLElement)) return null;
  if (node.parentElement === content && node.matches('[data-message-id]')) return node;
  return null;
};

export interface MessageScrollerProviderProps {
  autoScroll?: boolean;
  initialScroll?: 'start' | 'end';
  children: ReactNode;
}

export const MessageScrollerProvider = ({
  autoScroll = false,
  initialScroll,
  children,
}: MessageScrollerProviderProps) => {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const itemsRef = useRef<Map<string, ItemEntry>>(new Map());
  const pinnedToEndRef = useRef(initialScroll !== 'start');
  const autoScrollingRef = useRef(false);
  const initialScrollAppliedRef = useRef(false);
  const pendingScrollTargetRef = useRef<{
    messageId: string;
    options?: MessageScrollerScrollOptions;
  } | null>(null);

  const scrollableRef = useRef<ScrollableState>({ start: false, end: false });
  const visibilityRef = useRef<MessageScrollerVisibility>({});
  const scrollableListenersRef = useRef(new Set<() => void>());
  const visibilityListenersRef = useRef(new Set<() => void>());
  const visibilityTrackingListenersRef = useRef(new Set<() => void>());
  const visibilityTrackingActiveRef = useRef(false);
  const geometryRafRef = useRef<number | null>(null);
  const beforeReadEffectsRef = useRef<Array<() => void>>([]);
  const syncVisibilityOnNextFlushRef = useRef(false);

  const emitScrollable = useCallback(() => {
    scrollableListenersRef.current.forEach((listener) => listener());
  }, []);

  const emitVisibility = useCallback(() => {
    visibilityListenersRef.current.forEach((listener) => listener());
  }, []);

  const emitVisibilityTrackingChange = useCallback(() => {
    visibilityTrackingListenersRef.current.forEach((listener) => listener());
  }, []);

  const flushGeometryUpdate = useCallback(() => {
    geometryRafRef.current = null;

    const viewport = viewportRef.current;
    if (!viewport) {
      beforeReadEffectsRef.current = [];
      syncVisibilityOnNextFlushRef.current = false;
      return;
    }

    const effects = beforeReadEffectsRef.current;
    beforeReadEffectsRef.current = [];
    effects.forEach((effect) => effect());

    const scrollTop = viewport.scrollTop;
    const scrollHeight = viewport.scrollHeight;
    const clientHeight = viewport.clientHeight;

    const nextScrollable = computeScrollableFromMetrics(
      scrollTop,
      scrollHeight,
      clientHeight,
      pinnedToEndRef.current
    );
    const prevScrollable = scrollableRef.current;
    if (prevScrollable.start !== nextScrollable.start || prevScrollable.end !== nextScrollable.end) {
      scrollableRef.current = nextScrollable;
      emitScrollable();
    }

    const shouldSyncVisibility =
      visibilityTrackingActiveRef.current &&
      (syncVisibilityOnNextFlushRef.current || visibilityListenersRef.current.size > 0);
    syncVisibilityOnNextFlushRef.current = false;

    if (shouldSyncVisibility) {
      const nextVisibility = buildVisibilitySnapshot(viewport, itemsRef.current);
      if (visibilityChanged(visibilityRef.current, nextVisibility)) {
        visibilityRef.current = nextVisibility;
        emitVisibility();
      }
    }
  }, [emitScrollable, emitVisibility]);

  const scheduleGeometryUpdate = useCallback(
    (beforeRead?: () => void) => {
      if (beforeRead) {
        beforeReadEffectsRef.current.push(beforeRead);
      }
      if (geometryRafRef.current !== null) return;
      geometryRafRef.current = requestAnimationFrame(flushGeometryUpdate);
    },
    [flushGeometryUpdate]
  );

  const requestVisibilitySync = useCallback(() => {
    if (!visibilityTrackingActiveRef.current) return;
    syncVisibilityOnNextFlushRef.current = true;
    scheduleGeometryUpdate();
  }, [scheduleGeometryUpdate]);

  const patchVisibilityFromIntersection = useCallback(
    (updates: Readonly<Record<string, boolean>>) => {
      if (!visibilityTrackingActiveRef.current) return;

      const prev = visibilityRef.current;
      const next = { ...prev, ...updates };
      if (visibilityChanged(prev, next)) {
        visibilityRef.current = next;
        emitVisibility();
      }
    },
    [emitVisibility]
  );

  const setVisibilityTrackingActive = useCallback(
    (active: boolean) => {
      if (visibilityTrackingActiveRef.current === active) return;
      visibilityTrackingActiveRef.current = active;
      emitVisibilityTrackingChange();
      if (active) {
        requestVisibilitySync();
      } else {
        visibilityRef.current = {};
      }
    },
    [emitVisibilityTrackingChange, requestVisibilitySync]
  );

  const setPinnedToEnd = useCallback(
    (pinned: boolean) => {
      if (pinnedToEndRef.current === pinned) return;
      pinnedToEndRef.current = pinned;
      scheduleGeometryUpdate();
    },
    [scheduleGeometryUpdate]
  );

  const getPinnedToEnd = useCallback(() => pinnedToEndRef.current, []);

  const setAutoScrolling = useCallback((active: boolean) => {
    autoScrollingRef.current = active;
    const viewport = viewportRef.current;
    if (viewport) {
      if (active) {
        viewport.dataset.autoscrolling = 'true';
      } else {
        delete viewport.dataset.autoscrolling;
      }
    }
  }, []);

  const scrollToStart = useCallback(
    (options?: MessageScrollerScrollOptions): boolean => {
      const viewport = viewportRef.current;
      if (!viewport) return false;

      pinnedToEndRef.current = false;
      setAutoScrolling(false);
      viewport.scrollTo({ top: 0, behavior: options?.behavior ?? 'auto' });
      scheduleGeometryUpdate();
      return true;
    },
    [setAutoScrolling, scheduleGeometryUpdate]
  );

  const scrollToEnd = useCallback(
    (options?: MessageScrollerScrollOptions): boolean => {
      const viewport = viewportRef.current;
      if (!viewport) return false;

      setAutoScrolling(true);
      viewport.scrollTo({
        top: viewport.scrollHeight,
        behavior: options?.behavior ?? 'auto',
      });
      pinnedToEndRef.current = true;
      scheduleGeometryUpdate(() => {
        setAutoScrolling(false);
      });
      return true;
    },
    [setAutoScrolling, scheduleGeometryUpdate]
  );

  const scrollToMessage = useCallback(
    (messageId: string, options?: MessageScrollerScrollOptions): boolean => {
      const viewport = viewportRef.current;
      const entry = itemsRef.current.get(messageId);

      if (!viewport) return false;

      if (!entry) {
        pendingScrollTargetRef.current = { messageId, options };
        return false;
      }

      pendingScrollTargetRef.current = null;
      pinnedToEndRef.current = false;
      setAutoScrolling(false);
      scrollElementIntoView(viewport, entry.element, options);
      scheduleGeometryUpdate();
      return true;
    },
    [setAutoScrolling, scheduleGeometryUpdate]
  );

  const registerItem = useCallback(
    (messageId: string, element: HTMLElement, scrollAnchor: boolean) => {
      itemsRef.current.set(messageId, { element, scrollAnchor });

      const pending = pendingScrollTargetRef.current;
      if (pending?.messageId === messageId) {
        scrollToMessage(messageId, pending.options);
      }

      requestVisibilitySync();
    },
    [scrollToMessage, requestVisibilitySync]
  );

  const unregisterItem = useCallback(
    (messageId: string) => {
      itemsRef.current.delete(messageId);
      if (!visibilityTrackingActiveRef.current) return;

      const prev = visibilityRef.current;
      if (!(messageId in prev)) return;

      const next = { ...prev };
      delete next[messageId];
      visibilityRef.current = next;
      emitVisibility();
    },
    [emitVisibility]
  );

  const notifyViewportChange = useCallback(() => {
    scheduleGeometryUpdate();
  }, [scheduleGeometryUpdate]);

  const subscribeScrollable = useCallback((listener: () => void) => {
    scrollableListenersRef.current.add(listener);
    return () => {
      scrollableListenersRef.current.delete(listener);
    };
  }, []);

  const subscribeVisibility = useCallback(
    (listener: () => void) => {
      const hadSubscribers = visibilityListenersRef.current.size > 0;
      visibilityListenersRef.current.add(listener);
      if (!hadSubscribers) {
        setVisibilityTrackingActive(true);
      }
      return () => {
        visibilityListenersRef.current.delete(listener);
        if (visibilityListenersRef.current.size === 0) {
          setVisibilityTrackingActive(false);
        }
      };
    },
    [setVisibilityTrackingActive]
  );

  const subscribeVisibilityTracking = useCallback((listener: () => void) => {
    visibilityTrackingListenersRef.current.add(listener);
    return () => {
      visibilityTrackingListenersRef.current.delete(listener);
    };
  }, []);

  const getScrollable = useCallback(() => scrollableRef.current, []);
  const getVisibility = useCallback(() => visibilityRef.current, []);
  const getVisibilityTrackingActive = useCallback(
    () => visibilityTrackingActiveRef.current,
    []
  );

  useLayoutEffect(
    () => () => {
      if (geometryRafRef.current !== null) {
        cancelAnimationFrame(geometryRafRef.current);
        geometryRafRef.current = null;
      }
      beforeReadEffectsRef.current = [];
    },
    []
  );

  const value = useMemo<MessageScrollerContextValue>(
    () => ({
      autoScroll,
      initialScroll,
      viewportRef,
      contentRef,
      scrollToMessage,
      scrollToStart,
      scrollToEnd,
      registerItem,
      unregisterItem,
      notifyViewportChange,
      subscribeScrollable,
      getScrollable,
      subscribeVisibility,
      getVisibility,
      subscribeVisibilityTracking,
      getVisibilityTrackingActive,
      patchVisibilityFromIntersection,
      scheduleGeometryUpdate,
      setPinnedToEnd,
      getPinnedToEnd,
      setAutoScrolling,
      initialScrollAppliedRef,
    }),
    [
      autoScroll,
      initialScroll,
      scrollToMessage,
      scrollToStart,
      scrollToEnd,
      registerItem,
      unregisterItem,
      notifyViewportChange,
      subscribeScrollable,
      getScrollable,
      subscribeVisibility,
      getVisibility,
      subscribeVisibilityTracking,
      getVisibilityTrackingActive,
      patchVisibilityFromIntersection,
      scheduleGeometryUpdate,
      setPinnedToEnd,
      getPinnedToEnd,
      setAutoScrolling,
    ]
  );

  return <MessageScrollerContext.Provider value={value}>{children}</MessageScrollerContext.Provider>;
};

MessageScrollerProvider.displayName = 'MessageScrollerProvider';

export type MessageScrollerProps = HTMLAttributes<HTMLDivElement>;

export const MessageScroller = forwardRef<HTMLDivElement, MessageScrollerProps>(
  ({ className = '', children, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="message-scroller"
      className={`${styles.root} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  )
);

MessageScroller.displayName = 'MessageScroller';

export interface MessageScrollerViewportProps extends HTMLAttributes<HTMLDivElement> {
  preserveScrollOnPrepend?: boolean;
}

export const MessageScrollerViewport = forwardRef<HTMLDivElement, MessageScrollerViewportProps>(
  (
    {
      className = '',
      preserveScrollOnPrepend = true,
      role = 'region',
      'aria-label': ariaLabel = 'Messages',
      tabIndex = 0,
      ...props
    },
    ref
  ) => {
    const {
      autoScroll,
      initialScroll,
      viewportRef,
      contentRef,
      scrollToEnd,
      scrollToStart,
      scheduleGeometryUpdate,
      setPinnedToEnd,
      getPinnedToEnd,
      setAutoScrolling,
      initialScrollAppliedRef,
      subscribeScrollable,
      getScrollable,
      subscribeVisibilityTracking,
      getVisibilityTrackingActive,
      patchVisibilityFromIntersection,
    } = useMessageScrollerContext();

    const intersectionObserverRef = useRef<IntersectionObserver | null>(null);
    const mutationObserverRef = useRef<MutationObserver | null>(null);
    const resizeObserverRef = useRef<ResizeObserver | null>(null);
    const previousScrollHeightRef = useRef(0);
    const previousChildCountRef = useRef(0);

    const visibilityTrackingActive = useSyncExternalStore(
      subscribeVisibilityTracking,
      getVisibilityTrackingActive,
      getVisibilityTrackingActive
    );

    const observeMessageItems = useCallback((root: IntersectionObserver, content: HTMLElement) => {
      content.querySelectorAll<HTMLElement>('[data-message-id]').forEach((node) => {
        root.observe(node);
      });
    }, []);

    const handleScroll = useCallback(() => {
      const viewport = viewportRef.current;
      if (!viewport) return;

      const atEnd = isAtScrollEnd(viewport.scrollTop, viewport.scrollHeight, viewport.clientHeight);
      setPinnedToEnd(atEnd);
      setAutoScrolling(false);
      scheduleGeometryUpdate();
    }, [viewportRef, setPinnedToEnd, setAutoScrolling, scheduleGeometryUpdate]);

    const applyInitialScroll = useCallback(() => {
      const content = contentRef.current;
      if (!content || content.children.length === 0) return false;

      if (initialScroll === 'start') {
        scrollToStart({ behavior: 'auto' });
        return true;
      }

      scrollToEnd({ behavior: 'auto' });
      return true;
    }, [contentRef, initialScroll, scrollToStart, scrollToEnd]);

    useLayoutEffect(() => {
      const viewport = viewportRef.current;
      const content = contentRef.current;
      if (!viewport || !content) return;

      previousScrollHeightRef.current = viewport.scrollHeight;
      previousChildCountRef.current = content.children.length;

      if (!initialScrollAppliedRef.current && content.children.length > 0) {
        initialScrollAppliedRef.current = true;
        requestAnimationFrame(() => {
          applyInitialScroll();
        });
      }

      mutationObserverRef.current = new MutationObserver((mutations) => {
        const prevScrollHeight = previousScrollHeightRef.current;
        const prevScrollTop = viewport.scrollTop;
        const prevChildCount = previousChildCountRef.current;

        let prepended = false;
        let appendedAnchor = false;
        const addedItems: HTMLElement[] = [];

        mutations.forEach((mutation) => {
          if (mutation.type !== 'childList') return;

          mutation.addedNodes.forEach((node) => {
            const item = resolveMessageItem(node, content);
            if (!item) return;

            addedItems.push(item);
            if (item.dataset.scrollAnchor === 'true') {
              appendedAnchor = true;
            }
            if (content.firstElementChild === item) {
              prepended = true;
            }
          });
        });

        const nextChildCount = content.children.length;

        if (visibilityTrackingActive && addedItems.length > 0) {
          addedItems.forEach((item) => {
            intersectionObserverRef.current?.observe(item);
          });
        }

        scheduleGeometryUpdate(() => {
          const heightDelta = viewport.scrollHeight - prevScrollHeight;

          if (
            preserveScrollOnPrepend &&
            prepended &&
            heightDelta > 0 &&
            prevScrollTop > 0 &&
            !getPinnedToEnd()
          ) {
            viewport.scrollTop = prevScrollTop + heightDelta;
          } else if (appendedAnchor && nextChildCount > prevChildCount) {
            const items = Array.from(
              content.querySelectorAll<HTMLElement>('[data-scroll-anchor="true"]')
            );
            const anchor = items.at(-1);
            if (anchor) {
              const margin = SCROLL_MARGIN + SCROLL_PREVIOUS_ITEM_PEEK;
              scrollElementIntoView(viewport, anchor, {
                align: 'start',
                behavior: 'auto',
                scrollMargin: margin,
              });
              setPinnedToEnd(false);
            }
          } else if (autoScroll && getPinnedToEnd()) {
            setAutoScrolling(true);
            viewport.scrollTop = viewport.scrollHeight;
            setAutoScrolling(false);
          }

          previousScrollHeightRef.current = viewport.scrollHeight;
          previousChildCountRef.current = nextChildCount;
        });
      });

      mutationObserverRef.current.observe(content, { childList: true });

      resizeObserverRef.current = new ResizeObserver(() => {
        scheduleGeometryUpdate(() => {
          if (autoScroll && getPinnedToEnd()) {
            setAutoScrolling(true);
            viewport.scrollTop = viewport.scrollHeight;
            setAutoScrolling(false);
          }
        });
      });

      resizeObserverRef.current.observe(content);

      viewport.addEventListener('scroll', handleScroll, { passive: true });
      scheduleGeometryUpdate();

      return () => {
        viewport.removeEventListener('scroll', handleScroll);
        intersectionObserverRef.current?.disconnect();
        intersectionObserverRef.current = null;
        mutationObserverRef.current?.disconnect();
        mutationObserverRef.current = null;
        resizeObserverRef.current?.disconnect();
        resizeObserverRef.current = null;
      };
    }, [
      viewportRef,
      contentRef,
      autoScroll,
      preserveScrollOnPrepend,
      applyInitialScroll,
      handleScroll,
      getPinnedToEnd,
      setPinnedToEnd,
      setAutoScrolling,
      initialScrollAppliedRef,
      scheduleGeometryUpdate,
      visibilityTrackingActive,
    ]);

    useLayoutEffect(() => {
      const viewport = viewportRef.current;
      const content = contentRef.current;
      if (!viewport || !content) return;

      intersectionObserverRef.current?.disconnect();
      intersectionObserverRef.current = null;

      if (!visibilityTrackingActive) return;

      intersectionObserverRef.current = new IntersectionObserver(
        (entries) => {
          const updates: Record<string, boolean> = {};
          entries.forEach((entry) => {
            const messageId = (entry.target as HTMLElement).dataset.messageId;
            if (messageId) {
              updates[messageId] = entry.isIntersecting;
            }
          });
          if (Object.keys(updates).length > 0) {
            patchVisibilityFromIntersection(updates);
          }
        },
        { root: viewport, threshold: [0, 0.01, 0.25, 0.5, 0.75, 1] }
      );

      observeMessageItems(intersectionObserverRef.current, content);

      return () => {
        intersectionObserverRef.current?.disconnect();
        intersectionObserverRef.current = null;
      };
    }, [
      viewportRef,
      contentRef,
      visibilityTrackingActive,
      observeMessageItems,
      patchVisibilityFromIntersection,
    ]);

    const scrollable = useSyncExternalStore(subscribeScrollable, getScrollable, getScrollable);

    return (
      <div
        ref={composeRefs(ref, viewportRef)}
        data-slot="message-scroller-viewport"
        data-scrollable={buildScrollableAttr(scrollable)}
        role={role}
        aria-label={ariaLabel}
        tabIndex={tabIndex}
        className={`${styles.viewport} ${className}`.trim()}
        {...props}
      />
    );
  }
);

MessageScrollerViewport.displayName = 'MessageScrollerViewport';

export type MessageScrollerContentProps = HTMLAttributes<HTMLDivElement>;

export const MessageScrollerContent = forwardRef<HTMLDivElement, MessageScrollerContentProps>(
  (
    {
      className = '',
      role = 'log',
      'aria-relevant': ariaRelevant = 'additions',
      ...props
    },
    ref
  ) => {
    const { contentRef } = useMessageScrollerContext();

    return (
      <div
        ref={composeRefs(ref, contentRef)}
        data-slot="message-scroller-content"
        role={role}
        aria-relevant={ariaRelevant}
        className={`${styles.content} ${className}`.trim()}
        {...props}
      />
    );
  }
);

MessageScrollerContent.displayName = 'MessageScrollerContent';

export interface MessageScrollerItemProps extends HTMLAttributes<HTMLDivElement> {
  messageId: string;
  scrollAnchor?: boolean;
}

export const MessageScrollerItem = forwardRef<HTMLDivElement, MessageScrollerItemProps>(
  ({ className = '', messageId, scrollAnchor = false, ...props }, ref) => {
    const { registerItem, unregisterItem } = useMessageScrollerContext();
    const itemRef = useRef<HTMLDivElement | null>(null);

    useLayoutEffect(() => {
      const element = itemRef.current;
      if (!element) return undefined;

      registerItem(messageId, element, scrollAnchor);
      return () => {
        unregisterItem(messageId);
      };
    }, [messageId, scrollAnchor, registerItem, unregisterItem]);

    return (
      <div
        ref={composeRefs(ref, itemRef)}
        data-slot="message-scroller-item"
        data-message-id={messageId}
        data-scroll-anchor={scrollAnchor ? 'true' : 'false'}
        className={`${styles.item} ${className}`.trim()}
        {...props}
      />
    );
  }
);

MessageScrollerItem.displayName = 'MessageScrollerItem';

const ScrollArrowIcon = () => (
  <svg
    className={styles.icon}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 5v14" />
    <path d="m19 12-7 7-7-7" />
  </svg>
);

export interface MessageScrollerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  direction?: 'start' | 'end';
  behavior?: ScrollBehavior;
}

export const MessageScrollerButton = forwardRef<HTMLButtonElement, MessageScrollerButtonProps>(
  (
    {
      className = '',
      direction = 'end',
      behavior = 'smooth',
      children,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const { scrollToStart, scrollToEnd, subscribeScrollable, getScrollable } =
      useMessageScrollerContext();

    const scrollable = useSyncExternalStore(subscribeScrollable, getScrollable, getScrollable);
    const active = direction === 'end' ? scrollable.end : scrollable.start;
    const defaultLabel = direction === 'end' ? 'Scroll to end' : 'Scroll to start';

    const handleClick = useCallback(() => {
      if (direction === 'end') {
        scrollToEnd({ behavior });
      } else {
        scrollToStart({ behavior });
      }
    }, [direction, behavior, scrollToEnd, scrollToStart]);

    return (
      <button
        ref={ref}
        type="button"
        data-slot="message-scroller-button"
        data-direction={direction}
        data-active={active ? 'true' : 'false'}
        aria-label={ariaLabel ?? defaultLabel}
        aria-hidden={active ? undefined : true}
        inert={active ? undefined : true}
        tabIndex={active ? 0 : -1}
        className={`${styles.button} ${className}`.trim()}
        onClick={handleClick}
        {...props}
      >
        {children ?? <ScrollArrowIcon />}
      </button>
    );
  }
);

MessageScrollerButton.displayName = 'MessageScrollerButton';

// eslint-disable-next-line react-refresh/only-export-components
export const useMessageScroller = () => {
  const { scrollToMessage, scrollToStart, scrollToEnd, viewportRef } = useMessageScrollerContext();
  return { scrollToMessage, scrollToStart, scrollToEnd, viewportRef };
};

// eslint-disable-next-line react-refresh/only-export-components
export const useMessageScrollerScrollable = (): ScrollableState => {
  const { subscribeScrollable, getScrollable } = useMessageScrollerContext();
  return useSyncExternalStore(subscribeScrollable, getScrollable, getScrollable);
};

// eslint-disable-next-line react-refresh/only-export-components
export const useMessageScrollerVisibility = (): MessageScrollerVisibility => {
  const { subscribeVisibility, getVisibility } = useMessageScrollerContext();
  return useSyncExternalStore(subscribeVisibility, getVisibility, getVisibility);
};
