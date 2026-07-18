import { Clapperboard, Cog, Server, type LucideIcon } from 'lucide-react';

import styles from './TopologyNodeIcon.module.scss';

type TopologyNodeIconProps = {
  type: 'server' | 'adbreak' | 'transcode';
  size?: number;
};

const ICONS: Record<TopologyNodeIconProps['type'], LucideIcon> = {
  server: Server,
  adbreak: Clapperboard,
  transcode: Cog,
};

export const TopologyNodeIcon = ({ type, size = 20 }: TopologyNodeIconProps) => {
  const Icon = ICONS[type];
  const half = size / 2;

  return (
    <g transform={`translate(${-half}, ${-half})`} className={styles.icon} aria-hidden>
      <Icon width={size} height={size} strokeWidth={1.75} className={styles.iconSvg} />
    </g>
  );
};
