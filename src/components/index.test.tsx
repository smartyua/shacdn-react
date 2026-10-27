import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import * as library from './index';

/**
 * Broad guard rails rather than per-component assertions: every export must be a usable
 * React binding, and the primitives that render standalone must survive a mount and an
 * axe pass. Components needing props, providers or children are asserted structurally.
 */

const isComponentLike = (value: unknown): boolean =>
  typeof value === 'function' ||
  (typeof value === 'object' && value !== null && '$$typeof' in value);

/** Primitives that render meaningfully with no required props, providers or children. */
const STANDALONE: Array<[string, () => React.ReactElement]> = [
  ['Badge', () => <library.Badge>New</library.Badge>],
  ['Button', () => <library.Button>Save</library.Button>],
  ['Card', () => <library.Card>Body</library.Card>],
  ['Checkbox', () => <library.Checkbox aria-label="Accept" />],
  ['Input', () => <library.Input aria-label="Name" />],
  ['Label', () => <library.Label htmlFor="x">Name</library.Label>],
  ['Progress', () => <library.Progress value={40} aria-label="Upload progress" />],
  ['Separator', () => <library.Separator />],
  ['Skeleton', () => <library.Skeleton />],
  ['Spinner', () => <library.Spinner />],
  ['Switch', () => <library.Switch aria-label="Wifi" />],
  ['Textarea', () => <library.Textarea aria-label="Bio" />],
  ['Toggle', () => <library.Toggle aria-label="Bold">B</library.Toggle>],
  [
    'NativeSelect',
    () => (
      <library.NativeSelect aria-label="Fruit">
        <option value="apple">Apple</option>
      </library.NativeSelect>
    ),
  ],
];

/** Arc parity components rendered with the minimum props they need. */
const WITH_PROPS: Array<[string, () => React.ReactElement]> = [
  ['CopyButton', () => <library.CopyButton value="npm i" label="Copy" />],
  ['HoldToConfirm', () => <library.HoldToConfirm onConfirm={() => undefined}>Delete</library.HoldToConfirm>],
  ['PasswordStrength', () => <library.PasswordStrength value="Abc123!" />],
  ['InlineEdit', () => <library.InlineEdit aria-label="Name" defaultValue="Apollo" />],
  ['NumberField', () => <library.NumberField aria-label="Seats" defaultValue={3} />],
  [
    'SegmentedControl',
    () => (
      <library.SegmentedControl
        aria-label="View"
        options={[
          { value: 'list', label: 'List' },
          { value: 'grid', label: 'Grid' },
        ]}
      />
    ),
  ],
  ['TimePicker', () => <library.TimePicker aria-label="Start time" defaultValue="09:30" />],
  ['UsageMeter', () => <library.UsageMeter label="Storage" limit={10} segments={[{ label: 'Files', value: 4 }]} />],
  ['MetricCard', () => <library.MetricCard label="Revenue" value="$1,200" delta={4} />],
  ['Gauge', () => <library.Gauge value={40} label="CPU" />],
  ['TreeView', () => <library.TreeView aria-label="Files" items={[{ id: 'a', label: 'a.ts' }]} />],
  ['JsonViewer', () => <library.JsonViewer data={{ ok: true }} />],
  [
    'ImageCompare',
    () => <library.ImageCompare beforeSrc="a.jpg" afterSrc="b.jpg" beforeAlt="Before" afterAlt="After" />,
  ],
  ['ActivityHeatmap', () => <library.ActivityHeatmap data={[]} weeks={4} endDate={new Date(2026, 0, 1)} />],
  [
    'ScheduleCalendar',
    () => (
      <library.ScheduleCalendar
        defaultDate="2026-11-10"
        events={[{ id: 'a', title: 'Sync', date: '2026-11-10', start: 540, end: 600 }]}
      />
    ),
  ],
];

describe('components barrel', () => {
  it('exports only React-usable bindings', () => {
    const invalid = Object.entries(library)
      .filter(([, value]) => !isComponentLike(value))
      .map(([name]) => name);

    expect(invalid).toEqual([]);
  });

  it('exports a substantial public surface', () => {
    expect(Object.keys(library).length).toBeGreaterThan(200);
  });

  it.each(STANDALONE)('renders %s without crashing', (_name, renderComponent) => {
    const { container } = render(renderComponent());

    expect(container).not.toBeEmptyDOMElement();
  });

  it.each([...STANDALONE, ...WITH_PROPS])('renders %s without serious a11y violations', async (_name, renderComponent) => {
    const { container } = render(renderComponent());
    const results = await axe(container);

    expect(
      results.violations.filter(v => v.impact === 'serious' || v.impact === 'critical')
    ).toEqual([]);
  });
});
