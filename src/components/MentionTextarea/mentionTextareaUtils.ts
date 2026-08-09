export type MentionUser = {
  id: string;
  label: string;
  handle: string;
};

export type SlashCommand = {
  id: string;
  name: string;
  description?: string;
};

export type MentionRef = {
  id: string;
  handle: string;
  label: string;
  start: number;
  end: number;
};

export type ActiveTrigger =
  | { type: 'mention'; start: number; query: string }
  | { type: 'command'; start: number; query: string };

export type UrlRange = {
  start: number;
  end: number;
  url: string;
};

export type DecorationRange = {
  start: number;
  end: number;
  type: 'mention' | 'command' | 'link';
  text: string;
  /** A neighbouring space was pulled into the range and can host chip spacing. */
  padStart?: boolean;
  padEnd?: boolean;
};

const URL_RE = /(?:https?:\/\/|www\.)[^\s<>"']+/gi;
const MENTION_TOKEN_RE = /@([A-Za-z0-9_.-]+)/g;
const COMMAND_TOKEN_RE = /(^|[\s([{])(\/[\w-]+)/g;

export const defaultFormatLinkLabel = (url: string): string => {
  try {
    const normalized = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    const parsed = new URL(normalized);
    return parsed.hostname.replace(/^www\./i, '');
  } catch {
    return url.replace(/^https?:\/\//i, '').replace(/^www\./i, '').split('/')[0] || url;
  }
};

export const findUrlRanges = (text: string): UrlRange[] => {
  const ranges: UrlRange[] = [];
  URL_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = URL_RE.exec(text)) !== null) {
    let end = match.index + match[0].length;
    // Trim common trailing punctuation from URL match.
    while (end > match.index && /[.,;:!?)]/.test(text[end - 1] ?? '')) {
      end -= 1;
    }
    if (end > match.index) {
      ranges.push({
        start: match.index,
        end,
        url: text.slice(match.index, end),
      });
    }
  }
  return ranges;
};

export const findCommandRanges = (
  text: string,
  commands: SlashCommand[]
): Array<{ start: number; end: number; text: string }> => {
  const known = new Set(commands.map(c => c.name.toLowerCase()));
  const ranges: Array<{ start: number; end: number; text: string }> = [];
  COMMAND_TOKEN_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = COMMAND_TOKEN_RE.exec(text)) !== null) {
    const token = match[2] ?? '';
    const name = token.slice(1).toLowerCase();
    if (known.size > 0 && !known.has(name)) {
      continue;
    }
    const start = (match.index ?? 0) + (match[1]?.length ?? 0);
    ranges.push({
      start,
      end: start + token.length,
      text: token,
    });
  }
  return ranges;
};

/** Non-overlapping decorations for backdrop chips (links win over mentions/commands). */
export const findDecorationRanges = (
  text: string,
  users: MentionUser[],
  commands: SlashCommand[]
): DecorationRange[] => {
  const mentions = extractMentions(text, users).map(m => ({
    start: m.start,
    end: m.end,
    type: 'mention' as const,
    text: text.slice(m.start, m.end),
  }));
  const commandRanges = findCommandRanges(text, commands).map(c => ({
    start: c.start,
    end: c.end,
    type: 'command' as const,
    text: c.text,
  }));
  const links = findUrlRanges(text).map(u => ({
    start: u.start,
    end: u.end,
    type: 'link' as const,
    text: u.url,
  }));

  const all = [...links, ...mentions, ...commandRanges].sort((a, b) => a.start - b.start);
  const merged: DecorationRange[] = [];
  for (const range of all) {
    const last = merged[merged.length - 1];
    if (last && range.start < last.end) {
      continue;
    }
    merged.push({ ...range });
  }

  // Mentions: absorb one adjacent space on each side when free — visual padding
  // without negative margins that paint over neighboring words.
  const claimed = (index: number, self: DecorationRange): boolean =>
    merged.some(r => r !== self && index >= r.start && index < r.end);

  return merged.map(range => {
    if (range.type !== 'mention') {
      return range;
    }
    let { start, end } = range;
    let padStart = false;
    let padEnd = false;
    if (start > 0 && text[start - 1] === ' ' && !claimed(start - 1, range)) {
      start -= 1;
      padStart = true;
    }
    if (end < text.length && text[end] === ' ' && !claimed(end, range)) {
      end += 1;
      padEnd = true;
    }
    return { ...range, start, end, padStart, padEnd };
  });
};

export const findActiveTrigger = (text: string, caret: number): ActiveTrigger | null => {
  if (caret < 0 || caret > text.length) {
    return null;
  }

  const before = text.slice(0, caret);

  const lineStart = before.lastIndexOf('\n') + 1;
  const lineBefore = before.slice(lineStart);
  const commandMatch = lineBefore.match(/^\/([\w-]*)$/);
  if (commandMatch) {
    return {
      type: 'command',
      start: lineStart,
      query: commandMatch[1] ?? '',
    };
  }

  const mentionMatch = before.match(/(^|[\s([{])@([A-Za-z0-9_.-]*)$/);
  if (mentionMatch) {
    const query = mentionMatch[2] ?? '';
    const atIndex = before.length - query.length - 1;
    return {
      type: 'mention',
      start: atIndex,
      query,
    };
  }

  return null;
};

export const filterUsers = (users: MentionUser[], query: string): MentionUser[] => {
  const q = query.trim().toLowerCase();
  if (!q) {
    return users;
  }
  return users.filter(
    u => u.label.toLowerCase().includes(q) || u.handle.toLowerCase().includes(q)
  );
};

export const filterCommands = (commands: SlashCommand[], query: string): SlashCommand[] => {
  const q = query.trim().toLowerCase();
  if (!q) {
    return commands;
  }
  return commands.filter(
    c =>
      c.name.toLowerCase().includes(q) ||
      (c.description?.toLowerCase().includes(q) ?? false)
  );
};

export const extractMentions = (text: string, users: MentionUser[]): MentionRef[] => {
  const byHandle = new Map(users.map(u => [u.handle.toLowerCase(), u]));
  const mentions: MentionRef[] = [];
  MENTION_TOKEN_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = MENTION_TOKEN_RE.exec(text)) !== null) {
    const handle = match[1] ?? '';
    const user = byHandle.get(handle.toLowerCase());
    if (!user) {
      continue;
    }
    mentions.push({
      id: user.id,
      handle: user.handle,
      label: user.label,
      start: match.index,
      end: match.index + match[0].length,
    });
  }
  return mentions;
};

export const replaceRange = (
  text: string,
  start: number,
  end: number,
  insert: string
): string => text.slice(0, start) + insert + text.slice(end);
