'use client';

import React, { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { FIELD_KEYS, defaultStoreCatalog, parseStoreCatalog, type StoreCatalog } from '@pms/site-content';
import { WebsiteDataService } from '@/services/WebsiteDataService';
import { SiteDocumentEditorShell } from './site-content/SiteDocumentEditorShell';

export function StoreCatalogEditor() {
  const defaultValue = defaultStoreCatalog();
  const [config, setConfig] = useState<StoreCatalog>(defaultValue);
  const [baseline, setBaseline] = useState(JSON.stringify(defaultValue));
  const [isLoading, setIsLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState<Date>();

  useEffect(() => {
    WebsiteDataService.getData('draft').then((rows) => {
      const row = rows.find((r) => r.field_key === FIELD_KEYS.STORE_CATALOG);
      const next = row?.content ? parseStoreCatalog(row.content) : defaultValue;
      setConfig(next);
      setBaseline(JSON.stringify(next));
      setUpdatedAt(row?.updated_at ? new Date(row.updated_at) : undefined);
      setIsLoading(false);
    });
  }, [defaultValue]);

  return (
    <SiteDocumentEditorShell
      fieldKey={FIELD_KEYS.STORE_CATALOG}
      title="Resource store catalog"
      data={config as unknown as Record<string, unknown>}
      setData={setConfig as React.Dispatch<React.SetStateAction<Record<string, unknown>>>}
      baseline={baseline}
      setBaseline={setBaseline}
      isLoading={isLoading}
      lastSynced={updatedAt}
      publicPreviewPath="/community?view=store"
    >
      <GlassCard className="p-6 space-y-4">
        {config.products.map((product, idx) => (
          <div key={product.id} className="p-4 border rounded-2xl space-y-2">
            <input
              value={product.title}
              onChange={(e) =>
                setConfig((c) => {
                  const products = [...c.products];
                  products[idx] = { ...products[idx], title: e.target.value };
                  return { ...c, products };
                })
              }
              className="w-full border rounded-xl px-3 py-2 text-sm font-bold"
            />
            <textarea
              value={product.description}
              onChange={(e) =>
                setConfig((c) => {
                  const products = [...c.products];
                  products[idx] = { ...products[idx], description: e.target.value };
                  return { ...c, products };
                })
              }
              className="w-full border rounded-xl px-3 py-2 text-sm h-16"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={product.price}
                onChange={(e) =>
                  setConfig((c) => {
                    const products = [...c.products];
                    const price = Number(e.target.value) || 0;
                    products[idx] = {
                      ...products[idx],
                      price,
                      displayPrice: `$${price.toFixed(2)}`,
                    };
                    return { ...c, products };
                  })
                }
                className="border rounded-xl px-3 py-2 text-sm"
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={product.visible}
                  onChange={(e) =>
                    setConfig((c) => {
                      const products = [...c.products];
                      products[idx] = { ...products[idx], visible: e.target.checked };
                      return { ...c, products };
                    })
                  }
                />
                Visible
              </label>
            </div>
          </div>
        ))}
      </GlassCard>
    </SiteDocumentEditorShell>
  );
}
