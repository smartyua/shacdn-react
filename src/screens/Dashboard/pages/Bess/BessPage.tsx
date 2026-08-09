import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  Activity,
  ArrowDownToLine,
  BatteryCharging,
  Building2,
  CircleAlert,
  Factory,
  Info,
  Pause,
  Play,
  PlugZap,
  Sun,
  Thermometer,
  TriangleAlert,
  Zap,
} from 'lucide-react';

import { Badge } from '../../../../components/Badge/Badge';
import { Button } from '../../../../components/Button/Button';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/Card/Card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../../../components/Dialog/Dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../components/Tabs/Tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/Table/Table';

import { BessProgress } from './BessProgress';
import { BessProgressRing } from './BessProgressRing';
import { EnergyFlowDiagram } from './EnergyFlowDiagram';
import { PowerChart } from './PowerChart';
import { GridExchangeChart } from './GridExchangeChart';
import { WeatherPanel } from './WeatherPanel';
import {
  INITIAL_MINUTE,
  PLANT,
  clampMinute,
  formatKw,
  formatPower,
  getDaySeries,
  getHourlyExchange,
  getPlantState,
  stringHealth,
  type AlarmSeverity,
  type ChargerStatus,
  type InverterStatus,
} from './bessData';
import { t } from './bessCopy';
import { toneBadgeClass, type Tone } from './tones';
import { PageHeader } from '../../components/PageHeader';
import dash from '../../Dashboard.module.scss';
import styles from './Bess.module.scss';

const TICK_MS = 2000;
const TICK_MINUTES = 4;

type BadgeKind = 'outline' | 'destructive' | 'secondary' | Tone;

const REAL_VARIANTS = new Set(['outline', 'destructive', 'secondary']);

const ToneBadge = ({ kind, children }: { kind: BadgeKind; children: ReactNode }) => {
  if (REAL_VARIANTS.has(kind)) {
    return <Badge variant={kind as 'outline' | 'destructive' | 'secondary'}>{children}</Badge>;
  }
  return (
    <Badge variant="secondary" className={toneBadgeClass(kind as Tone)}>
      {children}
    </Badge>
  );
};

const STATUS_KIND: Record<InverterStatus, BadgeKind> = {
  online: 'success',
  derated: 'warning',
  fault: 'destructive',
  standby: 'outline',
};

const CHARGER_KIND: Record<ChargerStatus, BadgeKind> = {
  charging: 'ev',
  idle: 'outline',
  fault: 'destructive',
};

const SEVERITY_KIND: Record<AlarmSeverity, BadgeKind> = {
  critical: 'destructive',
  warning: 'warning',
  info: 'outline',
};

const HEALTH_KIND: Record<'good' | 'fair' | 'watch' | 'poor', BadgeKind> = {
  good: 'success',
  fair: 'secondary',
  watch: 'warning',
  poor: 'destructive',
};

const SeverityIcon = ({ severity }: { severity: AlarmSeverity }) => {
  if (severity === 'critical') return <CircleAlert aria-hidden />;
  if (severity === 'warning') return <TriangleAlert aria-hidden />;
  return <Info aria-hidden />;
};

type KpiProps = {
  icon: ReactNode;
  label: string;
  value: string;
  unitNote: string;
  badge?: { text: string; kind: BadgeKind };
  progress?: number;
  tone?: Tone;
};

const KpiTile = ({ icon, label, value, unitNote, badge, progress, tone }: KpiProps) => (
  <article className={dash.metricTile}>
    <div className={dash.metricTileHeader}>
      <span className={styles.kpiLabel}>
        {icon}
        <span className={styles.kpiLabelText}>{label}</span>
      </span>
      {badge ? <ToneBadge kind={badge.kind}>{badge.text}</ToneBadge> : null}
    </div>
    <div className={dash.metricTileBody}>
      <strong className={`${dash.kpiValue} ${styles.kpiValue}`}>{value}</strong>
      <span className={styles.kpiNote}>{unitNote}</span>
      {progress === undefined ? null : <BessProgress value={progress} tone={tone} size="sm" />}
    </div>
  </article>
);

export const BessPage = () => {
  const [minute, setMinute] = useState(INITIAL_MINUTE);
  const [playing, setPlaying] = useState(true);
  const [stringDialogId, setStringDialogId] = useState<string | null>(null);

  useEffect(() => {
    if (!playing) return undefined;
    const id = window.setInterval(() => setMinute(current => clampMinute(current + TICK_MINUTES)), TICK_MS);
    return () => window.clearInterval(id);
  }, [playing]);

  const state = useMemo(() => getPlantState(minute), [minute]);
  const series = useMemo(() => getDaySeries(20), []);
  const hours = useMemo(() => getHourlyExchange(minute), [minute]);

  const charging = state.batteryKw < 0;
  const exporting = state.gridKw < 0;
  const gridLimit = exporting ? PLANT.exportLimitKw : PLANT.importLimitKw;
  const siteKw = state.loadKw - state.evKw;
  const peakHourImport = Math.max(...hours.map(hour => hour.importKwh));
  const peakHourExport = Math.max(...hours.map(hour => hour.exportKwh));
  const criticalCount = state.alarms.filter(alarm => alarm.severity === 'critical').length;
  const warningCount = state.alarms.filter(alarm => alarm.severity === 'warning').length;
  const stringDialogInverter = state.inverters.find(inverter => inverter.spec.id === stringDialogId) ?? null;

  return (
    <>
      <PageHeader
        title="BESS &amp; solar monitoring"
        lead="Battery storage, PV inverters, EV charging and grid exchange for a simulated hybrid plant — built entirely from this library's Card, Badge, Button, Progress, Tabs, Table and Dialog primitives."
        meta={`${PLANT.name} · ${(PLANT.acCapacityKw / 1000).toFixed(2)} MW AC · ${(PLANT.storageCapacityKwh / 1000).toFixed(0)} MWh BESS · ${PLANT.inverterCount} ${t('_BESS_INVERTERS')} · ${PLANT.stringCount} ${t('_BESS_STRINGS')}`}
        actions={
          <div className={styles.headerStatus}>
            {criticalCount > 0 ? (
              <Badge variant="destructive">
                <CircleAlert aria-hidden />
                {`${criticalCount} ${t('_BESS_SEV_CRITICAL')}`}
              </Badge>
            ) : null}
            {warningCount > 0 ? (
              <ToneBadge kind="warning">
                <TriangleAlert aria-hidden />
                {`${warningCount} ${t('_BESS_SEV_WARNING')}`}
              </ToneBadge>
            ) : null}
            <span className={`${styles.livePill} ${playing ? styles.liveOn : ''}`}>
              <i />
              {playing ? t('_BESS_LIVE') : t('_BESS_PAUSED')}
            </span>
            <span className={styles.clock}>{state.clock}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPlaying(current => !current)}
              aria-label={playing ? t('_BESS_PAUSE_SIM') : t('_BESS_RESUME_SIM')}
            >
              {playing ? <Pause aria-hidden /> : <Play aria-hidden />}
            </Button>
          </div>
        }
      />

      <section className={dash.section} aria-labelledby="bess-live-heading">
        <h2 id="bess-live-heading" className={dash.sectionHeading}>
          {t('_BESS_SECTION_LIVE')}
        </h2>
        <p className={dash.sectionLead}>{t('_BESS_SECTION_LIVE_LEAD')}</p>
        <div className={dash.kpiGrid}>
          <KpiTile
            icon={<Sun aria-hidden />}
            label={t('_BESS_KPI_PV')}
            value={formatPower(state.pvKw)}
            unitNote={`${t('_BESS_OF')} ${(PLANT.acCapacityKw / 1000).toFixed(2)} MW AC`}
            badge={{ text: `${Math.round((state.pvKw / PLANT.acCapacityKw) * 100)} %`, kind: 'solar' }}
            progress={(state.pvKw / PLANT.acCapacityKw) * 100}
            tone="solar"
          />
          <KpiTile
            icon={<BatteryCharging aria-hidden />}
            label={t('_BESS_KPI_BATTERY')}
            value={formatPower(Math.abs(state.batteryKw))}
            unitNote={`${t('_BESS_OF')} ${(PLANT.storagePowerKw / 1000).toFixed(1)} MW`}
            badge={{
              text: charging ? t('_BESS_FLOW_CHARGE') : t('_BESS_FLOW_DISCHARGE'),
              kind: charging ? 'battery' : 'solar',
            }}
            progress={(Math.abs(state.batteryKw) / PLANT.storagePowerKw) * 100}
            tone="battery"
          />
          <KpiTile
            icon={<Activity aria-hidden />}
            label={t('_BESS_KPI_SOC')}
            value={`${state.totals.socPercent.toFixed(1)} %`}
            unitNote={`${(state.totals.storedKwh / 1000).toFixed(2)} / ${(PLANT.storageCapacityKwh / 1000).toFixed(0)} MWh`}
            progress={state.totals.socPercent}
            tone="battery"
          />
          <KpiTile
            icon={<Building2 aria-hidden />}
            label={t('_BESS_KPI_LOAD')}
            value={formatPower(siteKw)}
            unitNote={`${t('_BESS_SELF_SUFFICIENCY')} ${state.totals.selfSufficiency.toFixed(0)} %`}
            progress={state.totals.selfSufficiency}
            tone="load"
          />
          <KpiTile
            icon={<PlugZap aria-hidden />}
            label={t('_BESS_KPI_EV')}
            value={formatPower(state.evKw)}
            unitNote={`${state.totals.evActiveConnectors} / ${PLANT.connectorCount} ${t('_BESS_EV_CONNECTORS')}`}
            badge={{ text: `${state.totals.evSolarShare.toFixed(0)} % ${t('_BESS_EV_GREEN')}`, kind: 'ev' }}
            progress={state.totals.evUtilization}
            tone="ev"
          />
          <KpiTile
            icon={<Factory aria-hidden />}
            label={t('_BESS_KPI_GRID')}
            value={formatPower(Math.abs(state.gridKw))}
            unitNote={`${t('_BESS_OF')} ${gridLimit} kW ${exporting ? t('_BESS_FLOW_EXPORT') : t('_BESS_FLOW_IMPORT')}`}
            badge={{
              text: exporting ? t('_BESS_FLOW_EXPORT') : t('_BESS_FLOW_IMPORT'),
              kind: exporting ? 'export' : 'import',
            }}
            progress={(Math.abs(state.gridKw) / gridLimit) * 100}
            tone={exporting ? 'export' : 'import'}
          />
          <KpiTile
            icon={<ArrowDownToLine aria-hidden />}
            label={t('_BESS_KPI_IMPORT')}
            value={`${state.totals.importMwh.toFixed(2)} MWh`}
            unitNote={`${t('_BESS_PEAK')} ${state.totals.peakImportKw.toFixed(0)} / ${PLANT.importLimitKw} kW`}
            progress={(state.totals.peakImportKw / PLANT.importLimitKw) * 100}
            tone="import"
          />
          <KpiTile
            icon={<Zap aria-hidden />}
            label={t('_BESS_KPI_YIELD')}
            value={`${state.totals.pvYieldMwh.toFixed(1)} MWh`}
            unitNote={`↑ ${state.totals.exportMwh.toFixed(2)} MWh ${t('_BESS_FLOW_EXPORT')}`}
            badge={
              state.curtailedKw > 1
                ? { text: `${t('_BESS_CURTAILED')} ${formatKw(state.curtailedKw)}`, kind: 'warning' }
                : undefined
            }
          />
        </div>
      </section>

      <section className={dash.section} aria-labelledby="bess-site-heading">
        <h2 id="bess-site-heading" className={dash.sectionHeading}>
          {t('_BESS_SECTION_SITE')}
        </h2>
        <p className={dash.sectionLead}>{t('_BESS_SECTION_SITE_LEAD')}</p>
        <div className={styles.panelStack}>
          <Card>
            <CardHeader>
              <CardTitle>{t('_BESS_WX_TITLE')}</CardTitle>
              <CardDescription>{t('_BESS_WX_DESC')}</CardDescription>
            </CardHeader>
            <CardContent>
              <WeatherPanel weather={state.weather} forecast={state.forecast} pvPotentialKw={state.pvKw + state.curtailedKw} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('_BESS_FLOW_TITLE')}</CardTitle>
              <CardDescription>{t('_BESS_FLOW_DESC')}</CardDescription>
            </CardHeader>
            <CardContent>
              <EnergyFlowDiagram state={state} />
            </CardContent>
          </Card>
        </div>
      </section>

      <section className={dash.section} aria-labelledby="bess-storage-heading">
        <h2 id="bess-storage-heading" className={dash.sectionHeading}>
          {t('_BESS_SECTION_STORAGE')}
        </h2>
        <p className={dash.sectionLead}>{t('_BESS_SECTION_STORAGE_LEAD')}</p>
        <div className={styles.bankGrid}>
          {state.banks.map(bank => (
            <Card key={bank.spec.id}>
              <CardHeader>
                <CardTitle>{bank.spec.id}</CardTitle>
                <CardDescription>{`${(bank.spec.capacityKwh / 1000).toFixed(0)} MWh · ${(bank.spec.powerKw / 1000).toFixed(1)} MW · ${bank.spec.chemistry}`}</CardDescription>
                <CardAction>
                  <ToneBadge kind={bank.mode === 'charging' ? 'battery' : bank.mode === 'discharging' ? 'solar' : 'outline'}>
                    {t(`_BESS_MODE_${bank.mode.toUpperCase()}`)}
                  </ToneBadge>
                </CardAction>
              </CardHeader>
              <CardContent className={styles.bankBody}>
                <BessProgressRing value={bank.soc * 100} size={92} strokeWidth={7} tone="battery">
                  <b className={styles.ringValue}>{`${(bank.soc * 100).toFixed(0)}%`}</b>
                  <small className={styles.ringLabel}>SOC</small>
                </BessProgressRing>
                <dl className={styles.bankStats}>
                  <div>
                    <dt>{t('_BESS_POWER')}</dt>
                    <dd>{formatPower(Math.abs(bank.powerKw))}</dd>
                  </div>
                  <div>
                    <dt>{t('_BESS_AVAILABLE')}</dt>
                    <dd>{`${(bank.availableKwh / 1000).toFixed(2)} MWh`}</dd>
                  </div>
                  <div>
                    <dt>SOH</dt>
                    <dd>{`${bank.spec.soh.toFixed(1)} %`}</dd>
                  </div>
                  <div>
                    <dt>{t('_BESS_CYCLES')}</dt>
                    <dd>{bank.spec.cycles}</dd>
                  </div>
                  <div>
                    <dt>{t('_BESS_CELL_TEMP')}</dt>
                    <dd>{`${bank.cellTemp.toFixed(1)} °C`}</dd>
                  </div>
                  <div>
                    <dt>{t('_BESS_C_RATE')}</dt>
                    <dd>{`${(Math.abs(bank.powerKw) / bank.spec.capacityKwh).toFixed(2)} C`}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className={dash.section} aria-labelledby="bess-trends-heading">
        <h2 id="bess-trends-heading" className={dash.sectionHeading}>
          {t('_BESS_SECTION_TRENDS')}
        </h2>
        <p className={dash.sectionLead}>{t('_BESS_SECTION_TRENDS_LEAD')}</p>
        <div className={styles.panelStack}>
          <Card>
            <CardHeader>
              <CardTitle>{t('_BESS_CHART_TITLE')}</CardTitle>
              <CardDescription>{t('_BESS_CHART_DESC')}</CardDescription>
            </CardHeader>
            <CardContent>
              <PowerChart series={series} currentMinute={state.minute} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('_BESS_GRID_TITLE')}</CardTitle>
              <CardDescription>{t('_BESS_GRID_DESC')}</CardDescription>
              <CardAction>
                <ul className={styles.chartLegend}>
                  <li className={styles.legendImport}>
                    <i />
                    {t('_BESS_FLOW_IMPORT')}
                  </li>
                  <li className={styles.legendExport}>
                    <i />
                    {t('_BESS_FLOW_EXPORT')}
                  </li>
                </ul>
              </CardAction>
            </CardHeader>
            <CardContent className={styles.gridExchange}>
              <GridExchangeChart hours={hours} currentHour={Math.floor(state.minute / 60)} />
              <dl className={styles.gridStats}>
                <div>
                  <dt>{t('_BESS_GRID_IMPORT_TODAY')}</dt>
                  <dd className={styles.importValue}>{`${state.totals.importMwh.toFixed(2)} MWh`}</dd>
                  <small>{`${t('_BESS_PEAK')} ${state.totals.peakImportKw.toFixed(0)} kW · ${t('_BESS_OF')} ${PLANT.importLimitKw} kW`}</small>
                  <BessProgress value={(state.totals.peakImportKw / PLANT.importLimitKw) * 100} tone="import" size="sm" />
                </div>
                <div>
                  <dt>{t('_BESS_GRID_EXPORT_TODAY')}</dt>
                  <dd className={styles.exportValue}>{`${state.totals.exportMwh.toFixed(2)} MWh`}</dd>
                  <small>{`${t('_BESS_PEAK')} ${state.totals.peakExportKw.toFixed(0)} kW · ${t('_BESS_OF')} ${PLANT.exportLimitKw} kW`}</small>
                  <BessProgress value={(state.totals.peakExportKw / PLANT.exportLimitKw) * 100} tone="export" size="sm" />
                </div>
                <div>
                  <dt>{t('_BESS_GRID_NET')}</dt>
                  <dd>{`${(state.totals.exportMwh - state.totals.importMwh).toFixed(2)} MWh`}</dd>
                  <small>{`${t('_BESS_GRID_PEAK_HOUR_IN')} ${peakHourImport.toFixed(0)} kWh · ${t('_BESS_GRID_PEAK_HOUR_OUT')} ${peakHourExport.toFixed(0)} kWh`}</small>
                </div>
                <div>
                  <dt>{t('_BESS_GRID_SHAVED')}</dt>
                  <dd>{`${(state.totals.shavedMwh * 1000).toFixed(0)} kWh`}</dd>
                  <small>{t('_BESS_GRID_SHAVED_NOTE')}</small>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className={dash.section} aria-labelledby="bess-equipment-heading">
        <h2 id="bess-equipment-heading" className={dash.sectionHeading}>
          {t('_BESS_SECTION_EQUIPMENT')}
        </h2>
        <p className={dash.sectionLead}>{t('_BESS_SECTION_EQUIPMENT_LEAD')}</p>
        <Card>
          <CardContent className={styles.tabsContent}>
            <Tabs defaultValue="inverters">
              <TabsList className={dash.tabsList}>
                <TabsTrigger value="inverters">{t('_BESS_TAB_INVERTERS')}</TabsTrigger>
                <TabsTrigger value="strings">{t('_BESS_TAB_STRINGS')}</TabsTrigger>
                <TabsTrigger value="chargers">{t('_BESS_TAB_CHARGERS')}</TabsTrigger>
                <TabsTrigger value="alarms">{`${t('_BESS_TAB_ALARMS')} (${state.alarms.length})`}</TabsTrigger>
              </TabsList>

              <TabsContent value="inverters">
                <p className={styles.tabHint}>{t('_BESS_INV_DESC')}</p>
                <div className={styles.inverterGrid}>
                  {state.inverters.map(inverter => {
                    const loadPercent = (inverter.powerKw / inverter.spec.ratedKw) * 100;
                    return (
                      <button
                        key={inverter.spec.id}
                        type="button"
                        className={styles.inverterCard}
                        data-status={inverter.spec.status}
                        onClick={() => setStringDialogId(inverter.spec.id)}
                        aria-label={`${inverter.spec.id} · ${t('_BESS_STR_VIEW_DETAILS')}`}
                      >
                        <span className={styles.inverterHead}>
                          <span className={styles.inverterId}>{inverter.spec.id}</span>
                          <ToneBadge kind={STATUS_KIND[inverter.spec.status]}>
                            {t(`_BESS_STATUS_${inverter.spec.status.toUpperCase()}`)}
                          </ToneBadge>
                        </span>
                        <strong className={styles.inverterPower}>{formatKw(inverter.powerKw, 1)}</strong>
                        <BessProgress value={loadPercent} tone="solar" size="sm" />
                        <span className={styles.inverterMeta}>
                          <span>{`${inverter.spec.ratedKw} kW · ${inverter.spec.block}`}</span>
                          <span>{`η ${inverter.efficiency.toFixed(1)} %`}</span>
                        </span>
                        <span className={styles.inverterMeta}>
                          <span>{`${inverter.spec.strings} ${t('_BESS_STRINGS')}`}</span>
                          <span className={styles.temp}>
                            <Thermometer aria-hidden />
                            {`${inverter.temperature.toFixed(0)} °C`}
                          </span>
                        </span>
                        <span className={styles.stringBars}>
                          {inverter.strings.map(item => (
                            <i
                              key={item.id}
                              data-health={stringHealth(item.ratio)}
                              title={`${item.id} · ${(item.ratio * 100).toFixed(0)} %`}
                            />
                          ))}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="strings">
                <p className={styles.tabHint}>{t('_BESS_STR_DESC')}</p>
                <ul className={styles.healthLegend}>
                  <li data-health="good">{t('_BESS_STR_GOOD')}</li>
                  <li data-health="fair">{t('_BESS_STR_FAIR')}</li>
                  <li data-health="watch">{t('_BESS_STR_WATCH')}</li>
                  <li data-health="poor">{t('_BESS_STR_POOR')}</li>
                </ul>
                <div className={styles.matrixScroller}>
                  <div className={styles.matrix}>
                    {state.inverters.map(inverter => (
                      <div key={inverter.spec.id} className={styles.matrixRow}>
                        <span className={styles.matrixLabel}>{inverter.spec.id}</span>
                        {inverter.strings.map(item => (
                          <span key={item.id} className={styles.matrixCell} data-health={stringHealth(item.ratio)}>
                            <b>{`${(item.ratio * 100).toFixed(0)}%`}</b>
                            <small>{`${item.powerKw.toFixed(1)} kW`}</small>
                            <small>{`${item.current.toFixed(1)} A`}</small>
                          </span>
                        ))}
                        {Array.from({ length: 6 - inverter.strings.length }, (_, index) => (
                          <span key={`empty-${index}`} className={styles.matrixEmpty} aria-hidden />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="chargers">
                <p className={styles.tabHint}>{t('_BESS_EVSE_DESC')}</p>
                <div className={styles.chargerGrid}>
                  {state.chargers.map(charger => (
                    <div key={charger.spec.id} className={styles.chargerCard} data-status={charger.status}>
                      <div className={styles.chargerHead}>
                        <span className={styles.inverterId}>{charger.spec.id}</span>
                        <ToneBadge kind={CHARGER_KIND[charger.status]}>
                          {t(`_BESS_EVSE_${charger.status.toUpperCase()}`)}
                        </ToneBadge>
                      </div>
                      <div className={styles.chargerTop}>
                        <strong className={styles.inverterPower}>{formatKw(charger.powerKw)}</strong>
                        <span className={styles.chargerRated}>{`${t('_BESS_OF')} ${charger.spec.ratedKw} kW`}</span>
                      </div>
                      <BessProgress value={charger.utilization} tone="ev" size="sm" />
                      <div className={styles.inverterMeta}>
                        <span>{charger.spec.standard}</span>
                        <span>{`${charger.sessionsToday} ${t('_BESS_EV_SESSIONS')}`}</span>
                      </div>
                      <div className={styles.inverterMeta}>
                        <span>{`${charger.energyTodayKwh.toFixed(0)} kWh ${t('_BESS_TODAY')}`}</span>
                        <span>{`${t('_BESS_PEAK')} ${charger.peakKw.toFixed(0)} kW`}</span>
                      </div>
                      <ul className={styles.connectorList}>
                        {charger.connectors.map(connector => (
                          <li key={connector.index} className={styles.connector} data-status={connector.status}>
                            <span className={styles.connectorId}>{`#${connector.index}`}</span>
                            <span className={styles.connectorBody}>
                              <span className={styles.connectorTop}>
                                <b>{connector.vehicleKey ? t(connector.vehicleKey) : t(`_BESS_EVSE_${connector.status.toUpperCase()}`)}</b>
                                <em>{connector.status === 'charging' ? formatKw(connector.powerKw) : '—'}</em>
                              </span>
                              {connector.status === 'charging' ? (
                                <>
                                  <BessProgress value={(connector.progress || 0) * 100} tone="ev" size="xs" />
                                  <span className={styles.connectorMeta}>
                                    {`${((connector.progress || 0) * 100).toFixed(0)} % · ${(connector.deliveredKwh || 0).toFixed(0)} kWh · ${connector.remainingMin || 0} ${t('_BESS_EV_MIN_LEFT')}`}
                                  </span>
                                </>
                              ) : null}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="alarms">
                <p className={styles.tabHint}>{t('_BESS_ALARM_DESC')}</p>
                <div className={dash.tableScroll}>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('_BESS_ALARM_SEVERITY')}</TableHead>
                        <TableHead>{t('_BESS_ALARM_TIME')}</TableHead>
                        <TableHead>{t('_BESS_ALARM_SOURCE')}</TableHead>
                        <TableHead>{t('_BESS_ALARM_MESSAGE')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {state.alarms.map(alarm => (
                        <TableRow key={alarm.id}>
                          <TableCell>
                            <ToneBadge kind={SEVERITY_KIND[alarm.severity]}>
                              <SeverityIcon severity={alarm.severity} />
                              {t(`_BESS_SEV_${alarm.severity.toUpperCase()}`)}
                            </ToneBadge>
                          </TableCell>
                          <TableCell className={styles.mono}>{alarm.time}</TableCell>
                          <TableCell className={styles.mono}>{alarm.source}</TableCell>
                          <TableCell>{t(alarm.messageKey)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </section>

      <Dialog open={Boolean(stringDialogInverter)} onOpenChange={open => !open && setStringDialogId(null)}>
        <DialogContent onClose={() => setStringDialogId(null)}>
          <DialogHeader>
            <DialogTitle>{stringDialogInverter ? `${stringDialogInverter.spec.id} — ${t('_BESS_STR_DIALOG_SUFFIX')}` : ''}</DialogTitle>
            <DialogDescription>{t('_BESS_STR_DIALOG_DESC')}</DialogDescription>
          </DialogHeader>
          {stringDialogInverter ? (
            <>
              <div className={styles.stringDialogMeta}>
                <span>{`${stringDialogInverter.spec.ratedKw} kW · ${stringDialogInverter.spec.block}`}</span>
                <span>{`η ${stringDialogInverter.efficiency.toFixed(1)} %`}</span>
                <span>{`${stringDialogInverter.temperature.toFixed(0)} °C`}</span>
                <ToneBadge kind={STATUS_KIND[stringDialogInverter.spec.status]}>
                  {t(`_BESS_STATUS_${stringDialogInverter.spec.status.toUpperCase()}`)}
                </ToneBadge>
              </div>
              <div className={dash.tableScroll}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('_BESS_STR_COL_STRING')}</TableHead>
                      <TableHead>{t('_BESS_STR_COL_HEALTH')}</TableHead>
                      <TableHead>{t('_BESS_STR_COL_POWER')}</TableHead>
                      <TableHead>{t('_BESS_STR_COL_VOLTAGE')}</TableHead>
                      <TableHead>{t('_BESS_STR_COL_CURRENT')}</TableHead>
                      <TableHead>{t('_BESS_STR_COL_RATIO')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stringDialogInverter.strings.map(item => {
                      const health = stringHealth(item.ratio);
                      return (
                        <TableRow key={item.id}>
                          <TableCell className={styles.mono}>{item.id}</TableCell>
                          <TableCell>
                            <ToneBadge kind={HEALTH_KIND[health]}>{t(`_BESS_STR_BADGE_${health.toUpperCase()}`)}</ToneBadge>
                          </TableCell>
                          <TableCell className={styles.mono}>{`${item.powerKw.toFixed(2)} kW`}</TableCell>
                          <TableCell className={styles.mono}>{`${item.voltage.toFixed(0)} V`}</TableCell>
                          <TableCell className={styles.mono}>{`${item.current.toFixed(1)} A`}</TableCell>
                          <TableCell className={styles.mono}>{`${(item.ratio * 100).toFixed(0)} %`}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
};
