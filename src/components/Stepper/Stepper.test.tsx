import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Stepper } from './Stepper';

describe('Stepper', () => {
  it('increments and decrements within bounds', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Stepper
        value={2}
        min={1}
        max={3}
        onValueChange={onValueChange}
        aria-label="Copies"
      />
    );

    await user.click(screen.getByRole('button', { name: /increase/i }));
    expect(onValueChange).toHaveBeenCalledWith(3);

    await user.click(screen.getByRole('button', { name: /decrease/i }));
    expect(onValueChange).toHaveBeenCalledWith(1);
  });
});
