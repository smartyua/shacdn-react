/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react';
import { createPortal } from 'react-dom';

export type ModalVariant = 'dialog' | 'alertdialog' | 'drawer';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

let scrollLockCount = 0;
let previousBodyOverflow = '';

const lockBodyScroll = (): void => {
  if (scrollLockCount === 0) {
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  scrollLockCount += 1;
};

const unlockBodyScroll = (): void => {
  scrollLockCount = Math.max(0, scrollLockCount - 1);
  if (scrollLockCount === 0) {
    document.body.style.overflow = previousBodyOverflow;
  }
};

export const useBodyScrollLock = (enabled: boolean): void => {
  useEffect(() => {
    if (!enabled) {
      return;
    }
    lockBodyScroll();
    return () => unlockBodyScroll();
  }, [enabled]);
};

type InertRestore = {
  element: Element;
  ariaHidden: string | null;
  inert: boolean;
};

const applyOutsideInert = (portalContainer: HTMLElement): InertRestore[] => {
  const restored: InertRestore[] = [];

  Array.from(document.body.children).forEach(child => {
    if (child === portalContainer || child.contains(portalContainer)) {
      return;
    }
    if (child.hasAttribute('data-shacdn-modal-layer')) {
      return;
    }

    const el = child as HTMLElement;
    restored.push({
      element: child,
      ariaHidden: el.getAttribute('aria-hidden'),
      inert: el.inert,
    });
    el.setAttribute('aria-hidden', 'true');
    el.inert = true;
  });

  return restored;
};

const restoreOutsideInert = (restored: InertRestore[]): void => {
  restored.forEach(({ element, ariaHidden, inert }) => {
    const el = element as HTMLElement;
    if (ariaHidden === null) {
      el.removeAttribute('aria-hidden');
    } else {
      el.setAttribute('aria-hidden', ariaHidden);
    }
    el.inert = inert;
  });
};

export const useOutsideInert = (enabled: boolean, portalRef: RefObject<HTMLElement | null>): void => {
  useLayoutEffect(() => {
    if (!enabled) {
      return;
    }
    const portalContainer = portalRef.current;
    if (!portalContainer) {
      return;
    }

    const restored = applyOutsideInert(portalContainer);
    return () => restoreOutsideInert(restored);
  }, [enabled, portalRef]);
};

export interface UseControllableOpenOptions {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const useControllableOpen = ({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
}: UseControllableOpenOptions) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : uncontrolledOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(next);
      }
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  return { open, setOpen };
};

export interface ModalContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  requestClose: () => void;
  variant: ModalVariant;
  defaultTitleId: string;
  defaultDescriptionId: string;
  titleId: string | null;
  descriptionId: string | null;
  registerTitleId: (id: string | null) => void;
  registerDescriptionId: (id: string | null) => void;
  contentRef: RefObject<HTMLDivElement | null>;
  portalRef: RefObject<HTMLDivElement | null>;
  dismissOnOverlayClick: boolean;
  dismissOnEscape: boolean;
  preferCancelFocus: boolean;
  setOnCloseCallback: (callback: (() => void) | undefined) => void;
  layerSlot: string;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export const useModalContext = (): ModalContextValue => {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    throw new Error('Modal components must be used within Dialog, Drawer, or AlertDialog');
  }
  return ctx;
};

export const useOptionalModalContext = (): ModalContextValue | null => useContext(ModalContext);

const getFocusableElements = (container: HTMLElement): HTMLElement[] =>
  Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    el => !el.hasAttribute('disabled') && el.getAttribute('aria-hidden') !== 'true'
  );

const getInitialFocusTarget = (
  container: HTMLElement,
  preferCancelFocus: boolean
): HTMLElement | null => {
  if (preferCancelFocus) {
    const cancel = container.querySelector<HTMLElement>('[data-slot="alert-dialog-cancel"]');
    if (cancel && !cancel.hasAttribute('disabled')) {
      return cancel;
    }
  }
  const focusables = getFocusableElements(container);
  if (focusables.length > 0) {
    return focusables[0];
  }
  if (container.tabIndex < 0) {
    container.tabIndex = -1;
  }
  return container;
};

export const useModalFocus = (
  open: boolean,
  contentRef: RefObject<HTMLDivElement | null>,
  preferCancelFocus: boolean
): void => {
  const initialFocusAppliedRef = useRef(false);

  useEffect(() => {
    if (!open) {
      initialFocusAppliedRef.current = false;
      return;
    }
    if (initialFocusAppliedRef.current) {
      return;
    }

    const container = contentRef.current;
    if (!container) {
      return;
    }

    const target = getInitialFocusTarget(container, preferCancelFocus);
    target?.focus({ preventScroll: true });
    initialFocusAppliedRef.current = true;
  }, [open, contentRef, preferCancelFocus]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') {
        return;
      }

      const container = contentRef.current;
      if (!container) {
        return;
      }

      const focusables = getFocusableElements(container);
      if (focusables.length === 0) {
        event.preventDefault();
        container.focus();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement;

      if (event.shiftKey) {
        if (active === first || !container.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last || !container.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, contentRef]);
};

export const useModalDismiss = (
  open: boolean,
  requestClose: () => void,
  dismissOnEscape: boolean
): void => {
  const requestCloseRef = useRef(requestClose);

  useEffect(() => {
    requestCloseRef.current = requestClose;
  }, [requestClose]);

  useEffect(() => {
    if (!open || !dismissOnEscape) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        requestCloseRef.current();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, dismissOnEscape]);
};

export const useRestoreFocusOnClose = (open: boolean): void => {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement | null;
      return;
    }

    const toRestore = previousFocusRef.current;
    if (toRestore && document.contains(toRestore)) {
      toRestore.focus({ preventScroll: true });
    }
    previousFocusRef.current = null;
  }, [open]);

  useEffect(
    () => () => {
      if (!open) {
        return;
      }
      const toRestore = previousFocusRef.current;
      if (toRestore && document.contains(toRestore)) {
        toRestore.focus({ preventScroll: true });
      }
    },
    [open]
  );
};

export interface ModalProviderProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  variant?: ModalVariant;
  dismissOnOverlayClick?: boolean;
  dismissOnEscape?: boolean;
  preferCancelFocus?: boolean;
  layerSlot?: string;
  children: ReactNode;
}

export const ModalProvider = ({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  variant = 'dialog',
  dismissOnOverlayClick = true,
  dismissOnEscape = true,
  preferCancelFocus = false,
  layerSlot = 'dialog',
  children,
}: ModalProviderProps) => {
  const { open, setOpen } = useControllableOpen({ open: openProp, defaultOpen, onOpenChange });
  const contentRef = useRef<HTMLDivElement | null>(null);
  const portalRef = useRef<HTMLDivElement | null>(null);
  const baseId = useId();
  const defaultTitleId = `${baseId}-title`;
  const defaultDescriptionId = `${baseId}-description`;
  const [titleId, setTitleId] = useState<string | null>(null);
  const [descriptionId, setDescriptionId] = useState<string | null>(null);
  const onCloseCallbackRef = useRef<(() => void) | undefined>(undefined);

  const registerTitleId = useCallback((id: string | null) => {
    setTitleId(id);
  }, []);

  const registerDescriptionId = useCallback((id: string | null) => {
    setDescriptionId(id);
  }, []);

  const setOnCloseCallback = useCallback((callback: (() => void) | undefined) => {
    onCloseCallbackRef.current = callback;
  }, []);

  const requestClose = useCallback(() => {
    setOpen(false);
    onCloseCallbackRef.current?.();
  }, [setOpen]);

  useBodyScrollLock(open);
  useOutsideInert(open, portalRef);
  useRestoreFocusOnClose(open);

  const value = useMemo(
    (): ModalContextValue => ({
      open,
      setOpen,
      requestClose,
      variant,
      defaultTitleId,
      defaultDescriptionId,
      titleId,
      descriptionId,
      registerTitleId,
      registerDescriptionId,
      contentRef,
      portalRef,
      dismissOnOverlayClick,
      dismissOnEscape,
      preferCancelFocus,
      setOnCloseCallback,
      layerSlot,
    }),
    [
      open,
      setOpen,
      requestClose,
      variant,
      defaultTitleId,
      defaultDescriptionId,
      titleId,
      descriptionId,
      registerTitleId,
      registerDescriptionId,
      dismissOnOverlayClick,
      dismissOnEscape,
      preferCancelFocus,
      setOnCloseCallback,
      layerSlot,
    ]
  );

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
};

export interface ModalPortalProps {
  children: ReactNode;
  className?: string;
}

export const ModalPortal = ({ children, className = '' }: ModalPortalProps) => {
  const { open, portalRef, layerSlot } = useModalContext();

  if (!open || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div
      ref={portalRef}
      className={className}
      data-shacdn-modal-layer
      data-slot={layerSlot}
    >
      {children}
    </div>,
    document.body
  );
};

export const useModalTitle = (customId?: string): string => {
  const { defaultTitleId, registerTitleId } = useModalContext();
  const resolvedId = customId ?? defaultTitleId;

  useLayoutEffect(() => {
    registerTitleId(resolvedId);
    return () => registerTitleId(null);
  }, [resolvedId, registerTitleId]);

  return resolvedId;
};

export const useModalDescription = (customId?: string): string => {
  const { defaultDescriptionId, registerDescriptionId } = useModalContext();
  const resolvedId = customId ?? defaultDescriptionId;

  useLayoutEffect(() => {
    registerDescriptionId(resolvedId);
    return () => registerDescriptionId(null);
  }, [resolvedId, registerDescriptionId]);

  return resolvedId;
};
