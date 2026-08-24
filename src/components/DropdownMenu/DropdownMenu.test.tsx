import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Button } from '../Button/Button';
import { useStubbedLayout } from '../../test/layout';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
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

describe('DropdownMenu compound items', () => {
  useStubbedLayout();

  it('toggles a checkbox item without closing the menu', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem onCheckedChange={onCheckedChange}>
            Status bar
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    const item = screen.getByText('Status bar');
    expect(item.closest('[role="menuitemcheckbox"]')).toHaveAttribute('aria-checked', 'false');

    await user.click(item);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(item.closest('[role="menuitemcheckbox"]')).toHaveAttribute('aria-checked', 'true');
    expect(document.querySelector('[role="menu"]')).toBeTruthy();
  });

  it('selects a radio item within a group', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup defaultValue="bottom" onValueChange={onValueChange}>
            <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    expect(screen.getByText('Bottom').closest('[role="menuitemradio"]')).toHaveAttribute(
      'aria-checked',
      'true'
    );

    await user.click(screen.getByText('Top'));

    expect(onValueChange).toHaveBeenCalledWith('top');
    expect(screen.getByText('Top').closest('[role="menuitemradio"]')).toHaveAttribute(
      'aria-checked',
      'true'
    );
  });

  it('opens a submenu from the trigger and keeps shortcuts in the item', async () => {
    const user = userEvent.setup();

    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Account</DropdownMenuLabel>
            <DropdownMenuItem>
              Profile
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Email</DropdownMenuItem>
              <DropdownMenuItem>Message</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    expect(screen.getByText('⇧⌘P')).toBeInTheDocument();

    await user.click(screen.getByText('Invite users'));

    expect(screen.getByText('Email').closest('[role="menuitem"]')).toBeTruthy();
    expect(screen.getByText('Message').closest('[role="menuitem"]')).toBeTruthy();
  });
});

describe('DropdownMenu checkbox controlled demo', () => {
  useStubbedLayout();

  it('honors a controlled checked value', async () => {
    const user = userEvent.setup();

    const Harness = () => {
      const [checked, setChecked] = useState(true);
      return (
        <DropdownMenu>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem checked={checked} onCheckedChange={setChecked}>
              Status bar
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    };

    render(<Harness />);
    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    const item = screen.getByText('Status bar').closest('[role="menuitemcheckbox"]');
    expect(item).toHaveAttribute('aria-checked', 'true');
    await user.click(screen.getByText('Status bar'));
    expect(item).toHaveAttribute('aria-checked', 'false');
  });
});
