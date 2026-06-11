'use client';

import * as React from 'react';
import type { GccCountryCode, RegionId } from '@/types/regional-catalogue';
import { getCatalogue } from '@/lib/regional-catalogue';
import {
  clearStoredRegion,
  readStoredRegion,
  writeStoredRegion,
  type RegionSource,
} from '@/lib/region-storage';
import { fetchBrowserGeolocationRegionHint, fetchIpRegionHint } from '@/lib/region-geo';
import { syncProfileRegion } from '@/services/regional';

interface RegionContextValue {
  regionId: RegionId;
  gccCountry: GccCountryCode | null;
  regionLabel: string;
  regionSource: RegionSource | null;
  /** True after the visitor shared browser location — unlocks manual region change. */
  canChangeRegion: boolean;
  isReady: boolean;
  isDetectingRegion: boolean;
  modalOpen: boolean;
  setRegion: (regionId: RegionId, gccCountry?: GccCountryCode | null) => void;
  openRegionModal: () => void;
  closeRegionModal: () => void;
  /** Prompt for browser location; on success updates region and unlocks manual change. */
  shareLocationForRegion: () => Promise<boolean>;
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

function applyRegionHint(
  hint: { regionId: RegionId; gccCountry: GccCountryCode | null },
  source: RegionSource,
  setRegionId: React.Dispatch<React.SetStateAction<RegionId>>,
  setGccCountry: React.Dispatch<React.SetStateAction<GccCountryCode | null>>,
  setRegionSource: React.Dispatch<React.SetStateAction<RegionSource | null>>,
) {
  setRegionId(hint.regionId);
  setGccCountry(hint.gccCountry);
  setRegionSource(source);
  writeStoredRegion(hint.regionId, hint.gccCountry, source);
}

type RegionProviderProps = {
  children: React.ReactNode;
  /** Channel portals: always global pricing; region chip is display-only. */
  portalDefaults?: boolean;
};

export function RegionProvider({ children, portalDefaults = false }: RegionProviderProps) {
  const [regionId, setRegionId] = React.useState<RegionId>('global');
  const [gccCountry, setGccCountry] = React.useState<GccCountryCode | null>(null);
  const [regionSource, setRegionSource] = React.useState<RegionSource | null>(null);
  const [canChangeRegion, setCanChangeRegion] = React.useState(false);
  /** Default true so regional widgets use global fallback until bootstrap completes. */
  const [isReady, setIsReady] = React.useState(true);
  const [isDetectingRegion, setIsDetectingRegion] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      setRegionId('global');
      setGccCountry(null);
      setModalOpen(false);

      if (portalDefaults) {
        if (!cancelled) {
          setRegionSource(null);
          setCanChangeRegion(false);
          setIsDetectingRegion(false);
        }
        return;
      }

      const stored = readStoredRegion();

      // Legacy manual picks (no source) — discard and re-detect from IP.
      if (stored && !stored.source) {
        clearStoredRegion();
      } else       if (stored?.source) {
        if (!cancelled) {
          setRegionId(stored.regionId);
          setGccCountry(stored.gccCountry);
          setRegionSource(stored.source);
          setCanChangeRegion(
            stored.source === 'geolocation' ||
              stored.source === 'manual' ||
              stored.source === 'ip',
          );
        }
        return;
      }

      const hint = await fetchIpRegionHint();
      if (!cancelled && hint) {
        applyRegionHint(hint, 'ip', setRegionId, setGccCountry, setRegionSource);
        setCanChangeRegion(true);
      }
    }

    void bootstrap();
    return () => {
      cancelled = true;
    };
  }, [portalDefaults]);

  const setRegion = React.useCallback((id: RegionId, gcc?: GccCountryCode | null) => {
    setRegionId(id);
    setGccCountry(gcc ?? null);
    setRegionSource('manual');
    setCanChangeRegion(true);
    writeStoredRegion(id, gcc, 'manual');
    setModalOpen(false);

    const userId =
      typeof window !== 'undefined' ? localStorage.getItem('pms_supabase_user_id') : null;
    if (userId) {
      syncProfileRegion({ userId, regionId: id, gccCountry: gcc ?? null }).catch(() => {});
    }
  }, []);

  const openRegionModal = React.useCallback(() => {
    if (!canChangeRegion) return;
    setModalOpen(true);
  }, [canChangeRegion]);

  const closeRegionModal = React.useCallback(() => {
    setModalOpen(false);
  }, []);

  const shareLocationForRegion = React.useCallback(async (): Promise<boolean> => {
    if (isDetectingRegion) return false;
    setIsDetectingRegion(true);
    try {
      const hint = await fetchBrowserGeolocationRegionHint();
      if (!hint) return false;
      applyRegionHint(hint, 'geolocation', setRegionId, setGccCountry, setRegionSource);
      setCanChangeRegion(true);
      return true;
    } catch {
      return false;
    } finally {
      setIsDetectingRegion(false);
    }
  }, [isDetectingRegion]);

  const regionConfig = getCatalogue().regions.find((r) => r.id === regionId);
  const regionLabel =
    regionId === 'gcc' && gccCountry
      ? `${gccCountry} · GCC`
      : REGION_LABELS[regionId] ?? regionConfig?.label ?? regionId;

  const value: RegionContextValue = {
    regionId,
    gccCountry,
    regionLabel,
    regionSource,
    canChangeRegion,
    isReady,
    isDetectingRegion,
    modalOpen,
    setRegion,
    openRegionModal,
    closeRegionModal,
    shareLocationForRegion,
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
