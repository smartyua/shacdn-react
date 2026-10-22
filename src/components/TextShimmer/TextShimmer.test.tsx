import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TextShimmer } from './TextShimmer';

describe('TextShimmer', () => {
  it('keeps the text readable and renders the requested element', () => {
    render(
      <TextShimmer as="p" duration={3}>
        Generating summary…
      </TextShimmer>
    );
    const node = screen.getByText('Generating summary…');
    expect(node.tagName).toBe('P');
    expect(node.style.getPropertyValue('--shimmer-duration')).toBe('3s');
  });

  it('marks the paused state', () => {
    render(<TextShimmer paused>Done</TextShimmer>);
    expect(screen.getByText('Done')).toHaveAttribute('data-paused');
  });
});
