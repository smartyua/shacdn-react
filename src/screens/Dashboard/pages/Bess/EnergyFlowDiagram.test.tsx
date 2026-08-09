import { render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { getPlantState, type PlantState } from './bessData';
import { EnergyFlowDiagram } from './EnergyFlowDiagram';

// Midday, so the wires carry enough power to run above the base speed.
const NOON = 12 * 60;

const MINUTES_IN_DAY = 24 * 60;

const stateWhere = (predicate: (state: PlantState) => boolean): PlantState => {
  for (let minute = 0; minute < MINUTES_IN_DAY; minute += 4) {
    const state = getPlantState(minute);
    if (predicate(state)) return state;
  }

  throw new Error('the simulated day never reaches the requested state');
};

const nodeById = (container: HTMLElement, id: string): HTMLElement => {
  const node = [...container.querySelectorAll('article')].find(
    article => article.querySelector('header span')?.textContent === id,
  );

  if (!node) throw new Error(`no diagram node for ${id}`);
  return node;
};

type FakeAnimation = { animationName: string; playbackRate: number };

// jsdom implements no animations at all, so the Web Animations entry point has to be planted here.
const stubAnimations = () => {
  const created: FakeAnimation[] = [];

  Object.defineProperty(Element.prototype, 'getAnimations', {
    configurable: true,
    value: () => {
      const animation: FakeAnimation = { animationName: 'flowDash', playbackRate: 1 };
      created.push(animation);
      return [animation];
    },
  });

  return created;
};

describe('EnergyFlowDiagram', () => {
  afterEach(() => {
    Reflect.deleteProperty(Element.prototype, 'getAnimations');
  });

  it('leaves the animation duration to the stylesheet so a tick cannot re-map the dash phase', () => {
    stubAnimations();
    const { container } = render(<EnergyFlowDiagram state={getPlantState(NOON)} />);

    const wires = [...container.querySelectorAll<SVGPathElement>('path')].filter(path =>
      path.getAttribute('class')?.includes('wireFlow'),
    );

    expect(wires.length).toBeGreaterThan(0);
    expect(wires.every(wire => wire.style.animationDuration === '')).toBe(true);
  });

  it('carries the power level in the playback rate of the dash animation', () => {
    const animations = stubAnimations();
    render(<EnergyFlowDiagram state={getPlantState(NOON)} />);

    expect(animations.some(animation => animation.playbackRate > 1)).toBe(true);
  });

  it('fades an idle charger and an idle bank back', () => {
    stubAnimations();
    const state = stateWhere(
      plant => plant.chargers.some(item => item.status === 'idle') && plant.banks.some(item => item.mode === 'idle'),
    );
    const { container } = render(<EnergyFlowDiagram state={state} />);

    const charger = state.chargers.find(item => item.status === 'idle')!;
    const bank = state.banks.find(item => item.mode === 'idle')!;

    expect(getComputedStyle(nodeById(container, charger.spec.id)).opacity).toBe('0.5');
    expect(getComputedStyle(nodeById(container, bank.spec.id)).opacity).toBe('0.5');
  });

  it('pulses a faulted charger and leaves the working ones alone', () => {
    stubAnimations();
    const state = stateWhere(plant => plant.chargers.some(item => item.status === 'fault'));
    const { container } = render(<EnergyFlowDiagram state={state} />);

    const faulted = state.chargers.find(item => item.status === 'fault')!;
    const healthy = state.chargers.find(item => item.status !== 'fault')!;

    expect(getComputedStyle(nodeById(container, faulted.spec.id)).animationName).not.toBe('none');
    expect(getComputedStyle(nodeById(container, healthy.spec.id)).animationName).toBe('none');
  });
});
