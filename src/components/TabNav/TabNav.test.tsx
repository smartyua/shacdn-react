import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { TabNav, TabNavLink } from './TabNav';

const renderTabNav = (active = 'account') =>
  render(
    <TabNav aria-label="Settings">
      <TabNavLink href="#account" active={active === 'account'}>
        Account
      </TabNavLink>
      <TabNavLink href="#documents" active={active === 'documents'}>
        Documents
      </TabNavLink>
      <TabNavLink href="#settings" active={active === 'settings'}>
        Settings
      </TabNavLink>
    </TabNav>
  );

describe('TabNav', () => {
  it('marks the active link as the current page', () => {
    renderTabNav('documents');

    expect(screen.getByRole('navigation', { name: 'Settings' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Documents' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Account' })).not.toHaveAttribute('aria-current');
  });

  it('moves focus between links with arrow keys', async () => {
    const user = userEvent.setup();
    renderTabNav();

    const account = screen.getByRole('link', { name: 'Account' });
    account.focus();
    await user.keyboard('{ArrowRight}');

    expect(screen.getByRole('link', { name: 'Documents' })).toHaveFocus();
  });

  it('does not expose a disabled link as current', () => {
    render(
      <TabNav aria-label="Settings">
        <TabNavLink href="#account" active>
          Account
        </TabNavLink>
        <TabNavLink href="#settings" disabled>
          Settings
        </TabNavLink>
      </TabNav>
    );

    expect(screen.getByRole('link', { name: 'Settings' })).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('link', { name: 'Account' })).toHaveAttribute('aria-current', 'page');
  });

  it('has no serious accessibility violations', async () => {
    const { container } = renderTabNav();
    expect(await axe(container)).toHaveNoViolations();
  });
});
