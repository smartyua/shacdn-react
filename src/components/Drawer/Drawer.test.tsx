import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { Button } from '../Button/Button';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from './Drawer';

const DrawerHarness = () => {
  const [open, setOpen] = useState(false);
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <Button type="button" onClick={() => setOpen(true)}>
        Open drawer
      </Button>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filters</DrawerTitle>
          <DrawerDescription>Narrow the result set.</DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
};

describe('Drawer', () => {
  it('opens with dialog semantics', async () => {
    const user = userEvent.setup();
    render(<DrawerHarness />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Open drawer' }));
    expect(screen.getByRole('dialog')).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Filters' })).toBeVisible();
  });
});
