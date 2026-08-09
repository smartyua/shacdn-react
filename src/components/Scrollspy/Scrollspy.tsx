import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import styles from './Scrollspy.module.scss';

type ScrollspyContextValue = {
  activeId: string | null;
  registerTarget: (id: string, element: Element | null) => void;
};

const ScrollspyContext = createContext<ScrollspyContextValue | null>(null);

const useScrollspy = (): ScrollspyContextValue => {
  const ctx = useContext(ScrollspyContext);
  if (!ctx) {
    throw new Error('ScrollspyLink must be used within Scrollspy');
  }
  return ctx;
};

const parseHashId = (href: string): string | null => {
  if (!href.startsWith('#')) {
    return null;
  }
  const id = href.slice(1);
  return id.length > 0 ? id : null;
};

export interface ScrollspyProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  rootMargin?: string;
  'aria-label'?: string;
}

export const Scrollspy = ({
  children,
  rootMargin = '-20% 0px -60% 0px',
  className = '',
  'aria-label': ariaLabel,
  ...props
}: ScrollspyProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const targetsRef = useRef<Map<string, Element>>(new Map());
  const observerRef = useRef<IntersectionObserver | null>(null);

  const registerTarget = useCallback((id: string, element: Element | null) => {
    const observer = observerRef.current;
    const existing = targetsRef.current.get(id);

    if (existing && observer) {
      observer.unobserve(existing);
      targetsRef.current.delete(id);
    }

    if (element) {
      targetsRef.current.set(id, element);
      observer?.observe(element);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.filter(entry => entry.isIntersecting);
        if (visible.length === 0) {
          return;
        }

        visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const topEntry = visible[0];
        if (topEntry?.target.id) {
          setActiveId(topEntry.target.id);
        }
      },
      { root: null, rootMargin, threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
    );

    observerRef.current = observer;
    targetsRef.current.forEach(element => observer.observe(element));

    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, [rootMargin]);

  const value = useMemo(
    () => ({ activeId, registerTarget }),
    [activeId, registerTarget]
  );

  return (
    <ScrollspyContext.Provider value={value}>
      <nav
        className={`${styles.nav} ${className}`}
        aria-label={ariaLabel}
        data-slot="scrollspy"
        {...props}
      >
        {children}
      </nav>
    </ScrollspyContext.Provider>
  );
};

export interface ScrollspyLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

export const ScrollspyLink = ({
  href,
  className = '',
  children,
  ...props
}: ScrollspyLinkProps) => {
  const { activeId, registerTarget } = useScrollspy();
  const targetId = parseHashId(href);
  const isActive = targetId !== null && activeId === targetId;

  useEffect(() => {
    if (!targetId) {
      return;
    }

    const element = document.getElementById(targetId);
    registerTarget(targetId, element);

    return () => {
      registerTarget(targetId, null);
    };
  }, [targetId, registerTarget]);

  return (
    <a
      href={href}
      className={`${styles.link} ${isActive ? styles.linkActive : ''} ${className}`}
      aria-current={isActive ? 'location' : undefined}
      data-slot="scrollspy-link"
      data-active={isActive || undefined}
      {...props}
    >
      {children}
    </a>
  );
};
