import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { ToastProvider } from '../../../../components/Toast/Toast';
import { useStubbedLayout } from '../../../../test/layout';
import { FinancePage } from './FinancePage';

const renderPage = () =>
  render(
    <ToastProvider>
      <FinancePage />
    </ToastProvider>
  );

describe('FinancePage', () => {
  useStubbedLayout();

  it('renders the finance dashboard regions and headline figures', () => {
    renderPage();

    expect(screen.getByRole('heading', { level: 1, name: 'Finance Dashboard' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Key metrics' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Income Sources' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Monthly Expenses' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Transactions' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Saving Goal' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'My Wallet' })).toBeVisible();
    expect(screen.getByText('$125,430')).toBeVisible();
    expect(screen.getByText('Samantha William')).toBeVisible();
    expect(screen.getByText('Credit Card')).toBeVisible();
  });

  it('opens the transfer dialog from the balance card', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('button', { name: 'Transfer' }));

    const dialog = screen.getByRole('dialog', { name: 'Transfer funds' });
    expect(dialog).toBeVisible();
    await user.click(within(dialog).getByRole('button', { name: 'Transfer' }));
    expect(screen.getByText('Transfer requested')).toBeVisible();
  });
});
