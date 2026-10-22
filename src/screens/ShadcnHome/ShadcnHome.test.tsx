import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { LocaleProvider } from '../../components/Locale/Locale';
import { ShadcnHome } from './ShadcnHome';

describe('ShadcnHome', () => {
  it('links the hero to the AI agents docs', async () => {
    render(
      <LocaleProvider defaultLocale="en">
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<ShadcnHome />} />
            <Route path="/docs/ai" element={<p>AI docs page</p>} />
          </Routes>
        </MemoryRouter>
      </LocaleProvider>
    );

    await userEvent.click(screen.getByRole('button', { name: 'For AI agents' }));

    expect(screen.getByText('AI docs page')).toBeInTheDocument();
  });
});
