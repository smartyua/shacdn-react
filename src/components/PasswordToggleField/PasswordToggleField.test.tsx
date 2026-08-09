import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  PasswordToggleField,
  PasswordToggleFieldIcon,
  PasswordToggleFieldInput,
  PasswordToggleFieldToggle,
} from './PasswordToggleField';

const renderField = (props: {
  visible?: boolean;
  defaultVisible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
} = {}) =>
  render(
    <form
      onSubmit={event => {
        event.preventDefault();
      }}
    >
      <PasswordToggleField {...props}>
        <PasswordToggleFieldInput aria-label="Password" />
        <PasswordToggleFieldToggle>
          <PasswordToggleFieldIcon visible={<span>hide</span>} hidden={<span>show</span>} />
        </PasswordToggleFieldToggle>
      </PasswordToggleField>
      <button type="submit">Submit</button>
    </form>
  );

describe('PasswordToggleField', () => {
  it('toggles input type between password and text', async () => {
    const user = userEvent.setup();
    renderField();

    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('type', 'password');
    expect(screen.getByText('show')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Show password' }));
    expect(input).toHaveAttribute('type', 'text');
    expect(screen.getByText('hide')).toBeInTheDocument();
  });

  it('restores focus to the input after a pointer toggle', async () => {
    const user = userEvent.setup();
    renderField();

    const input = screen.getByLabelText('Password');
    const toggle = screen.getByRole('button', { name: 'Show password' });
    await user.click(toggle);

    expect(input).toHaveFocus();
  });

  it('resets visibility to hidden on form submit', async () => {
    const user = userEvent.setup();
    const onVisibleChange = vi.fn();
    renderField({ defaultVisible: true, onVisibleChange });

    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'text');

    await user.click(screen.getByRole('button', { name: 'Submit' }));
    expect(onVisibleChange).toHaveBeenCalledWith(false);
  });
});
