import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Button } from '../Button/Button';
import { ToastProvider, useToast } from './Toast';

const Trigger = () => {
  const { addToast } = useToast();
  return (
    <Button type="button" onClick={() => addToast({ title: 'Saved', description: 'Draft stored.' })}>
      Notify
    </Button>
  );
};

describe('Toast', () => {
  it('announces a toast after addToast', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>
    );

    await user.click(screen.getByRole('button', { name: 'Notify' }));
    expect(screen.getByRole('status')).toHaveTextContent('Saved');
  });
});
