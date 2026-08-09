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

  it.each(STANDALONE)('renders %s without serious a11y violations', async (_name, renderComponent) => {
    const { container } = render(renderComponent());
    const results = await axe(container);

    expect(
      results.violations.filter(v => v.impact === 'serious' || v.impact === 'critical')
    ).toEqual([]);
  });
});
