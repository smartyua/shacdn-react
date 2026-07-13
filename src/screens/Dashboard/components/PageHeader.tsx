import { type ReactNode } from 'react';
import styles from '../Dashboard.module.scss';

export type PageHeaderProps = {
  title: string;
  lead: string;
  meta?: string;
  actions?: ReactNode;
  classes?: {
    title?: string;
    lead?: string;
    meta?: string;
  };
};

export const PageHeader = ({ title, lead, meta, actions, classes }: PageHeaderProps) => (
  <header className={styles.pageHeader}>
    <div className={styles.pageTitleBlock}>
      <h1 className={`${styles.pageTitle} ${classes?.title ?? ''}`.trim()}>{title}</h1>
      <p className={`${styles.pageLead} ${classes?.lead ?? ''}`.trim()}>{lead}</p>
      {meta ? <p className={`${styles.pageMeta} ${classes?.meta ?? ''}`.trim()}>{meta}</p> : null}
    </div>
    {actions ? <div className={styles.pageActions}>{actions}</div> : null}
  </header>
);
