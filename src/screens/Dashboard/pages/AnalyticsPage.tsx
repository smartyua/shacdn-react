import { Activity } from 'lucide-react';

import { BarChart, ChartContainer } from '../../../components/Chart/Chart';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '../../../components/ContextMenu/ContextMenu';
import { Progress } from '../../../components/Progress/Progress';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../../../components/Resizable/Resizable';
import { TypographyMuted } from '../../../components/Typography/Typography';
import { useToastActions } from '../../../components/Toast/Toast';

import { PageHeader } from '../components/PageHeader';
import { useDashboard } from '../useDashboard';
import { ANALYTICS_FUNNEL, CONVERSION_DATA, ENGAGEMENT_METRICS } from '../dashboardData';
import styles from '../Dashboard.module.scss';

export const AnalyticsPage = () => {
  const { addToast } = useToastActions();
  const { timeRangeLabel } = useDashboard();

  return (
    <>
      <PageHeader
        title="Analytics"
        lead="Engagement, funnel performance, and traffic quality for the selected reporting window."
        meta={`Metrics reflect the ${timeRangeLabel} period · drag panel handles to resize charts`}
      />

      <section className={styles.section} aria-labelledby="analytics-engagement-heading">
        <h2 id="analytics-engagement-heading" className={styles.sectionHeading}>
          Engagement analytics
        </h2>
        <p className={styles.sectionLead}>Drag panel handles to resize charts. Metrics refresh with the global time range.</p>
        <div className={styles.resizableWrap}>
          <ResizablePanelGroup orientation="horizontal">
            <ResizablePanel defaultSize="60%">
              <ResizablePanelGroup orientation="vertical">
                <ResizablePanel defaultSize="50%">
                  <div className={styles.resizableCell}>
                    <ChartContainer
                      title="Conversion rate"
                      description="Daily checkout completions as % of visits"
                      className={styles.chartBare}
                    >
                      <BarChart data={[...CONVERSION_DATA]} maxValue={100} />
                    </ChartContainer>
                  </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize="50%">
                  <div className={styles.resizableCell}>
                    <div className={styles.engagementHeader}>
                      <Activity size={18} aria-hidden />
                      <span>Session engagement</span>
                    </div>
                    <div className={styles.engagementList}>
                      {ENGAGEMENT_METRICS.map((metric) => (
                        <div key={metric.label} className={styles.metricRow}>
                          <span className={styles.metricLabel}>{metric.label}</span>
                          <span className={styles.metricValue}>
                            {metric.value}{' '}
                            <TypographyMuted>({metric.change})</TypographyMuted>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize="40%">
              <div className={styles.resizableCell}>
                <p className={styles.panelTitle}>Traffic quality</p>
                <div className={styles.progressList}>
                  {[
                    { label: 'Page views', value: 82 },
                    { label: 'Session duration', value: 64 },
                    { label: 'Bounce rate', value: 28 },
                  ].map((item) => (
                    <div key={item.label} className={styles.progressItem}>
                      <div className={styles.progressLabel}>
                        <span>{item.label}</span>
                        <span>{item.value}%</span>
                      </div>
                      <Progress value={item.value} />
                    </div>
                  ))}
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="analytics-funnel-heading">
        <h2 id="analytics-funnel-heading" className={styles.sectionHeading}>
          Purchase funnel
        </h2>
        <p className={styles.sectionLead}>Drop-off between store visit and completed purchase.</p>
        <div className={styles.funnelGrid}>
          {ANALYTICS_FUNNEL.map((step, index) => (
            <div key={step.label} className={styles.funnelStep}>
              <div className={styles.funnelStepHeader}>
                <span className={styles.funnelStepLabel}>{step.label}</span>
                <span className={styles.funnelStepValue}>{step.value}%</span>
              </div>
              <Progress value={step.value} />
              {index < ANALYTICS_FUNNEL.length - 1 ? (
                <span className={styles.funnelDropoff}>
                  −{step.value - (ANALYTICS_FUNNEL[index + 1]?.value ?? 0)}% to next step
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="analytics-breakdown-heading">
        <h2 id="analytics-breakdown-heading" className={styles.sectionHeading}>
          Performance breakdown
        </h2>
        <p className={styles.sectionLead}>Right-click to copy segment data or open a detailed funnel report.</p>
        <ContextMenu>
          <ContextMenuTrigger>
            <div className={styles.contextTarget}>
              Right-click here for analytics actions — copy data, export PNG, or view full report
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem onClick={() => addToast({ title: 'Copied', description: 'Segment data copied.' })}>
              Copy data
            </ContextMenuItem>
            <ContextMenuItem>Export PNG</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>View full report</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </section>
    </>
  );
};
