import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { UsageMeter } from './UsageMeter';

describe('UsageMeter', () => {
  it('sums segments into an accessible meter', () => {
    render(
      <UsageMeter
        label="Storage"
        limit={100}
        format={value => `${value} GB`}
        segments={[
          { label: 'Media', value: 40 },
          { label: 'Backups', value: 25 },
        ]}
      />
    );

    const meter = screen.getByRole('meter', { name: 'Storage' });
    expect(meter).toHaveAttribute('aria-valuenow', '65');
    expect(meter).toHaveAttribute('aria-valuetext', '65 GB of 100 GB');
    expect(meter.closest('[data-slot="usage-meter"]')).toHaveAttribute('data-tone', 'ok');
    expect(screen.getByText('Backups')).toBeInTheDocument();
  });

  it('switches tone near and past the limit', () => {
    const { rerender, container } = render(
      <UsageMeter label="Seats" limit={10} segments={[{ label: 'Members', value: 9 }]} />
    );
    expect(container.firstChild).toHaveAttribute('data-tone', 'warn');

    rerender(<UsageMeter label="Seats" limit={10} segments={[{ label: 'Members', value: 12 }]} />);
    expect(container.firstChild).toHaveAttribute('data-tone', 'over');
  });
});
