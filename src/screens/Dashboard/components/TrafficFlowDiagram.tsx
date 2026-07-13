import { Globe, Layers, Server, Database, HardDrive, Cloud } from 'lucide-react';

import { TRAFFIC_FLOW_NODES } from '../dashboardData';
import styles from '../TrafficPage.module.scss';

const BACKEND_NODE_IDS = ['services', 'cache', 'database'] as const;

const NODE_ICONS: Record<string, typeof Globe> = {
  users: Globe,
  edge: Cloud,
  lb: Layers,
  services: Server,
  cache: HardDrive,
  database: Database,
};

const getNode = (id: string) => TRAFFIC_FLOW_NODES.find((node) => node.id === id);

type FlowNodeProps = {
  nodeId: string;
};

const FlowNode = ({ nodeId }: FlowNodeProps) => {
  const node = getNode(nodeId);
  if (!node) return null;

  const Icon = NODE_ICONS[nodeId] ?? Server;

  return (
    <article
      className={styles.flowNode}
      aria-label={`${node.label}: ${node.statusLabel}. Throughput ${node.throughput}. Latency ${node.latency}.`}
    >
      <div className={styles.flowNodeTop}>
        <span className={styles.flowNodeIcon} aria-hidden>
          <Icon size={16} />
        </span>
        <span className={styles.flowNodeStatus} data-status={node.status}>
          <span className={styles.flowNodeStatusDot} aria-hidden />
          <span className={styles.flowNodeStatusText}>{node.statusLabel}</span>
        </span>
      </div>
      <h3 className={styles.flowNodeTitle}>{node.label}</h3>
      <p className={styles.flowNodeSubtitle}>{node.subtitle}</p>
      <dl className={styles.flowNodeMetrics}>
        <div className={styles.flowNodeMetric}>
          <dt>Throughput</dt>
          <dd>{node.throughput}</dd>
        </div>
        <div className={styles.flowNodeMetric}>
          <dt>Latency</dt>
          <dd>{node.latency}</dd>
        </div>
      </dl>
    </article>
  );
};

type FlowConnectorProps = {
  label?: string;
  variant?: 'horizontal' | 'vertical' | 'branch';
};

const FlowConnector = ({ label, variant = 'horizontal' }: FlowConnectorProps) => (
  <div
    className={`${styles.flowConnector} ${styles[`flowConnector${variant.charAt(0).toUpperCase()}${variant.slice(1)}`]}`}
    aria-hidden
  >
    <svg className={styles.flowConnectorSvg} viewBox="0 0 100 24" preserveAspectRatio="none">
      <line className={styles.flowLine} x1="0" y1="12" x2="100" y2="12" />
    </svg>
    {label ? <span className={styles.flowConnectorLabel}>{label}</span> : null}
  </div>
);

export const TrafficFlowDiagram = () => {
  const edgeNode = getNode('edge');
  const lbNode = getNode('lb');

  return (
    <figure className={styles.flowDiagram} aria-labelledby="traffic-flow-caption">
      <div className={styles.flowPipeline}>
        <div className={styles.flowMainTrack}>
          <FlowNode nodeId="users" />
          <FlowConnector label={edgeNode?.latency} />
          <FlowNode nodeId="edge" />
          <FlowConnector label={lbNode?.latency} />
          <FlowNode nodeId="lb" />
          <FlowConnector label="56 ms" variant="branch" />
        </div>

        <div className={styles.flowBackendTrack} role="group" aria-label="Backend services layer">
          {BACKEND_NODE_IDS.map((nodeId, index) => (
            <div key={nodeId} className={styles.flowBackendItem}>
              {index > 0 ? <FlowConnector variant="vertical" /> : null}
              <FlowNode nodeId={nodeId} />
            </div>
          ))}
        </div>
      </div>

      <figcaption id="traffic-flow-caption" className={styles.flowCaption}>
        Request path from users through edge CDN, load balancer, application services, cache, and database.
        Animated connectors indicate live traffic direction. Status labels describe node health.
      </figcaption>
    </figure>
  );
};
