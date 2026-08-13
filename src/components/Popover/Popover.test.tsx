import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { useStubbedLayout } from '../../test/layout';
import { Button } from '../Button/Button';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';

describe('Popover', () => {
  useStubbedLayout();

  it('opens a dialog surface from the trigger', async () => {
    const user = userEvent.setup();
    render(
      <Popover>
        <PopoverTrigger asChild>
          <Button type="button">Open popover</Button>
        </PopoverTrigger>
        <PopoverContent>Panel body</PopoverContent>
      </Popover>
    );

    expect(document.querySelector('[data-slot="popover-content"]')).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Open popover' }));
    expect(document.querySelector('[data-slot="popover-content"]')?.textContent).toContain(
      'Panel body'
    );
  });
});
