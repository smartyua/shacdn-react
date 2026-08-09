import { ArrowDownRight, ArrowUpRight, Filter, RefreshCw } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Alert, AlertDescription, AlertTitle } from '../../../components/Alert/Alert';
import { Badge } from '../../../components/Badge/Badge';
import { Button } from '../../../components/Button/Button';
import { NativeSelect } from '../../../components/NativeSelect/NativeSelect';
import { Progress } from '../../../components/Progress/Progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/Table/Table';
import { ToggleGroup, ToggleGroupItem } from '../../../components/ToggleGroup/ToggleGroup';
import { TypographyMuted } from '../../../components/Typography/Typography';

import { TrafficFlowDiagram } from '../components/TrafficFlowDiagram';
import { PageHeader } from '../components/PageHeader';
import { useDashboard } from '../useDashboard';
import {
  REGION_OPTIONS,
  TRAFFIC_ENDPOINTS,
  TRAFFIC_HEALTH_VARIANT,
  TRAFFIC_INCIDENTS,
  TRAFFIC_METRICS,
  TRAFFIC_REGIONS,
  TRAFFIC_SOURCES,
} from '../dashboardData';
import dashStyles from '../Dashboard.module.scss';
import styles from '../TrafficPage.module.scss';

export const TrafficPage = () => {
  const { timeRange, timeRangeLabel, refreshing, handleRefresh } = useDashboard();
  const [regionFilter, setRegionFilter] = useState('all');
  const [protocolFilter, setProtocolFilter] = useState('all');

  const filteredRegions = useMemo(
    () =>
      regionFilter === 'all'
        ? TRAFFIC_REGIONS
        : TRAFFIC_REGIONS.filter((region) => region.code === regionFilter),
    [regionFilter]
  );

  const filteredSources = useMemo(
    () =>
      protocolFilter === 'all'
        ? TRAFFIC_SOURCES
        : TRAFFIC_SOURCES.filter((source) =>
            protocolFilter === 'grpc'
              ? source.protocol === 'gRPC'
              : source.protocol === 'HTTPS'
          ),
    [protocolFilter]
  );

  const activeIncidents = TRAFFIC_INCIDENTS.filter((incident) => incident.status === 'active');

  return (
    <>
      <PageHeader
        title="Traffic"
        lead="Live request flow from edge regions through load balancers to application services, cache, and database layers."
        meta={`${timeRangeLabel} window · ${TRAFFIC_REGIONS.length} regions · ${activeIncidents.length} active incident${activeIncidents.length === 1 ? '' : 's'}`}
        actions={
          <>
            <div className={styles.trafficFilters}>
              <NativeSelect
                className={styles.trafficFilterSelect}
                aria-label="Filter by region"
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
              >
                {REGION_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </NativeSelect>
              <ToggleGroup
                type="single"
                value={protocolFilter}
                onValueChange={(value) => {
                  if (typeof value === 'string') setProtocolFilter(value);
                }}
              >
                <ToggleGroupItem value="all" aria-label="All protocols">
                  All
                </ToggleGroupItem>
                <ToggleGroupItem value="https" aria-label="HTTPS only">
                  HTTPS
                </ToggleGroupItem>
                <ToggleGroupItem value="grpc" aria-label="gRPC only">
                  gRPC
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw size={14} aria-hidden className={refreshing ? dashStyles.spinIcon : undefined} />
              Refresh
            </Button>
          </>
        }
      />

      {activeIncidents.length > 0 ? (
        <Alert variant="subtle">
          <Filter size={16} aria-hidden />
          <div>
            <AlertTitle>Active traffic incidents</AlertTitle>
            <AlertDescription>
              {activeIncidents.map((incident) => incident.title).join(' · ')} — review the health panel below for
              details.
            </AlertDescription>
          </div>
        </Alert>
      ) : null}

      <section className={dashStyles.section} aria-labelledby="traffic-metrics-heading">
        <h2 id="traffic-metrics-heading" className={dashStyles.sectionHeading}>
          Traffic metrics
        </h2>
        <p className={dashStyles.sectionLead}>
          Headline throughput and reliability numbers for the selected {timeRangeLabel} period.
        </p>
        <div className={dashStyles.kpiGrid}>
          {TRAFFIC_METRICS.map((metric) => {
            const Icon = metric.icon;
            return (
              <article key={metric.title} className={dashStyles.metricTile}>
                <div className={dashStyles.metricTileHeader}>
                  <div>
                    <p className={dashStyles.metricTileLabel}>{metric.title}</p>
                    <p className={dashStyles.kpiDescription}>{metric.description}</p>
                  </div>
                  <Icon size={16} aria-hidden className={dashStyles.kpiIcon} />
                </div>
                <div className={dashStyles.metricTileBody}>
                  <div className={dashStyles.kpiValue}>{metric.value}</div>
                  <div className={dashStyles.kpiMeta}>
                    <Badge
                      variant={metric.trend === 'up' && metric.title !== 'Error Rate' ? 'secondary' : 'destructive'}
                      className={dashStyles.badgeIcon}
                    >
                      {metric.trend === 'up' && metric.title !== 'Error Rate' ? (
                        <ArrowUpRight size={12} aria-hidden />
                      ) : (
                        <ArrowDownRight size={12} aria-hidden />
                      )}
                      {metric.change}
                    </Badge>
                    <span>
                      vs previous {timeRange === '24h' ? 'day' : timeRange === '7d' ? 'week' : 'month'}
                    </span>
                  </div>
                  <p className={dashStyles.kpiTarget}>{metric.target}</p>
                  <Progress value={metric.progress} className={dashStyles.kpiProgress} />
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className={dashStyles.section} aria-labelledby="traffic-flow-heading">
        <h2 id="traffic-flow-heading" className={dashStyles.sectionHeading}>
          Request flow
        </h2>
        <p className={dashStyles.sectionLead}>
          Directional connectors show live traffic movement. Latency labels appear on each hop between layers.
        </p>
        <TrafficFlowDiagram />
      </section>

      <section className={dashStyles.section} aria-labelledby="traffic-breakdown-heading">
        <h2 id="traffic-breakdown-heading" className={dashStyles.sectionHeading}>
          Breakdown
        </h2>
        <p className={dashStyles.sectionLead}>
          Regional distribution, traffic sources, top endpoints, and incident status for the selected filters.
        </p>
        <div className={styles.trafficBreakdownGrid}>
          <div className={dashStyles.surfacePanel}>
            <div className={dashStyles.surfacePanelHeader}>
              <h3 className={dashStyles.panelTitle}>Regions</h3>
              <p className={dashStyles.panelDescription}>
                Request share and P95 latency by edge region
                {regionFilter !== 'all' ? ` · filtered to ${regionFilter}` : ''}
              </p>
            </div>
            <div className={styles.regionList}>
              {filteredRegions.map((region) => (
                <div key={region.code} className={styles.regionRow}>
                  <div className={styles.regionRowHeader}>
                    <span className={styles.regionName}>{region.region}</span>
                    <Badge variant={TRAFFIC_HEALTH_VARIANT[region.status]}>{region.statusLabel}</Badge>
                  </div>
                  <div className={styles.regionMeta}>
                    {region.requests} requests · {region.latency} P95
                  </div>
                  <Progress value={region.share} aria-label={`${region.region} traffic share ${region.share}%`} />
                </div>
              ))}
            </div>
          </div>

          <div className={dashStyles.surfacePanel}>
            <div className={dashStyles.surfacePanelHeader}>
              <h3 className={dashStyles.panelTitle}>Traffic sources</h3>
              <p className={dashStyles.panelDescription}>
                Protocol mix and error rates by client type
                {protocolFilter !== 'all' ? ` · ${protocolFilter.toUpperCase()} only` : ''}
              </p>
            </div>
            <div className={styles.sourceList}>
              {filteredSources.map((source) => (
                <div key={source.source} className={styles.sourceRow}>
                  <div className={styles.sourceInfo}>
                    <span className={styles.sourceName}>{source.source}</span>
                    <span className={styles.sourceProtocol}>{source.protocol}</span>
                  </div>
                  <div className={styles.sourceStats}>
                    {source.requests}
                    <br />
                    {source.share}% · {source.errorRate} errors
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`${dashStyles.tableSurface} ${styles.trafficBreakdownWide}`}>
            <div className={dashStyles.surfacePanelHeader}>
              <h3 className={dashStyles.panelTitle}>Top endpoints</h3>
              <p className={dashStyles.panelDescription}>Highest-volume API routes with P95 latency and error rate</p>
            </div>
            <div className={dashStyles.tableScroll}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Route</TableHead>
                    <TableHead>Throughput</TableHead>
                    <TableHead className={dashStyles.colHideMobile}>P95</TableHead>
                    <TableHead>Errors</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {TRAFFIC_ENDPOINTS.map((endpoint) => (
                    <TableRow key={`${endpoint.method}-${endpoint.path}`}>
                      <TableCell>
                        <span className={styles.endpointMethod}>{endpoint.method}</span>{' '}
                        <span className={styles.endpointPath}>{endpoint.path}</span>
                      </TableCell>
                      <TableCell>{endpoint.rps} rps</TableCell>
                      <TableCell className={dashStyles.colHideMobile}>{endpoint.p95}</TableCell>
                      <TableCell>{endpoint.errors}</TableCell>
                      <TableCell>
                        <Badge variant={TRAFFIC_HEALTH_VARIANT[endpoint.status]}>{endpoint.statusLabel}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className={dashStyles.surfacePanel}>
            <div className={dashStyles.surfacePanelHeader}>
              <h3 className={dashStyles.panelTitle}>Health &amp; incidents</h3>
              <p className={dashStyles.panelDescription}>Active and recently resolved operational events</p>
            </div>
            <div className={styles.incidentList}>
              {TRAFFIC_INCIDENTS.map((incident) => (
                <article key={incident.id} className={styles.incidentItem}>
                  <div className={styles.incidentHeader}>
                    <Badge
                      variant={
                        incident.severity === 'critical'
                          ? 'destructive'
                          : incident.severity === 'warning'
                            ? 'outline'
                            : 'secondary'
                      }
                    >
                      {incident.severity}
                    </Badge>
                    <Badge variant={incident.status === 'active' ? 'outline' : 'secondary'}>
                      {incident.status}
                    </Badge>
                  </div>
                  <h4 className={styles.incidentTitle}>{incident.title}</h4>
                  <p className={styles.incidentMeta}>
                    {incident.region} · started {incident.started}
                  </p>
                </article>
              ))}
            </div>
            <TypographyMuted>Status uses text labels and badges — not color alone.</TypographyMuted>
          </div>
        </div>
      </section>
    </>
  );
};
