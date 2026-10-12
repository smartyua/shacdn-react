import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Toggle } from './Toggle';
import styles from './Toggle.module.scss';

describe('Toggle', () => {
  it('toggles an uncontrolled button and keeps the caller click', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onPressedChange = vi.fn();
    const ref = createRef<HTMLButtonElement>();

    render(
      <Toggle ref={ref} defaultPressed onClick={onClick} onPressedChange={onPressedChange} className="extra">
        Bold
      </Toggle>
    );

    const button = screen.getByRole('button', { name: 'Bold' });
    expect(ref.current).toBe(button);
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveAttribute('data-state', 'on');
    expect(button.className).toContain(styles.variantDefault);
    expect(button.className).toContain(styles.sizeDefault);
    expect(button.className).toContain('extra');

    await user.click(button);

    expect(onClick).toHaveBeenCalledOnce();
    expect(onPressedChange).toHaveBeenCalledWith(false);
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button).toHaveAttribute('data-state', 'off');
  });

  it('reports a controlled press without changing the pressed attribute', async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();

    render(
      <Toggle pressed={false} onPressedChange={onPressedChange} variant="outline" size="lg">
        Italic
      </Toggle>
    );

    const button = screen.getByRole('button', { name: 'Italic' });
    expect(button.className).toContain(styles.variantOutline);
    expect(button.className).toContain(styles.sizeLg);
    expect(button).toHaveAttribute('aria-pressed', 'false');

    await user.click(button);

    expect(onPressedChange).toHaveBeenCalledWith(true);
    expect(button).toHaveAttribute('aria-pressed', 'false');
  });

  it('ignores a click that was cancelled and a click while disabled', () => {
    const cancelled = vi.fn();
    const disabledChange = vi.fn();

    render(
      <>
        <Toggle
          size="sm"
          onClick={event => {
            event.preventDefault();
          }}
          onPressedChange={cancelled}
        >
          Small
        </Toggle>
        <Toggle disabled onPressedChange={disabledChange}>
          Locked
        </Toggle>
      </>
    );

    const small = screen.getByRole('button', { name: 'Small' });
    expect(small.className).toContain(styles.sizeSm);
    fireEvent.click(small);
    expect(cancelled).not.toHaveBeenCalled();
    expect(small).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(screen.getByRole('button', { name: 'Locked' }));
    expect(disabledChange).not.toHaveBeenCalled();
  });
});
