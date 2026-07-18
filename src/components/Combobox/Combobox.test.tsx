import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Combobox } from './Combobox';

const OPTIONS = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'blueberry', label: 'Blueberry' },
];

describe('Combobox', () => {
  it('filters options and selects a value', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Combobox
        options={OPTIONS}
        placeholder="Pick fruit"
        onValueChange={onValueChange}
      />
    );

    const input = screen.getByRole('combobox');
    await user.click(input);
    await user.clear(input);
    await user.type(input, 'blue');

    const blueberry = document.querySelector('[role="option"]');
    expect(blueberry?.textContent).toBe('Blueberry');
    expect(document.querySelectorAll('[role="option"]')).toHaveLength(1);

    fireEvent.mouseDown(blueberry!);

    expect(onValueChange).toHaveBeenCalledWith('blueberry');
  });

  it('has no serious accessibility violations when closed', async () => {
    const { container } = render(
      <Combobox options={OPTIONS} placeholder="Pick fruit" />
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
