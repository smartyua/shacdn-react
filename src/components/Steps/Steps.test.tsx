import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Steps, StepsItem } from './Steps';

describe('Steps', () => {
  it('marks the current step with aria-current', () => {
    render(
      <Steps value="shipping" aria-label="Checkout">
        <StepsItem value="cart" title="Cart" />
        <StepsItem value="shipping" title="Shipping" />
        <StepsItem value="payment" title="Payment" />
      </Steps>
    );

    expect(screen.getByText('Shipping').closest('li')).toHaveAttribute('aria-current', 'step');
    expect(screen.getByText('Cart').closest('li')).not.toHaveAttribute('aria-current');
  });

  it('notifies when a clickable step is selected', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Steps value="shipping" onValueChange={onValueChange}>
        <StepsItem value="cart" title="Cart" />
        <StepsItem value="shipping" title="Shipping" />
        <StepsItem value="payment" title="Payment" />
      </Steps>
    );

    await user.click(screen.getByText('Payment'));
    expect(onValueChange).toHaveBeenCalledWith('payment');
  });
});
