'use client';

import React from 'react';
import {
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Package,
  Plus,
  Star,
  Trash2,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import {
  FIELD_KEYS,
  defaultStoreCatalog,
  parseStoreCatalog,
  type StoreCatalog,
} from '@pms/site-content';
import { useSiteDocumentDraft } from '@/hooks/useSiteDocumentDraft';
import { SiteDocumentEditorShell } from './site-content/SiteDocumentEditorShell';
import { MediaPicker } from './site-content/MediaPicker';
import { getPublicSitePage } from '@/constants/publicSitePages';
import { cn } from '@/lib/utils';

type StoreProduct = StoreCatalog['products'][number];

const inputClass =
  'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/25';
const labelClass = 'text-[11px] font-bold uppercase tracking-wide text-muted-foreground';

function defaultCategoryId(catalog: StoreCatalog): string {
  const first = catalog.categories.find((c) => c.id !== 'all');
  return first?.id ?? catalog.categories[0]?.id ?? 'mock-exams';
}

function newStoreProduct(catalog: StoreCatalog): StoreProduct {
  const sortOrder = catalog.products.length;
  return {
    id: `product-${Date.now()}`,
    title: 'New product',
    description: '',
    categoryId: defaultCategoryId(catalog),
    price: 0,
    currency: 'USD',
    displayPrice: '$0.00',
    visible: true,
    sortOrder,
  };
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className={labelClass}>{label}</span>
      {children}
      {hint ? <span className="block text-[11px] text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

export function StoreCatalogEditor() {
  const { config, setConfig, baseline, setBaseline, isLoading, loadError, updatedAt } =
    useSiteDocumentDraft(FIELD_KEYS.STORE_CATALOG, defaultStoreCatalog, parseStoreCatalog);

  const visibleCount = config.products.filter((p) => p.visible).length;

  const updateProduct = (idx: number, patch: Partial<StoreProduct>) => {
    setConfig((c) => {
      const products = [...c.products];
      products[idx] = { ...products[idx], ...patch };
      return { ...c, products };
    });
  };

  const addProduct = () => {
    setConfig((c) => ({ ...c, products: [...c.products, newStoreProduct(c)] }));
  };

  const removeProduct = (idx: number) => {
    const product = config.products[idx];
    if (product && !window.confirm(`Remove "${product.title || product.id}" from the catalog?`)) {
      return;
    }
    setConfig((c) => ({
      ...c,
      products: c.products.filter((_, i) => i !== idx).map((p, i) => ({ ...p, sortOrder: i })),
    }));
  };

  const moveProduct = (idx: number, direction: -1 | 1) => {
    const target = idx + direction;
    if (target < 0 || target >= config.products.length) return;
    setConfig((c) => {
      const products = [...c.products];
      [products[idx], products[target]] = [products[target], products[idx]];
      return { ...c, products: products.map((p, i) => ({ ...p, sortOrder: i })) };
    });
  };

  return (
    <SiteDocumentEditorShell
      fieldKey={FIELD_KEYS.STORE_CATALOG}
      title="Resource store catalog"
      editorDescription={getPublicSitePage('store')?.editorDescription}
      data={config as unknown as Record<string, unknown>}
      setData={setConfig as React.Dispatch<React.SetStateAction<Record<string, unknown>>>}
      baseline={baseline}
      setBaseline={setBaseline}
      isLoading={isLoading}
      loadError={loadError}
      lastSynced={updatedAt}
      publicPreviewPath="/community?view=store"
    >
      <div className="space-y-6">
        {/* Products */}
        <GlassCard className="p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange">
                <Package className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Products</h3>
                <p className="text-xs text-muted-foreground">
                  {config.products.length} total · {visibleCount} visible in store
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={addProduct}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-orange px-3 py-2 text-sm font-bold text-white hover:opacity-90"
            >
              <Plus className="h-4 w-4" aria-hidden />
              Add product
            </button>
          </div>

          {config.products.length === 0 && (
            <p className="rounded-xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
              No products yet. Click <span className="font-semibold text-foreground">Add product</span> to create one.
            </p>
          )}

          <div className="space-y-4">
            {config.products.map((product, idx) => {
              const imageUrl = product.image?.url ?? product.imageUrl ?? '';
              return (
                <div
                  key={product.id}
                  className={cn(
                    'rounded-2xl border border-border bg-card p-4 sm:p-5',
                    !product.visible && 'opacity-70',
                  )}
                >
                  {/* Card header */}
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-muted-foreground">{product.id}</span>
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold',
                          product.visible
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                            : 'bg-muted text-muted-foreground',
                        )}
                      >
                        {product.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                        {product.visible ? 'Visible' : 'Hidden'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveProduct(idx, -1)}
                        disabled={idx === 0}
                        aria-label="Move up"
                        className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-40"
                      >
                        <ChevronUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveProduct(idx, 1)}
                        disabled={idx === config.products.length - 1}
                        aria-label="Move down"
                        className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-40"
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeProduct(idx)}
                        className="ml-1 inline-flex items-center gap-1 rounded-md border border-border px-2 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden />
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-5 lg:grid-cols-[200px_1fr]">
                    {/* Image column */}
                    <div className="space-y-2">
                      <div className="overflow-hidden rounded-xl border border-border bg-muted/30">
                        {imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={imageUrl} alt="" className="aspect-[4/3] w-full object-cover" />
                        ) : (
                          <div className="flex aspect-[4/3] w-full items-center justify-center text-xs text-muted-foreground">
                            No image
                          </div>
                        )}
                      </div>
                      <MediaPicker
                        label="Product image"
                        value={imageUrl}
                        onChange={(url) => {
                          const trimmed = url.trim();
                          updateProduct(idx, {
                            imageUrl: trimmed || undefined,
                            image: trimmed
                              ? { id: `product-img-${product.id}`, url: trimmed, alt: product.title }
                              : undefined,
                          });
                        }}
                      />
                    </div>

                    {/* Fields column */}
                    <div className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-[1fr_160px]">
                        <Field label="Title">
                          <input
                            value={product.title}
                            onChange={(e) => updateProduct(idx, { title: e.target.value })}
                            placeholder="Product title"
                            className={cn(inputClass, 'font-semibold')}
                          />
                        </Field>
                        <Field label="Badge" hint="Optional, e.g. Popular">
                          <input
                            value={product.badge ?? ''}
                            onChange={(e) =>
                              updateProduct(idx, { badge: e.target.value.trim() || undefined })
                            }
                            placeholder="—"
                            className={inputClass}
                          />
                        </Field>
                      </div>

                      <Field label="Description">
                        <textarea
                          value={product.description}
                          onChange={(e) => updateProduct(idx, { description: e.target.value })}
                          placeholder="Short product description"
                          className={cn(inputClass, 'h-16 resize-y leading-relaxed')}
                        />
                      </Field>

                      <div className="grid gap-4 sm:grid-cols-3">
                        <Field label="Category">
                          <select
                            value={product.categoryId}
                            onChange={(e) => updateProduct(idx, { categoryId: e.target.value })}
                            className={inputClass}
                          >
                            {config.categories
                              .filter((cat) => cat.id !== 'all')
                              .map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                  {cat.name}
                                </option>
                              ))}
                          </select>
                        </Field>
                        <Field label="Price" hint="Updates display price">
                          <div className="flex items-center gap-2">
                            <input
                              value={product.currency}
                              onChange={(e) =>
                                updateProduct(idx, { currency: e.target.value.toUpperCase() })
                              }
                              className={cn(inputClass, 'w-16 text-center')}
                              aria-label="Currency"
                            />
                            <input
                              type="number"
                              min={0}
                              step={0.01}
                              value={product.price}
                              onChange={(e) => {
                                const price = Number(e.target.value) || 0;
                                updateProduct(idx, { price, displayPrice: `$${price.toFixed(2)}` });
                              }}
                              className={inputClass}
                            />
                          </div>
                        </Field>
                        <Field label="Display price" hint="Shown on the card">
                          <input
                            value={product.displayPrice}
                            onChange={(e) => updateProduct(idx, { displayPrice: e.target.value })}
                            className={inputClass}
                          />
                        </Field>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-3">
                        <Field label="Rating" hint="0–5, optional">
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 shrink-0 text-amber-400" />
                            <input
                              type="number"
                              min={0}
                              max={5}
                              step={0.1}
                              value={product.rating ?? ''}
                              onChange={(e) =>
                                updateProduct(idx, {
                                  rating: e.target.value === '' ? undefined : Number(e.target.value),
                                })
                              }
                              placeholder="—"
                              className={inputClass}
                            />
                          </div>
                        </Field>
                        <Field label="Review count" hint="Optional">
                          <input
                            type="number"
                            min={0}
                            step={1}
                            value={product.reviewCount ?? ''}
                            onChange={(e) =>
                              updateProduct(idx, {
                                reviewCount:
                                  e.target.value === '' ? undefined : Number(e.target.value),
                              })
                            }
                            placeholder="—"
                            className={inputClass}
                          />
                        </Field>
                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={() => updateProduct(idx, { visible: !product.visible })}
                            className={cn(
                              'inline-flex h-[38px] w-full items-center justify-center gap-2 rounded-lg border px-3 text-sm font-semibold transition-colors',
                              product.visible
                                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                : 'border-border bg-muted/40 text-muted-foreground',
                            )}
                          >
                            {product.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                            {product.visible ? 'Visible in store' : 'Hidden'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>
    </SiteDocumentEditorShell>
  );
}
