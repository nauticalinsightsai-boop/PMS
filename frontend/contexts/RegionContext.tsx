'use client';

import * as React from 'react';
import type { GccCountryCode, RegionId } from '@/types/regional-catalogue';
import { getCatalogue } from '@/lib/regional-catalogue';
import { clearStoredRegion, readStoredRegion, writeStoredRegion } from '@/lib/region-storage';
import { syncProfileRegion } from '@/services/regional';

interface RegionContextValue {
  regionId: RegionId;
  gccCountry: GccCountryCode | null;
  regionLabel: string;
  isReady: boolean;
  modalOpen: boolean;
  setRegion: (regionId: RegionId, gccCountry?: GccCountryCode | null) => void;
  openRegionModal: () => void;
  closeRegionModal: () => void;
}

const RegionContext = React.createContext<RegionContextValue | null>(null);

const REGION_LABELS: Record<RegionId, string> = {
  global: 'Global',
  europe: 'Europe',
  uk: 'United Kingdom',
  gcc: 'GCC',
  india: 'India',
  pakistan: 'Pakistan',
};

export function RegionProvider({ children }: { children: React.ReactNode }) {
  const [regionId, setRegionId] = React.useState<RegionId>('global');
  const [gccCountry, setGccCountry] = React.useState<GccCountryCode | null>(null);
  const [isReady, setIsReady] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);

  React.useEffect(() => {
    const stored = readStoredRegion();
    if (stored) {
      setRegionId(stored.regionId);
      setGccCountry(stored.gccCountry);
    } else {
      setModalOpen(true);
    }
    setIsReady(true);
  }, []);

  const setRegion = React.useCallback((id: RegionId, gcc?: GccCountryCode | null) => {
    setRegionId(id);
    setGccCountry(gcc ?? null);
    writeStoredRegion(id, gcc);
    setModalOpen(false);

    const userId =
      typeof window !== 'undefined' ? localStorage.getItem('pms_supabase_user_id') : null;
    if (userId) {
      syncProfileRegion({ userId, regionId: id, gccCountry: gcc ?? null }).catch(() => {});
    }
  }, []);

  const openRegionModal = React.useCallback(() => setModalOpen(true), []);
  const closeRegionModal = React.useCallback(() => {
    if (!readStoredRegion()) {
      writeStoredRegion('global');
      setRegionId('global');
    }
    setModalOpen(false);
  }, []);

  const regionConfig = getCatalogue().regions.find((r) => r.id === regionId);
  const regionLabel =
    regionId === 'gcc' && gccCountry
      ? `${gccCountry} · GCC`
      : REGION_LABELS[regionId] ?? regionConfig?.label ?? regionId;

  const value: RegionContextValue = {
    regionId,
    gccCountry,
    regionLabel,
    isReady,
    modalOpen,
    setRegion,
    openRegionModal,
    closeRegionModal,
  };

  return <RegionContext.Provider value={value}>{children}</RegionContext.Provider>;
}

export function useRegion() {
  const ctx = React.useContext(RegionContext);
  if (!ctx) throw new Error('useRegion must be used within RegionProvider');
  return ctx;
}

export function useRegionOptional() {
  return React.useContext(RegionContext);
}
