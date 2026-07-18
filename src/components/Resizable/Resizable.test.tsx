import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './Resizable';

describe('Resizable', () => {
  it('sizes panels with flex-grow so fixed handles cannot overflow the group', () => {
    const { container } = render(
      <div style={{ height: 220, width: 480 }}>
        <ResizablePanelGroup orientation="vertical">
          <ResizablePanel defaultSize="50%">Top</ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize="50%">Bottom</ResizablePanel>
        </ResizablePanelGroup>
      </div>,
    );

    const panels = container.querySelectorAll('[class*="panel"]');
    // Outer panel nodes only (exclude panelInner)
    const sizedPanels = [...panels].filter((el) => el.parentElement?.hasAttribute('data-orientation'));
    expect(sizedPanels).toHaveLength(2);
    expect(sizedPanels[0]).toHaveStyle({ flex: '50 1 0px' });
    expect(sizedPanels[1]).toHaveStyle({ flex: '50 1 0px' });
    expect(screen.getByRole('button', { name: 'Resize panel' })).toBeInTheDocument();
  });

  it('keeps nested groups without stacking percentage overflow', () => {
    const { container } = render(
      <div style={{ height: 320, width: 640 }}>
        <ResizablePanelGroup orientation="horizontal">
          <ResizablePanel defaultSize="60%">
            <ResizablePanelGroup orientation="vertical">
              <ResizablePanel defaultSize="50%">A</ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize="50%">B</ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize="40%">C</ResizablePanel>
        </ResizablePanelGroup>
      </div>,
    );

    const groups = container.querySelectorAll('[data-orientation]');
    expect(groups).toHaveLength(2);

    const outerPanels = [...groups[0]!.children].filter((el) => el.tagName === 'DIV');
    expect(outerPanels[0]).toHaveStyle({ flex: '60 1 0px' });
    expect(outerPanels[1]).toHaveStyle({ flex: '40 1 0px' });
  });
});
