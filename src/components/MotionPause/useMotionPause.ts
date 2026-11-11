import { useEffect, useState } from 'react';
import { prefersReducedMotion } from '../../lib/prefersReducedMotion';

export interface MotionPauseProps {
  /** Controlled pause. Omit it to let the button own the state. */
  paused?: boolean;
  defaultPaused?: boolean;
  onPausedChange?: (paused: boolean) => void;
  /** Show the pause button. Hidden automatically when reduced motion is on. */
  controls?: boolean;
  pauseLabel?: string;
  playLabel?: string;
}

export const usePrefersReducedMotion = (): boolean => {
  const [reduced, setReduced] = useState(prefersReducedMotion);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return undefined;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => {
      setReduced(media.matches);
    };
    media.addEventListener('change', onChange);
    return () => {
      media.removeEventListener('change', onChange);
    };
  }, []);

  return reduced;
};

export const useMotionPause = (
  paused: boolean | undefined,
  defaultPaused = false,
  onPausedChange?: (paused: boolean) => void
) => {
  const reduced = usePrefersReducedMotion();
  const [internal, setInternal] = useState(defaultPaused);
  const explicit = paused ?? internal;

  const toggle = () => {
    const next = !explicit;
    if (paused === undefined) setInternal(next);
    onPausedChange?.(next);
  };

  return { paused: reduced || explicit, explicit, reduced, toggle };
};
