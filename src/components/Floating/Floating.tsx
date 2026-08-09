/* eslint-disable react-refresh/only-export-components */
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type MutableRefObject,
  type ReactNode,
  type Ref,
  type RefObject,
} from 'react';
import { createPortal } from 'react-dom';

export type FloatingSide = 'top' | 'right' | 'bottom' | 'left';
export type FloatingAlign = 'start' | 'center' | 'end';
export type FloatingAnchorMode = 'element' | 'point';

const VIEWPORT_PADDING = 8;
const FLIP_THRESHOLD = 8;

const OPPOSITE_SIDE: Record<FloatingSide, FloatingSide> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
};

export interface ComputeFloatingPositionInput {
  anchorRect: DOMRectReadOnly;
  floatingRect: DOMRectReadOnly;
  side: FloatingSide;
  align: FloatingAlign;
  sideOffset?: number;
  sameWidth?: boolean;
  viewportPadding?: number;
  anchorMode?: FloatingAnchorMode;
}

export interface ComputeFloatingPositionResult {
  top: number;
  left: number;
  side: FloatingSide;
  align: FloatingAlign;
  width?: number;
}

type RectLike = { top: number; left: number; width: number; height: number };

export const anchorRectIntersectsViewport = (
  rect: DOMRectReadOnly,
  viewportWidth: number,
  viewportHeight: number,
  padding: number = VIEWPORT_PADDING
): boolean =>
  rect.bottom > padding &&
  rect.top < viewportHeight - padding &&
  rect.right > padding &&
  rect.left < viewportWidth - padding;

const getOverflow = (
  rect: RectLike,
  viewportWidth: number,
  viewportHeight: number,
  padding: number
): number => {
  const top = Math.max(0, padding - rect.top);
  const left = Math.max(0, padding - rect.left);
  const bottom = Math.max(0, rect.top + rect.height - (viewportHeight - padding));
  const right = Math.max(0, rect.left + rect.width - (viewportWidth - padding));
  return top + left + bottom + right;
};

const placeFloating = (
  anchorRect: DOMRectReadOnly,
  floatingRect: DOMRectReadOnly,
  side: FloatingSide,
  align: FloatingAlign,
  sideOffset: number
): { top: number; left: number } => {
  const anchor = anchorRect;
  const floating = floatingRect;

  switch (side) {
    case 'top':
      return {
        top: anchor.top - floating.height - sideOffset,
        left:
          align === 'start'
            ? anchor.left
            : align === 'end'
              ? anchor.right - floating.width
              : anchor.left + (anchor.width - floating.width) / 2,
      };
    case 'bottom':
      return {
        top: anchor.bottom + sideOffset,
        left:
          align === 'start'
            ? anchor.left
            : align === 'end'
              ? anchor.right - floating.width
              : anchor.left + (anchor.width - floating.width) / 2,
      };
    case 'left':
      return {
        top:
          align === 'start'
            ? anchor.top
            : align === 'end'
              ? anchor.bottom - floating.height
              : anchor.top + (anchor.height - floating.height) / 2,
        left: anchor.left - floating.width - sideOffset,
      };
    case 'right':
      return {
        top:
          align === 'start'
            ? anchor.top
            : align === 'end'
              ? anchor.bottom - floating.height
              : anchor.top + (anchor.height - floating.height) / 2,
        left: anchor.right + sideOffset,
      };
  }
};

const clampPosition = (
  top: number,
  left: number,
  width: number,
  height: number,
  viewportWidth: number,
  viewportHeight: number,
  padding: number
): { top: number; left: number } => ({
  top: Math.max(padding, Math.min(top, viewportHeight - height - padding)),
  left: Math.max(padding, Math.min(left, viewportWidth - width - padding)),
});

const placePointAnchor = (
  anchorRect: DOMRectReadOnly,
  floatingRect: DOMRectReadOnly,
  flipVertical: boolean,
  flipHorizontal: boolean,
  sideOffset: number
): { top: number; left: number } => {
  let top = anchorRect.top;
  let left = anchorRect.left;

  if (flipVertical) {
    top = anchorRect.top - floatingRect.height - sideOffset;
  }
  if (flipHorizontal) {
    left = anchorRect.left - floatingRect.width - sideOffset;
  }

  return { top, left };
};

const computePointFloatingPosition = ({
  anchorRect,
  floatingRect,
  sideOffset = 0,
  viewportPadding = VIEWPORT_PADDING,
}: Omit<ComputeFloatingPositionInput, 'side' | 'align' | 'sameWidth'>): ComputeFloatingPositionResult => {
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 0;
  const width = floatingRect.width;
  const height = floatingRect.height;

  const preferred = placePointAnchor(anchorRect, floatingRect, false, false, sideOffset);
  const preferredRect: RectLike = { top: preferred.top, left: preferred.left, width, height };
  const preferredOverflow = getOverflow(preferredRect, viewportWidth, viewportHeight, viewportPadding);

  const flippedVertical = placePointAnchor(anchorRect, floatingRect, true, false, sideOffset);
  const flippedVerticalRect: RectLike = {
    top: flippedVertical.top,
    left: flippedVertical.left,
    width,
    height,
  };
  const flippedVerticalOverflow = getOverflow(
    flippedVerticalRect,
    viewportWidth,
    viewportHeight,
    viewportPadding
  );

  const flipVertical = preferredOverflow - flippedVerticalOverflow > FLIP_THRESHOLD;
  const base = flipVertical ? flippedVertical : preferred;

  const flippedHorizontal = placePointAnchor(anchorRect, floatingRect, flipVertical, true, sideOffset);
  const flippedHorizontalRect: RectLike = {
    top: flippedHorizontal.top,
    left: flippedHorizontal.left,
    width,
    height,
  };
  const baseRect: RectLike = { top: base.top, left: base.left, width, height };
  const baseOverflow = getOverflow(baseRect, viewportWidth, viewportHeight, viewportPadding);
  const flippedHorizontalOverflow = getOverflow(
    flippedHorizontalRect,
    viewportWidth,
    viewportHeight,
    viewportPadding
  );

  const resolved =
    baseOverflow - flippedHorizontalOverflow > FLIP_THRESHOLD ? flippedHorizontal : base;

  const clamped = clampPosition(
    resolved.top,
    resolved.left,
    width,
    height,
    viewportWidth,
    viewportHeight,
    viewportPadding
  );

  return {
    top: clamped.top,
    left: clamped.left,
    side: flipVertical ? 'top' : 'bottom',
    align: baseOverflow - flippedHorizontalOverflow > FLIP_THRESHOLD ? 'end' : 'start',
  };
};

export const createPointAnchorRect = (x: number, y: number): DOMRectReadOnly => ({
  x,
  y,
  width: 0,
  height: 0,
  top: y,
  left: x,
  right: x,
  bottom: y,
  toJSON: () => ({}),
});

export const computeFloatingPosition = ({
  anchorRect,
  floatingRect,
  side,
  align,
  sideOffset = 0,
  sameWidth = false,
  viewportPadding = VIEWPORT_PADDING,
  anchorMode = 'element',
}: ComputeFloatingPositionInput): ComputeFloatingPositionResult => {
  if (anchorMode === 'point') {
    return computePointFloatingPosition({
      anchorRect,
      floatingRect,
      sideOffset,
      viewportPadding,
      anchorMode,
    });
  }

  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 0;
  const width = sameWidth ? anchorRect.width : floatingRect.width;
  const height = floatingRect.height;

  const preferred = placeFloating(anchorRect, { ...floatingRect, width, height }, side, align, sideOffset);
  const preferredRect: RectLike = { top: preferred.top, left: preferred.left, width, height };
  const preferredOverflow = getOverflow(preferredRect, viewportWidth, viewportHeight, viewportPadding);

  const oppositeSide = OPPOSITE_SIDE[side];
  const opposite = placeFloating(
    anchorRect,
    { ...floatingRect, width, height },
    oppositeSide,
    align,
    sideOffset
  );
  const oppositeRect: RectLike = { top: opposite.top, left: opposite.left, width, height };
  const oppositeOverflow = getOverflow(oppositeRect, viewportWidth, viewportHeight, viewportPadding);

  const resolvedSide =
    preferredOverflow - oppositeOverflow > FLIP_THRESHOLD ? oppositeSide : side;
  const base =
    resolvedSide === side
      ? preferred
      : placeFloating(anchorRect, { ...floatingRect, width, height }, resolvedSide, align, sideOffset);

  const clamped = clampPosition(
    base.top,
    base.left,
    width,
    height,
    viewportWidth,
    viewportHeight,
    viewportPadding
  );

  return {
    top: clamped.top,
    left: clamped.left,
    side: resolvedSide,
    align,
    ...(sameWidth ? { width } : {}),
  };
};

export const composeRefs =
  <T,>(...refs: Array<Ref<T> | undefined>) =>
  (node: T | null) => {
    refs.forEach(ref => {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        (ref as MutableRefObject<T | null>).current = node;
      }
    });
  };

export const getFloatingDir = (anchor: HTMLElement | null): string => {
  if (typeof document === 'undefined') {
    return 'ltr';
  }
  const fromAnchor = anchor?.closest('[dir]')?.getAttribute('dir');
  if (fromAnchor) {
    return fromAnchor;
  }
  return document.documentElement.getAttribute('dir') || 'ltr';
};

export interface FloatingPortalProps {
  children: ReactNode;
}

export const FloatingPortal = ({ children }: FloatingPortalProps) => {
  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(children, document.body);
};

export interface UseFloatingPositionOptions {
  anchorRef?: RefObject<HTMLElement | null>;
  anchorPoint?: { x: number; y: number } | null;
  floatingRef: RefObject<HTMLElement | null>;
  open: boolean;
  side?: FloatingSide;
  align?: FloatingAlign;
  sideOffset?: number;
  sameWidth?: boolean;
  anchorMode?: FloatingAnchorMode;
}

export interface UseFloatingPositionReturn {
  style: CSSProperties;
  isPositioned: boolean;
  resolvedSide: FloatingSide;
  resolvedAlign: FloatingAlign;
  dir: string;
  floatingProps: {
    'data-side': FloatingSide;
    'data-align': FloatingAlign;
    dir: string;
  };
}

export const useFloatingPosition = ({
  anchorRef,
  anchorPoint = null,
  floatingRef,
  open,
  side = 'bottom',
  align = 'center',
  sideOffset = 0,
  sameWidth = false,
  anchorMode = 'element',
}: UseFloatingPositionOptions): UseFloatingPositionReturn => {
  const resolvedAnchorMode = anchorPoint !== null ? 'point' : anchorMode;

  const [position, setPosition] = useState<ComputeFloatingPositionResult>({
    top: 0,
    left: 0,
    side,
    align,
  });
  const [dir, setDir] = useState('ltr');
  const [positionedForOpen, setPositionedForOpen] = useState(false);
  const [anchorInViewport, setAnchorInViewport] = useState(true);

  const updatePosition = useCallback(() => {
    const floating = floatingRef.current;
    if (!floating) {
      return;
    }

    const anchorElement = anchorRef?.current ?? null;
    if (resolvedAnchorMode === 'element' && !anchorElement) {
      return;
    }

    setDir(getFloatingDir(anchorElement));

    const anchorRect =
      resolvedAnchorMode === 'point' && anchorPoint !== null
        ? createPointAnchorRect(anchorPoint.x, anchorPoint.y)
        : anchorElement!.getBoundingClientRect();

    if (resolvedAnchorMode === 'element') {
      setAnchorInViewport(
        anchorRectIntersectsViewport(
          anchorRect,
          window.innerWidth,
          window.innerHeight,
          VIEWPORT_PADDING
        )
      );
    } else {
      setAnchorInViewport(true);
    }

    const result = computeFloatingPosition({
      anchorRect,
      floatingRect: floating.getBoundingClientRect(),
      side,
      align,
      sideOffset,
      sameWidth,
      anchorMode: resolvedAnchorMode,
    });

    setPosition(result);
    setPositionedForOpen(true);
  }, [
    anchorRef,
    anchorPoint,
    floatingRef,
    side,
    align,
    sideOffset,
    sameWidth,
    resolvedAnchorMode,
  ]);

  useEffect(() => {
    if (!open) {
      queueMicrotask(() => {
        setPositionedForOpen(false);
        setAnchorInViewport(true);
      });
    }
  }, [open]);

  useLayoutEffect(() => {
    if (!open) {
      return;
    }

    let rafId = 0;
    const scheduleUpdate = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updatePosition);
    };

    scheduleUpdate();

    const floating = floatingRef.current;
    const anchor = anchorRef?.current ?? null;
    const resizeObserver =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(scheduleUpdate) : null;
    if (floating) {
      resizeObserver?.observe(floating);
    }
    if (anchor) {
      resizeObserver?.observe(anchor);
    }

    const onScrollOrResize = () => scheduleUpdate();
    window.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver?.disconnect();
      window.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [open, updatePosition, anchorRef, floatingRef]);

  const hiddenForFirstPaint = open && !positionedForOpen;
  const hiddenForOffscreenAnchor = resolvedAnchorMode === 'element' && !anchorInViewport;
  const isPositioned =
    open && positionedForOpen && (resolvedAnchorMode === 'point' || anchorInViewport);

  const style: CSSProperties = {
    position: 'fixed',
    top: position.top,
    left: position.left,
    visibility: hiddenForFirstPaint || hiddenForOffscreenAnchor ? 'hidden' : 'visible',
    ...(position.width !== undefined ? { width: position.width } : {}),
  };

  return {
    style,
    isPositioned,
    resolvedSide: position.side,
    resolvedAlign: position.align,
    dir,
    floatingProps: {
      'data-side': position.side,
      'data-align': position.align,
      dir,
    },
  };
};

export interface UseInitialMenuFocusOptions {
  open: boolean;
  isPositioned: boolean;
  containerRef: RefObject<HTMLElement | null>;
  focusIndex?: number;
}

export const useInitialMenuFocus = ({
  open,
  isPositioned,
  containerRef,
  focusIndex = 0,
}: UseInitialMenuFocusOptions): void => {
  const initialFocusAppliedRef = useRef(false);

  useEffect(() => {
    if (!open) {
      initialFocusAppliedRef.current = false;
      return;
    }
    if (!isPositioned || initialFocusAppliedRef.current) {
      return;
    }

    const container = containerRef.current;
    if (!container) {
      return;
    }

    const items = Array.from(
      container.querySelectorAll(
        '[role="menuitem"]:not([aria-disabled="true"]), [role="menuitemradio"]:not([aria-disabled="true"]), [role="menuitemcheckbox"]:not([aria-disabled="true"])'
      )
    ) as HTMLElement[];

    if (items.length === 0) {
      return;
    }

    const normalized = ((focusIndex % items.length) + items.length) % items.length;
    items[normalized]?.focus();
    initialFocusAppliedRef.current = true;
  }, [open, isPositioned, containerRef, focusIndex]);
};

export interface UseDismissLayerOptions {
  open: boolean;
  onDismiss: () => void;
  contentRef: RefObject<HTMLElement | null>;
  excludeRefs?: Array<RefObject<HTMLElement | null>>;
  dismissOnEscape?: boolean;
  dismissOnOutsidePointer?: boolean;
}

export const useDismissLayer = ({
  open,
  onDismiss,
  contentRef,
  excludeRefs = [],
  dismissOnEscape = true,
  dismissOnOutsidePointer = false,
}: UseDismissLayerOptions): void => {
  const onDismissRef = useRef(onDismiss);
  const excludeRefsRef = useRef(excludeRefs);

  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  useEffect(() => {
    excludeRefsRef.current = excludeRefs;
  }, [excludeRefs]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const isInsideExcluded = (target: Node) =>
      excludeRefsRef.current.some(ref => ref.current?.contains(target)) ||
      contentRef.current?.contains(target);

    const onKeyDown = (event: KeyboardEvent) => {
      if (dismissOnEscape && event.key === 'Escape') {
        event.preventDefault();
        onDismissRef.current();
      }
    };

    const onPointerDown = (event: MouseEvent) => {
      if (!dismissOnOutsidePointer) {
        return;
      }
      const target = event.target as Node;
      if (!isInsideExcluded(target)) {
        onDismissRef.current();
      }
    };

    if (dismissOnEscape) {
      document.addEventListener('keydown', onKeyDown);
    }
    if (dismissOnOutsidePointer) {
      document.addEventListener('mousedown', onPointerDown);
    }

    return () => {
      if (dismissOnEscape) {
        document.removeEventListener('keydown', onKeyDown);
      }
      if (dismissOnOutsidePointer) {
        document.removeEventListener('mousedown', onPointerDown);
      }
    };
  }, [open, contentRef, dismissOnEscape, dismissOnOutsidePointer]);
};
