import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  Activity,
  Cloud,
  Cpu,
  Film,
  HardDrive,
  Pause,
  Play,
  Radio,
  Shield,
  Upload,
  Workflow,
} from 'lucide-react';

import { Badge } from '../../components/Badge/Badge';
import { Button } from '../../components/Button/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/Card/Card';
import { Input } from '../../components/Input/Input';
import { Progress } from '../../components/Progress/Progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/Select/Select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/Table/Table';
import { PageHeader } from '../Dashboard/components/PageHeader';
import {
  SECTION_IDS,
  SECTION_LABELS,
  createInitialState,
  runPipelineLocally,
  tickState,
  type HealthStatus,
  type JobStatus,
  type PipelineStatus,
  type WorkerStatus,
} from './transcodingData';
import styles from './TranscodingDashboard.module.scss';

const TICK_MS = 2000;

const healthBadge = (health: HealthStatus): { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' } => {
  if (health === 'healthy') return { label: 'Healthy', variant: 'secondary' };
  if (health === 'degraded') return { label: 'Degraded', variant: 'outline' };
  return { label: 'Offline', variant: 'destructive' };
};

const jobBadge = (status: JobStatus): { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' } => {
  if (status === 'running') return { label: 'Running', variant: 'default' };
  if (status === 'queued') return { label: 'Queued', variant: 'outline' };
  if (status === 'completed') return { label: 'Completed', variant: 'secondary' };
  return { label: 'Failed', variant: 'destructive' };
};

const workerBadge = (status: WorkerStatus): { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' } => {
  if (status === 'active') return { label: 'Busy', variant: 'default' };
  if (status === 'idle') return { label: 'Idle', variant: 'secondary' };
  return { label: 'Offline', variant: 'destructive' };
};

const pipelineBadge = (status: PipelineStatus): { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' } => {
  if (status === 'running') return { label: 'Running', variant: 'default' };
  if (status === 'error') return { label: 'Error', variant: 'destructive' };
  return { label: 'Idle', variant: 'outline' };
};

type KpiProps = {
  icon: ReactNode;
  label: string;
  value: string;
  note: string;
  badge?: { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' };
};

const KpiTile = ({ icon, label, value, note, badge }: KpiProps) => (
  <article className={styles.kpiTile}>
    <div className={styles.kpiHeader}>
      <span className={styles.kpiLabel}>
        {icon}
        <span>{label}</span>
      </span>
      {badge ? <Badge variant={badge.variant}>{badge.label}</Badge> : null}
    </div>
    <strong className={styles.kpiValue}>{value}</strong>
    <span className={styles.kpiNote}>{note}</span>
  </article>
);

export const TranscodingDashboard = () => {
  const [state, setState] = useState(createInitialState);
  const [playing, setPlaying] = useState(true);
  const [uploadName, setUploadName] = useState('feature_reel_master.mov');
  const [uploadProfile, setUploadProfile] = useState(state.videoProfiles[0]?.id ?? '');
  const [ingestPath, setIngestPath] = useState(state.ingestPath);
  const [submittedNote, setSubmittedNote] = useState<string | null>(null);

  useEffect(() => {
    if (!playing) return undefined;
    const id = window.setInterval(() => {
      setState(current => tickState(current));
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [playing]);

  const health = useMemo(() => healthBadge(state.health), [state.health]);

  return (
    <div className={styles.page}>
      <PageHeader
        title="Transcoding dashboard"
        lead="Cumulative demo of pipeline operations and configuration — overview, live queue, workers, profiles, ingest and DRM — simulated locally with no backend."
        meta={`${state.activeJobs} active · ${state.queueDepth} queued · ${state.completedToday} completed today`}
        actions={
          <div className={styles.headerStatus}>
            <Badge variant={health.variant}>{health.label}</Badge>
            <span className={`${styles.livePill} ${playing ? styles.liveOn : ''}`}>
              <i />
              {playing ? 'Live' : 'Paused'}
            </span>
            <span className={styles.clock}>{state.clockLabel}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPlaying(current => !current)}
              aria-label={playing ? 'Pause simulation' : 'Resume simulation'}
            >
              {playing ? <Pause aria-hidden /> : <Play aria-hidden />}
            </Button>
          </div>
        }
      />

      <nav className={styles.anchorNav} aria-label="Dashboard sections">
        {SECTION_IDS.map(id => (
          <a key={id} className={styles.anchorLink} href={`#${id}`}>
            {SECTION_LABELS[id]}
          </a>
        ))}
      </nav>

      <section className={styles.section} id="overview" aria-labelledby="overview-heading">
        <h2 id="overview-heading" className={styles.sectionHeading}>
          Overview
        </h2>
        <p className={styles.sectionLead}>
          Cluster health and throughput for the simulated transcoding fleet.
        </p>
        <div className={styles.kpiGrid}>
          <KpiTile
            icon={<Activity aria-hidden />}
            label="Health"
            value={health.label}
            note="API + worker heartbeat"
            badge={health}
          />
          <KpiTile
            icon={<Radio aria-hidden />}
            label="Active jobs"
            value={String(state.activeJobs)}
            note={`${state.queueDepth} waiting in queue`}
          />
          <KpiTile
            icon={<Workflow aria-hidden />}
            label="Completed today"
            value={String(state.completedToday)}
            note={`${state.failedToday} failed`}
          />
          <KpiTile
            icon={<HardDrive aria-hidden />}
            label="Throughput"
            value={`${state.throughputGbh}`}
            note="GB/h processed"
          />
          <KpiTile
            icon={<Cpu aria-hidden />}
            label="Success rate"
            value={`${state.successRatePct}%`}
            note="Rolling 24h"
          />
        </div>
      </section>

      <section className={styles.section} id="live-progress" aria-labelledby="live-progress-heading">
        <h2 id="live-progress-heading" className={styles.sectionHeading}>
          Live progress
        </h2>
        <p className={styles.sectionLead}>
          Queue and in-flight jobs. Progress advances while the simulation is running.
        </p>
        <div className={styles.jobList}>
          {state.jobs.map(job => {
            const badge = jobBadge(job.status);
            return (
              <div key={job.id} className={styles.jobRow}>
                <div className={styles.jobMain}>
                  <p className={styles.jobTitle}>{job.fileName}</p>
                  <p className={styles.jobMeta}>
                    {job.id} · {job.profileName}
                    {job.workerName ? ` · ${job.workerName}` : ''}
                  </p>
                </div>
                <div className={styles.progressBlock}>
                  <Progress value={job.progress} aria-label={`${job.fileName} progress`} />
                  <div className={styles.progressMeta}>
                    <span>{job.progress}%</span>
                    <span>{job.etaLabel}</span>
                  </div>
                </div>
                <Badge variant={badge.variant}>{badge.label}</Badge>
                <span className={styles.mutedRow}>{job.workerName ?? 'unassigned'}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className={styles.section} id="pipelines" aria-labelledby="pipelines-heading">
        <h2 id="pipelines-heading" className={styles.sectionHeading}>
          Pipelines
        </h2>
        <p className={styles.sectionLead}>
          Saved pipelines. Run starts a local mock job when a worker is idle.
        </p>
        <div className={styles.cardGrid}>
          {state.pipelines.map(pipeline => {
            const badge = pipelineBadge(pipeline.status);
            return (
              <Card key={pipeline.id}>
                <CardHeader>
                  <CardTitle>{pipeline.name}</CardTitle>
                  <CardDescription>
                    {pipeline.sourcePath} → {pipeline.outputFormat}
                  </CardDescription>
                </CardHeader>
                <CardContent className={styles.mutedRow}>Last run: {pipeline.lastRunLabel}</CardContent>
                <CardFooter className={styles.pipelineActions}>
                  <Badge variant={badge.variant}>{badge.label}</Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setState(current => runPipelineLocally(current, pipeline.id))}
                  >
                    Run
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </section>

      <section className={styles.section} id="workers" aria-labelledby="workers-heading">
        <h2 id="workers-heading" className={styles.sectionHeading}>
          Workers
        </h2>
        <p className={styles.sectionLead}>
          Connected encode and packaging workers. Busy nodes track the assigned job progress.
        </p>
        <div className={styles.cardGrid}>
          {state.workers.map(worker => {
            const badge = workerBadge(worker.status);
            return (
              <Card key={worker.id} className={styles.workerCard}>
                <CardHeader>
                  <div className={styles.workerTop}>
                    <div>
                      <p className={styles.workerName}>{worker.name}</p>
                      <p className={styles.workerHost}>
                        {worker.host} · {worker.kind}
                      </p>
                    </div>
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {worker.status === 'active' ? (
                    <div className={styles.progressBlock}>
                      <p className={styles.jobMeta}>{worker.profileName ?? 'Processing…'}</p>
                      <Progress value={worker.progress} aria-label={`${worker.name} progress`} />
                      <div className={styles.progressMeta}>
                        <span>{worker.progress}%</span>
                        <span>{worker.jobId}</span>
                      </div>
                    </div>
                  ) : (
                    <p className={styles.mutedRow}>Waiting for the next job</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className={styles.section} id="upload" aria-labelledby="upload-heading">
        <h2 id="upload-heading" className={styles.sectionHeading}>
          Upload
        </h2>
        <p className={styles.sectionLead}>
          Demo submit form. No files leave the browser; a queue entry is created in the simulator.
        </p>
        <Card>
          <CardContent>
            <div className={`${styles.formGrid} ${styles.cardBodyPad}`}>
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="upload-file-name">
                  Source file
                </label>
                <Input
                  id="upload-file-name"
                  value={uploadName}
                  onChange={event => setUploadName(event.target.value)}
                />
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel} id="upload-profile-label">
                  Video profile
                </span>
                <Select value={uploadProfile} onValueChange={setUploadProfile}>
                  <SelectTrigger aria-labelledby="upload-profile-label">
                    <SelectValue placeholder="Select profile" />
                  </SelectTrigger>
                  <SelectContent>
                    {state.videoProfiles.map(profile => (
                      <SelectItem key={profile.id} value={profile.id}>
                        {profile.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className={styles.pipelineActions}>
            <Button
              onClick={() => {
                const profile =
                  state.videoProfiles.find(item => item.id === uploadProfile)?.name ??
                  'HLS 1080p H.264';
                setState(current => {
                  const idle = current.workers.find(worker => worker.status === 'idle');
                  const id = `job-up-${current.tick + 1}`;
                  if (!idle) {
                    return {
                      ...current,
                      queueDepth: current.queueDepth + 1,
                      jobs: [
                        {
                          id,
                          fileName: uploadName || 'untitled.mp4',
                          profileName: profile,
                          workerName: null,
                          progress: 0,
                          status: 'queued',
                          etaLabel: 'queued',
                        },
                        ...current.jobs,
                      ],
                    };
                  }
                  return {
                    ...current,
                    activeJobs: current.activeJobs + 1,
                    workers: current.workers.map(worker =>
                      worker.id === idle.id
                        ? {
                            ...worker,
                            status: 'active' as const,
                            jobId: id,
                            progress: 4,
                            profileName: profile,
                          }
                        : worker,
                    ),
                    jobs: [
                      {
                        id,
                        fileName: uploadName || 'untitled.mp4',
                        profileName: profile,
                        workerName: idle.name,
                        progress: 4,
                        status: 'running',
                        etaLabel: '~12 min',
                      },
                      ...current.jobs,
                    ],
                  };
                });
                setSubmittedNote('Queued in the local simulator');
              }}
            >
              <Upload aria-hidden />
              Submit job
            </Button>
            {submittedNote ? <span className={styles.hint}>{submittedNote}</span> : null}
          </CardFooter>
        </Card>
      </section>

      <section className={styles.section} id="video-profiles" aria-labelledby="video-profiles-heading">
        <h2 id="video-profiles-heading" className={styles.sectionHeading}>
          Video profiles
        </h2>
        <p className={styles.sectionLead}>Encode ladders used by pipelines and manual uploads.</p>
        <div className={styles.tableWrap}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Resolution</TableHead>
                <TableHead>Codec</TableHead>
                <TableHead>Bitrate</TableHead>
                <TableHead>Frame rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.videoProfiles.map(profile => (
                <TableRow key={profile.id}>
                  <TableCell>{profile.name}</TableCell>
                  <TableCell>{profile.resolution}</TableCell>
                  <TableCell>{profile.codec}</TableCell>
                  <TableCell>{profile.bitrate}</TableCell>
                  <TableCell>{profile.frameRate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section className={styles.section} id="audio-profiles" aria-labelledby="audio-profiles-heading">
        <h2 id="audio-profiles-heading" className={styles.sectionHeading}>
          Audio profiles
        </h2>
        <p className={styles.sectionLead}>Audio encode presets for stereo and surround delivery.</p>
        <div className={styles.tableWrap}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Codec</TableHead>
                <TableHead>Channels</TableHead>
                <TableHead>Sample rate</TableHead>
                <TableHead>Bitrate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.audioProfiles.map(profile => (
                <TableRow key={profile.id}>
                  <TableCell>{profile.name}</TableCell>
                  <TableCell>{profile.codec}</TableCell>
                  <TableCell>{profile.channels}</TableCell>
                  <TableCell>{profile.sampleRate}</TableCell>
                  <TableCell>{profile.bitrate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section className={styles.section} id="input-config" aria-labelledby="input-config-heading">
        <h2 id="input-config-heading" className={styles.sectionHeading}>
          Input config
        </h2>
        <p className={styles.sectionLead}>Local ingest root watched by the pipeline for new media.</p>
        <Card>
          <CardContent>
            <div className={`${styles.formGrid} ${styles.cardBodyPad}`}>
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="ingest-path">
                  Ingest path
                </label>
                <Input
                  id="ingest-path"
                  value={ingestPath}
                  onChange={event => setIngestPath(event.target.value)}
                />
                <p className={styles.hint}>Demo only — path is not persisted.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className={styles.section} id="s3-connectors" aria-labelledby="s3-connectors-heading">
        <h2 id="s3-connectors-heading" className={styles.sectionHeading}>
          S3 connectors
        </h2>
        <p className={styles.sectionLead}>
          Public connector metadata only — name, region and bucket. No access keys or secrets.
        </p>
        <div className={styles.cardGrid}>
          {state.connectors.map(connector => (
            <Card key={connector.id}>
              <CardHeader>
                <div className={styles.workerTop}>
                  <div>
                    <CardTitle>{connector.name}</CardTitle>
                    <CardDescription>
                      {connector.region} · {connector.bucket}
                    </CardDescription>
                  </div>
                  <Badge variant={connector.status === 'connected' ? 'secondary' : 'destructive'}>
                    {connector.status === 'connected' ? 'Connected' : 'Error'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className={`${styles.hint} ${styles.inlineIconHint}`}>
                  <Cloud aria-hidden /> Credentials are never shown in this demo.
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className={styles.section} id="drm-settings" aria-labelledby="drm-settings-heading">
        <h2 id="drm-settings-heading" className={styles.sectionHeading}>
          DRM settings
        </h2>
        <p className={styles.sectionLead}>Neutral packaging and key-rotation options for protected outputs.</p>
        <Card>
          <CardHeader>
            <CardTitle className={styles.inlineIconHint}>
              <Shield aria-hidden /> Content protection
            </CardTitle>
            <CardDescription>
              {state.drm.enabled ? 'Enabled' : 'Disabled'} · rotation every {state.drm.keyRotationHours}h
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Provider</span>
                <Input value={state.drm.provider} readOnly aria-label="DRM provider" />
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Packaging</span>
                <Input value={state.drm.packaging} readOnly aria-label="DRM packaging" />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <p className={`${styles.hint} ${styles.inlineIconHint}`}>
        <Film aria-hidden /> Demonstration UI composed from shacdn primitives. Not connected to a live cluster.
      </p>
    </div>
  );
};
