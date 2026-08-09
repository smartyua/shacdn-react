import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import {
  Timeline,
  TimelineContent,
  TimelineDescription,
  TimelineIndicator,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
} from './Timeline';

describe('Timeline', () => {
  it('marks current step and renders statuses', () => {
    render(
      <Timeline>
        <TimelineItem status="complete">
          <TimelineIndicator />
          <TimelineContent>
            <TimelineTitle>Order confirmed</TimelineTitle>
            <TimelineTime>Jul 3, 9:41 AM</TimelineTime>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem status="current">
          <TimelineIndicator />
          <TimelineContent>
            <TimelineTitle>Out for delivery</TimelineTitle>
            <TimelineTime>Today, 11:05 AM</TimelineTime>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem status="upcoming">
          <TimelineIndicator />
          <TimelineContent>
            <TimelineTitle>Delivered</TimelineTitle>
            <TimelineTime>ETA 2:15 PM</TimelineTime>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    );

    expect(screen.getByText('Out for delivery').closest('li')).toHaveAttribute(
      'aria-current',
      'step'
    );
    expect(screen.getByText('Order confirmed').closest('li')).toHaveAttribute(
      'data-status',
      'complete'
    );
    expect(screen.getByText('Delivered').closest('li')).toHaveAttribute(
      'data-status',
      'upcoming'
    );
  });

  it('renders an optional description only for steps that provide one', () => {
    render(
      <Timeline>
        <TimelineItem status="complete">
          <TimelineIndicator />
          <TimelineContent>
            <TimelineTitle>Packed &amp; shipped</TimelineTitle>
            <TimelineDescription>Handed off to Speedy Logistics</TimelineDescription>
            <TimelineTime>Jul 4, 6:12 PM</TimelineTime>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem status="upcoming">
          <TimelineIndicator />
          <TimelineContent>
            <TimelineTitle>Delivered</TimelineTitle>
            <TimelineTime>ETA 2:15 PM</TimelineTime>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    );

    expect(screen.getByText('Handed off to Speedy Logistics')).toBeInTheDocument();
    expect(screen.queryByText('Delivered')?.closest('li')?.textContent).not.toMatch(/Handed off/);
  });

  it('has no serious accessibility violations', async () => {
    const { container } = render(
      <Timeline>
        <TimelineItem status="complete">
          <TimelineIndicator />
          <TimelineContent>
            <TimelineTitle>Packed</TimelineTitle>
            <TimelineTime dateTime="2026-07-04">Jul 4</TimelineTime>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
