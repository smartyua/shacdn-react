import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { OrbitingCircles, OrbitingCirclesItem } from './OrbitingCircles';

describe('OrbitingCircles', () => {
  it('renders the center and an orbiting item', () => {
    render(
      <OrbitingCircles>
        <OrbitingCirclesItem radius={48} reverse path>
          Moon
        </OrbitingCirclesItem>
        <span>Sun</span>
      </OrbitingCircles>
    );

    expect(screen.getByText('Sun')).toBeInTheDocument();
    expect(screen.getByText('Moon')).toHaveAttribute('data-reverse', 'true');
  });

  it('keeps a non-positive radius usable', () => {
    render(
      <OrbitingCircles size={0}>
        <OrbitingCirclesItem radius={0} duration={0}>
          Dot
        </OrbitingCirclesItem>
      </OrbitingCircles>
    );
    expect(screen.getByText('Dot')).toBeInTheDocument();
  });
});
