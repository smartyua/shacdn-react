import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { useStubbedLayout } from '../../test/layout';
import { MultiSelect } from './MultiSelect';

const OPTIONS = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
];

describe('MultiSelect', () => {
  useStubbedLayout();

  it('selects an option and adds it to value', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <MultiSelect
        options={OPTIONS}
        placeholder="Pick fruits"
        onValueChange={onValueChange}
      />
    );

    await user.click(screen.getByRole('button', { name: /pick fruits/i }));

    const listbox = document.querySelector('[role="listbox"]');
    expect(listbox).toBeTruthy();

    const options = listbox!.querySelectorAll('[role="option"]');
    expect(options[0]?.textContent).toContain('Apple');

    fireEvent.mouseDown(options[1]!);

    expect(onValueChange).toHaveBeenCalledWith(['banana']);
  });

  it('removes a chip and deselects the value', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <MultiSelect
        options={OPTIONS}
        value={['apple', 'banana']}
        onValueChange={onValueChange}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Remove Apple' }));

    expect(onValueChange).toHaveBeenCalledWith(['banana']);
  });
});
