import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { useStubbedLayout } from '../../test/layout';
import { MentionTextarea } from './MentionTextarea';
import {
  defaultFormatLinkLabel,
  extractMentions,
  filterCommands,
  filterUsers,
  findActiveTrigger,
  findDecorationRanges,
  findUrlRanges,
} from './mentionTextareaUtils';

const users = [
  { id: '1', label: 'Ada Lovelace', handle: 'ada' },
  { id: '2', label: 'Grace Hopper', handle: 'grace' },
];

const commands = [
  { id: 'shrug', name: 'shrug', description: 'Insert shrug' },
  { id: 'table', name: 'tableflip', description: 'Flip a table' },
];

describe('mentionTextareaUtils', () => {
  it('formats link labels as hostname without www', () => {
    expect(defaultFormatLinkLabel('https://www.example.com/path?q=1')).toBe(
      'example.com'
    );
  });

  it('finds url ranges including www without protocol', () => {
    const text = 'See https://example.com/a and www.cursor.com!!';
    expect(findUrlRanges(text)).toEqual([
      {
        start: 4,
        end: 25,
        url: 'https://example.com/a',
      },
      {
        start: 30,
        end: 44,
        url: 'www.cursor.com',
      },
    ]);
    expect(defaultFormatLinkLabel('www.cursor.com')).toBe('cursor.com');
  });

  it('builds decoration ranges for mentions, commands, and links', () => {
    const text = 'Hey @grace /shrug www.cursor.com';
    expect(findDecorationRanges(text, users, commands)).toEqual([
      {
        // Leading/trailing spaces absorbed into the mention chip for padding.
        start: 3,
        end: 11,
        type: 'mention',
        text: '@grace',
        padStart: true,
        padEnd: true,
      },
      {
        start: 11,
        end: 17,
        type: 'command',
        text: '/shrug',
      },
      {
        start: 18,
        end: 32,
        type: 'link',
        text: 'www.cursor.com',
      },
    ]);
  });

  it('keeps mention padding spaces from covering neighboring words', () => {
    const text = 'Hey @grace look at this www.cursor.com check this out!!';
    const decorations = findDecorationRanges(text, users, commands);
    const mention = decorations.find(d => d.type === 'mention');
    expect(mention).toEqual({
      start: 3,
      end: 11,
      type: 'mention',
      text: '@grace',
      padStart: true,
      padEnd: true,
    });
    expect(text.slice(0, mention!.start)).toBe('Hey');
    expect(text.slice(mention!.end).startsWith('look')).toBe(true);
  });

  it('detects @ mention triggers after a word boundary', () => {
    expect(findActiveTrigger('hi @ad', 6)).toEqual({
      type: 'mention',
      start: 3,
      query: 'ad',
    });
    expect(findActiveTrigger('a@ad', 4)).toBeNull();
  });

  it('detects / commands only at line start', () => {
    expect(findActiveTrigger('/shr', 4)).toEqual({
      type: 'command',
      start: 0,
      query: 'shr',
    });
    expect(findActiveTrigger('ok /shr', 7)).toBeNull();
    expect(findActiveTrigger('line\n/ta', 8)).toEqual({
      type: 'command',
      start: 5,
      query: 'ta',
    });
  });

  it('filters users and commands', () => {
    expect(filterUsers(users, 'gra').map(u => u.handle)).toEqual(['grace']);
    expect(filterCommands(commands, 'flip').map(c => c.name)).toEqual([
      'tableflip',
    ]);
  });

  it('extracts known mentions with ranges', () => {
    expect(extractMentions('hey @ada and @nobody', users)).toEqual([
      {
        id: '1',
        handle: 'ada',
        label: 'Ada Lovelace',
        start: 4,
        end: 8,
      },
    ]);
  });
});

describe('MentionTextarea', () => {
  useStubbedLayout({ width: 320, height: 96, top: 80, left: 80 });

  it('inserts a mention from autosuggest and reports mentions', async () => {
    const user = userEvent.setup();
    const onMentionsChange = vi.fn();
    const onChange = vi.fn();

    render(
      <MentionTextarea
        users={users}
        commands={commands}
        aria-label="Composer"
        onMentionsChange={onMentionsChange}
        onChange={onChange}
      />
    );

    const textarea = screen.getByRole('textbox', { name: 'Composer' });
    await user.click(textarea);
    await user.type(textarea, 'Hi @ad');

    expect(await screen.findByRole('listbox')).toBeInTheDocument();
    await user.keyboard('{Enter}');

    expect(textarea).toHaveValue('Hi @ada ');
    expect(onMentionsChange).toHaveBeenCalled();
    const lastMentions =
      onMentionsChange.mock.calls[onMentionsChange.mock.calls.length - 1]?.[0];
    expect(lastMentions).toEqual([
      {
        id: '1',
        handle: 'ada',
        label: 'Ada Lovelace',
        start: 3,
        end: 7,
      },
    ]);
  });

  it('executes a slash command and removes the query', async () => {
    const user = userEvent.setup();
    const onCommand = vi.fn();

    render(
      <MentionTextarea
        users={users}
        commands={commands}
        aria-label="Composer"
        onCommand={onCommand}
      />
    );

    const textarea = screen.getByRole('textbox', { name: 'Composer' });
    await user.click(textarea);
    await user.type(textarea, '/shr');

    expect(await screen.findByRole('listbox')).toBeInTheDocument();
    await user.keyboard('{Enter}');

    expect(onCommand).toHaveBeenCalledWith(commands[0]);
    expect(textarea).toHaveValue('');
  });

  it('renders mention and shortened link chips in the backdrop', () => {
    render(
      <MentionTextarea
        users={users}
        commands={commands}
        defaultValue="Hey @grace look at this www.cursor.com check this out!!"
        aria-label="Composer"
      />
    );

    const backdrop = document.querySelector(
      '[data-slot="mention-textarea-backdrop"]'
    );
    expect(backdrop?.textContent).toContain('@grace');
    expect(backdrop?.textContent).toContain('cursor.com');
    expect(backdrop?.textContent).toContain('www.cursor.com');
    const mentionChip = backdrop?.querySelector('[data-decoration="mention"]');
    expect(mentionChip?.textContent).toContain('@grace');
    expect(
      mentionChip?.querySelector('[data-decoration-label="mention"]')?.textContent
    ).toBe('@grace');
    expect(
      backdrop?.querySelector('[data-decoration="link"]')?.textContent
    ).toContain('cursor.com');
  });

  it('exposes chip backgrounds as CSS variables', () => {
    const { rerender } = render(
      <MentionTextarea
        users={users}
        defaultValue="Hey @grace"
        aria-label="Composer"
        chipBackground="tomato"
      />
    );

    const root = document.querySelector<HTMLElement>(
      '[data-slot="mention-textarea"]'
    );
    expect(root?.style.getPropertyValue('--mention-textarea-chip-bg')).toBe(
      'tomato'
    );

    rerender(
      <MentionTextarea
        users={users}
        defaultValue="Hey @grace"
        aria-label="Composer"
        chipBackground={{ mention: 'rebeccapurple', link: 'gold' }}
      />
    );

    expect(root?.style.getPropertyValue('--mention-textarea-mention-bg')).toBe(
      'rebeccapurple'
    );
    expect(root?.style.getPropertyValue('--mention-textarea-link-bg')).toBe(
      'gold'
    );
  });
});

