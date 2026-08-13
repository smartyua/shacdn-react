import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { useStubbedLayout } from '../../test/layout';
import { Button } from '../Button/Button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './Tooltip';

describe('Tooltip', () => {
  useStubbedLayout();

  it('shows tooltip content on hover', async () => {
    const user = userEvent.setup();
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button type="button">Hint</Button>
          </TooltipTrigger>
          <TooltipContent>More detail</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    expect(document.querySelector('[role="tooltip"]')).toBeNull();
    await user.hover(screen.getByRole('button', { name: 'Hint' }));
    expect(document.querySelector('[role="tooltip"]')?.textContent).toContain('More detail');
  });
});
