import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../Dialog/Dialog';
import styles from './Command.module.scss';

type CommandCtx = {
  query: string;
  setQuery: (q: string) => void;
  selected: string | null;
  setSelected: (id: string | null) => void;
};

const CommandContext = createContext<CommandCtx | null>(null);

const useCommand = (): CommandCtx => {
  const ctx = useContext(CommandContext);
  if (!ctx) {
    throw new Error('Command parts must be used within Command');
  }
  return ctx;
};

export interface CommandProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const Command = ({ className = '', children, ...props }: CommandProps) => {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const value = useMemo(() => ({ query, setQuery, selected, setSelected }), [query, selected]);

  return (
    <CommandContext.Provider value={value}>
      <div
        className={`${styles.root} ${className}`}
        role="application"
        aria-label="Command palette"
        {...props}
      >
        {children}
      </div>
    </CommandContext.Provider>
  );
};

Command.displayName = 'Command';

export const CommandInput = ({
  className = '',
  placeholder = 'Type a command or search...',
  ...props
}: InputHTMLAttributes<HTMLInputElement>) => {
  const { query, setQuery } = useCommand();

  return (
    <div className={styles.inputWrap}>
      <input
        type="text"
        className={`${styles.input} ${className}`}
        placeholder={placeholder}
        value={query}
        onChange={e => setQuery(e.target.value)}
        aria-autocomplete="list"
        {...props}
      />
    </div>
  );
};

CommandInput.displayName = 'CommandInput';

export const CommandList = ({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={`${styles.list} ${className}`} role="listbox" {...props}>
    {children}
  </div>
);

CommandList.displayName = 'CommandList';

export const CommandEmpty = ({
  className = '',
  children = 'No results found.',
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  const { query } = useCommand();
  if (!query.trim()) return null;

  return (
    <div className={`${styles.empty} ${className}`} role="status" {...props}>
      {children}
    </div>
  );
};

CommandEmpty.displayName = 'CommandEmpty';

export const CommandGroup = ({
  className = '',
  heading,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { heading?: string }) => (
  <div className={`${styles.group} ${className}`} role="group" {...props}>
    {heading ? <div className={styles.groupHeading}>{heading}</div> : null}
    {children}
  </div>
);

CommandGroup.displayName = 'CommandGroup';

export interface CommandItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  keywords?: string[];
  onSelect?: () => void;
}

export const CommandItem = ({
  value,
  keywords = [],
  onSelect,
  className = '',
  children,
  ...props
}: CommandItemProps) => {
  const { query, selected, setSelected } = useCommand();
  const haystack = [value, ...keywords].join(' ').toLowerCase();
  const q = query.trim().toLowerCase();
  if (q && !haystack.includes(q)) return null;

  return (
    <button
      type="button"
      role="option"
      aria-selected={selected === value}
      className={`${styles.item} ${className}`}
      data-selected={selected === value ? 'true' : 'false'}
      onMouseEnter={() => setSelected(value)}
      onClick={() => {
        onSelect?.();
        setSelected(value);
      }}
      {...props}
    >
      {children}
    </button>
  );
};

CommandItem.displayName = 'CommandItem';

export const CommandSeparator = ({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={`${styles.separator} ${className}`} role="separator" {...props} />
);

CommandSeparator.displayName = 'CommandSeparator';

export interface CommandDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  children: ReactNode;
}

export const CommandDialog = ({
  open = false,
  onOpenChange,
  title = 'Command Palette',
  description = 'Search for a command to run...',
  children,
}: CommandDialogProps) => (
  <Dialog open={open}>
    <DialogContent className={styles.dialogContent} onClose={() => onOpenChange?.(false)}>
      <DialogHeader>
        <DialogTitle className="visually-hidden">{title}</DialogTitle>
        <DialogDescription className="visually-hidden">{description}</DialogDescription>
      </DialogHeader>
      {children}
    </DialogContent>
  </Dialog>
);

CommandDialog.displayName = 'CommandDialog';
