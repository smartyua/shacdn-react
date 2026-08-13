import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Form, FormDescription, FormField, FormLabel, FormMessage } from './Form';
import { Input } from '../Input/Input';

describe('Form', () => {
  it('associates a label with a control and exposes an error', () => {
    render(
      <Form>
        <FormField>
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input id="email" aria-invalid="true" />
          <FormDescription>We never share this.</FormDescription>
          <FormMessage>Enter a valid email.</FormMessage>
        </FormField>
      </Form>
    );

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent('Enter a valid email.');
  });

  it('has no serious accessibility violations', async () => {
    const { container } = render(
      <Form>
        <FormLabel htmlFor="n">Name</FormLabel>
        <Input id="n" />
      </Form>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
