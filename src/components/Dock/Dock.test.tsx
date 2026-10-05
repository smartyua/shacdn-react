import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Dock, DockItem } from './Dock';
import { dockScale } from './dockScale';

describe('dockScale', () => {
  it('returns 1 when range, size, or magnification is not positive', () => {
    expect(dockScale(0, 0, 0, 40, 64)).toBe(1);
    expect(dockScale(0, 0, 120, 0, 64)).toBe(1);
    expect(dockScale(0, 0, 120, 40, 0)).toBe(1);
  });

  it('magnifies at the pointer and falls off with distance', () => {
    expect(dockScale(10, 10, 100, 40, 80)).toBe(2);
    expect(dockScale(200, 10, 100, 40, 80)).toBe(1);
  });
});

describe('Dock', () => {
  it('magnifies items under the pointer and resets when the pointer leaves', () => {
    render(
      <Dock>
        <DockItem label="Home">H</DockItem>
      </Dock>
    );

    const dock = screen.getByRole('button', { name: 'Home' }).parentElement as HTMLElement;
    fireEvent.pointerMove(dock, { clientX: 0, clientY: 0 });
    expect(screen.getByRole('button', { name: 'Home' })).toHaveStyle({ '--dock-scale': '1.600' });

    fireEvent.pointerLeave(dock);
    expect(screen.getByRole('button', { name: 'Home' })).toHaveStyle({ '--dock-scale': '1' });
  });

  it('supports a vertical orientation', () => {
    render(
      <Dock orientation="vertical" data-testid="dock">
        <DockItem label="Mail">M</DockItem>
      </Dock>
    );
    expect(screen.getByTestId('dock')).toHaveAttribute('data-orientation', 'vertical');
  });
});
