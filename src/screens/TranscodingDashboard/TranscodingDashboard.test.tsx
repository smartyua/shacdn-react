import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { useStubbedLayout } from '../../test/layout';
import { TranscodingDashboard } from './TranscodingDashboard';
import {
  assertNoCredentialFields,
  containsForbiddenBrand,
  createInitialState,
} from './transcodingData';

describe('TranscodingDashboard', () => {
  useStubbedLayout();

  it('renders the page title and labelled sections', () => {
    render(<TranscodingDashboard />);

    expect(screen.getByRole('heading', { level: 1, name: 'Transcoding dashboard' })).toBeVisible();

    for (const name of [
      'Overview',
      'Live progress',
      'Pipelines',
      'Workers',
      'Upload',
      'Video profiles',
      'Audio profiles',
      'Input config',
      'S3 connectors',
      'DRM settings',
    ]) {
      expect(screen.getByRole('region', { name })).toBeInTheDocument();
    }
  });

  it('pauses and resumes the simulation from the header control', async () => {
    const user = userEvent.setup();
    render(<TranscodingDashboard />);

    await user.click(screen.getByRole('button', { name: 'Pause simulation' }));
    expect(screen.getByRole('button', { name: 'Resume simulation' })).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Resume simulation' }));
    expect(screen.getByRole('button', { name: 'Pause simulation' })).toBeVisible();
  });

  it('keeps S3 connectors free of credential fields and brand strings', () => {
    const state = createInitialState();
    for (const connector of state.connectors) {
      assertNoCredentialFields(connector);
      expect(containsForbiddenBrand(connector.name)).toBe(false);
      expect(containsForbiddenBrand(connector.bucket)).toBe(false);
    }

    render(<TranscodingDashboard />);
    const section = screen.getByRole('region', { name: 'S3 connectors' });
    expect(within(section).queryByLabelText(/access key|secret|password/i)).toBeNull();
    expect(within(section).queryByRole('textbox')).toBeNull();
    expect(document.body.textContent).not.toMatch(/sony|arcadian/i);
  });

  it('queues a job from the upload form', async () => {
    const user = userEvent.setup();
    render(<TranscodingDashboard />);

    const source = screen.getByLabelText('Source file');
    await user.clear(source);
    await user.type(source, 'demo_upload.mp4');
    await user.click(screen.getByRole('button', { name: /Submit job/i }));

    expect(screen.getByText('Queued in the local simulator')).toBeVisible();
    expect(screen.getByText('demo_upload.mp4')).toBeVisible();
  });
});
