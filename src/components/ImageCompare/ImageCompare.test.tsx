import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useStubbedLayout } from '../../test/layout';
import { ImageCompare } from './ImageCompare';

const PROPS = {
  beforeSrc: 'before.jpg',
  afterSrc: 'after.jpg',
  beforeAlt: 'Room before renovation',
  afterAlt: 'Room after renovation',
};

describe('ImageCompare', () => {
  useStubbedLayout({ left: 0, width: 200 });

  it('moves the divider with the keyboard', () => {
    const onPositionChange = vi.fn();
    render(<ImageCompare {...PROPS} onPositionChange={onPositionChange} />);
    const slider = screen.getByRole('slider', { name: 'Comparison divider' });

    expect(slider).toHaveAttribute('aria-valuenow', '50');
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(slider).toHaveAttribute('aria-valuenow', '52');
    fireEvent.keyDown(slider, { key: 'Home' });
    expect(onPositionChange).toHaveBeenLastCalledWith(0);
    expect(screen.getByRole('img', { name: 'Room before renovation' })).toBeInTheDocument();
  });

  it('follows the pointer while dragging', () => {
    render(<ImageCompare {...PROPS} />);
    const frame = screen.getByRole('slider').parentElement as HTMLElement;

    fireEvent.pointerDown(frame, { clientX: 50, pointerId: 1 });
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '25');
    fireEvent.pointerMove(frame, { clientX: 150, pointerId: 1 });
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '75');
    fireEvent.pointerUp(frame, { pointerId: 1 });
    fireEvent.pointerMove(frame, { clientX: 10, pointerId: 1 });
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '75');
  });
});
