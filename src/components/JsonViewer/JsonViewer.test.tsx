import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { JsonViewer } from './JsonViewer';
import { childPath, previewOf } from './jsonPath';

describe('jsonPath', () => {
  it('builds accessor paths', () => {
    expect(childPath('$', 'users')).toBe('$.users');
    expect(childPath('$.users', 0)).toBe('$.users[0]');
    expect(childPath('$', 'display name')).toBe('$["display name"]');
  });

  it('previews containers', () => {
    expect(previewOf([1, 2, 3])).toBe('Array(3)');
    expect(previewOf({ a: 1 })).toBe('{1 key}');
  });
});

describe('JsonViewer', () => {
  const DATA = { name: 'shacdn', tags: Array.from({ length: 5 }, (_, i) => `t${i}`), meta: { stars: 42 } };

  it('expands nested nodes and pages long arrays', async () => {
    const user = userEvent.setup();
    render(<JsonViewer data={DATA} pageSize={2} />);

    expect(screen.getByText('"shacdn"')).toBeInTheDocument();
    expect(screen.queryByText('42')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Expand meta' }));
    expect(screen.getByText('42')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Expand tags' }));
    expect(screen.getByText('"t1"')).toBeInTheDocument();
    expect(screen.queryByText('"t2"')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Show 2 more of 3' }));
    expect(screen.getByText('"t3"')).toBeInTheDocument();
  });

  it('copies a value path', async () => {
    const writeText = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    const onCopyText = vi.fn();
    render(<JsonViewer data={{ meta: { stars: 42 } }} defaultExpandDepth={2} onCopyText={onCopyText} />);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Copy path $.meta.stars' }));
    });
    expect(writeText).toHaveBeenCalledWith('$.meta.stars');
    expect(onCopyText).toHaveBeenCalledWith('$.meta.stars', 'path');
  });
});
