import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BorderBeam } from './BorderBeam';

describe('BorderBeam', () => {
  it('falls back when width and duration are not positive', () => {
    render(
      <BorderBeam borderWidth={0} duration={0}>
        Edge
      </BorderBeam>
    );
    const frame = screen.getByText('Edge').parentElement as HTMLElement;
    expect(frame.style.getPropertyValue('--beam-width')).toBe('1px');
    expect(frame.style.getPropertyValue('--beam-duration')).toBe('6s');
  });
});
