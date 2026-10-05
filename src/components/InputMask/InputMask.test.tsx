import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { applyMask } from './applyMask';
import { InputMask } from './InputMask';

describe('applyMask', () => {
  it('passes input through when the mask is empty', () => {
    expect(applyMask('ab-12', '')).toEqual({ masked: 'ab-12', raw: 'ab-12' });
  });

  it('builds a phone mask, skips letters, and uppercases letter slots', () => {
    expect(applyMask('12ab34', '(###) ###')).toEqual({ masked: '(123) 4', raw: '1234' });
    expect(applyMask('ab12', 'AA-###')).toEqual({ masked: 'AB-12', raw: 'AB12' });
    expect(applyMask('a1!', '*#')).toEqual({ masked: 'a1', raw: 'a1' });
    expect(applyMask('', '###')).toEqual({ masked: '', raw: '' });
  });
});

describe('InputMask', () => {
  it('emits the masked and raw values', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<InputMask aria-label="Phone" mask="(###) ###-####" onValueChange={onValueChange} />);

    await user.type(screen.getByRole('textbox', { name: 'Phone' }), '415555');
    expect(onValueChange).toHaveBeenLastCalledWith('(415) 555', '415555');
  });

  it('renders a controlled value through the mask', () => {
    render(<InputMask aria-label="Code" mask="AA-###" value="xy9" />);
    expect(screen.getByRole('textbox', { name: 'Code' })).toHaveValue('XY-9');
  });
});
