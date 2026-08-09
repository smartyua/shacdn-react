import { type ReactNode } from 'react';

import { DashboardContext, type DashboardContextValue } from './dashboardContext';

export type DashboardProviderProps = {
  value: DashboardContextValue;
  children: ReactNode;
};

export const DashboardProvider = ({ value, children }: DashboardProviderProps) => (
  <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
);
