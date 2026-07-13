import { createContext } from 'react';

export type DashboardContextValue = {
  timeRange: string;
  timeRangeLabel: string;
  setTimeRange: (value: string) => void;
  refreshing: boolean;
  handleRefresh: () => void;
  showSkeleton: boolean;
  setShowSkeleton: (value: boolean) => void;
  openCommandPalette: () => void;
  openSettings: () => void;
  openReports: () => void;
};

export const DashboardContext = createContext<DashboardContextValue | null>(null);
