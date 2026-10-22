import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PasswordStrength } from './PasswordStrength';
import { scorePassword } from './passwordScore';

describe('scorePassword', () => {
  it('scores by satisfied rules', () => {
    expect(scorePassword('')).toEqual({ score: 0, passed: [] });
    expect(scorePassword('abc').score).toBe(1);
    expect(scorePassword('abcdefgh1').score).toBe(2);
    expect(scorePassword('Abcdefgh1').score).toBe(3);
    expect(scorePassword('Abcdefgh1!').score).toBe(4);
  });

  it('rewards long passphrases', () => {
    expect(scorePassword('correct horse battery staple').score).toBe(4);
  });
});

describe('PasswordStrength', () => {
  it('exposes the score as a meter and lists met rules', () => {
    render(<PasswordStrength value="Abcdefgh1" />);

    const meter = screen.getByRole('meter', { name: 'Password strength' });
    expect(meter).toHaveAttribute('aria-valuenow', '3');
    expect(meter).toHaveAttribute('aria-valuetext', 'Good');
    expect(screen.getByText('A symbol').closest('li')).not.toHaveAttribute('data-passed');
    expect(screen.getByText('A number').closest('li')).toHaveAttribute('data-passed');
  });
});
