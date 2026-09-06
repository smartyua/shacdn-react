import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders text with default variant', () => {
    render(<Badge>New Feature</Badge>);
    expect(screen.getByText('New Feature')).toBeInTheDocument();
  });

  it('renders different variants', () => {
    render(
      <div>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="destructive">Destructive</Badge>
      </div>
    );

    expect(screen.getByText('Secondary')).toBeInTheDocument();
    expect(screen.getByText('Outline')).toBeInTheDocument();
    expect(screen.getByText('Destructive')).toBeInTheDocument();
  });

  it('has no serious accessibility violations', async () => {
    const { container } = render(<Badge>Status</Badge>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
