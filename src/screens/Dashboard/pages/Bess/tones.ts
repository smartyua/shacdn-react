import styles from './Bess.module.scss';

export type Tone = 'solar' | 'battery' | 'grid' | 'load' | 'ev' | 'import' | 'export' | 'success' | 'warning' | 'destructive';

// Each class sets --progress-indicator (read by Progress and ProgressRing) plus the
// --tone-surface / --tone-foreground pair used by tinted badges.
export const TONE_CLASS: Record<Tone, string> = {
  solar: styles.toneSolar,
  battery: styles.toneBattery,
  grid: styles.toneGrid,
  load: styles.toneLoad,
  ev: styles.toneEv,
  import: styles.toneImport,
  export: styles.toneExport,
  success: styles.toneSuccess,
  warning: styles.toneWarning,
  destructive: styles.toneDestructive,
};

export const toneBadgeClass = (tone: Tone): string => `${styles.toneBadge} ${TONE_CLASS[tone]}`;
