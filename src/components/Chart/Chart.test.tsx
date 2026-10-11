import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DivergingBarChart, DonutChart, GroupedBarChart, Sparkline } from './Chart';

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

  it('draws signed bars around zero and labels the extremes', () => {
    render(
      <DivergingBarChart
        data={[
          { label: '26', value: -267 },
          { label: '27', value: -307 },
          { label: '35', value: 223 },
        ]}
      />
    );

    expect(screen.getByRole('img', { name: 'Diverging bar chart' })).toBeInTheDocument();
    expect(screen.getByText('−307')).toBeInTheDocument();
    expect(screen.getByText('+223')).toBeInTheDocument();
    expect(screen.getByText('Money in')).toBeInTheDocument();
    expect(screen.getByText('Money out')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('plots a comparison line on the same scale', () => {
    render(
      <DivergingBarChart
        aria-label="Cashflow with comparison"
        data={[{ label: '26', value: 446 }]}
        comparison={[{ label: '26', value: -267 }]}
        comparisonLabel="Before tax"
      />
    );

    expect(screen.getByRole('img', { name: 'Cashflow with comparison' })).toBeInTheDocument();
    expect(screen.getByText('Before tax')).toBeInTheDocument();
    expect(screen.getByText('Money in')).toBeInTheDocument();
  });

  it('uses one series color when tone is single', () => {
    render(
      <DivergingBarChart
        aria-label="Tax impact"
        tone="single"
        seriesLabel="Tax refund"
        data={[{ label: '26', value: 7588 }]}
        showEndLabels={false}
      />
    );

    expect(screen.getByRole('img', { name: 'Tax impact' })).toBeInTheDocument();
    expect(screen.getByText('Tax refund')).toBeInTheDocument();
    expect(screen.queryByText('Money out')).not.toBeInTheDocument();
  });

  it('renders an empty signed chart without throwing', () => {
    render(<DivergingBarChart data={[]} showLegend={false} />);
    expect(screen.getByRole('img', { name: 'Diverging bar chart' })).toBeInTheDocument();
  });
});
