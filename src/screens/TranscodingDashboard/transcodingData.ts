export type HealthStatus = 'healthy' | 'degraded' | 'offline';
export type WorkerStatus = 'active' | 'idle' | 'offline';
export type JobStatus = 'queued' | 'running' | 'completed' | 'failed';
export type PipelineStatus = 'idle' | 'running' | 'error';

export type LiveJob = {
  id: string;
  fileName: string;
  profileName: string;
  workerName: string | null;
  progress: number;
  status: JobStatus;
  etaLabel: string;
};

export type Worker = {
  id: string;
  name: string;
  host: string;
  kind: 'transcode' | 'packaging';
  status: WorkerStatus;
  jobId: string | null;
  progress: number;
  profileName: string | null;
};

export type Pipeline = {
  id: string;
  name: string;
  sourcePath: string;
  outputFormat: string;
  status: PipelineStatus;
  lastRunLabel: string;
};

export type VideoProfile = {
  id: string;
  name: string;
  resolution: string;
  codec: string;
  bitrate: string;
  frameRate: string;
};

export type AudioProfile = {
  id: string;
  name: string;
  codec: string;
  channels: string;
  sampleRate: string;
  bitrate: string;
};

/** Public connector metadata only — never store secrets here. */
export type S3Connector = {
  id: string;
  name: string;
  region: string;
  bucket: string;
  status: 'connected' | 'error';
};

export type DrmSettings = {
  provider: string;
  packaging: string;
  keyRotationHours: number;
  enabled: boolean;
};

export type TranscodingState = {
  clockLabel: string;
  tick: number;
  health: HealthStatus;
  activeJobs: number;
  completedToday: number;
  failedToday: number;
  queueDepth: number;
  throughputGbh: number;
  successRatePct: number;
  jobs: LiveJob[];
  workers: Worker[];
  pipelines: Pipeline[];
  videoProfiles: VideoProfile[];
  audioProfiles: AudioProfile[];
  ingestPath: string;
  connectors: S3Connector[];
  drm: DrmSettings;
};

const CLOCK_START_MINUTES = 9 * 60 + 14;

const formatClock = (tick: number): string => {
  const total = CLOCK_START_MINUTES + tick;
  const hours = Math.floor(total / 60) % 24;
  const minutes = total % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

const etaFromProgress = (progress: number): string => {
  if (progress >= 100) return 'done';
  const remaining = Math.max(1, Math.round((100 - progress) / 8));
  return `~${remaining} min`;
};

export const SECTION_IDS = [
  'overview',
  'live-progress',
  'pipelines',
  'workers',
  'upload',
  'video-profiles',
  'audio-profiles',
  'input-config',
  's3-connectors',
  'drm-settings',
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export const SECTION_LABELS: Record<SectionId, string> = {
  overview: 'Overview',
  'live-progress': 'Live progress',
  pipelines: 'Pipelines',
  workers: 'Workers',
  upload: 'Upload',
  'video-profiles': 'Video profiles',
  'audio-profiles': 'Audio profiles',
  'input-config': 'Input config',
  's3-connectors': 'S3 connectors',
  'drm-settings': 'DRM settings',
};

export const createInitialState = (): TranscodingState => ({
  clockLabel: formatClock(0),
  tick: 0,
  health: 'healthy',
  activeJobs: 3,
  completedToday: 41,
  failedToday: 1,
  queueDepth: 7,
  throughputGbh: 96,
  successRatePct: 97.4,
  jobs: [
    {
      id: 'job-2401',
      fileName: 'feature_reel_master.mov',
      profileName: 'HLS 1080p H.264',
      workerName: 'worker-01',
      progress: 42,
      status: 'running',
      etaLabel: '~7 min',
    },
    {
      id: 'job-2402',
      fileName: 'promo_cutdown_v3.mp4',
      profileName: 'HLS 720p HEVC',
      workerName: 'worker-02',
      progress: 68,
      status: 'running',
      etaLabel: '~3 min',
    },
    {
      id: 'job-2403',
      fileName: 'trailer_uhd_source.mxf',
      profileName: 'MP4 4K HEVC',
      workerName: 'worker-04',
      progress: 18,
      status: 'running',
      etaLabel: '~14 min',
    },
    {
      id: 'job-2404',
      fileName: 'episode_s02e04.mp4',
      profileName: 'HLS 1080p H.264',
      workerName: null,
      progress: 0,
      status: 'queued',
      etaLabel: 'queued',
    },
    {
      id: 'job-2405',
      fileName: 'sizzle_alt_audio.mov',
      profileName: 'AAC 5.1',
      workerName: null,
      progress: 0,
      status: 'queued',
      etaLabel: 'queued',
    },
  ],
  workers: [
    {
      id: 'w1',
      name: 'worker-01',
      host: '10.0.12.11',
      kind: 'transcode',
      status: 'active',
      jobId: 'job-2401',
      progress: 42,
      profileName: 'HLS 1080p H.264',
    },
    {
      id: 'w2',
      name: 'worker-02',
      host: '10.0.12.12',
      kind: 'transcode',
      status: 'active',
      jobId: 'job-2402',
      progress: 68,
      profileName: 'HLS 720p HEVC',
    },
    {
      id: 'w3',
      name: 'worker-03',
      host: '10.0.12.13',
      kind: 'transcode',
      status: 'idle',
      jobId: null,
      progress: 0,
      profileName: null,
    },
    {
      id: 'w4',
      name: 'worker-04',
      host: '10.0.12.14',
      kind: 'packaging',
      status: 'active',
      jobId: 'job-2403',
      progress: 18,
      profileName: 'MP4 4K HEVC',
    },
  ],
  pipelines: [
    {
      id: 'pipe-hls-main',
      name: 'pipeline-hls-main',
      sourcePath: '/ingest/features',
      outputFormat: 'HLS',
      status: 'running',
      lastRunLabel: '2 min ago',
    },
    {
      id: 'pipe-cmaf',
      name: 'pipeline-cmaf-abr',
      sourcePath: '/ingest/promos',
      outputFormat: 'CMAF',
      status: 'idle',
      lastRunLabel: '1 h ago',
    },
    {
      id: 'pipe-mp4',
      name: 'pipeline-mp4-mezz',
      sourcePath: '/ingest/mezzanine',
      outputFormat: 'MP4',
      status: 'idle',
      lastRunLabel: 'yesterday',
    },
  ],
  videoProfiles: [
    {
      id: 'vp1',
      name: 'HLS 1080p H.264',
      resolution: '1920×1080',
      codec: 'H.264',
      bitrate: '5 Mbps',
      frameRate: '25 fps',
    },
    {
      id: 'vp2',
      name: 'HLS 720p HEVC',
      resolution: '1280×720',
      codec: 'H.265',
      bitrate: '3 Mbps',
      frameRate: '25 fps',
    },
    {
      id: 'vp3',
      name: 'MP4 4K HEVC',
      resolution: '3840×2160',
      codec: 'H.265',
      bitrate: '12 Mbps',
      frameRate: '25 fps',
    },
    {
      id: 'vp4',
      name: 'HLS 480p H.264',
      resolution: '854×480',
      codec: 'H.264',
      bitrate: '1.5 Mbps',
      frameRate: '25 fps',
    },
  ],
  audioProfiles: [
    {
      id: 'ap1',
      name: 'AAC Stereo',
      codec: 'AAC',
      channels: '2.0',
      sampleRate: '48 kHz',
      bitrate: '192 kbps',
    },
    {
      id: 'ap2',
      name: 'AAC 5.1',
      codec: 'AAC',
      channels: '5.1',
      sampleRate: '48 kHz',
      bitrate: '384 kbps',
    },
    {
      id: 'ap3',
      name: 'AC-3 Broadcast',
      codec: 'AC-3',
      channels: '5.1',
      sampleRate: '48 kHz',
      bitrate: '448 kbps',
    },
  ],
  ingestPath: '/mnt/ingest/media',
  connectors: [
    {
      id: 'c1',
      name: 'connector-media-in',
      region: 'eu-central-1',
      bucket: 'media-ingest-prod',
      status: 'connected',
    },
    {
      id: 'c2',
      name: 'connector-delivery-out',
      region: 'eu-west-1',
      bucket: 'delivery-packaging',
      status: 'connected',
    },
    {
      id: 'c3',
      name: 'connector-archive',
      region: 'us-east-1',
      bucket: 'media-archive-cold',
      status: 'error',
    },
  ],
  drm: {
    provider: 'Widevine + FairPlay',
    packaging: 'CMAF + HLS',
    keyRotationHours: 24,
    enabled: true,
  },
});

const FORBIDDEN_BRAND_PATTERN = /sony|arcadian|\barc\b/i;
const FORBIDDEN_CREDENTIAL_KEYS = [
  'accessKey',
  'accessKeyId',
  'secretKey',
  'secretAccessKey',
  'secret',
  'password',
  'endpoint',
  'credentials',
] as const;

export const containsForbiddenBrand = (value: string): boolean => FORBIDDEN_BRAND_PATTERN.test(value);

export const assertNoCredentialFields = (connector: S3Connector): void => {
  const keys = Object.keys(connector);
  for (const forbidden of FORBIDDEN_CREDENTIAL_KEYS) {
    if (keys.includes(forbidden)) {
      throw new Error(`S3 connector must not expose credential field: ${forbidden}`);
    }
  }
};

const pickQueuedJob = (jobs: LiveJob[]): LiveJob | undefined =>
  jobs.find(job => job.status === 'queued');

export const tickState = (state: TranscodingState): TranscodingState => {
  const nextTick = state.tick + 1;
  let completedDelta = 0;
  const failedDelta = 0;

  let jobs = state.jobs.map(job => {
    if (job.status !== 'running') return job;
    const bump = job.id === 'job-2403' ? 4 : 7;
    const progress = Math.min(100, job.progress + bump);
    if (progress >= 100) {
      completedDelta += 1;
      return {
        ...job,
        progress: 100,
        status: 'completed' as const,
        etaLabel: 'done',
        workerName: job.workerName,
      };
    }
    return {
      ...job,
      progress,
      etaLabel: etaFromProgress(progress),
    };
  });

  let workers = state.workers.map(worker => {
    if (worker.status !== 'active' || !worker.jobId) return worker;
    const job = jobs.find(item => item.id === worker.jobId);
    if (!job || job.status === 'completed') {
      return {
        ...worker,
        status: 'idle' as const,
        jobId: null,
        progress: 0,
        profileName: null,
      };
    }
    return { ...worker, progress: job.progress };
  });

  // Assign queued jobs to idle workers
  workers = workers.map(worker => {
    if (worker.status !== 'idle') return worker;
    const queued = pickQueuedJob(jobs);
    if (!queued) return worker;
    jobs = jobs.map(job =>
      job.id === queued.id
        ? {
            ...job,
            status: 'running' as const,
            workerName: worker.name,
            progress: 3,
            etaLabel: etaFromProgress(3),
          }
        : job,
    );
    return {
      ...worker,
      status: 'active' as const,
      jobId: queued.id,
      progress: 3,
      profileName: queued.profileName,
    };
  });

  // Occasionally surface a brief degraded health blip
  const health: HealthStatus =
    nextTick % 17 === 0 ? 'degraded' : state.failedToday + failedDelta > 2 ? 'degraded' : 'healthy';

  const runningCount = jobs.filter(job => job.status === 'running').length;
  const queuedCount = jobs.filter(job => job.status === 'queued').length;

  const pipelines = state.pipelines.map(pipeline => {
    if (pipeline.id === 'pipe-hls-main') {
      return {
        ...pipeline,
        status: runningCount > 0 ? ('running' as const) : ('idle' as const),
        lastRunLabel: runningCount > 0 ? 'just now' : pipeline.lastRunLabel,
      };
    }
    return pipeline;
  });

  const throughputGbh = Math.max(40, Math.min(140, state.throughputGbh + ((nextTick % 5) - 2) * 1.5));
  const successRatePct = Math.max(
    90,
    Math.min(99.9, state.successRatePct + (completedDelta > 0 ? 0.05 : -0.01)),
  );

  return {
    ...state,
    tick: nextTick,
    clockLabel: formatClock(nextTick),
    health,
    activeJobs: runningCount,
    completedToday: state.completedToday + completedDelta,
    failedToday: state.failedToday + failedDelta,
    queueDepth: queuedCount,
    throughputGbh: Number(throughputGbh.toFixed(1)),
    successRatePct: Number(successRatePct.toFixed(1)),
    jobs,
    workers,
    pipelines,
  };
};

export const runPipelineLocally = (state: TranscodingState, pipelineId: string): TranscodingState => {
  const pipelines = state.pipelines.map(pipeline =>
    pipeline.id === pipelineId
      ? { ...pipeline, status: 'running' as const, lastRunLabel: 'just now' }
      : pipeline,
  );

  const idleWorker = state.workers.find(worker => worker.status === 'idle');
  if (!idleWorker) {
    return { ...state, pipelines, queueDepth: state.queueDepth + 1 };
  }

  const newJob: LiveJob = {
    id: `job-${2400 + state.tick + 10}`,
    fileName: `batch_${pipelineId.replace('pipe-', '')}.mp4`,
    profileName: 'HLS 1080p H.264',
    workerName: idleWorker.name,
    progress: 5,
    status: 'running',
    etaLabel: etaFromProgress(5),
  };

  const workers = state.workers.map(worker =>
    worker.id === idleWorker.id
      ? {
          ...worker,
          status: 'active' as const,
          jobId: newJob.id,
          progress: 5,
          profileName: newJob.profileName,
        }
      : worker,
  );

  return {
    ...state,
    pipelines,
    workers,
    jobs: [newJob, ...state.jobs],
    activeJobs: state.activeJobs + 1,
  };
};
