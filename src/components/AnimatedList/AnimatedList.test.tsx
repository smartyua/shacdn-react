import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AnimatedList } from './AnimatedList';

describe('AnimatedList', () => {
  it('renders each child in order', () => {
    render(
      <AnimatedList>
        <span>One</span>
        <span>Two</span>
      </AnimatedList>
    );

    expect(screen.getByText('One')).toBeInTheDocument();
    expect(screen.getByText('Two')).toBeInTheDocument();
  });

  it('renders an empty list', () => {
    const { container } = render(<AnimatedList>{null}</AnimatedList>);
    expect(container.querySelector('[data-slot="animated-list"]')).toBeEmptyDOMElement();
  });

  it('ignores a non-positive delay', () => {
    render(
      <AnimatedList delay={0}>
        <span>Item</span>
      </AnimatedList>
    );
    expect(screen.getByText('Item').parentElement).toHaveStyle({ animationDelay: '0ms' });
  });
});
