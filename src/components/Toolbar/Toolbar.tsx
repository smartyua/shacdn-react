import {
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type FocusEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type RefObject,
} from 'react';
import { useDirection } from '../Direction/Direction';
import { composeRefs } from '../Floating/Floating';
import styles from './Toolbar.module.scss';

type ToolbarOrientation = 'horizontal' | 'vertical';

type ToolbarContextValue = {
  orientation: ToolbarOrientation;
};

const ToolbarContext = createContext<ToolbarContextValue | null>(null);

const useToolbar = (): ToolbarContextValue => {
  const context = useContext(ToolbarContext);
  if (!context) {
    throw new Error('Toolbar parts must be used within Toolbar');
  }
  return context;
};

const TOOLBAR_ITEM_SELECTOR = '[data-toolbar-item]:not([disabled]):not([aria-disabled="true"])';

const getToolbarItems = (root: HTMLElement | null): HTMLElement[] => {
  if (!root) {
    return [];
  }
  return Array.from(root.querySelectorAll<HTMLElement>(TOOLBAR_ITEM_SELECTOR));
};

const syncTabIndexes = (root: HTMLElement | null, active?: HTMLElement | null) => {
  const items = getToolbarItems(root);
  if (items.length === 0) {
    return;
  }
  const current =
    active && items.includes(active)
      ? active
      : items.find(item => item.tabIndex === 0) ?? items[0];
  items.forEach(item => {
    item.tabIndex = item === current ? 0 : -1;
  });
};

export interface ToolbarProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: ToolbarOrientation;
  loop?: boolean;
  dir?: 'ltr' | 'rtl';
  children: ReactNode;
}

export const Toolbar = forwardRef<HTMLDivElement, ToolbarProps>(
  (
    {
      orientation = 'horizontal',
      loop = true,
      dir: dirProp,
      className = '',
      children,
      onKeyDown,
      onFocusCapture,
      ...props
    },
    ref
  ) => {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const { dir: contextDir } = useDirection();
    const dir = dirProp ?? contextDir;

    useEffect(() => {
      syncTabIndexes(rootRef.current);
    }, [children]);

    const focusItem = (index: number) => {
      const root = rootRef.current;
      const items = getToolbarItems(root);
      if (items.length === 0) {
        return;
      }
      const normalized = loop
        ? ((index % items.length) + items.length) % items.length
        : Math.max(0, Math.min(index, items.length - 1));
      const target = items[normalized];
      syncTabIndexes(root, target);
      target.focus();
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) {
        return;
      }

      const items = getToolbarItems(rootRef.current);
      if (items.length === 0) {
        return;
      }
      const currentIndex = items.indexOf(document.activeElement as HTMLElement);
      if (currentIndex < 0) {
        return;
      }

      const isHorizontal = orientation === 'horizontal';
      const nextKey = isHorizontal
        ? dir === 'rtl'
          ? 'ArrowLeft'
          : 'ArrowRight'
        : 'ArrowDown';
      const prevKey = isHorizontal
        ? dir === 'rtl'
          ? 'ArrowRight'
          : 'ArrowLeft'
        : 'ArrowUp';

      switch (event.key) {
        case nextKey:
          event.preventDefault();
          focusItem(currentIndex + 1);
          break;
        case prevKey:
          event.preventDefault();
          focusItem(currentIndex - 1);
          break;
        case 'Home':
          event.preventDefault();
          focusItem(0);
          break;
        case 'End':
          event.preventDefault();
          focusItem(items.length - 1);
          break;
        default:
          break;
      }
    };

    const handleFocusCapture = (event: FocusEvent<HTMLDivElement>) => {
      onFocusCapture?.(event);
      const target = event.target;
      if (!(target instanceof HTMLElement)) {
        return;
      }
      if (target.matches(TOOLBAR_ITEM_SELECTOR)) {
        syncTabIndexes(rootRef.current, target);
      }
    };

    const contextValue = useMemo(() => ({ orientation }), [orientation]);

    return (
      <ToolbarContext.Provider value={contextValue}>
        <div
          ref={composeRefs(ref, rootRef)}
          role="toolbar"
          aria-orientation={orientation}
          data-orientation={orientation}
          data-slot="toolbar"
          dir={dir}
          className={`${styles.toolbar} ${className}`}
          onKeyDown={handleKeyDown}
          onFocusCapture={handleFocusCapture}
          {...props}
        >
          {children}
        </div>
      </ToolbarContext.Provider>
    );
  }
);

Toolbar.displayName = 'Toolbar';

export type ToolbarButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
};

export const ToolbarButton = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ asChild = false, className = '', children, ...props }, ref) => {
    const { orientation } = useToolbar();

    if (asChild && isValidElement(children)) {
      const child = children as ReactElement<{
        className?: string;
        ref?: RefObject<HTMLButtonElement | null>;
        [key: string]: unknown;
      }>;
      const childRef = child.props.ref;
      const mergedRef = (node: HTMLButtonElement | null) => {
        composeRefs(ref, childRef)(node);
      };
      // eslint-disable-next-line react-hooks/refs -- asChild ref merge runs on commit, not during render
      return cloneElement(child, {
        ...props,
        ref: mergedRef as unknown as RefObject<HTMLButtonElement | null>,
        className: `${styles.button} ${child.props.className ?? ''} ${className}`.trim(),
        'data-toolbar-item': '',
        'data-orientation': orientation,
        'data-slot': 'toolbar-button',
        tabIndex: -1,
      });
    }

    return (
      <button
        ref={ref}
        type="button"
        tabIndex={-1}
        data-toolbar-item=""
        data-orientation={orientation}
        data-slot="toolbar-button"
        className={`${styles.button} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

ToolbarButton.displayName = 'ToolbarButton';

export type ToolbarLinkProps = AnchorHTMLAttributes<HTMLAnchorElement>;

export const ToolbarLink = forwardRef<HTMLAnchorElement, ToolbarLinkProps>(
  ({ className = '', ...props }, ref) => {
    const { orientation } = useToolbar();

    return (
      <a
        ref={ref}
        tabIndex={-1}
        data-toolbar-item=""
        data-orientation={orientation}
        data-slot="toolbar-link"
        className={`${styles.link} ${className}`}
        {...props}
      />
    );
  }
);

ToolbarLink.displayName = 'ToolbarLink';

export type ToolbarSeparatorProps = HTMLAttributes<HTMLDivElement>;

export const ToolbarSeparator = forwardRef<HTMLDivElement, ToolbarSeparatorProps>(
  ({ className = '', ...props }, ref) => {
    const { orientation } = useToolbar();
    const separatorOrientation = orientation === 'horizontal' ? 'vertical' : 'horizontal';

    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation={separatorOrientation}
        data-orientation={separatorOrientation}
        data-slot="toolbar-separator"
        className={`${styles.separator} ${className}`}
        {...props}
      />
    );
  }
);

ToolbarSeparator.displayName = 'ToolbarSeparator';

type ToolbarToggleGroupContextValue = {
  type: 'single' | 'multiple';
  value: string | string[];
  toggleItem: (itemValue: string, pressed: boolean) => void;
  disabled?: boolean;
};

const ToolbarToggleGroupContext = createContext<ToolbarToggleGroupContextValue | null>(null);

const useToolbarToggleGroup = (): ToolbarToggleGroupContextValue => {
  const context = useContext(ToolbarToggleGroupContext);
  if (!context) {
    throw new Error('ToolbarToggleItem must be used within ToolbarToggleGroup');
  }
  return context;
};

export interface ToolbarToggleGroupProps extends HTMLAttributes<HTMLDivElement> {
  type: 'single' | 'multiple';
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  disabled?: boolean;
  children: ReactNode;
}

export const ToolbarToggleGroup = forwardRef<HTMLDivElement, ToolbarToggleGroupProps>(
  (
    {
      type,
      value: valueControlled,
      defaultValue,
      onValueChange,
      disabled = false,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const { orientation } = useToolbar();
    const [internal, setInternal] = useState<string | string[]>(() => {
      if (type === 'multiple') {
        if (Array.isArray(defaultValue)) return defaultValue;
        if (typeof defaultValue === 'string') return [defaultValue];
        return [];
      }
      return typeof defaultValue === 'string' ? defaultValue : '';
    });

    const value = valueControlled ?? internal;

    const toggleItem = useCallback(
      (itemValue: string, pressed: boolean) => {
        if (disabled) {
          return;
        }
        if (type === 'single') {
          const next = pressed ? itemValue : '';
          if (valueControlled === undefined) {
            setInternal(next);
          }
          onValueChange?.(next);
          return;
        }

        const list = Array.isArray(value) ? [...value] : value ? [String(value)] : [];
        const next = pressed
          ? list.includes(itemValue)
            ? list
            : [...list, itemValue]
          : list.filter(entry => entry !== itemValue);
        if (valueControlled === undefined) {
          setInternal(next);
        }
        onValueChange?.(next);
      },
      [disabled, onValueChange, type, value, valueControlled]
    );

    const contextValue = useMemo(
      () => ({ type, value, toggleItem, disabled }),
      [disabled, toggleItem, type, value]
    );

    return (
      <ToolbarToggleGroupContext.Provider value={contextValue}>
        <div
          ref={ref}
          role="group"
          data-orientation={orientation}
          data-slot="toolbar-toggle-group"
          className={`${styles.toggleGroup} ${className}`}
          {...props}
        >
          {children}
        </div>
      </ToolbarToggleGroupContext.Provider>
    );
  }
);

ToolbarToggleGroup.displayName = 'ToolbarToggleGroup';

export type ToolbarToggleItemProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  value: string;
};

export const ToolbarToggleItem = forwardRef<HTMLButtonElement, ToolbarToggleItemProps>(
  (
    {
      value: itemValue,
      className = '',
      disabled: disabledProp,
      onClick,
      children,
      ...props
    },
    ref
  ) => {
    const { orientation } = useToolbar();
    const { type, value, toggleItem, disabled: groupDisabled } = useToolbarToggleGroup();
    const disabled = disabledProp || groupDisabled;
    const pressed =
      type === 'single'
        ? value === itemValue
        : Array.isArray(value) && value.includes(itemValue);

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (event.defaultPrevented || disabled) {
        return;
      }
      toggleItem(itemValue, !pressed);
    };

    return (
      <button
        ref={ref}
        type="button"
        tabIndex={-1}
        aria-pressed={pressed}
        data-state={pressed ? 'on' : 'off'}
        data-toolbar-item=""
        data-orientation={orientation}
        data-slot="toolbar-toggle-item"
        disabled={disabled}
        className={`${styles.toggleItem} ${className}`}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);

ToolbarToggleItem.displayName = 'ToolbarToggleItem';
