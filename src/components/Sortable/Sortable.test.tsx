import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { indexFromPointer, reorder } from './reorder';
import { Sortable, SortableItem } from './Sortable';

describe('reorder', () => {
  it('moves an item and ignores no-op indexes', () => {
    const items = ['a', 'b', 'c'];
    expect(reorder(items, 0, 2)).toEqual(['b', 'c', 'a']);
    expect(reorder(items, 1, 1)).toBe(items);
    expect(reorder(items, -1, 0)).toBe(items);
    expect(reorder(items, 0, 9)).toBe(items);
  });

  it('maps a pointer to a row', () => {
    const bands = [
      { top: 0, height: 10 },
      { top: 10, height: 10 },
    ];
    expect(indexFromPointer([], 4)).toBe(0);
    expect(indexFromPointer(bands, Number.NaN)).toBe(0);
    expect(indexFromPointer(bands, 3)).toBe(0);
    expect(indexFromPointer(bands, 40)).toBe(1);
  });
});

describe('Sortable', () => {
  it('reorders with the arrow keys and ignores an unknown id', () => {
    const onValueChange = vi.fn();
    render(
      <Sortable value={['a', 'b']} onValueChange={onValueChange}>
        <SortableItem id="a">Alpha</SortableItem>
        <SortableItem id="missing">Missing</SortableItem>
        <SortableItem id="b">Beta</SortableItem>
      </Sortable>
    );

    fireEvent.keyDown(screen.getByText('Alpha').closest('li') as HTMLElement, { key: 'ArrowDown' });
    expect(onValueChange).toHaveBeenCalledWith(['b', 'a']);

    fireEvent.keyDown(screen.getByText('Missing').closest('li') as HTMLElement, { key: 'ArrowUp' });
    expect(onValueChange).toHaveBeenCalledTimes(1);
  });

  it('requires a Sortable parent', () => {
    expect(() => render(<SortableItem id="a">Alpha</SortableItem>)).toThrow(
      /SortableItem must be used within Sortable/
    );
  });
});
