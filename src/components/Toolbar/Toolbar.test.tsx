import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import {
  Toolbar,
  ToolbarButton,
  ToolbarLink,
  ToolbarSeparator,
  ToolbarToggleGroup,
  ToolbarToggleItem,
} from './Toolbar';

describe('Toolbar', () => {
  it('exposes toolbar semantics and roving focus', async () => {
    const user = userEvent.setup();
    render(
      <Toolbar aria-label="Formatting">
        <ToolbarButton>Cut</ToolbarButton>
        <ToolbarSeparator />
        <ToolbarButton>Copy</ToolbarButton>
        <ToolbarLink href="#paste">Paste</ToolbarLink>
        <ToolbarToggleGroup type="single" defaultValue="bold">
          <ToolbarToggleItem value="bold">Bold</ToolbarToggleItem>
          <ToolbarToggleItem value="italic">Italic</ToolbarToggleItem>
        </ToolbarToggleGroup>
      </Toolbar>
    );

    expect(screen.getByRole('toolbar', { name: 'Formatting' })).toBeInTheDocument();

    const cut = screen.getByRole('button', { name: 'Cut' });
    const copy = screen.getByRole('button', { name: 'Copy' });
    cut.focus();
    expect(cut).toHaveFocus();

    await user.keyboard('{ArrowRight}');
    expect(copy).toHaveFocus();

    await user.keyboard('{End}');
    expect(screen.getByRole('button', { name: 'Italic' })).toHaveFocus();

    await user.keyboard('{Home}');
    expect(cut).toHaveFocus();
  });

  it('toggles items inside ToolbarToggleGroup', async () => {
    const user = userEvent.setup();
    render(
      <Toolbar>
        <ToolbarToggleGroup type="single" defaultValue="left">
          <ToolbarToggleItem value="left">Left</ToolbarToggleItem>
          <ToolbarToggleItem value="right">Right</ToolbarToggleItem>
        </ToolbarToggleGroup>
      </Toolbar>
    );

    const left = screen.getByRole('button', { name: 'Left' });
    const right = screen.getByRole('button', { name: 'Right' });
    expect(left).toHaveAttribute('aria-pressed', 'true');

    await user.click(right);
    expect(right).toHaveAttribute('aria-pressed', 'true');
    expect(left).toHaveAttribute('aria-pressed', 'false');
  });
});
