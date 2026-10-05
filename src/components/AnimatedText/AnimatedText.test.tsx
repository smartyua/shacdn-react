import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AnimatedText } from './AnimatedText';

describe('AnimatedText', () => {
  it.each(['fade', 'blur', 'slide', 'gradient', 'highlight'] as const)(
    'renders the full string for %s',
    variant => {
      const { container } = render(<AnimatedText text="Ship faster" variant={variant} />);
      expect(container.querySelector('[data-slot="animated-text"]')?.textContent).toBe('Ship faster');
    }
  );

  it('shows the full typewriter string when duration is zero', () => {
    render(<AnimatedText text="Ready" variant="typewriter" duration={0} />);
    expect(screen.getByText('Ready')).toBeInTheDocument();
  });

  it('shows the full scramble string when duration is zero', () => {
    render(<AnimatedText text="Ready" variant="scramble" duration={0} />);
    expect(screen.getByText('Ready')).toBeInTheDocument();
  });

  it('shows the first word for rotate', () => {
    render(<AnimatedText text="fallback" variant="rotate" words={['Alpha', 'Beta']} duration={0} />);
    expect(screen.getByText('Alpha')).toBeInTheDocument();
  });

  it('falls back to text when rotate has no words', () => {
    render(<AnimatedText text="fallback" variant="rotate" words={[]} />);
    expect(screen.getByText('fallback')).toBeInTheDocument();
  });

  it('renders an empty string', () => {
    const { container } = render(<AnimatedText text="" variant="typewriter" />);
    expect(container.querySelector('[data-slot="animated-text"]')).toBeInTheDocument();
  });

  it('splits characters without dropping them', () => {
    render(<AnimatedText text="Ab" variant="fade" by="character" />);
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('b')).toBeInTheDocument();
  });
});
