import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useId,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
} from 'react';
import styles from './Tabs.module.scss';

type TabsActivationMode = 'automatic' | 'manual';
type TabsOrientation = 'horizontal' | 'vertical';

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
  baseId: string;
  activationMode: TabsActivationMode;
  orientation: TabsOrientation;
  focusedValue: string | null;
  setFocusedValue: (value: string | null) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

const useTabsContext = (): TabsContextValue => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within Tabs');
  }
  return context;
};

export interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  activationMode?: TabsActivationMode;
  orientation?: TabsOrientation;
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      defaultValue = '',
      value,
      onValueChange,
      activationMode = 'automatic',
      orientation = 'horizontal',
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(value ?? defaultValue);
    const [focusedValue, setFocusedValue] = useState<string | null>(null);
    const currentValue = value ?? internalValue;
    const baseId = useId();

    const handleValueChange = useCallback(
      (newValue: string) => {
        if (value === undefined) {
          setInternalValue(newValue);
        }
        onValueChange?.(newValue);
      },
      [onValueChange, value]
    );

    const handleFocusedValueChange = useCallback((next: string | null) => {
      setFocusedValue(next);
    }, []);

    const contextValue = useMemo(
      () => ({
        value: currentValue,
        onValueChange: handleValueChange,
        baseId,
        activationMode,
        orientation,
        focusedValue: activationMode === 'manual' ? focusedValue : null,
        setFocusedValue: handleFocusedValueChange,
      }),
      [
        activationMode,
        baseId,
        currentValue,
        focusedValue,
        handleFocusedValueChange,
        handleValueChange,
        orientation,
      ]
    );

    return (
      <TabsContext.Provider value={contextValue}>
        <div ref={ref} className={`${styles.tabs} ${className || ''}`} data-slot="tabs" {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);

Tabs.displayName = 'Tabs';

export interface TabsListProps extends HTMLAttributes<HTMLDivElement> {
  loop?: boolean;
}

export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, loop = true, onKeyDown, ...props }, ref) => {
    const { onValueChange, activationMode, orientation } = useTabsContext();
    const listRef = useRef<HTMLDivElement | null>(null);

    const getTabElements = (): HTMLButtonElement[] => {
      const list = listRef.current;
      if (!list) {
        return [];
      }
      return Array.from(
        list.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)')
      );
    };

    const focusTab = (index: number): void => {
      const tabs = getTabElements();
      if (tabs.length === 0) {
        return;
      }
      const normalized = loop
        ? ((index % tabs.length) + tabs.length) % tabs.length
        : Math.max(0, Math.min(index, tabs.length - 1));
      const tab = tabs[normalized];
      tab?.focus();
      if (activationMode === 'automatic' && tab?.dataset.value) {
        onValueChange(tab.dataset.value);
      }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented) {
        return;
      }

      const tabs = getTabElements();
      if (tabs.length === 0) {
        return;
      }

      const activeIndex = tabs.findIndex(tab => tab === document.activeElement);
      const currentIndex = activeIndex >= 0 ? activeIndex : tabs.findIndex(tab => tab.getAttribute('aria-selected') === 'true');

      const isHorizontal = orientation === 'horizontal';
      const prevKeys = isHorizontal ? ['ArrowLeft'] : ['ArrowUp'];
      const nextKeys = isHorizontal ? ['ArrowRight'] : ['ArrowDown'];

      if (prevKeys.includes(e.key)) {
        e.preventDefault();
        focusTab(currentIndex <= 0 ? (loop ? tabs.length - 1 : 0) : currentIndex - 1);
        return;
      }

      if (nextKeys.includes(e.key)) {
        e.preventDefault();
        focusTab(currentIndex >= tabs.length - 1 ? (loop ? 0 : tabs.length - 1) : currentIndex + 1);
        return;
      }

      if (e.key === 'Home') {
        e.preventDefault();
        focusTab(0);
        return;
      }

      if (e.key === 'End') {
        e.preventDefault();
        focusTab(tabs.length - 1);
      }
    };

    const setRefs = (node: HTMLDivElement | null) => {
      listRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    return (
      <div
        ref={setRefs}
        role="tablist"
        aria-orientation={orientation}
        data-slot="tabs-list"
        data-orientation={orientation}
        className={`${styles.list} ${className || ''}`}
        onKeyDown={handleKeyDown}
        {...props}
      />
    );
  }
);

TabsList.displayName = 'TabsList';

export interface TabsTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ value, className, disabled, onClick, onKeyDown, ...props }, ref) => {
    const { value: selectedValue, onValueChange, baseId, activationMode, focusedValue, setFocusedValue } =
      useTabsContext();

    const isActive = selectedValue === value;
    const isFocusTarget =
      activationMode === 'automatic' ? isActive : (focusedValue ?? selectedValue) === value;
    const tabId = `${baseId}-trigger-${value}`;
    const panelId = `${baseId}-content-${value}`;

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      if (e.defaultPrevented || disabled) {
        return;
      }
      onValueChange(value);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented || disabled || activationMode !== 'manual') {
        return;
      }
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onValueChange(value);
      }
    };

    const handleFocus = () => {
      if (activationMode === 'manual') {
        setFocusedValue(value);
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        id={tabId}
        data-value={value}
        aria-selected={isActive}
        aria-controls={panelId}
        tabIndex={isFocusTarget ? 0 : -1}
        disabled={disabled}
        data-state={isActive ? 'active' : 'inactive'}
        data-slot="tabs-trigger"
        onFocus={handleFocus}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`${styles.trigger} ${isActive ? styles.triggerActive : ''} ${className || ''}`}
        {...props}
      />
    );
  }
);

TabsTrigger.displayName = 'TabsTrigger';

export interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  forceMount?: boolean;
}

export const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  ({ value, className, forceMount, ...props }, ref) => {
    const { value: selectedValue, baseId } = useTabsContext();

    const isActive = selectedValue === value;
    const tabId = `${baseId}-trigger-${value}`;
    const panelId = `${baseId}-content-${value}`;

    if (!isActive && !forceMount) {
      return null;
    }

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={panelId}
        aria-labelledby={tabId}
        hidden={!isActive}
        tabIndex={0}
        data-state={isActive ? 'active' : 'inactive'}
        data-slot="tabs-content"
        className={`${styles.content} ${className || ''}`}
        {...props}
      />
    );
  }
);

TabsContent.displayName = 'TabsContent';
