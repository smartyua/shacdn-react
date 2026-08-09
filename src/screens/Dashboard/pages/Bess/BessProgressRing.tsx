import { ProgressRing, type ProgressRingProps } from '../../../../components/ProgressRing/ProgressRing';
import { TONE_CLASS, type Tone } from './tones';

export interface BessProgressRingProps extends ProgressRingProps {
  tone?: Tone;
}

export const BessProgressRing = ({ tone, className, ...props }: BessProgressRingProps) => (
  <ProgressRing className={`${tone ? TONE_CLASS[tone] : ''} ${className || ''}`.trim()} {...props} />
);
