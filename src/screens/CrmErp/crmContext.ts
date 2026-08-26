import { createContext, useContext, type Dispatch, type SetStateAction } from 'react';

import type { CrmView, Deal, Quote, SelectedRecord } from './crmData';

export type CrmContextValue = {
  view: CrmView;
  setView: (view: CrmView) => void;
  deals: Deal[];
  setDeals: Dispatch<SetStateAction<Deal[]>>;
  quotes: Quote[];
  setQuotes: Dispatch<SetStateAction<Quote[]>>;
  selected: SelectedRecord;
  setSelected: (record: SelectedRecord) => void;
  search: string;
  setSearch: (value: string) => void;
  ownerFilter: string;
  setOwnerFilter: (value: string) => void;
  regions: string[];
  setRegions: (value: string[]) => void;
  plant: string;
  setPlant: (value: string) => void;
  closeAfter?: Date;
  setCloseAfter: (value: Date | undefined) => void;
  horizon: string;
  setHorizon: (value: string) => void;
  watchMine: boolean;
  setWatchMine: (value: boolean) => void;
  refreshing: boolean;
  pinned: boolean;
  setPinned: (value: boolean) => void;
  openQuote: () => void;
  openApprove: () => void;
  openAccount: () => void;
  openCommand: () => void;
  openVisit: () => void;
  openExpedite: () => void;
  openPrint: () => void;
};

export const CrmContext = createContext<CrmContextValue | null>(null);

export const useCrm = (): CrmContextValue => {
  const ctx = useContext(CrmContext);
  if (!ctx) {
    throw new Error('useCrm must be used within CrmErp');
  }
  return ctx;
};
