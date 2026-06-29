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
import { clearCachedIpRegionHint, fetchBrowserGeolocationRegionHint, fetchIpRegionHint } from '@/lib/region-geo';
import { syncProfileRegion } from '@/services/regional';

interface RegionContextValue {
  regionId: RegionId;
  gccCountry: GccCountryCode | null;
  regionLabel: string;
  regionSource: RegionSource | null;
  /** Always false: region is IP/location only, not manually selectable. */
  canChangeRegion: boolean;
  isReady: boolean;
  isDetectingRegion: boolean;
  modalOpen: boolean;
  setRegion: (regionId: RegionId, gccCountry?: GccCountryCode | null) => void;
  openRegionModal: () => void;
  closeRegionModal: () => void;
  /** Re-detect region from browser location, then IP fallback. */
  refreshRegionDetection: () => Promise<boolean>;
  /** @deprecated Use refreshRegionDetection */
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
          setIsDetectingRegion(false);
        }
        return;
      }

      const stored = readStoredRegion();

      if (stored && (!stored.source || stored.source === 'manual')) {
        clearStoredRegion();
      } else       if (stored?.source === 'ip' || stored?.source === 'geolocation') {
        if (!cancelled) {
          setRegionId(stored.regionId);
          setGccCountry(stored.gccCountry);
          setRegionSource(stored.source);
        }
        return;
      }

      const detectIp = async () => {
        const hint = await fetchIpRegionHint();
        if (!cancelled && hint) {
          applyRegionHint(hint, 'ip', setRegionId, setGccCountry, setRegionSource);
        }
      };

      if (typeof requestIdleCallback === 'function') {
        requestIdleCallback(() => {
          void detectIp();
        });
      } else {
        setTimeout(() => {
          void detectIp();
        }, 0);
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
    writeStoredRegion(id, gcc, 'manual');
    setModalOpen(false);

    const userId =
      typeof window !== 'undefined' ? localStorage.getItem('pms_supabase_user_id') : null;
    if (userId) {
      syncProfileRegion({ userId, regionId: id, gccCountry: gcc ?? null }).catch(() => {});
    }
  }, []);

  const openRegionModal = React.useCallback(() => {
    /* Region is not manually selectable. */
  }, []);

  const closeRegionModal = React.useCallback(() => {
    setModalOpen(false);
  }, []);

  const refreshRegionDetection = React.useCallback(async (): Promise<boolean> => {
    if (isDetectingRegion) return false;
    setIsDetectingRegion(true);
    try {
      clearCachedIpRegionHint();
      const geoHint = await fetchBrowserGeolocationRegionHint();
      if (geoHint) {
        applyRegionHint(geoHint, 'geolocation', setRegionId, setGccCountry, setRegionSource);
        return true;
      }
      const ipHint = await fetchIpRegionHint({ bypassCache: true });
      if (ipHint) {
        applyRegionHint(ipHint, 'ip', setRegionId, setGccCountry, setRegionSource);
        return true;
      }
      return false;
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
    canChangeRegion: false,
    isReady,
    isDetectingRegion,
    modalOpen,
    setRegion,
    openRegionModal,
    closeRegionModal,
    refreshRegionDetection,
    shareLocationForRegion: refreshRegionDetection,
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