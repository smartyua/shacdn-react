import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { useStubbedLayout } from '../../test/layout';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from './Combobox';

const OPTIONS = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'blueberry', label: 'Blueberry' },
];

const FRAMEWORKS = ['Next.js', 'Remix', 'Astro', 'Nuxt.js'];

describe('Combobox', () => {
  useStubbedLayout();

  it('legacy API filters options and selects a value', async () => {
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
    expect(blueberry?.textContent).toContain('Blueberry');
    expect(document.querySelectorAll('[role="option"]')).toHaveLength(1);

    fireEvent.mouseDown(blueberry!);

    expect(onValueChange).toHaveBeenCalledWith('blueberry');
  });

  it('compound API supports clearable and slots', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Combobox
        items={FRAMEWORKS}
        defaultValue="Next.js"
        clearable
        onValueChange={onValueChange}
      >
        <ComboboxInput
          placeholder="Search a framework"
          aria-label="Search a framework"
          startSlot={<span data-testid="start-slot">⌘</span>}
        />
        <ComboboxContent>
          <ComboboxEmpty>No frameworks found.</ComboboxEmpty>
          <ComboboxList>
            {(item: string) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    );

    expect(screen.getByTestId('start-slot')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveValue('Next.js');

    await user.click(screen.getByRole('button', { name: 'Clear selection' }));
    expect(onValueChange).toHaveBeenCalledWith(null);
    expect(screen.getByRole('combobox')).toHaveValue('');
  });

  it('has no serious accessibility violations when closed', async () => {
    const { container } = render(
      <Combobox options={OPTIONS} placeholder="Pick fruit" />
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
