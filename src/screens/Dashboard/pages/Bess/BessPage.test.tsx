import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { useStubbedLayout } from '../../../../test/layout';
import { BessPage } from './BessPage';

describe('BessPage', () => {
  useStubbedLayout();

  it('exposes every inverter tile as a button that opens its string details', async () => {
    const user = userEvent.setup();
    render(<BessPage />);

    await user.click(screen.getByRole('button', { name: 'INV-01 · View string details' }));

    expect(screen.getByRole('dialog')).toBeVisible();
    expect(screen.getByRole('heading', { name: /INV-01 — DC strings/ })).toBeVisible();
  });

  it('groups content into labelled regions', () => {
    render(<BessPage />);

    for (const name of ['Live metrics', 'Site conditions', 'Battery banks', 'Trends', 'Equipment']) {
      expect(screen.getByRole('region', { name })).toBeInTheDocument();
    }
  });

  it('keeps the alarm table inside a horizontal scroller so narrow viewports can reach every column', async () => {
    const user = userEvent.setup();
    render(<BessPage />);

    await user.click(screen.getByRole('tab', { name: /Alarms/ }));
    const wrapper = screen.getByRole('table').parentElement as HTMLElement;

    expect(window.getComputedStyle(wrapper).overflowX).toBe('auto');
  });

  it('pauses and resumes the simulation from the header control', async () => {
    const user = userEvent.setup();
    render(<BessPage />);

    await user.click(screen.getByRole('button', { name: 'Pause simulation' }));

    expect(screen.getByRole('button', { name: 'Resume simulation' })).toBeVisible();
  });
});
