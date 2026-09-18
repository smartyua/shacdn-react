import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DonutChart, GroupedBarChart, Sparkline } from './Chart';

describe('Chart extras', () => {
  it('renders a donut with a center label', () => {
    render(
      <DonutChart
        data={[
          { label: 'Rental', value: 35 },
          { label: 'Freelance', value: 11 },
        ]}
        showLegend={false}
      >
        Total Income
      </DonutChart>
    );

    expect(screen.getByRole('img', { name: 'Donut chart' })).toBeInTheDocument();
    expect(screen.getByText('Total Income')).toBeInTheDocument();
  });

  it('renders grouped bars and a sparkline', () => {
    render(
      <>
        <GroupedBarChart
          data={[
            { label: 'Jan', values: { food: 4, shopping: 2 } },
            { label: 'Feb', values: { food: 3, shopping: 1 } },
          ]}
          series={[
            { key: 'food', label: 'Food' },
            { key: 'shopping', label: 'Shopping' },
          ]}
        />
        <Sparkline data={[4, 8, 6, 10]} />
      </>
    );

    expect(screen.getByRole('img', { name: 'Grouped bar chart' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Sparkline' })).toBeInTheDocument();
    expect(screen.getByText('Food')).toBeInTheDocument();
  });
});
