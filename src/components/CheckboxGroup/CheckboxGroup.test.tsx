import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CheckboxGroup, CheckboxGroupItem } from './CheckboxGroup';

describe('CheckboxGroup', () => {
  it('toggles labeled checkboxes', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <CheckboxGroup defaultValue={['email']} onValueChange={onValueChange} aria-label="Alerts">
        <CheckboxGroupItem value="email">Email</CheckboxGroupItem>
        <CheckboxGroupItem value="sms">SMS</CheckboxGroupItem>
      </CheckboxGroup>
    );

    expect(screen.getByRole('checkbox', { name: 'Email' })).toBeChecked();
    await user.click(screen.getByRole('checkbox', { name: 'SMS' }));
    expect(onValueChange).toHaveBeenCalledWith(['email', 'sms']);
  });
});
