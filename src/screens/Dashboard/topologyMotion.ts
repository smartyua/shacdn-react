export type FlowMotionPreference = 'auto' | 'on' | 'off';

const STORAGE_KEY = 'topology-flow-motion';

export const FLOW_MOTION_LABELS: Record<FlowMotionPreference, string> = {
  auto: 'Auto',
  on: 'On',
  off: 'Off',
};

export const readStoredFlowMotion = (): FlowMotionPreference => {
  if (typeof window === 'undefined') return 'auto';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === 'on' || stored === 'off' ? stored : 'auto';
};

export const persistFlowMotion = (value: FlowMotionPreference): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, value);
};

export const resolveFlowMotion = (
  preference: FlowMotionPreference,
  systemReducedMotion: boolean
): { linesEnabled: boolean; packetsEnabled: boolean } => {
  if (preference === 'off') {
    return { linesEnabled: false, packetsEnabled: false };
  }
  if (preference === 'on') {
    return { linesEnabled: true, packetsEnabled: true };
  }
  if (systemReducedMotion) {
    return { linesEnabled: false, packetsEnabled: false };
  }
  return { linesEnabled: true, packetsEnabled: true };
};

export const getFlowStatusLabel = (
  preference: FlowMotionPreference,
  systemReducedMotion: boolean,
  running: boolean,
  linesEnabled: boolean
): string => {
  if (preference === 'off') return 'Animation off';
  if (!running && linesEnabled) return 'Flow paused';
  if (preference === 'auto' && systemReducedMotion) return 'Auto (reduced)';
  if (linesEnabled && running) return 'Live flow';
  if (preference === 'auto' && !systemReducedMotion && !running) return 'Flow paused';
  return 'Static';
};

export const motionOverrideActive = (preference: FlowMotionPreference): boolean => preference === 'on';
