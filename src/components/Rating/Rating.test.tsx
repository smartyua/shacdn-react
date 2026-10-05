import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Rating } from './Rating';
import { clampRating, fillForStar, ratingFromPointer } from './ratingValue';

describe('ratingValue', () => {
  it('picks a half star from the pointer and ignores a zero width', () => {
    expect(ratingFromPointer(2, 2, 10, true)).toBe(2.5);
    expect(ratingFromPointer(2, 8, 10, true)).toBe(3);
    expect(ratingFromPointer(2, 2, 0, true)).toBe(3);
    expect(ratingFromPointer(2, Number.NaN, 10, true)).toBe(3);
    expect(ratingFromPointer(2, 2, 10, false)).toBe(3);
  });

  it('clamps and fills stars', () => {
    expect(clampRating(Number.NaN, 5)).toBe(0);
    expect(clampRating(9, 5)).toBe(5);
    expect(clampRating(2, 0)).toBe(1);
    expect(fillForStar(2.5, 0)).toBe(1);
    expect(fillForStar(2.5, 2)).toBe(0.5);
    expect(fillForStar(2.5, 4)).toBe(0);
  });
});

describe('Rating', () => {
  it('selects a star and moves with the keyboard', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Rating onValueChange={onValueChange} />);

    await user.click(screen.getByRole('radio', { name: '3 stars' }));
    expect(onValueChange).toHaveBeenCalledWith(3);

    fireEvent.keyDown(screen.getByRole('radiogroup'), { key: 'ArrowRight' });
    expect(onValueChange).toHaveBeenCalledWith(4);
    fireEvent.keyDown(screen.getByRole('radiogroup'), { key: 'Home' });
    expect(onValueChange).toHaveBeenCalledWith(1);
    fireEvent.keyDown(screen.getByRole('radiogroup'), { key: 'End' });
    expect(onValueChange).toHaveBeenCalledWith(5);
  });

  it('supports half steps and ignores input when disabled or read only', () => {
    const onValueChange = vi.fn();
    const { rerender } = render(<Rating allowHalf defaultValue={2} onValueChange={onValueChange} />);
    const star = screen.getByRole('radio', { name: '3 stars' });
    star.getBoundingClientRect = () =>
      ({
        x: 0,
        y: 0,
        top: 0,
        left: 0,
        right: 20,
        bottom: 16,
        width: 20,
        height: 16,
        toJSON: () => ({}),
      }) as DOMRect;
    fireEvent.click(star, { clientX: 4 });
    expect(onValueChange).toHaveBeenCalledWith(2.5);

    rerender(<Rating disabled defaultValue={2} onValueChange={onValueChange} />);
    fireEvent.keyDown(screen.getByRole('radiogroup'), { key: 'ArrowLeft' });
    expect(onValueChange).toHaveBeenCalledTimes(1);

    rerender(<Rating key="readonly" readOnly defaultValue={4} />);
    expect(screen.getByRole('img', { name: '4 out of 5' })).toBeInTheDocument();
  });

  it('treats a non-positive max as a single star', () => {
    const { rerender } = render(<Rating max={0} defaultValue={3} size="sm" />);
    expect(screen.getAllByRole('radio')).toHaveLength(1);
    rerender(<Rating max={5} size="lg" />);
    expect(screen.getAllByRole('radio')).toHaveLength(5);
  });
});
