import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { GlowCard } from './GlowCard';

describe('GlowCard', () => {
  it('tracks the pointer and clears the glow on leave', () => {
    render(<GlowCard>Spotlight</GlowCard>);
    const card = screen.getByText('Spotlight').parentElement as HTMLElement;
    fireEvent.pointerMove(card, { clientX: 12, clientY: 18 });
    expect(card).toHaveAttribute('data-glow', 'true');
    expect(card.style.getPropertyValue('--glow-x')).toBe('12px');
    expect(card.style.getPropertyValue('--glow-y')).toBe('18px');
    fireEvent.pointerLeave(card);
    expect(card).not.toHaveAttribute('data-glow');
  });
});
