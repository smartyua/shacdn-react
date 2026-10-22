import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { InlineEdit } from './InlineEdit';

describe('InlineEdit', () => {
  it('commits on Enter and returns focus to the display', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<InlineEdit aria-label="Project name" defaultValue="Apollo" onValueChange={onValueChange} />);

    await user.click(screen.getByRole('button', { name: /Project name: Apollo/ }));
    const field = screen.getByRole('textbox', { name: 'Project name' });
    expect(field).toHaveFocus();

    await user.clear(field);
    await user.type(field, 'Artemis{Enter}');

    expect(onValueChange).toHaveBeenCalledWith('Artemis');
    expect(screen.getByRole('button', { name: /Project name: Artemis/ })).toHaveFocus();
  });

  it('cancels on Escape and refuses blank commits', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<InlineEdit aria-label="Title" defaultValue="Draft" onValueChange={onValueChange} />);

    await user.click(screen.getByRole('button', { name: /Title: Draft/ }));
    await user.type(screen.getByRole('textbox'), ' v2{Escape}');
    expect(screen.getByRole('button', { name: /Title: Draft/ })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Title: Draft/ }));
    await user.clear(screen.getByRole('textbox'));
    await user.keyboard('{Enter}');

    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: /Title: Draft/ })).toBeInTheDocument();
  });
});
