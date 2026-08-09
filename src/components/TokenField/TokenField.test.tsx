import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TokenField } from './TokenField';

describe('TokenField', () => {
  it('adds a token on Enter', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(<TokenField onValueChange={onValueChange} placeholder="Add tag" />);

    const input = screen.getByRole('textbox', { name: 'Tokens' });
    await user.type(input, 'react{Enter}');

    expect(onValueChange).toHaveBeenCalledWith(['react']);
  });

  it('removes the last token on Backspace when input is empty', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <TokenField value={['alpha', 'beta']} onValueChange={onValueChange} />
    );

    const input = screen.getByRole('textbox', { name: 'Tokens' });
    await user.click(input);
    await user.keyboard('{Backspace}');

    expect(onValueChange).toHaveBeenCalledWith(['alpha']);
  });

  it('removes a token when chip remove is clicked', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <TokenField value={['alpha', 'beta']} onValueChange={onValueChange} />
    );

    await user.click(screen.getByRole('button', { name: 'Remove alpha' }));

    expect(onValueChange).toHaveBeenCalledWith(['beta']);
  });
});
