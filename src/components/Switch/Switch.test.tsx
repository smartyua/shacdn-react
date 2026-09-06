import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Switch } from './Switch';

describe('Switch', () => {
  it('renders a switch element and toggles state', () => {
    const handleChange = vi.fn();
    render(<Switch aria-label="Airplane mode" onChange={handleChange} />);

    const switchEl = screen.getByRole('switch', { name: 'Airplane mode' });
    expect(switchEl).not.toBeChecked();

    fireEvent.click(switchEl);
    expect(switchEl).toBeChecked();
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('supports disabled state', () => {
    render(<Switch aria-label="Disabled option" disabled />);
    const switchEl = screen.getByRole('switch', { name: 'Disabled option' });
    expect(switchEl).toBeDisabled();
  });

  it('has no serious accessibility violations', async () => {
    const { container } = render(<Switch aria-label="Dark mode" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
