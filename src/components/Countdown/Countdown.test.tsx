import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Countdown } from './Countdown';
import { getCountdownParts } from './countdownParts';

describe('getCountdownParts', () => {
  it('splits the remaining time and never goes negative', () => {
    expect(getCountdownParts(90_061_000, 0)).toEqual({ days: 1, hours: 1, minutes: 1, seconds: 1, total: 90_061_000 });
    expect(getCountdownParts(0, 5000).total).toBe(0);
  });
});

describe('Countdown', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('ticks down and completes once', () => {
    vi.useFakeTimers();
    let clock = 0;
    const onComplete = vi.fn();
    render(<Countdown target={3000} now={() => clock} onComplete={onComplete} completedContent="We are live" />);

    expect(screen.getByRole('timer')).toHaveAccessibleName('0 hours, 0 minutes, 3 seconds');

    act(() => {
      clock = 1000;
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByRole('timer')).toHaveAccessibleName('0 hours, 0 minutes, 2 seconds');

    act(() => {
      clock = 5000;
      vi.advanceTimersByTime(3000);
    });
    expect(screen.getByText('We are live')).toBeInTheDocument();
    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
