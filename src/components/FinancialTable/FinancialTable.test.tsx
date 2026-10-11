import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { FinancialTable } from './FinancialTable';

const columns = [
  { id: 'y10', label: '10 years' },
  { id: 'y15', label: '15 years' },
  { id: 'y20', label: '20 years' },
];

describe('FinancialTable', () => {
  it('colors signed amounts and highlights the active column', () => {
    render(
      <FinancialTable
        cornerLabel="Over the hold"
        activeColumnId="y10"
        caption="Wealth up is what remains after the loan and selling costs."
        columns={columns}
        rows={[
          {
            id: 'rent',
            label: 'Rent collected',
            cells: { y10: { value: 164604, tone: 'neutral' }, y15: { value: 267696, tone: 'neutral' } },
          },
          {
            id: 'before',
            label: 'Cashflow before tax benefits',
            cells: { y10: -20776, y15: -10374, y20: 19300 },
          },
          {
            id: 'wealth',
            label: 'Wealth up',
            emphasis: true,
            cells: { y10: { value: 137335, tone: 'neutral' } },
          },
        ]}
      />
    );

    expect(screen.getByRole('columnheader', { name: '10 years' })).toHaveAttribute('data-active', 'true');
    expect(screen.getByRole('columnheader', { name: '15 years' })).not.toHaveAttribute('data-active');
    expect(screen.getByText('164.604 €')).toBeInTheDocument();
    expect(screen.getByText('−20.776 €')).toBeInTheDocument();
    expect(screen.getByText('+19.300 €')).toBeInTheDocument();
    expect(screen.getByText('137.335 €')).toBeInTheDocument();
    expect(screen.getAllByText('—').length).toBeGreaterThan(0);
    expect(screen.getByText('Wealth up is what remains after the loan and selling costs.')).toBeInTheDocument();
  });

  it('has no serious accessibility violations', async () => {
    const { container } = render(
      <FinancialTable
        cornerLabel="Over the hold"
        columns={columns}
        rows={[{ id: 'rent', label: 'Rent collected', cells: { y10: { value: 1000, tone: 'neutral' } } }]}
      />
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
