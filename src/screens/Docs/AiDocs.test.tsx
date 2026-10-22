import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LocaleProvider } from '../../components/Locale/Locale';
import { AiDocs } from './AiDocs';
import { MCP_TOOLS } from './AiDocs.copy';

const renderPage = () =>
  render(
    <LocaleProvider defaultLocale="en">
      <MemoryRouter initialEntries={['/docs/ai']}>
        <AiDocs />
      </MemoryRouter>
    </LocaleProvider>
  );

describe('AiDocs', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      }
    );
  });

  it('documents every MCP tool and links the agent-readable files', () => {
    renderPage();

    expect(screen.getByRole('heading', { level: 1, name: 'shacdn for AI agents' })).toBeInTheDocument();
    const toolsTable = screen.getByRole('table');
    for (const tool of MCP_TOOLS) {
      expect(within(toolsTable).getByText(tool)).toBeInTheDocument();
    }
    expect(screen.getByRole('link', { name: 'llms.txt' })).toHaveAttribute('href', '/llms.txt');
    expect(screen.getByRole('link', { name: 'Component catalog' })).toHaveAttribute('href', '/components');
  });

  it('offers a config for each MCP client and an on-this-page index', () => {
    renderPage();

    for (const client of ['Cursor', 'Claude Code', 'VS Code', 'Codex']) {
      expect(screen.getByRole('button', { name: client })).toBeInTheDocument();
    }
    const toc = screen.getByRole('navigation', { name: 'On this page' });
    expect(within(toc).getAllByRole('link')).toHaveLength(6);
  });
});
