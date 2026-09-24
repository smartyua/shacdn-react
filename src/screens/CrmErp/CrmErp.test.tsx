import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { ToastProvider } from '../../components/Toast/Toast';
import { useStubbedLayout } from '../../test/layout';
import { CrmErp } from './CrmErp';

const renderCrm = () =>
  render(
    <ToastProvider>
      <CrmErp />
    </ToastProvider>
  );

describe('CrmErp', () => {
  useStubbedLayout();

  it('renders the command-center heading and labelled regions', () => {
    renderCrm();

    expect(screen.getByRole('heading', { level: 1, name: 'Helix Works operations' })).toBeVisible();
    expect(screen.getByRole('region', { name: 'Operating KPIs' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Operating alerts' })).toBeInTheDocument();
    expect(screen.getByRole('list', { name: 'Opportunity board' })).toBeInTheDocument();
    expect(screen.getByLabelText('Record inspector')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Evaporator train upgrade' })).toBeVisible();
    const inspector = screen.getByLabelText('Record inspector');
    const accountTrigger = inspector.querySelector('[data-slot="hover-card-trigger"]');
    expect(accountTrigger).not.toBeNull();
    expect(accountTrigger?.closest('p')).toBeNull();
    expect(screen.getByText(/Iberia Pharma is on credit hold/)).toBeVisible();
    expect(screen.getByLabelText('Desk menus')).toBeInTheDocument();
  });

  it('opens the site-visit drawer from the operations menu', async () => {
    const user = userEvent.setup();
    renderCrm();

    await user.click(screen.getByRole('button', { name: 'Visit' }));

    expect(screen.getByRole('heading', { name: 'Schedule a site visit' })).toBeVisible();
  });

  it('switches the workbench from the sidebar', async () => {
    const user = userEvent.setup();
    renderCrm();

    await user.click(screen.getByRole('button', { name: 'Orders' }));

    expect(screen.getByRole('heading', { name: 'Orders' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'SO-2291' })).toBeVisible();
    expect(screen.getByRole('table')).toBeVisible();
  });

  it('updates the inspector when another deal is selected', async () => {
    const user = userEvent.setup();
    renderCrm();

    await user.click(screen.getByRole('button', { name: /Rhine Chem GmbH: CIP skid package/i }));

    expect(screen.getByRole('heading', { name: 'CIP skid package' })).toBeVisible();
    expect(within(screen.getByLabelText('Record inspector')).getAllByText(/Walk the P&ID/).length).toBeGreaterThan(0);
  });

  it('drafts a quote from the header action', async () => {
    const user = userEvent.setup();
    renderCrm();

    await user.click(screen.getByRole('button', { name: 'New quote' }));
    expect(screen.getByRole('dialog', { name: 'New quote' })).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Create draft' }));

    expect(screen.getByText(/drafted/i)).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Quotes' })).toBeVisible();
  });
});
