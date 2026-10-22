import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CopyButton } from './CopyButton';

const mockClipboard = (writeText: (value: string) => Promise<void>) => {
  Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
};

describe('CopyButton', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('copies the value, confirms, and resets', async () => {
    vi.useFakeTimers();
    const writeText = vi.fn(() => Promise.resolve());
    const onCopy = vi.fn();
    mockClipboard(writeText);
    render(<CopyButton value="npm i shacdn" label="Copy" onCopy={onCopy} resetAfter={500} />);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
    });

    expect(writeText).toHaveBeenCalledWith('npm i shacdn');
    expect(onCopy).toHaveBeenCalledWith('npm i shacdn');
    expect(screen.getByRole('button', { name: 'Copied' })).toHaveAttribute('data-state', 'copied');

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(screen.getByRole('button', { name: 'Copy' })).toHaveAttribute('data-state', 'idle');
  });

  it('reports a failed copy on an icon-only button', async () => {
    const onCopyError = vi.fn();
    mockClipboard(() => Promise.reject(new Error('denied')));
    render(<CopyButton value="x" aria-label="Copy token" onCopyError={onCopyError} />);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Copy token' }));
    });

    expect(onCopyError).toHaveBeenCalled();
    expect(screen.getByRole('status')).toHaveTextContent('Copy failed');
  });
});
