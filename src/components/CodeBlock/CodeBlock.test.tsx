import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CodeBlock } from './CodeBlock';

describe('CodeBlock', () => {
  it('highlights a line and copies the source', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });

    render(<CodeBlock code={'one\ntwo'} language="ts" highlight={[2]} />);
    expect(screen.getByText('two')).toHaveAttribute('data-highlighted', 'true');
    expect(screen.getByText('ts')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Copy' }));
    expect(writeText).toHaveBeenCalledWith('one\ntwo');
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();
  });

  it('marks the copy button when the clipboard rejects', async () => {
    const user = userEvent.setup();
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockRejectedValue(new Error('nope')) },
    });

    render(<CodeBlock code="secret" />);
    await user.click(screen.getByRole('button', { name: 'Copy' }));
    expect(screen.getByRole('button', { name: 'Copy' })).toHaveAttribute('aria-invalid', 'true');
  });

  it('switches files and can hide the copy button', async () => {
    const user = userEvent.setup();
    render(
      <CodeBlock
        copyable={false}
        files={[
          { name: 'a.ts', code: 'alpha', language: 'ts' },
          { name: 'b.ts', code: 'beta', language: 'ts' },
        ]}
      />
    );

    expect(screen.queryByRole('button', { name: 'Copy' })).not.toBeInTheDocument();
    expect(screen.getByText('alpha')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'b.ts' }));
    expect(screen.getByText('beta')).toBeInTheDocument();
  });

  it('renders an empty source', () => {
    const { container } = render(<CodeBlock code="" copyable={false} />);
    expect(container.querySelector('code span')?.textContent).toBe(' ');
  });
});
