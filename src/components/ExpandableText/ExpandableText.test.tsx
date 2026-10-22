import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ExpandableText } from './ExpandableText';

const stubScrollHeight = (height: number) =>
  vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(height);

describe('ExpandableText', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('hides the toggle when the text fits', () => {
    stubScrollHeight(20);
    render(<ExpandableText lines={3}>Short text.</ExpandableText>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('toggles between clamped and expanded when the text overflows', async () => {
    stubScrollHeight(400);
    const user = userEvent.setup();
    const onExpandedChange = vi.fn();
    render(
      <ExpandableText lines={2} onExpandedChange={onExpandedChange}>
        A long paragraph that overflows.
      </ExpandableText>
    );

    const toggle = screen.getByRole('button', { name: 'Read more' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');

    await user.click(toggle);
    expect(onExpandedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('button', { name: 'Show less' })).toHaveAttribute('aria-expanded', 'true');
  });
});
