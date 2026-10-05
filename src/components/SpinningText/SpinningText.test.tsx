import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SpinningText } from './SpinningText';

describe('SpinningText', () => {
  it('exposes the text to assistive tech and can reverse', () => {
    render(<SpinningText text="Open source" reverse />);
    const svg = screen.getByRole('img', { name: 'Open source' });
    expect(svg).toHaveAttribute('data-reverse', 'true');
    expect(svg.querySelector('textPath')).toHaveTextContent('Open source');
  });

  it('labels an empty string', () => {
    render(<SpinningText text="" size={0} duration={0} />);
    expect(screen.getByRole('img', { name: 'Spinning text' })).toBeInTheDocument();
  });
});
