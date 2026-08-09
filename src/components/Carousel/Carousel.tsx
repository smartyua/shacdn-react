import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import styles from './Carousel.module.scss';

type CarouselCtx = {
  scrollRef: React.RefObject<HTMLUListElement | null>;
  index: number;
  setIndex: (i: number) => void;
  count: number;
  setCount: (n: number) => void;
};

const CarouselContext = createContext<CarouselCtx | null>(null);

const useCarousel = (): CarouselCtx => {
  const ctx = useContext(CarouselContext);
  if (!ctx) {
    throw new Error('Carousel parts must be used within Carousel');
  }
  return ctx;
};

export interface CarouselProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const Carousel = ({ className = '', children, ...props }: CarouselProps) => {
  const scrollRef = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(0);
  const value = useMemo(
    () => ({ scrollRef, index, setIndex, count, setCount }),
    [index, count]
  );

  return (
    <CarouselContext.Provider value={value}>
      <div className={`${styles.root} ${className}`} role="region" aria-roledescription="carousel" {...props}>
        {children}
      </div>
    </CarouselContext.Provider>
  );
};

Carousel.displayName = 'Carousel';

export const CarouselViewport = ({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={`${styles.viewport} ${className}`} {...props}>
    {children}
  </div>
);

CarouselViewport.displayName = 'CarouselViewport';

export const CarouselContent = ({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLUListElement>) => {
  const { scrollRef, setIndex, setCount } = useCarousel();

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCount(el.children.length);
    const onScroll = () => {
      const w = el.clientWidth || 1;
      setIndex(Math.round(el.scrollLeft / w));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [scrollRef, setIndex, setCount]);

  return (
    <ul ref={scrollRef} className={`${styles.content} ${className}`} {...props}>
      {children}
    </ul>
  );
};

CarouselContent.displayName = 'CarouselContent';

export const CarouselItem = ({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLLIElement>) => (
  <li className={`${styles.item} ${className}`} role="group" aria-roledescription="slide" {...props}>
    {children}
  </li>
);

CarouselItem.displayName = 'CarouselItem';

export const CarouselPrevious = ({
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { scrollRef, index, setIndex } = useCarousel();

  const go = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const next = Math.max(0, index - 1);
    el.scrollTo({ left: next * el.clientWidth, behavior: 'smooth' });
    setIndex(next);
  }, [scrollRef, index, setIndex]);

  return (
    <button
      type="button"
      className={`${styles.control} ${styles.previous} ${className}`}
      aria-label="Previous slide"
      disabled={index <= 0}
      onClick={go}
      {...props}
    >
      ‹
    </button>
  );
};

CarouselPrevious.displayName = 'CarouselPrevious';

export const CarouselNext = ({
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { scrollRef, index, count, setIndex } = useCarousel();

  const go = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const next = Math.min(count - 1, index + 1);
    el.scrollTo({ left: next * el.clientWidth, behavior: 'smooth' });
    setIndex(next);
  }, [scrollRef, index, count, setIndex]);

  return (
    <button
      type="button"
      className={`${styles.control} ${styles.next} ${className}`}
      aria-label="Next slide"
      disabled={index >= count - 1}
      onClick={go}
      {...props}
    >
      ›
    </button>
  );
};

CarouselNext.displayName = 'CarouselNext';

export const CarouselDots = ({ className = '' }: { className?: string }) => {
  const { scrollRef, index, count, setIndex } = useCarousel();

  if (count <= 1) return null;

  return (
    <ul className={`${styles.dots} ${className}`} aria-label="Slide pagination">
      {Array.from({ length: count }, (_, i) => (
        <li key={i}>
          <button
            type="button"
            className={styles.dot}
            data-active={i === index ? 'true' : 'false'}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index ? 'true' : undefined}
            onClick={() => {
              const el = scrollRef.current;
              if (!el) return;
              el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
              setIndex(i);
            }}
          />
        </li>
      ))}
    </ul>
  );
};

CarouselDots.displayName = 'CarouselDots';

export const CarouselSlide = ({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={`${styles.slide} ${className}`} {...props}>
    {children}
  </div>
);

CarouselSlide.displayName = 'CarouselSlide';
