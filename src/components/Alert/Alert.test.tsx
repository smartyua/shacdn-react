import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Alert, AlertDescription, AlertTitle } from './Alert';

describe('Alert', () => {
  it('renders role="alert" with default variant', () => {
    render(
      <Alert>
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>You can add components to your app.</AlertDescription>
      </Alert>
    );

    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(screen.getByText('Heads up!')).toBeInTheDocument();
    expect(screen.getByText('You can add components to your app.')).toBeInTheDocument();
  });

  it('supports destructive variant', () => {
    const { container } = render(
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Something went wrong.</AlertDescription>
      </Alert>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(container.querySelector('[class*="destructive"]')).toBeInTheDocument();
  });

  it('has no serious accessibility violations', async () => {
    const { container } = render(
      <Alert>
        <AlertTitle>Note</AlertTitle>
        <AlertDescription>Accessible alert content.</AlertDescription>
      </Alert>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
