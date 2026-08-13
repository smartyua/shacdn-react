import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Input } from './Input';

describe('Input', () => {
  it('forwards the accessible name', () => {
    render(<Input aria-label="Email" placeholder="you@example.com" />);
    expect(screen.getByRole('textbox', { name: 'Email' })).toBeInTheDocument();
  });

  it('has no serious accessibility violations', async () => {
    const { container } = render(<Input aria-label="Name" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
