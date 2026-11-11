import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DotField } from './DotField';

describe('DotField', () => {
  it('moves the spotlight with the pointer', () => {
    render(<DotField>Grid</DotField>);
    const field = screen.getByText('Grid').parentElement as HTMLElement;
    fireEvent.pointerMove(field, { clientX: 24, clientY: 36 });
    expect(field.style.getPropertyValue('--spot-x')).toBe('24px');
    expect(field.style.getPropertyValue('--spot-y')).toBe('36px');
  });
});
