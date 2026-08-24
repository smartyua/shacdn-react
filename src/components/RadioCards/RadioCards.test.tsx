import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { RadioCards, RadioCardsItem } from './RadioCards';

describe('RadioCards', () => {
  it('selects a single card and reports the value', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <RadioCards defaultValue="free" onValueChange={onValueChange} aria-label="Plan">
        <RadioCardsItem value="free">Free</RadioCardsItem>
        <RadioCardsItem value="pro">Pro</RadioCardsItem>
        <RadioCardsItem value="team">Team</RadioCardsItem>
      </RadioCards>
    );

    expect(screen.getByRole('radio', { name: 'Free' })).toBeChecked();
    await user.click(screen.getByRole('radio', { name: 'Pro' }));
    expect(onValueChange).toHaveBeenCalledWith('pro');
    expect(screen.getByRole('radio', { name: 'Pro' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Free' })).not.toBeChecked();
  });

  it('does not change when disabled', () => {
    const onValueChange = vi.fn();

    render(
      <RadioCards defaultValue="free" disabled onValueChange={onValueChange} aria-label="Plan">
        <RadioCardsItem value="free">Free</RadioCardsItem>
        <RadioCardsItem value="pro">Pro</RadioCardsItem>
      </RadioCards>
    );

    expect(screen.getByRole('radio', { name: 'Pro' })).toBeDisabled();
    expect(screen.getByRole('radio', { name: 'Free' })).toBeChecked();
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
