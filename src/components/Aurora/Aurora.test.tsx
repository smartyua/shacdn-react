import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Aurora } from './Aurora';

describe('Aurora', () => {
  it('renders content and pauses from the control', () => {
    render(<Aurora>Night wash</Aurora>);
    expect(screen.getByText('Night wash')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Pause animation' }));
    expect(screen.getByRole('button', { name: 'Play animation' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('Night wash').closest('[data-slot="aurora"]')).toHaveAttribute('data-paused', 'true');
  });

  it('hides the pause control when asked', () => {
    render(<Aurora controls={false}>Still</Aurora>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
