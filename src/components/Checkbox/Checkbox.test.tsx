import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('renders a checkbox and handles check events', () => {
    const handleChange = vi.fn();
    render(<Checkbox aria-label="Accept terms" onChange={handleChange} />);

    const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' });
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('supports disabled state', () => {
    render(<Checkbox aria-label="Disabled checkbox" disabled />);
    const checkbox = screen.getByRole('checkbox', { name: 'Disabled checkbox' });
    expect(checkbox).toBeDisabled();
  });

  it('has no serious accessibility violations', async () => {
    const { container } = render(<Checkbox aria-label="Terms of service" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
