import { Progress, type ProgressProps } from '../../../../components/Progress/Progress';
import { TONE_CLASS, type Tone } from './tones';
import styles from './Bess.module.scss';

export interface BessProgressProps extends ProgressProps {
  tone?: Tone;
  size?: 'xs' | 'sm' | 'md';
}

const SIZE_CLASS: Record<'xs' | 'sm' | 'md', string> = {
  xs: styles.progressXs,
  sm: styles.progressSm,
  md: styles.progressMd,
};

export const BessProgress = ({ tone, size = 'md', className, ...props }: BessProgressProps) => (
  <Progress
    className={`${SIZE_CLASS[size]} ${tone ? TONE_CLASS[tone] : ''} ${className || ''}`.trim()}
    {...props}
  />
);
