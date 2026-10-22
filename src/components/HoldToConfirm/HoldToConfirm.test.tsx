import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HoldToConfirm } from './HoldToConfirm';

describe('HoldToConfirm', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('confirms only after the full hold', () => {
    const onConfirm = vi.fn();
    render(
      <HoldToConfirm onConfirm={onConfirm} duration={1000}>
        Delete project
      </HoldToConfirm>
    );
    const button = screen.getByRole('button', { name: 'Delete project' });

    fireEvent.pointerDown(button, { button: 0 });
    act(() => {
      vi.advanceTimersByTime(600);
    });
    fireEvent.pointerUp(button);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(onConfirm).not.toHaveBeenCalled();
    expect(button).toHaveAttribute('data-state', 'idle');

    fireEvent.pointerDown(button, { button: 0 });
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(button).toHaveAttribute('data-state', 'confirmed');
  });

  it('supports holding Space and describes the gesture', () => {
    const onConfirm = vi.fn();
    render(
      <HoldToConfirm onConfirm={onConfirm} duration={500}>
        Remove
      </HoldToConfirm>
    );
    const button = screen.getByRole('button', { name: 'Remove' });
    expect(button).toHaveAccessibleDescription('Press and hold to confirm');

    fireEvent.keyDown(button, { key: ' ' });
    fireEvent.keyDown(button, { key: ' ', repeat: true });
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
