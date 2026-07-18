import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs';

const renderTabs = () =>
  render(
    <Tabs defaultValue="account">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">Account panel</TabsContent>
      <TabsContent value="password">Password panel</TabsContent>
    </Tabs>
  );

describe('Tabs', () => {
  it('shows the default panel and switches on click', async () => {
    const user = userEvent.setup();
    renderTabs();

    expect(screen.getByText('Account panel')).toBeVisible();
    expect(screen.queryByText('Password panel')).not.toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Password' }));

    expect(screen.getByText('Password panel')).toBeVisible();
    expect(screen.getByRole('tab', { name: 'Password' })).toHaveAttribute('aria-selected', 'true');
  });

  it('has no serious accessibility violations', async () => {
    const { container } = renderTabs();
    expect(await axe(container)).toHaveNoViolations();
  });
});
