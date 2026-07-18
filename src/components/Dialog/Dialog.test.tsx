import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Button } from '../Button/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './Dialog';

const DialogHarness = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button type="button" onClick={() => setOpen(true)}>
        Open dialog
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Make changes to your profile here.</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

describe('Dialog', () => {
  it('opens with dialog semantics when triggered', async () => {
    const user = userEvent.setup();
    render(<DialogHarness />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Open dialog' }));

    expect(screen.getByRole('dialog')).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Edit profile' })).toBeVisible();
  });

  it('has no serious accessibility violations when open', async () => {
    const { container } = render(
      <Dialog open onOpenChange={() => undefined}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accessible dialog</DialogTitle>
            <DialogDescription>Description for screen readers.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
