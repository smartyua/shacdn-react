import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TreeView } from './TreeView';
import { flattenVisible, type TreeNode } from './treeModel';

const ITEMS: TreeNode[] = [
  {
    id: 'src',
    label: 'src',
    children: [
      { id: 'components', label: 'components', children: [{ id: 'button', label: 'Button.tsx' }] },
      { id: 'main', label: 'main.tsx' },
    ],
  },
  { id: 'readme', label: 'README.md' },
];

describe('flattenVisible', () => {
  it('only descends into expanded nodes', () => {
    expect(flattenVisible(ITEMS, new Set()).map(row => row.node.id)).toEqual(['src', 'readme']);
    expect(flattenVisible(ITEMS, new Set(['src'])).map(row => row.node.id)).toEqual(['src', 'components', 'main', 'readme']);
  });
});

describe('TreeView', () => {
  it('expands, navigates, and selects with the keyboard', () => {
    const onSelect = vi.fn();
    render(<TreeView aria-label="Files" items={ITEMS} onSelect={onSelect} />);
    const tree = screen.getByRole('tree', { name: 'Files' });
    const src = screen.getByRole('treeitem', { name: 'src' });

    expect(src).toHaveAttribute('tabindex', '0');
    src.focus();
    fireEvent.keyDown(tree, { key: 'ArrowRight' });
    expect(src).toHaveAttribute('aria-expanded', 'true');

    fireEvent.keyDown(tree, { key: 'ArrowRight' });
    expect(screen.getByRole('treeitem', { name: 'components' })).toHaveFocus();

    fireEvent.keyDown(tree, { key: 'ArrowDown' });
    expect(screen.getByRole('treeitem', { name: 'main.tsx' })).toHaveFocus();
    fireEvent.keyDown(tree, { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledWith('main', expect.objectContaining({ id: 'main' }));

    fireEvent.keyDown(tree, { key: 'ArrowLeft' });
    expect(src).toHaveFocus();
  });

  it('toggles a folder on click', async () => {
    const user = userEvent.setup();
    render(<TreeView aria-label="Files" items={ITEMS} />);

    await user.click(screen.getByText('src'));
    expect(screen.getByRole('treeitem', { name: 'main.tsx' })).toBeInTheDocument();
    await user.click(screen.getByText('src'));
    expect(screen.queryByRole('treeitem', { name: 'main.tsx' })).not.toBeInTheDocument();
  });
});
