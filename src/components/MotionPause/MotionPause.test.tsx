import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { MotionPauseButton } from './MotionPause';
import { useMotionPause } from './useMotionPause';

const originalMatchMedia = window.matchMedia;

const Probe = ({ paused }: { paused?: boolean }) => {
  const motion = useMotionPause(paused, false);
  return (
    <div>
      <span data-testid="state">{motion.paused ? 'paused' : 'running'}</span>
      <MotionPauseButton paused={motion.explicit} onClick={motion.toggle} />
    </div>
  );
};

describe('MotionPause', () => {
  afterEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: originalMatchMedia,
    });
  });
  it('toggles an uncontrolled pause', () => {
    render(<Probe />);
    expect(screen.getByTestId('state')).toHaveTextContent('running');
    fireEvent.click(screen.getByRole('button', { name: 'Pause animation' }));
    expect(screen.getByTestId('state')).toHaveTextContent('paused');
    expect(screen.getByRole('button', { name: 'Play animation' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('stays paused when the system requests reduced motion', () => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: (query: string) =>
        ({
          matches: query.includes('reduce'),
          media: query,
          addEventListener: () => undefined,
          removeEventListener: () => undefined,
          dispatchEvent: () => false,
          onchange: null,
          addListener: () => undefined,
          removeListener: () => undefined,
        }) as MediaQueryList,
    });

    render(<Probe paused={false} />);
    expect(screen.getByTestId('state')).toHaveTextContent('paused');
  });
});
