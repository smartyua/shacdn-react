import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { useStubbedLayout } from '../../test/layout';
import { DateRangePicker } from './DateRangePicker';

describe('DateRangePicker', () => {
  useStubbedLayout();

  it('shows the formatted range and lets the user pick a new one', async () => {
    const user = userEvent.setup();

    render(
      <DateRangePicker
        defaultValue={{ from: new Date(2026, 7, 22), to: new Date(2026, 8, 18) }}
      />
    );

    expect(screen.getByRole('button', { name: 'Date range' })).toHaveTextContent(
      '22 Aug 2026 - 18 Sep 2026'
    );

    await user.click(screen.getByRole('button', { name: 'Date range' }));

    fireEvent.click(document.querySelector('[aria-label="Saturday, August 1, 2026"]')!);
    fireEvent.click(document.querySelector('[aria-label="Monday, August 10, 2026"]')!);

    expect(screen.getByRole('button', { name: 'Date range' })).toHaveTextContent(
      '1 Aug 2026 - 10 Aug 2026'
    );
  });
});
