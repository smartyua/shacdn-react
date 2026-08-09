import { Pause, Play } from 'lucide-react';
import { useState } from 'react';

import { Button } from '../../../components/Button/Button';
import { ToggleGroup, ToggleGroupItem } from '../../../components/ToggleGroup/ToggleGroup';

import { PipelineTopologyDiagram } from '../components/PipelineTopologyDiagram';
import { PageHeader } from '../components/PageHeader';
import { useDashboard } from '../useDashboard';
import { WORKER_Y_POSITIONS } from '../topologyData';
import {
  FLOW_MOTION_LABELS,
  persistFlowMotion,
  readStoredFlowMotion,
  type FlowMotionPreference,
} from '../topologyMotion';
import dashStyles from '../Dashboard.module.scss';
import styles from '../TopologyPage.module.scss';

export const TopologyPage = () => {
  const { timeRangeLabel } = useDashboard();
  const [running, setRunning] = useState(true);
  const [totalPackets, setTotalPackets] = useState(0);
  const [motionPreference, setMotionPreference] = useState<FlowMotionPreference>(readStoredFlowMotion);

  const handleMotionChange = (value: string | string[]) => {
    const next = (typeof value === 'string' ? value : value[0]) as FlowMotionPreference;
    if (next === 'auto' || next === 'on' || next === 'off') {
      setMotionPreference(next);
      persistFlowMotion(next);
    }
  };

  return (
    <>
      <PageHeader
        title="Network topology"
        lead="Live media pipeline topology — central hub, ad-break and transcode workers, and directional packet flow across orthogonal connectors."
        meta={`${timeRangeLabel} window · ${WORKER_Y_POSITIONS.length} workers per group · Media Processing Cluster`}
        classes={{
          title: styles.topologyPageTitle,
          lead: styles.topologyPageLead,
          meta: styles.topologyPageMeta,
        }}
        actions={
          <div className={styles.topologyHeaderActions}>
            <div className={styles.topologyMotionControl}>
              <span className={styles.topologyMotionLabel} id="topology-motion-label">
                Animate flow
              </span>
              <ToggleGroup
                type="single"
                value={motionPreference}
                onValueChange={handleMotionChange}
                aria-labelledby="topology-motion-label"
                className={styles.topologyMotionToggle}
              >
                <ToggleGroupItem value="auto" aria-label={`${FLOW_MOTION_LABELS.auto} — follow system reduced motion`}>
                  {FLOW_MOTION_LABELS.auto}
                </ToggleGroupItem>
                <ToggleGroupItem value="on" aria-label={`${FLOW_MOTION_LABELS.on} — always animate connector flow`}>
                  {FLOW_MOTION_LABELS.on}
                </ToggleGroupItem>
                <ToggleGroupItem value="off" aria-label={`${FLOW_MOTION_LABELS.off} — static connectors`}>
                  {FLOW_MOTION_LABELS.off}
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRunning((prev) => !prev)}
              aria-pressed={running}
              aria-label={running ? 'Pause packet flow' : 'Resume packet flow'}
            >
              {running ? <Pause size={14} aria-hidden /> : <Play size={14} aria-hidden />}
              {running ? 'Pause flow' : 'Resume flow'}
            </Button>
          </div>
        }
      />

      <section className={dashStyles.section} aria-labelledby="topology-diagram-heading">
        <h2 id="topology-diagram-heading" className={`${dashStyles.sectionHeading} ${styles.topologySectionHeading}`}>
          Pipeline topology
        </h2>
        <p className={`${dashStyles.sectionLead} ${styles.topologySectionLead}`}>
          Hub-and-spoke layout with animated connector lanes and optional packet markers. Hover or focus nodes for
          status, throughput, and active flows. A compact list view is used below 1024px widths.
        </p>
        <PipelineTopologyDiagram
          running={running}
          motionPreference={motionPreference}
          totalPackets={totalPackets}
          onTotalPacketsChange={setTotalPackets}
        />
      </section>
    </>
  );
};
