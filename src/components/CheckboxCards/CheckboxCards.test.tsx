import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CheckboxCards, CheckboxCardsItem } from './CheckboxCards';

describe('CheckboxCards', () => {
  it('toggles multiple cards', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <CheckboxCards defaultValue={['keyboard']} onValueChange={onValueChange} aria-label="Peripherals">
        <CheckboxCardsItem value="keyboard">Keyboard</CheckboxCardsItem>
        <CheckboxCardsItem value="mouse">Mouse</CheckboxCardsItem>
        <CheckboxCardsItem value="monitor">Monitor</CheckboxCardsItem>
      </CheckboxCards>
    );

    expect(screen.getByRole('checkbox', { name: 'Keyboard' })).toBeChecked();
    await user.click(screen.getByRole('checkbox', { name: 'Mouse' }));
    expect(onValueChange).toHaveBeenCalledWith(['keyboard', 'mouse']);
    await user.click(screen.getByRole('checkbox', { name: 'Keyboard' }));
    expect(onValueChange).toHaveBeenLastCalledWith(['mouse']);
  });

  it('ignores clicks on a disabled item', () => {
    const onValueChange = vi.fn();

    render(
      <CheckboxCards defaultValue={[]} onValueChange={onValueChange} aria-label="Peripherals">
        <CheckboxCardsItem value="keyboard">Keyboard</CheckboxCardsItem>
        <CheckboxCardsItem value="mouse" disabled>
          Mouse
        </CheckboxCardsItem>
      </CheckboxCards>
    );

    expect(screen.getByRole('checkbox', { name: 'Mouse' })).toBeDisabled();
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
