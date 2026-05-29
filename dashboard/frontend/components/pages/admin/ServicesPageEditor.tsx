'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Plus, Trash2 } from 'lucide-react';
import {
  FIELD_KEYS,
  defaultServicesPageConfig,
  parseServicesPageConfig,
  type ServicesPageConfig,
} from '@pms/site-content';
import { useSiteDocumentDraft } from '@/hooks/useSiteDocumentDraft';
import { SiteDocumentEditorShell } from './site-content/SiteDocumentEditorShell';

export function ServicesPageEditor() {
  const { config, setConfig, baseline, setBaseline, isLoading, loadError, updatedAt } =
    useSiteDocumentDraft(
      FIELD_KEYS.SERVICES_PAGE_CONFIG,
      defaultServicesPageConfig,
      parseServicesPageConfig,
    );

  return (
    <SiteDocumentEditorShell
      fieldKey={FIELD_KEYS.SERVICES_PAGE_CONFIG}
      title="Services page"
      data={config as unknown as Record<string, unknown>}
      setData={setConfig as React.Dispatch<React.SetStateAction<Record<string, unknown>>>}
      baseline={baseline}
      setBaseline={setBaseline}
      isLoading={isLoading}
      loadError={loadError}
      lastSynced={updatedAt}
      publicPreviewPath="/pm-service"
    >
      <GlassCard className="p-6 space-y-6">
        <section className="space-y-3">
          <h2 className="font-bold">Hero</h2>
          {(['badge', 'title', 'subtitle'] as const).map((key) => (
            <input
              key={key}
              value={config.hero[key]}
              onChange={(e) => setConfig((c) => ({ ...c, hero: { ...c.hero, [key]: e.target.value } }))}
              className="w-full border rounded-xl px-3 py-2 text-sm"
            />
          ))}
        </section>
        <section className="space-y-4">
          <h2 className="font-bold">Services</h2>
          {config.services.map((svc, idx) => (
            <div key={svc.id} className="p-4 border rounded-2xl space-y-2">
              <input
                value={svc.title}
                onChange={(e) =>
                  setConfig((c) => {
                    const services = [...c.services];
                    services[idx] = { ...services[idx], title: e.target.value };
                    return { ...c, services };
                  })
                }
                className="w-full border rounded-xl px-3 py-2 text-sm font-bold"
              />
              <textarea
                value={svc.description}
                onChange={(e) =>
                  setConfig((c) => {
                    const services = [...c.services];
                    services[idx] = { ...services[idx], description: e.target.value };
                    return { ...c, services };
                  })
                }
                className="w-full border rounded-xl px-3 py-2 text-sm h-20"
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={svc.visible}
                  onChange={(e) =>
                    setConfig((c) => {
                      const services = [...c.services];
                      services[idx] = { ...services[idx], visible: e.target.checked };
                      return { ...c, services };
                    })
                  }
                />
                Visible
              </label>
            </div>
          ))}
        </section>
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">Case studies</h2>
            <button
              type="button"
              onClick={() =>
                setConfig((c) => ({
                  ...c,
                  caseStudies: [
                    ...c.caseStudies,
                    {
                      id: `case-${Date.now()}`,
                      title: 'New case study',
                      summary: '',
                      published: true,
                    },
                  ],
                }))
              }
              className="text-sm font-bold text-brand-orange flex items-center gap-1"
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>
          {config.caseStudies.map((cs, idx) => (
            <div key={cs.id} className="p-4 border rounded-2xl space-y-2">
              <input
                value={cs.title}
                onChange={(e) =>
                  setConfig((c) => {
                    const caseStudies = [...c.caseStudies];
                    caseStudies[idx] = { ...caseStudies[idx], title: e.target.value };
                    return { ...c, caseStudies };
                  })
                }
                className="w-full border rounded-xl px-3 py-2 text-sm font-bold"
              />
              <textarea
                value={cs.summary}
                onChange={(e) =>
                  setConfig((c) => {
                    const caseStudies = [...c.caseStudies];
                    caseStudies[idx] = { ...caseStudies[idx], summary: e.target.value };
                    return { ...c, caseStudies };
                  })
                }
                className="w-full border rounded-xl px-3 py-2 text-sm h-20"
              />
              <button
                type="button"
                onClick={() =>
                  setConfig((c) => ({
                    ...c,
                    caseStudies: c.caseStudies.filter((_, i) => i !== idx),
                  }))
                }
                className="text-xs text-red-500 flex items-center gap-1"
              >
                <Trash2 className="h-3 w-3" /> Remove
              </button>
            </div>
          ))}
        </section>
      </GlassCard>
    </SiteDocumentEditorShell>
  );
}
