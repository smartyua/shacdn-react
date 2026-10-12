import { createRef } from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ToolCallCard, ToolCallGroup } from './ToolCallCard';
import { formatDuration, formatPayload, tokenizeJson, usedToolsLabel } from './payload';

afterEach(() => {
  vi.useRealTimers();
});

describe('tool call payload', () => {
  it('pretty-prints objects, parsed JSON strings, and leaves plain text alone', () => {
    expect(formatPayload({ query: 'crm' }).json).toBe(true);
    expect(formatPayload('{"ok":true}').text).toContain('"ok"');
    expect(formatPayload('not json')).toEqual({ text: 'not json', json: false });
    expect(formatPayload('{oops').json).toBe(false);
    expect(formatPayload(null)).toEqual({ text: 'null', json: true });
    expect(formatPayload(12).text).toBe('12');
    expect(formatPayload(true).text).toBe('true');

    const circular: { self?: unknown } = {};
    circular.self = circular;
    expect(formatPayload(circular)).toEqual({ text: '[object Object]', json: false });
    expect(formatPayload(undefined)).toEqual({ text: '', json: true });
    expect(formatPayload(Symbol('gap'))).toEqual({ text: '', json: true });
    expect(formatPayload('  [1, 2]  ').json).toBe(true);
    expect(formatPayload('[1, 2]').text).toContain('1');
    expect(formatPayload('{bad}').json).toBe(false);
    expect(formatPayload('')).toEqual({ text: '', json: false });
  });

  it('tokenizes keys, strings, numbers, and literals', () => {
    const tokens = tokenizeJson('{\n  "query": "crm",\n  "n": 5,\n  "ok": true\n}');
    expect(tokens.find(token => token.value === '"query"')?.kind).toBe('key');
    expect(tokens.find(token => token.value === '"crm"')?.kind).toBe('string');
    expect(tokens.find(token => token.value === '5')?.kind).toBe('number');
    expect(tokens.find(token => token.value === 'true')?.kind).toBe('literal');
    expect(tokenizeJson('false null 1e2').map(token => token.kind)).toEqual([
      'literal',
      'plain',
      'literal',
      'plain',
      'number',
    ]);
    expect(tokenizeJson('')).toEqual([]);
  });

  it('formats durations and the group label', () => {
    expect(formatDuration(1500)).toBe('1.5s');
    expect(formatDuration(Number.NaN)).toBe('0.0s');
    expect(formatDuration(-20)).toBe('0.0s');
    expect(usedToolsLabel(1)).toBe('Used 1 tool');
    expect(usedToolsLabel(3)).toBe('Used 3 tools');
  });
});

describe('ToolCallCard', () => {
  it('copies arguments and result, and caps tall payloads', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    const scrollHeight = vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(800);

    render(
      <ToolCallCard
        name="search_web"
        status="success"
        summary="Searched the web"
        defaultOpen
        duration={1500}
        maxCodeHeight={40}
        args={{ query: 'CRM pricing 2026' }}
        result="plain result"
      />
    );

    expect(screen.getByRole('button', { name: /search_web/ })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('status')).toHaveTextContent('search_web finished');
    expect(screen.getByText('plain result')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Show all' })).toHaveLength(2);

    await user.click(screen.getByRole('button', { name: 'Copy arguments' }));
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();
    });
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('"query"'));

    await user.click(screen.getAllByRole('button', { name: 'Show all' })[0]);
    expect(screen.getByRole('button', { name: 'Show less' })).toBeInTheDocument();

    scrollHeight.mockRestore();
  });

  it('opens on error, retries, and stays closed after a manual toggle', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    const { rerender } = render(
      <ToolCallCard name="kb.fetch" status="error" error="403 – no access" onRetry={onRetry} args={{ id: 'doc_381' }} />
    );

    const header = screen.getByRole('button', { name: /kb\.fetch/ });
    expect(header).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('403 – no access')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('kb.fetch failed: 403 – no access');

    await user.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onRetry).toHaveBeenCalledOnce();

    await user.click(header);
    expect(header).toHaveAttribute('aria-expanded', 'false');

    rerender(<ToolCallCard name="kb.fetch" status="running" onRetry={onRetry} />);
    expect(screen.getByRole('button', { name: /kb\.fetch/ })).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes a fresh run after an error and shows a waiting result', () => {
    const { rerender } = render(<ToolCallCard name="crm.list_deals" status="error" error="timeout" />);
    expect(screen.getByRole('button', { name: /crm\.list_deals/ })).toHaveAttribute('aria-expanded', 'true');

    rerender(<ToolCallCard name="crm.list_deals" status="running" summary="Looking up open deals" />);
    expect(screen.getByRole('button', { name: /crm\.list_deals/ })).toHaveAttribute('aria-expanded', 'false');
  });

  it('shows a waiting result while running and hides missing arguments', () => {
    render(<ToolCallCard name="crm.list_deals" status="running" defaultOpen summary="Looking up open deals" />);
    expect(screen.getByText('Waiting for result…')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Arguments' })).not.toBeInTheDocument();
  });

  it('parses a JSON string result and reports a failed copy', async () => {
    const user = userEvent.setup();
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
    });

    render(
      <ToolCallCard name="fetch_page" status="success" defaultOpen duration={1000} result='{"title":"Sales Hub"}' />
    );

    expect(screen.getByText('"title"')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Copy result' }));
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Copy failed' })).toBeInTheDocument();
    });
  });

  it('respects a controlled open state', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <ToolCallCard name="search_web" status="error" error="nope" open={false} onOpenChange={onOpenChange} />
    );

    const header = screen.getByRole('button', { name: /search_web/ });
    expect(header).toHaveAttribute('aria-expanded', 'false');
    await user.click(header);
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(header).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens when a finished call fails', () => {
    const { rerender } = render(<ToolCallCard name="kb.fetch" status="success" />);
    const header = screen.getByRole('button', { name: /kb\.fetch/ });
    expect(header).toHaveAttribute('aria-expanded', 'false');
    expect(header).toHaveTextContent('0.0s');

    rerender(<ToolCallCard name="kb.fetch" status="error" error="403" />);
    expect(screen.getByRole('button', { name: /kb\.fetch/ })).toHaveAttribute('aria-expanded', 'true');
  });

  it('stays shut when openOnError is off and announces a failure without a message', () => {
    const { rerender } = render(<ToolCallCard name="kb.fetch" status="success" openOnError={false} />);
    rerender(<ToolCallCard name="kb.fetch" status="error" openOnError={false} />);

    expect(screen.getByRole('button', { name: /kb\.fetch/ })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('status')).toHaveTextContent('kb.fetch failed');
    expect(screen.getByRole('status').textContent).toBe('kb.fetch failed');
  });

  it('counts elapsed time while running and clears the copied label', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    const ref = createRef<HTMLDivElement>();
    const { unmount } = render(
      <ToolCallCard
        ref={ref}
        className="row"
        name="search_web"
        status="running"
        startedAt={Date.now()}
        defaultOpen
        args={{ q: 'crm' }}
        icon={<span>web</span>}
      />
    );

    expect(ref.current?.className).toContain('row');
    expect(screen.getByText('web')).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(1100);
    });
    expect(screen.getByRole('button', { name: /search_web/ })).toHaveTextContent('1.1s');

    await act(async () => {
      screen.getByRole('button', { name: 'Copy arguments' }).click();
    });
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(1400);
    });
    expect(screen.getByRole('button', { name: 'Copy arguments' })).toBeInTheDocument();
    unmount();
  });

  it('reports a missing clipboard and still ticks when the start time is omitted', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: undefined,
    });
    const { unmount } = render(
      <ToolCallCard name="search_web" status="running" defaultOpen args="query" />
    );

    act(() => {
      screen.getByRole('button', { name: 'Copy arguments' }).click();
    });
    expect(screen.getByRole('button', { name: 'Copy failed' })).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(screen.getByRole('button', { name: /search_web/ })).toHaveTextContent('0.2s');
    unmount();
  });
});

describe('ToolCallGroup', () => {
  it('sums finished calls and announces a running turn', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <ToolCallGroup>
        <ToolCallCard name="search_web" status="success" duration={1500} />
        <ToolCallCard name="fetch_page" status="success" duration={1000} />
        <span>note</span>
      </ToolCallGroup>
    );

    const header = screen.getByRole('button', { name: /Used 2 tools/ });
    expect(header).toHaveTextContent('2.5s');
    const panel = document.getElementById(header.getAttribute('aria-controls') ?? '');
    expect(panel).toHaveAttribute('aria-hidden', 'true');
    expect(panel).toHaveAttribute('inert');
    expect(panel).toHaveTextContent('note');

    await user.click(header);
    expect(header).toHaveAttribute('aria-expanded', 'true');
    expect(panel).not.toHaveAttribute('aria-hidden');
    expect(screen.getByRole('button', { name: /search_web/ })).toBeInTheDocument();

    rerender(
      <ToolCallGroup>
        <ToolCallCard name="search_web" status="success" duration={1500} />
        <ToolCallCard name="crm.list_deals" status="running" summary="Looking up open deals" />
      </ToolCallGroup>
    );
    expect(screen.getByRole('button', { name: /Using tools/ })).toBeInTheDocument();
    expect(screen.getByText('crm.list_deals running')).toBeInTheDocument();
  });

  it('uses an explicit label and duration', () => {
    render(
      <ToolCallGroup label="Checked the knowledge base" duration={380} defaultOpen>
        <ToolCallCard name="kb.search" status="success" duration={380} />
      </ToolCallGroup>
    );

    expect(screen.getByRole('button', { name: /Checked the knowledge base/ })).toHaveTextContent('0.4s');
  });

  it('sums only the durations cards actually provide', () => {
    render(
      <ToolCallGroup>
        <ToolCallCard name="search_web" status="success" duration={1500} />
        <ToolCallCard name="kb.fetch" status="error" error="403" />
      </ToolCallGroup>
    );

    expect(screen.getByRole('button', { name: /Used 2 tools/ })).toHaveTextContent('1.5s');
  });

  it('uses the live clock when no card reports a duration', () => {
    render(
      <ToolCallGroup>
        <ToolCallCard name="search_web" status="success" />
      </ToolCallGroup>
    );

    expect(screen.getByRole('button', { name: /Used 1 tool/ })).toHaveTextContent('0.0s');
  });

  it('keeps a controlled group closed and counts a running call from its start time', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'));
    const onOpenChange = vi.fn();
    const started = Date.now();
    const ref = createRef<HTMLDivElement>();
    const { unmount } = render(
      <ToolCallGroup ref={ref} className="log" open={false} onOpenChange={onOpenChange}>
        <ToolCallCard key="search" name="search_web" status="running" startedAt={started} icon={<span>web</span>} />
        <ToolCallCard name="fetch_page" status="success" />
        <ToolCallCard name="kb.fetch" status="success" />
        <ToolCallCard name="crm.list" status="success" />
      </ToolCallGroup>
    );

    const header = screen.getByRole('button', { name: /Using tools/ });
    expect(ref.current?.className).toContain('log');
    expect(header).toHaveAttribute('aria-expanded', 'false');
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(header).toHaveTextContent('0.5s');
    header.click();
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(header).toHaveAttribute('aria-expanded', 'false');
    unmount();
  });
});
