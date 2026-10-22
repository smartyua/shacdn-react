import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { NumberField } from './NumberField';
import { clampToStep, parseLocaleNumber } from './numberValue';

describe('numberValue', () => {
  it('parses locale-formatted input', () => {
    expect(parseLocaleNumber('1,234.5', 'en-US')).toBe(1234.5);
    expect(parseLocaleNumber('1.234,5', 'de-DE')).toBe(1234.5);
    expect(parseLocaleNumber('  ', 'en-US')).toBeNull();
    expect(parseLocaleNumber('abc', 'en-US')).toBeNaN();
  });

  it('clamps and snaps to the step grid', () => {
    expect(clampToStep(7.3, { min: 0, max: 10, step: 0.5 })).toBe(7.5);
    expect(clampToStep(42, { min: 0, max: 10, step: 1 })).toBe(10);
    expect(clampToStep(Number.NaN, { min: 0, max: 10, step: 1 })).toBeNull();
  });
});

describe('NumberField', () => {
  it('steps with keys and clamps typed input on blur', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <NumberField aria-label="Seats" defaultValue={5} min={1} max={20} locale="en-US" onValueChange={onValueChange} />
    );
    const field = screen.getByRole('spinbutton', { name: 'Seats' });

    fireEvent.keyDown(field, { key: 'ArrowUp' });
    expect(onValueChange).toHaveBeenLastCalledWith(6);
    fireEvent.keyDown(field, { key: 'End' });
    expect(onValueChange).toHaveBeenLastCalledWith(20);
    expect(field).toHaveAttribute('aria-valuenow', '20');

    await user.clear(field);
    await user.type(field, '99');
    await user.tab();
    expect(onValueChange).toHaveBeenLastCalledWith(20);
    expect(field).toHaveValue('20');
  });

  it('uses the step buttons and disables them at the bounds', async () => {
    const user = userEvent.setup();
    render(<NumberField aria-label="Qty" defaultValue={1} min={0} max={2} />);

    await user.click(screen.getByRole('button', { name: 'Decrease' }));
    expect(screen.getByRole('spinbutton')).toHaveValue('0');
    expect(screen.getByRole('button', { name: 'Decrease' })).toBeDisabled();
  });
});
