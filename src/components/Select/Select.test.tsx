import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { useStubbedLayout } from '../../test/layout';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './Select';

const renderSelect = (props: { onValueChange?: (v: string) => void; disabled?: boolean } = {}) =>
  render(
    <Select onValueChange={props.onValueChange} disabled={props.disabled}>
      <SelectTrigger aria-label="Fruit">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectItem value="broccoli" disabled>
          Broccoli
        </SelectItem>
      </SelectContent>
    </Select>
  );

describe('Select', () => {
  useStubbedLayout();

  it('shows the placeholder until a value is chosen', () => {
    renderSelect();

    expect(screen.getByRole('combobox')).toHaveTextContent('Select a fruit');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('opens on click and selects an item with the pointer', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderSelect({ onValueChange });

    await user.click(screen.getByRole('combobox'));

    const listbox = await screen.findByRole('listbox');
    expect(listbox).toBeInTheDocument();

    await user.click(screen.getByRole('option', { name: 'Banana' }));

    expect(onValueChange).toHaveBeenCalledWith('banana');
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
    expect(screen.getByRole('combobox')).toHaveTextContent('Banana');
  });

  it('moves the active option with the keyboard and commits on Enter', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderSelect({ onValueChange });

    const trigger = screen.getByRole('combobox');
    trigger.focus();
    await user.keyboard('{ArrowDown}');

    const listbox = await screen.findByRole('listbox');
    await waitFor(() => expect(listbox).toHaveFocus());
    await waitFor(() =>
      expect(listbox.getAttribute('aria-activedescendant')).toBe(
        screen.getByRole('option', { name: 'Apple' }).id
      )
    );

    await user.keyboard('{ArrowDown}');
    expect(listbox.getAttribute('aria-activedescendant')).toBe(
      screen.getByRole('option', { name: 'Banana' }).id
    );

    await user.keyboard('{Enter}');
    expect(onValueChange).toHaveBeenCalledWith('banana');
  });

  it('skips disabled items during keyboard navigation', async () => {
    const user = userEvent.setup();
    renderSelect();

    screen.getByRole('combobox').focus();
    await user.keyboard('{ArrowDown}');

    const listbox = await screen.findByRole('listbox');
    await user.keyboard('{End}');

    expect(listbox.getAttribute('aria-activedescendant')).toBe(
      screen.getByRole('option', { name: 'Banana' }).id
    );
    expect(screen.getByRole('option', { name: 'Broccoli' })).toHaveAttribute(
      'aria-disabled',
      'true'
    );
  });

  it('closes on Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    renderSelect();

    const trigger = screen.getByRole('combobox');
    await user.click(trigger);
    await screen.findByRole('listbox');

    await user.keyboard('{Escape}');

    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it('does not open while disabled', async () => {
    const user = userEvent.setup();
    renderSelect({ disabled: true });

    await user.click(screen.getByRole('combobox'));

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('has no serious accessibility violations when open', async () => {
    const user = userEvent.setup();
    const { container } = renderSelect();

    await user.click(screen.getByRole('combobox'));
    await screen.findByRole('listbox');

    const results = await axe(container);
    expect(results.violations.filter(v => v.impact === 'serious' || v.impact === 'critical')).toEqual(
      []
    );
  });
});
