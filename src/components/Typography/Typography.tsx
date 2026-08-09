import { forwardRef, type ElementType, type HTMLAttributes, type TableHTMLAttributes } from 'react';
import styles from './Typography.module.scss';

type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'p'
  | 'lead'
  | 'large'
  | 'small'
  | 'muted'
  | 'blockquote'
  | 'code';

const variantClass: Record<TypographyVariant, string> = {
  h1: styles.h1,
  h2: styles.h2,
  h3: styles.h3,
  h4: styles.h4,
  p: styles.p,
  lead: styles.lead,
  large: styles.large,
  small: styles.small,
  muted: styles.muted,
  blockquote: styles.blockquote,
  code: styles.code,
};

const variantTag: Record<TypographyVariant, ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  p: 'p',
  lead: 'p',
  large: 'p',
  small: 'p',
  muted: 'p',
  blockquote: 'blockquote',
  code: 'code',
};

export type TypographyProps = HTMLAttributes<HTMLElement> & {
  variant?: TypographyVariant;
};

export const Typography = forwardRef<HTMLElement, TypographyProps>(
  ({ variant = 'p', className = '', ...props }, ref) => {
    const Tag = variantTag[variant];
    return (
      <Tag ref={ref as never} className={`${variantClass[variant]} ${className}`} {...props} />
    );
  }
);

Typography.displayName = 'Typography';

export const TypographyH1 = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  (props, ref) => <Typography ref={ref as never} variant="h1" {...props} />
);
TypographyH1.displayName = 'TypographyH1';

export const TypographyH2 = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  (props, ref) => <Typography ref={ref as never} variant="h2" {...props} />
);
TypographyH2.displayName = 'TypographyH2';

export const TypographyH3 = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  (props, ref) => <Typography ref={ref as never} variant="h3" {...props} />
);
TypographyH3.displayName = 'TypographyH3';

export const TypographyH4 = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  (props, ref) => <Typography ref={ref as never} variant="h4" {...props} />
);
TypographyH4.displayName = 'TypographyH4';

export const TypographyP = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  (props, ref) => <Typography ref={ref as never} variant="p" {...props} />
);
TypographyP.displayName = 'TypographyP';

export const TypographyLead = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  (props, ref) => <Typography ref={ref as never} variant="lead" {...props} />
);
TypographyLead.displayName = 'TypographyLead';

export const TypographyMuted = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  (props, ref) => <Typography ref={ref as never} variant="muted" {...props} />
);
TypographyMuted.displayName = 'TypographyMuted';

export const TypographyList = forwardRef<HTMLUListElement, HTMLAttributes<HTMLUListElement>>(
  ({ className = '', ...props }, ref) => (
    <ul ref={ref} className={`${styles.list} ${className}`} {...props} />
  )
);
TypographyList.displayName = 'TypographyList';

export const TypographyTable = forwardRef<HTMLTableElement, TableHTMLAttributes<HTMLTableElement>>(
  ({ className = '', ...props }, ref) => (
    <table ref={ref} className={`${styles.table} ${className}`} {...props} />
  )
);
TypographyTable.displayName = 'TypographyTable';
