import { Upload, X } from 'lucide-react';
import {
  forwardRef,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type HTMLAttributes,
} from 'react';
import { Button } from '../Button/Button';
import { cn } from '../../lib/cn';
import { takeFiles } from './fileAccept';
import styles from './FileUpload.module.scss';

export interface FileUploadProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  disabled?: boolean;
  value?: File[];
  defaultValue?: File[];
  onValueChange?: (files: File[]) => void;
}

const fileKey = (file: File): string => `${file.name}:${file.size}:${file.lastModified}`;

const previewUrl = (file: File, cache: Map<string, string>): string | null => {
  if (!file.type.startsWith('image/') || typeof URL.createObjectURL !== 'function') return null;
  const key = fileKey(file);
  const cached = cache.get(key);
  if (cached) return cached;
  try {
    const url = URL.createObjectURL(file);
    cache.set(key, url);
    return url;
  } catch {
    return null;
  }
};

export const FileUpload = forwardRef<HTMLDivElement, FileUploadProps>(
  (
    {
      accept,
      multiple = false,
      maxFiles,
      disabled = false,
      value,
      defaultValue = [],
      onValueChange,
      className,
      ...props
    },
    ref
  ) => {
    const inputId = useId();
    const previews = useRef(new Map<string, string>());
    const [internal, setInternal] = useState(defaultValue);
    const [active, setActive] = useState(false);
    const files = value ?? internal;
    const limit = maxFiles ?? (multiple ? Number.POSITIVE_INFINITY : 1);

    const commit = (incoming: File[]) => {
      const next = takeFiles(incoming, accept, limit);
      if (value === undefined) setInternal(next);
      onValueChange?.(next);
    };

    const add = (list: FileList | File[]) => {
      if (disabled) return;
      const incoming = multiple ? [...files, ...Array.from(list)] : Array.from(list).slice(0, 1);
      commit(incoming);
    };

    const onDrop = (event: DragEvent<HTMLLabelElement>) => {
      event.preventDefault();
      setActive(false);
      if (disabled) return;
      add(event.dataTransfer.files);
    };

    const remove = (index: number) => {
      commit(files.filter((_, itemIndex) => itemIndex !== index));
    };

    return (
      <div ref={ref} className={cn(styles.zone, className)} data-slot="file-upload" {...props}>
        <label
          className={styles.drop}
          htmlFor={inputId}
          data-active={active ? 'true' : 'false'}
          data-disabled={disabled ? 'true' : 'false'}
          onDragOver={event => {
            event.preventDefault();
            if (!disabled) setActive(true);
          }}
          onDragLeave={() => setActive(false)}
          onDrop={onDrop}
        >
          <Upload size={20} aria-hidden />
          <span className={styles.hint}>Drop files here or browse</span>
          <input
            id={inputId}
            className={styles.input}
            type="file"
            accept={accept}
            multiple={multiple}
            disabled={disabled}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              if (event.target.files) add(event.target.files);
              event.target.value = '';
            }}
          />
        </label>
        {files.length > 0 ? (
          <ul className={styles.list}>
            {files.map((file, index) => {
              const preview = previewUrl(file, previews.current);
              return (
                <li key={fileKey(file)} className={styles.file}>
                  {preview ? <img className={styles.preview} src={preview} alt="" /> : null}
                  <span className={styles.name}>{file.name}</span>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    aria-label={`Remove ${file.name}`}
                    onClick={() => remove(index)}
                    disabled={disabled}
                  >
                    <X size={14} aria-hidden />
                  </Button>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    );
  }
);

FileUpload.displayName = 'FileUpload';
