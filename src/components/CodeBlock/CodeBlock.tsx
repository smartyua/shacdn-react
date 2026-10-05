import { Check, Copy } from 'lucide-react';
import { forwardRef, useState, type HTMLAttributes } from 'react';
import { Button } from '../Button/Button';
import { cn } from '../../lib/cn';
import styles from './CodeBlock.module.scss';

export interface CodeBlockFile {
  name: string;
  code: string;
  language?: string;
}

export interface CodeBlockProps extends HTMLAttributes<HTMLDivElement> {
  code?: string;
  language?: string;
  /** 1-based line numbers to emphasize. */
  highlight?: number[];
  files?: CodeBlockFile[];
  copyable?: boolean;
}

export const CodeBlock = forwardRef<HTMLDivElement, CodeBlockProps>(
  (
    {
      code = '',
      language,
      highlight = [],
      files,
      copyable = true,
      className,
      ...props
    },
    ref
  ) => {
    const tabs = files && files.length > 0 ? files : null;
    const [active, setActive] = useState(0);
    const [copied, setCopied] = useState(false);
    const [copyError, setCopyError] = useState(false);
    const safeIndex = tabs ? Math.min(active, tabs.length - 1) : 0;
    const current = tabs ? tabs[safeIndex] : { name: language ?? '', code, language };
    const source = current?.code ?? '';
    const lines = source.length > 0 ? source.replace(/\n$/, '').split('\n') : [''];
    const marks = new Set(highlight.filter(line => Number.isInteger(line) && line > 0));

    const onCopy = async () => {
      try {
        await navigator.clipboard.writeText(source);
        setCopyError(false);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
      } catch {
        setCopied(false);
        setCopyError(true);
      }
    };

    return (
      <div ref={ref} className={cn(styles.block, className)} data-slot="code-block" {...props}>
        <div className={styles.toolbar}>
          {tabs ? (
            <div className={styles.tabs} role="group" aria-label="Code files">
              {tabs.map((file, index) => (
                <Button
                  key={file.name}
                  type="button"
                  size="sm"
                  variant={index === safeIndex ? 'secondary' : 'ghost'}
                  aria-pressed={index === safeIndex}
                  onClick={() => setActive(index)}
                >
                  {file.name}
                </Button>
              ))}
            </div>
          ) : (
            <span className={styles.language}>{current?.language}</span>
          )}
          {copyable ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                void onCopy();
              }}
              aria-invalid={copyError || undefined}
            >
              {copied ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          ) : null}
        </div>
        <pre className={styles.pre}>
          <code>
            {lines.map((line, index) => (
              <span
                key={`${index}-${line}`}
                className={cn(styles.line, marks.has(index + 1) && styles.highlighted)}
                data-highlighted={marks.has(index + 1) ? 'true' : undefined}
              >
                {line.length > 0 ? line : ' '}
              </span>
            ))}
          </code>
        </pre>
      </div>
    );
  }
);

CodeBlock.displayName = 'CodeBlock';
