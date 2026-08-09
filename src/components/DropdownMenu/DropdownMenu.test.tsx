import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Button } from '../Button/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './DropdownMenu';

const renderMenu = () =>
  render(
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button">Open menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

describe('DropdownMenu', () => {
  it('opens the menu and exposes menuitem roles', async () => {
    const user = userEvent.setup();
    renderMenu();

    expect(document.querySelector('[role="menu"]')).toBeNull();

    await user.click(screen.getByRole('button', { name: 'Open menu' }));

    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
      'aria-expanded',
      'true'
    );

    const menu = document.querySelector('[role="menu"]');
    expect(menu).toBeTruthy();
    expect(menu?.textContent).toContain('Profile');
    expect(menu?.textContent).toContain('Billing');
    expect(menu?.querySelectorAll('[role="menuitem"]')).toHaveLength(2);
  });

  it('has no serious accessibility violations when closed', async () => {
    const { container } = renderMenu();
    expect(await axe(container)).toHaveNoViolations();
  });
});
