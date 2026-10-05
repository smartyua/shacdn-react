import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ShineBorder } from './ShineBorder';

describe('ShineBorder', () => {
  it('renders children inside the frame', () => {
    render(
      <ShineBorder borderWidth={2} duration={4}>
        <p>Card</p>
      </ShineBorder>
    );
    expect(screen.getByText('Card')).toBeInTheDocument();
  });

  it('falls back when duration and width are not positive', () => {
    render(
      <ShineBorder borderWidth={0} duration={0}>
        Still here
      </ShineBorder>
    );
    expect(screen.getByText('Still here').parentElement).toHaveStyle({
      '--shine-width': '1px',
      '--shine-duration': '8s',
    });
  });
});
