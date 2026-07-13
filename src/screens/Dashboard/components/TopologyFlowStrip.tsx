import styles from '../TopologyPage.module.scss';

export type TopologyFlowStripProps = {
  linesActive: boolean;
};

const STRIP_PATHS = {
  left: 'M 52 28 H 168',
  right: 'M 232 28 H 348',
} as const;

export const TopologyFlowStrip = ({ linesActive }: TopologyFlowStripProps) => (
  <svg
    className={styles.topologyFlowStrip}
    viewBox="0 0 400 56"
    preserveAspectRatio="xMidYMid meet"
    aria-hidden
  >
    <rect x="0" y="0" width="400" height="56" className={styles.topologyFlowStripBg} rx="8" />
    <circle cx="36" cy="28" r="10" className={styles.topologyFlowStripNodeAdbreak} />
    <circle cx="200" cy="28" r="12" className={styles.topologyFlowStripNodeServer} />
    <circle cx="364" cy="28" r="10" className={styles.topologyFlowStripNodeTranscode} />
    <text x="36" y="48" textAnchor="middle" className={styles.topologyFlowStripLabel}>
      Ad-break
    </text>
    <text x="200" y="48" textAnchor="middle" className={styles.topologyFlowStripLabel}>
      Hub
    </text>
    <text x="364" y="48" textAnchor="middle" className={styles.topologyFlowStripLabel}>
      Transcode
    </text>
    {(Object.keys(STRIP_PATHS) as Array<keyof typeof STRIP_PATHS>).map((side) => {
      const d = STRIP_PATHS[side];
      const toneBase =
        side === 'left' ? styles.topologyFlowStripTrackAdbreak : styles.topologyFlowStripTrackTranscode;
      const toneFlow =
        side === 'left' ? styles.topologyFlowStripFlowAdbreak : styles.topologyFlowStripFlowTranscode;

      return (
        <g key={side}>
          <path d={d} fill="none" className={`${styles.topologyFlowStripTrack} ${toneBase}`} />
          {linesActive ? (
            <path
              d={d}
              fill="none"
              className={`${styles.topologyFlowStripFlow} ${toneFlow}`}
            />
          ) : null}
        </g>
      );
    })}
  </svg>
);
