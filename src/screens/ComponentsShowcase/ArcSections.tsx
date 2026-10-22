import { useState } from 'react';
import { DollarSign, FileCode, Folder, LayoutGrid, List } from 'lucide-react';
import { ActivityHeatmap } from '../../components/ActivityHeatmap/ActivityHeatmap';
import { CopyButton } from '../../components/CopyButton/CopyButton';
import { Countdown } from '../../components/Countdown/Countdown';
import { ExpandableText } from '../../components/ExpandableText/ExpandableText';
import { Gauge } from '../../components/Gauge/Gauge';
import { HoldToConfirm } from '../../components/HoldToConfirm/HoldToConfirm';
import { ImageCompare } from '../../components/ImageCompare/ImageCompare';
import { InlineEdit } from '../../components/InlineEdit/InlineEdit';
import { Input } from '../../components/Input/Input';
import { JsonViewer } from '../../components/JsonViewer/JsonViewer';
import { MetricCard } from '../../components/MetricCard/MetricCard';
import { NumberField } from '../../components/NumberField/NumberField';
import { PasswordStrength } from '../../components/PasswordStrength/PasswordStrength';
import { SegmentedControl } from '../../components/SegmentedControl/SegmentedControl';
import { TextShimmer } from '../../components/TextShimmer/TextShimmer';
import { TimePicker } from '../../components/TimePicker/TimePicker';
import { TreeView, type TreeNode } from '../../components/TreeView/TreeView';
import { UsageMeter } from '../../components/UsageMeter/UsageMeter';
import { toDateKey } from '../../components/ActivityHeatmap/heatmapGrid';
import styles from './ComponentsShowcase.module.scss';

const PHOTO = 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80';

const FILE_TREE: TreeNode[] = [
  {
    id: 'src',
    label: 'src',
    icon: <Folder />,
    children: [
      {
        id: 'components',
        label: 'components',
        icon: <Folder />,
        children: [
          { id: 'button', label: 'Button.tsx', icon: <FileCode /> },
          { id: 'tree', label: 'TreeView.tsx', icon: <FileCode /> },
        ],
      },
      { id: 'main', label: 'main.tsx', icon: <FileCode /> },
    ],
  },
  { id: 'readme', label: 'README.md', icon: <FileCode /> },
];

const PAYLOAD = {
  id: 'evt_1Q2w3E',
  type: 'invoice.paid',
  livemode: false,
  amount: 4900,
  customer: { id: 'cus_42', email: 'ada@example.com', tags: ['pro', 'eu'] },
  lines: Array.from({ length: 8 }, (_, index) => ({ sku: `seat-${index + 1}`, quantity: 1 })),
  refunded: null,
};

const seededActivity = () => {
  const today = new Date();
  return Array.from({ length: 220 }, (_, index) => {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - index * 1.6);
    return { date: toDateKey(date), count: (index * 7919) % 11 };
  });
};

export const ArcSections = () => {
  const [view, setView] = useState('list');
  const [password, setPassword] = useState('Shacdn2026');
  const [seats, setSeats] = useState<number | null>(12);
  const [time, setTime] = useState<string | null>('09:30');
  const [deleted, setDeleted] = useState(0);
  const [activity] = useState(seededActivity);
  const [launch] = useState(() => Date.now() + 1000 * 60 * 60 * 26);

  return (
    <>
      <section id="activity-heatmap" className={styles.section}>
        <h2>Activity Heatmap</h2>
        <ActivityHeatmap data={activity} weeks={30} />
      </section>

      <section id="copy-button" className={styles.section}>
        <h2>Copy Button</h2>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <CopyButton value="npm run shacdn:install -- ../my-app" label="Copy command" />
          <CopyButton value="sk_live_51Hx…" aria-label="Copy API key" variant="ghost" />
        </div>
      </section>

      <section id="countdown" className={styles.section}>
        <h2>Countdown</h2>
        <Countdown target={launch} hideEmptyDays={false} />
      </section>

      <section id="expandable-text" className={styles.section}>
        <h2>Expandable Text</h2>
        <div style={{ maxWidth: 520 }}>
          <ExpandableText lines={2}>
            <p>
              shacdn keeps the shadcn/ui look while shipping plain SCSS modules: every component is a folder you copy,
              own and adapt. Tokens live in one file, themes switch with a data attribute, and every popup positions
              itself without Radix. This paragraph is deliberately long so it overflows two lines and shows the
              Read more control with a soft fade at the bottom edge.
            </p>
          </ExpandableText>
        </div>
      </section>

      <section id="gauge" className={styles.section}>
        <h2>Gauge</h2>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <Gauge value={42} label="CPU" format={v => `${v}%`} thresholds={[{ from: 70, tone: 'warning' }, { from: 90, tone: 'destructive' }]} />
          <Gauge value={93} label="Memory" format={v => `${v}%`} thresholds={[{ from: 70, tone: 'warning' }, { from: 90, tone: 'destructive' }]} />
        </div>
      </section>

      <section id="hold-to-confirm" className={styles.section}>
        <h2>Hold To Confirm</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <HoldToConfirm onConfirm={() => setDeleted(count => count + 1)} confirmedLabel="Deleted">
            Hold to delete project
          </HoldToConfirm>
          <span style={{ fontSize: '0.875rem', opacity: 0.7 }}>Deleted {deleted}×</span>
        </div>
      </section>

      <section id="image-compare" className={styles.section}>
        <h2>Image Compare</h2>
        <div style={{ maxWidth: 560 }}>
          <ImageCompare
            beforeSrc={`${PHOTO}&sat=-100`}
            afterSrc={PHOTO}
            beforeAlt="Mountain lake in black and white"
            afterAlt="Mountain lake in color"
            beforeLabel="Original"
            afterLabel="Graded"
          />
        </div>
      </section>

      <section id="inline-edit" className={styles.section}>
        <h2>Inline Edit</h2>
        <h3 style={{ margin: 0, fontSize: '1.25rem' }}>
          <InlineEdit aria-label="Project name" defaultValue="Apollo redesign" />
        </h3>
      </section>

      <section id="json-viewer" className={styles.section}>
        <h2>Json Viewer</h2>
        <JsonViewer data={PAYLOAD} pageSize={5} style={{ maxWidth: 560 }} />
      </section>

      <section id="metric-card" className={styles.section}>
        <h2>Metric Card</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(14rem, 1fr))', gap: '1rem' }}>
          <MetricCard label="Revenue" value="$48,200" delta={12.4} deltaLabel="vs last month" trend={[12, 18, 15, 22, 28, 26, 34]} icon={<DollarSign />} />
          <MetricCard label="p95 latency" value="182 ms" delta={-8.1} invertDelta deltaLabel="vs last week" trend={[260, 240, 230, 210, 205, 190, 182]} />
        </div>
      </section>

      <section id="number-field" className={styles.section}>
        <h2>Number Field</h2>
        <NumberField aria-label="Seats" value={seats} onValueChange={setSeats} min={1} max={250} />
      </section>

      <section id="password-strength" className={styles.section}>
        <h2>Password Strength</h2>
        <div style={{ display: 'grid', gap: '0.75rem', maxWidth: 320 }}>
          <Input type="password" aria-label="New password" value={password} onChange={event => setPassword(event.target.value)} />
          <PasswordStrength value={password} />
        </div>
      </section>

      <section id="segmented-control" className={styles.section}>
        <h2>Segmented Control</h2>
        <SegmentedControl
          aria-label="View"
          value={view}
          onValueChange={setView}
          options={[
            { value: 'list', label: 'List', icon: <List /> },
            { value: 'grid', label: 'Grid', icon: <LayoutGrid /> },
            { value: 'board', label: 'Board' },
          ]}
        />
      </section>

      <section id="text-shimmer" className={styles.section}>
        <h2>Text Shimmer</h2>
        <TextShimmer>Generating release notes…</TextShimmer>
      </section>

      <section id="time-picker" className={styles.section}>
        <h2>Time Picker</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <TimePicker aria-label="Meeting start" value={time} onValueChange={setTime} />
          <TimePicker aria-label="Alarm" hourCycle={12} defaultValue="18:45" minuteStep={5} />
          <span style={{ fontSize: '0.875rem', opacity: 0.7 }}>Value: {time ?? '—'}</span>
        </div>
      </section>

      <section id="tree-view" className={styles.section}>
        <h2>Tree View</h2>
        <TreeView aria-label="Project files" items={FILE_TREE} defaultExpanded={['src']} defaultSelected="main" style={{ maxWidth: 280 }} />
      </section>

      <section id="usage-meter" className={styles.section}>
        <h2>Usage Meter</h2>
        <div style={{ maxWidth: 420 }}>
          <UsageMeter
            label="Storage"
            limit={50}
            format={value => `${value} GB`}
            segments={[
              { label: 'Media', value: 21 },
              { label: 'Backups', value: 12 },
              { label: 'Docs', value: 7 },
            ]}
          />
        </div>
      </section>
    </>
  );
};
