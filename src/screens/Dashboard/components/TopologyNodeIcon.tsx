import styles from './TopologyNodeIcon.module.scss';

type TopologyNodeIconProps = {
  type: 'server' | 'adbreak' | 'transcode';
  size?: number;
  busy?: boolean;
  reducedMotion?: boolean;
  ledBlinkClass?: string;
  ledBusyClass?: string;
};

export const TopologyNodeIcon = ({
  type,
  size = 38,
  busy = false,
  reducedMotion = false,
  ledBlinkClass,
  ledBusyClass,
}: TopologyNodeIconProps) => {
  const h = size / 2;

  switch (type) {
    case 'server':
      return (
        <g>
          <rect
            x={-h * 1.1}
            y={-h * 1.55}
            width={h * 2.2}
            height={h * 3.1}
            rx="5"
            className={styles.iconServerBody}
            strokeWidth="2"
          />
          {[-1.1, -0.5, 0.1, 0.7, 1.3].map((oy, i) => (
            <rect
              key={i}
              x={-h * 0.85}
              y={oy * h * 0.52}
              width={h * 1.7}
              height={h * 0.38}
              rx="2"
              className={styles.iconServerBay}
              strokeWidth="0.5"
            />
          ))}
          <circle
            cx={-h * 0.6}
            cy={h * 1.15}
            r="3"
            className={`${styles.iconLedSuccess} ${busy && !reducedMotion && ledBusyClass ? ledBusyClass : ''}`}
          />
          <circle cx={-h * 0.2} cy={h * 1.15} r="3" className={styles.iconLedSuccess} />
          <circle
            cx={h * 0.2}
            cy={h * 1.15}
            r="3"
            className={`${styles.iconLedWarning} ${!reducedMotion && ledBlinkClass ? ledBlinkClass : ''}`}
          />
          <circle cx={h * 0.6} cy={h * 1.15} r="3" className={styles.iconLedPrimary} />
          <rect
            x={-h * 0.85}
            y={h * 0.82}
            width={h * 1.7}
            height={h * 0.2}
            rx="1"
            className={styles.iconServerPort}
          />
        </g>
      );

    case 'adbreak':
      return (
        <g>
          <rect
            x={-h * 1.05}
            y={-h * 0.8}
            width={h * 2.1}
            height={h * 1.6}
            rx="3"
            className={styles.iconAdbreakBody}
            strokeWidth="1.8"
          />
          {[-0.55, 0, 0.55].map((ox, i) => (
            <rect
              key={`t${i}`}
              x={ox * h - h * 0.22}
              y={-h * 0.95}
              width={h * 0.44}
              height={h * 0.22}
              rx="1"
              className={styles.iconAdbreakSprocket}
              strokeWidth="0.5"
            />
          ))}
          {[-0.55, 0, 0.55].map((ox, i) => (
            <rect
              key={`b${i}`}
              x={ox * h - h * 0.22}
              y={h * 0.72}
              width={h * 0.44}
              height={h * 0.22}
              rx="1"
              className={styles.iconAdbreakSprocket}
              strokeWidth="0.5"
            />
          ))}
          <line
            x1={-h * 0.45}
            y1={-h * 0.35}
            x2={h * 0.45}
            y2={h * 0.35}
            className={styles.iconAdbreakMark}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1={-h * 0.45}
            y1={h * 0.35}
            x2={h * 0.45}
            y2={-h * 0.35}
            className={styles.iconAdbreakMark}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx={-h * 0.55} cy={-h * 0.45} r="4" className={styles.iconAdbreakAccent} opacity="0.35" />
          <circle cx={-h * 0.55} cy={h * 0.45} r="4" className={styles.iconAdbreakAccent} opacity="0.35" />
        </g>
      );

    case 'transcode':
      return (
        <g>
          <rect
            x={-h * 0.95}
            y={-h * 0.95}
            width={h * 1.9}
            height={h * 1.9}
            rx="4"
            className={styles.iconTranscodeBody}
            strokeWidth="1.8"
          />
          <rect x={-h * 0.55} y={-h * 0.55} width={h * 1.1} height={h * 1.1} rx="2" className={styles.iconTranscodeDie} />
          <path
            d={`M${-h * 0.28} 0 L${h * 0.05} ${-h * 0.32} L${h * 0.05} ${-h * 0.12} L${h * 0.38} ${-h * 0.12} L${h * 0.38} ${h * 0.12} L${h * 0.05} ${h * 0.12} L${h * 0.05} ${h * 0.32} Z`}
            className={styles.iconTranscodeArrow}
          />
          {[-0.55, -0.22, 0.11, 0.44].map((ox, i) => (
            <g key={i}>
              <rect x={ox * h} y={-h * 1.08} width={h * 0.18} height={h * 0.18} rx="1" className={styles.iconTranscodePin} />
              <rect x={ox * h} y={h * 0.9} width={h * 0.18} height={h * 0.18} rx="1" className={styles.iconTranscodePin} />
            </g>
          ))}
          {[-0.55, -0.22, 0.11, 0.44].map((oy, i) => (
            <g key={`lr${i}`}>
              <rect x={-h * 1.08} y={oy * h} width={h * 0.18} height={h * 0.18} rx="1" className={styles.iconTranscodePin} />
              <rect x={h * 0.9} y={oy * h} width={h * 0.18} height={h * 0.18} rx="1" className={styles.iconTranscodePin} />
            </g>
          ))}
        </g>
      );

    default:
      return (
        <rect x={-h} y={-h} width={h * 2} height={h * 2} rx="4" className={styles.iconFallback} strokeWidth="1.5" />
      );
  }
};
