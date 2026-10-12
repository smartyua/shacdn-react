import { createRef } from 'react';
import { act, render, screen } from '@testing-library/react';
import { describe, expect, it, vi, afterEach } from 'vitest';
import { ThinkingLoader } from './ThinkingLoader';

describe('ThinkingLoader', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('walks phases and holds the last one', () => {
    vi.useFakeTimers();
    render(<ThinkingLoader interval={1000} />);

    expect(screen.getByRole('status')).toHaveTextContent('Thinking');
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByRole('status')).toHaveTextContent('Searching the web');
    act(() => {
      vi.advanceTimersByTime(8000);
    });
    expect(screen.getByRole('status')).toHaveTextContent('Writing response');
  });

  it('loops when asked and follows a controlled phase', () => {
    vi.useFakeTimers();
    const { rerender } = render(<ThinkingLoader phases={['A', 'B']} interval={500} loop />);

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(screen.getByRole('status')).toHaveTextContent('B');
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(screen.getByRole('status')).toHaveTextContent('A');

    rerender(<ThinkingLoader phases={['A', 'B', 'C']} phase={2} interval={100} />);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByRole('status')).toHaveTextContent('C');
  });

  it('settles on the done label and starts over when done clears', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
    const { rerender } = render(<ThinkingLoader phases={['Thinking']} />);

    vi.setSystemTime(new Date('2026-01-01T00:00:04.000Z'));
    rerender(<ThinkingLoader phases={['Thinking']} done />);
    expect(screen.getByRole('status')).toHaveTextContent('Thought for 4s');
    expect(screen.getByRole('status')).toHaveAttribute('data-done', 'true');

    rerender(<ThinkingLoader phases={['Thinking']} done={false} />);
    expect(screen.getByRole('status')).toHaveTextContent('Thinking');
    expect(screen.getByRole('status')).toHaveAttribute('data-done', 'false');
  });

  it('uses a string done label, plain size, and the default phase list when phases are empty', () => {
    render(<ThinkingLoader phases={[]} variant="plain" size="sm" done doneLabel="Done" />);

    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('Done');
    expect(status).toHaveAttribute('data-variant', 'plain');
    expect(status).toHaveAttribute('data-size', 'sm');
  });

  it('clamps a controlled phase past the end', () => {
    render(<ThinkingLoader phases={['Only']} phase={4} />);
    expect(screen.getByRole('status')).toHaveTextContent('Only');
  });

  it('clamps a negative phase, falls back when the interval is not positive, and keeps its status role', () => {
    vi.useFakeTimers();
    const ref = createRef<HTMLDivElement>();
    render(<ThinkingLoader ref={ref} phases={['A', 'B']} phase={-3} id="loader" role="button" className="extra" />);

    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('A');
    expect(status).toHaveAttribute('id', 'loader');
    expect(status).toHaveAttribute('data-variant', 'pill');
    expect(status).toHaveAttribute('data-size', 'md');
    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(ref.current).toBe(status);
    expect(status.className).toContain('extra');

    const { unmount } = render(<ThinkingLoader interval={0} phases={['A', 'B']} />);
    act(() => {
      vi.advanceTimersByTime(2200);
    });
    expect(screen.getAllByRole('status')[1]).toHaveTextContent('B');
    unmount();

    render(<ThinkingLoader interval={-10} phases={['A', 'B']} />);
    act(() => {
      vi.advanceTimersByTime(2199);
    });
    expect(screen.getAllByRole('status').at(-1)).toHaveTextContent('A');
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.getAllByRole('status').at(-1)).toHaveTextContent('B');
  });
});
