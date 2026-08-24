import {
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  useRef,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type Ref,
  type RefObject,
} from 'react';
import { cn } from '../../lib/cn';
import styles from './TabNav.module.scss';

export type TabNavSize = 'sm' | 'md';

type TabNavContextValue = {
  size: TabNavSize;
};

const TabNavContext = createContext<TabNavContextValue | null>(null);

const useTabNav = (): TabNavContextValue => {
  const context = useContext(TabNavContext);
  if (!context) {
    throw new Error('TabNavLink must be used within TabNav');
  }
  return context;
};

const composeRefs =
  <T,>(...refs: Array<Ref<T> | undefined>) =>
  (node: T | null) => {
    refs.forEach(ref => {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    });
  };

export interface TabNavProps extends HTMLAttributes<HTMLElement> {
  size?: TabNavSize;
}

const getTabNavLinks = (root: HTMLElement | null): HTMLElement[] => {
  if (!root) {
    return [];
  }
  return Array.from(
    root.querySelectorAll<HTMLElement>('[data-slot="tab-nav-link"]:not([aria-disabled="true"])')
  );
};

export const TabNav = forwardRef<HTMLElement, TabNavProps>(
  ({ className = '', size = 'md', onKeyDown, children, ...props }, ref) => {
    const rootRef = useRef<HTMLElement | null>(null);

    const focusLink = (index: number): void => {
      const links = getTabNavLinks(rootRef.current);
      if (links.length === 0) {
        return;
      }
      const normalized = ((index % links.length) + links.length) % links.length;
      links[normalized]?.focus();
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented) {
        return;
      }

      const links = getTabNavLinks(rootRef.current);
      if (links.length === 0) {
        return;
      }

      const activeIndex = links.findIndex(link => link === document.activeElement);

      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        focusLink(activeIndex <= 0 ? links.length - 1 : activeIndex - 1);
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        focusLink(activeIndex >= links.length - 1 ? 0 : activeIndex + 1);
        return;
      }

      if (e.key === 'Home') {
        e.preventDefault();
        focusLink(0);
        return;
      }

      if (e.key === 'End') {
        e.preventDefault();
        focusLink(links.length - 1);
      }
    };

    return (
      <TabNavContext.Provider value={{ size }}>
        <nav
          ref={composeRefs(ref, rootRef)}
          data-slot="tab-nav"
          data-size={size}
          className={cn(styles.root, styles[size], className)}
          onKeyDown={handleKeyDown}
          {...props}
        >
          {children}
        </nav>
      </TabNavContext.Provider>
    );
  }
);

TabNav.displayName = 'TabNav';

export type TabNavLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  active?: boolean;
  asChild?: boolean;
  disabled?: boolean;
};

export const TabNavLink = forwardRef<HTMLAnchorElement, TabNavLinkProps>(
  (
    {
      className = '',
      active = false,
      asChild = false,
      href,
      disabled,
      onClick,
      children,
      ...props
    },
    ref
  ) => {
    const { size } = useTabNav();
    const isDisabled = Boolean(disabled);

    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
      if (isDisabled) {
        e.preventDefault();
        return;
      }
      onClick?.(e);
    };

    const classNames = cn(
      styles.link,
      active && styles.linkActive,
      isDisabled && styles.disabled,
      className
    );

    if (asChild && isValidElement(children)) {
      const child = children as ReactElement<{
        className?: string;
        onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
        ref?: RefObject<HTMLAnchorElement | null>;
      }>;
      const mergedRef = (node: HTMLAnchorElement | null) => {
        composeRefs(ref, child.props.ref)(node);
      };
      // eslint-disable-next-line react-hooks/refs -- asChild ref merge runs on commit, not during render
      return cloneElement(child, {
        ...props,
        ref: mergedRef,
        'data-slot': 'tab-nav-link',
        'data-active': active ? 'true' : undefined,
        'data-size': size,
        'aria-current': active ? 'page' : undefined,
        'aria-disabled': isDisabled || undefined,
        className: cn(classNames, child.props.className),
        onClick: (e: MouseEvent<HTMLAnchorElement>) => {
          child.props.onClick?.(e);
          handleClick(e);
        },
      } as Record<string, unknown>);
    }

    return (
      <a
        ref={ref}
        {...props}
        href={href}
        data-slot="tab-nav-link"
        data-active={active ? 'true' : undefined}
        data-size={size}
        aria-current={active ? 'page' : undefined}
        aria-disabled={isDisabled || undefined}
        className={classNames}
        onClick={handleClick}
        tabIndex={isDisabled ? -1 : undefined}
      >
        {children}
      </a>
    );
  }
);

TabNavLink.displayName = 'TabNavLink';
