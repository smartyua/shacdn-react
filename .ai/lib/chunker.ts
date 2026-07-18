export type ChunkType =
  | 'source'
  | 'test'
  | 'documentation'
  | 'adr'
  | 'memory'
  | 'schema';

export interface TextChunk {
  id: string;
  path: string;
  type: ChunkType;
  language: string;
  module: string;
  symbols: string[];
  content: string;
  startLine: number;
  endLine: number;
}

const languageFor = (path: string): string => {
  if (path.endsWith('.tsx')) return 'tsx';
  if (path.endsWith('.ts')) return 'typescript';
  if (path.endsWith('.scss') || path.endsWith('.css')) return 'scss';
  if (path.endsWith('.md')) return 'markdown';
  if (path.endsWith('.json')) return 'json';
  if (path.endsWith('.yaml') || path.endsWith('.yml')) return 'yaml';
  return 'text';
};

const moduleFor = (path: string): string => {
  const parts = path.split('/');
  if (parts[0] === 'src' && parts[1] === 'components' && parts[2]) return parts[2];
  if (parts[0] === 'src' && parts[1] === 'screens' && parts[2]) return parts[2];
  if (parts[0] === 'src' && parts[1] === 'styles') return 'styles';
  if (parts[0] === 'docs') return 'docs';
  if (parts[0] === '.ai') return 'ai';
  if (parts[0] === 'mcp') return 'mcp';
  return parts[0] ?? 'root';
};

const typeFor = (path: string): ChunkType => {
  if (path.includes('/adr/') || path.startsWith('docs/adr/')) return 'adr';
  if (path.includes('.ai/memory/') || path.startsWith('.ai/memory/')) return 'memory';
  if (path.includes('.test.') || path.includes('.spec.') || path.includes('/tests/')) {
    return 'test';
  }
  if (path.endsWith('.md') || path.startsWith('docs/')) return 'documentation';
  if (path.endsWith('.schema.json') || path.includes('schema')) return 'schema';
  return 'source';
};

const extractSymbols = (content: string, language: string): string[] => {
  const symbols = new Set<string>();
  if (language === 'typescript' || language === 'tsx') {
    const patterns = [
      /export\s+const\s+([A-Z][A-Za-z0-9_]*)/g,
      /export\s+type\s+([A-Za-z0-9_]+)/g,
      /export\s+interface\s+([A-Za-z0-9_]+)/g,
      /const\s+([A-Z][A-Za-z0-9_]*)\s*=/g,
      /(?:export\s+)?const\s+(use[A-Z][A-Za-z0-9_]*)\s*=/g,
    ];
    for (const pattern of patterns) {
      for (const match of content.matchAll(pattern)) {
        symbols.add(match[1]);
      }
    }
  }
  if (language === 'markdown') {
    for (const match of content.matchAll(/^#{1,3}\s+(.+)$/gm)) {
      symbols.add(match[1].trim().slice(0, 80));
    }
  }
  return [...symbols].slice(0, 20);
};

const splitBySize = (
  lines: string[],
  maxChunkChars: number,
): Array<{ start: number; end: number; text: string }> => {
  const chunks: Array<{ start: number; end: number; text: string }> = [];
  let start = 0;
  let buffer: string[] = [];
  let size = 0;

  const flush = (endLineExclusive: number): void => {
    if (buffer.length === 0) return;
    chunks.push({
      start: start + 1,
      end: endLineExclusive,
      text: buffer.join('\n'),
    });
    buffer = [];
    size = 0;
    start = endLineExclusive;
  };

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const nextSize = size + line.length + 1;
    if (buffer.length > 0 && nextSize > maxChunkChars) {
      flush(i);
    }
    if (buffer.length === 0) start = i;
    buffer.push(line);
    size += line.length + 1;
  }
  flush(lines.length);
  return chunks;
};

const splitCodeBySymbols = (
  content: string,
  maxChunkChars: number,
): Array<{ start: number; end: number; text: string }> => {
  const lines = content.split('\n');
  if (content.length <= maxChunkChars) {
    return [{ start: 1, end: lines.length, text: content }];
  }

  const boundary =
    /^(export\s+(const|type|interface|class)|const\s+[A-Z]|\/\*\*|\/\/ =+)/;
  const segments: number[] = [0];
  for (let i = 1; i < lines.length; i += 1) {
    if (boundary.test(lines[i]) && i - segments[segments.length - 1] > 5) {
      segments.push(i);
    }
  }
  segments.push(lines.length);

  const chunks: Array<{ start: number; end: number; text: string }> = [];
  for (let s = 0; s < segments.length - 1; s += 1) {
    const startIdx = segments[s];
    const endIdx = segments[s + 1];
    const slice = lines.slice(startIdx, endIdx);
    const text = slice.join('\n');
    if (text.length <= maxChunkChars) {
      chunks.push({ start: startIdx + 1, end: endIdx, text });
    } else {
      for (const part of splitBySize(slice, maxChunkChars)) {
        chunks.push({
          start: startIdx + part.start,
          end: startIdx + part.end,
          text: part.text,
        });
      }
    }
  }
  return chunks.length > 0 ? chunks : splitBySize(lines, maxChunkChars);
};

export const chunkFile = (
  path: string,
  content: string,
  maxChunkChars: number,
): TextChunk[] => {
  const language = languageFor(path);
  const type = typeFor(path);
  const module = moduleFor(path);
  const parts =
    language === 'typescript' || language === 'tsx' || language === 'scss'
      ? splitCodeBySymbols(content, maxChunkChars)
      : splitBySize(content.split('\n'), maxChunkChars);

  return parts.map((part, index) => {
    const symbols = extractSymbols(part.text, language);
    return {
      id: `${path}#${index}:${part.start}-${part.end}`,
      path,
      type,
      language,
      module,
      symbols,
      content: part.text,
      startLine: part.start,
      endLine: part.end,
    };
  });
};
