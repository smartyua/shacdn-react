import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ToggleGroup, ToggleGroupItem } from './ToggleGroup';
import styles from './ToggleGroup.module.scss';

const Sizes = ({ onValueChange }: { onValueChange?: (value: string | string[]) => void }) => {
  const [size, setSize] = useState('42');

  return (
    <ToggleGroup
      type="single"
      value={size}
      aria-label="Size"
      onValueChange={value => {
        if (typeof value === 'string' && value) setSize(value);
        onValueChange?.(value);
      }}
    >
      {['40', '41', '42', '43'].map(item => (
        <ToggleGroupItem key={item} value={item} aria-label={item}>
          {item}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};

describe('ToggleGroup', () => {
  it('shows the selected item and moves the selection when another item is pressed', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Sizes onValueChange={onValueChange} />);

    const selected = screen.getByRole('button', { name: '42' });
    const next = screen.getByRole('button', { name: '40' });
    expect(selected).toHaveAttribute('aria-pressed', 'true');
    expect(selected).toHaveAttribute('data-state', 'on');
    expect(next).toHaveAttribute('aria-pressed', 'false');

    await user.click(next);

    expect(onValueChange).toHaveBeenCalledWith('40');
    expect(next).toHaveAttribute('aria-pressed', 'true');
    expect(next).toHaveAttribute('data-state', 'on');
    expect(selected).toHaveAttribute('aria-pressed', 'false');
    expect(selected).toHaveAttribute('data-state', 'off');
  });

  it('keeps a controlled single value when the active item is pressed again', async () => {
    const user = userEvent.setup();
    render(<Sizes />);

    const selected = screen.getByRole('button', { name: '42' });
    await user.click(selected);

    expect(selected).toHaveAttribute('aria-pressed', 'true');
  });

  it('selects and clears an uncontrolled single value', async () => {
    const user = userEvent.setup();
    render(
      <ToggleGroup className="sizes" id="sizes">
        <ToggleGroupItem value="40">40</ToggleGroupItem>
        <ToggleGroupItem value="41">41</ToggleGroupItem>
      </ToggleGroup>
    );

    const group = screen.getByRole('group');
    expect(group).toHaveAttribute('id', 'sizes');
    expect(group).toHaveAttribute('data-type', 'single');
    expect(group.className).toContain(styles.group);
    expect(group.className).toContain('sizes');

    const first = screen.getByRole('button', { name: '40' });
    await user.click(first);
    expect(first).toHaveAttribute('aria-pressed', 'true');
    await user.click(first);
    expect(first).toHaveAttribute('aria-pressed', 'false');
  });

  it('starts from a string default for single selection', () => {
    render(
      <ToggleGroup defaultValue="41">
        <ToggleGroupItem value="40">40</ToggleGroupItem>
        <ToggleGroupItem value="41">41</ToggleGroupItem>
      </ToggleGroup>
    );

    expect(screen.getByRole('button', { name: '41' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: '40' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('ignores a non-string default for single selection', () => {
    render(
      <ToggleGroup type="single" defaultValue={['40']}>
        <ToggleGroupItem value="40">40</ToggleGroupItem>
      </ToggleGroup>
    );

    expect(screen.getByRole('button', { name: '40' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('adds and removes items from an uncontrolled multiple value', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <ToggleGroup type="multiple" defaultValue={['40']} onValueChange={onValueChange}>
        <ToggleGroupItem value="40">40</ToggleGroupItem>
        <ToggleGroupItem value="41">41</ToggleGroupItem>
      </ToggleGroup>
    );

    const forty = screen.getByRole('button', { name: '40' });
    const fortyOne = screen.getByRole('button', { name: '41' });
    expect(forty).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('group')).toHaveAttribute('data-type', 'multiple');

    await user.click(fortyOne);
    expect(onValueChange).toHaveBeenLastCalledWith(['40', '41']);
    expect(fortyOne).toHaveAttribute('aria-pressed', 'true');

    await user.click(forty);
    expect(onValueChange).toHaveBeenLastCalledWith(['41']);
    expect(forty).toHaveAttribute('aria-pressed', 'false');
  });

  it('wraps a string default and ignores a default that is not a list', async () => {
    const user = userEvent.setup();
    render(
      <ToggleGroup type="multiple" defaultValue="41">
        <ToggleGroupItem value="40">40</ToggleGroupItem>
        <ToggleGroupItem value="41">41</ToggleGroupItem>
      </ToggleGroup>
    );

    expect(screen.getByRole('button', { name: '41' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: '40' })).toHaveAttribute('aria-pressed', 'false');
    cleanup();

    render(
      <ToggleGroup type="multiple" defaultValue={false as unknown as string}>
        <ToggleGroupItem value="40">40</ToggleGroupItem>
      </ToggleGroup>
    );
    expect(screen.getByRole('button', { name: '40' })).toHaveAttribute('aria-pressed', 'false');
    cleanup();

    render(
      <ToggleGroup type="multiple">
        <ToggleGroupItem value="40">40</ToggleGroupItem>
      </ToggleGroup>
    );
    await user.click(screen.getByRole('button', { name: '40' }));
    expect(screen.getByRole('button', { name: '40' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('keeps a string controlled value when that item is pressed again', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <ToggleGroup type="multiple" value={'40' as unknown as string[]} onValueChange={onValueChange}>
        <ToggleGroupItem value="40">40</ToggleGroupItem>
        <ToggleGroupItem value="41">41</ToggleGroupItem>
      </ToggleGroup>
    );

    await user.click(screen.getByRole('button', { name: '40' }));
    expect(onValueChange).toHaveBeenLastCalledWith(['40']);

    await user.click(screen.getByRole('button', { name: '41' }));
    expect(onValueChange).toHaveBeenLastCalledWith(['40', '41']);
  });

  it('starts from an empty controlled list', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <ToggleGroup type="multiple" value="" onValueChange={onValueChange}>
        <ToggleGroupItem value="40">40</ToggleGroupItem>
      </ToggleGroup>
    );

    await user.click(screen.getByRole('button', { name: '40' }));
    expect(onValueChange).toHaveBeenCalledWith(['40']);
    expect(screen.getByRole('button', { name: '40' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('requires an item to sit inside the group', () => {
    expect(() => render(<ToggleGroupItem value="40">40</ToggleGroupItem>)).toThrow(
      'ToggleGroupItem must be used within ToggleGroup'
    );
  });
});
