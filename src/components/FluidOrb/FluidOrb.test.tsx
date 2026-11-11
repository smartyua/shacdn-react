import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FluidOrb } from './FluidOrb';

describe('FluidOrb', () => {
  it('names a decorative orb and exposes its state', () => {
    render(<FluidOrb label="Voice" state="listening" size="sm" />);
    const orb = screen.getByRole('img', { name: 'Voice' });
    expect(orb.closest('[data-slot="fluid-orb"]')).toHaveAttribute('data-state', 'listening');
  });

  it('keeps visible text out of an image role', () => {
    render(<FluidOrb label="Voice">Live</FluidOrb>);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText('Live')).toBeInTheDocument();
  });
});
