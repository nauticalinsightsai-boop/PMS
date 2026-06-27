'use client';

import React from 'react';
import {
  Eye,
  EyeOff,
  GripVertical,
  Package,
  Pencil,
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
import { ModalPortal } from '@/components/shared/ModalPortal';
import { getPublicSitePage } from '@/constants/publicSitePages';
import { cn } from '@/lib/utils';

type StoreProduct = StoreCatalog['products'][number];

const inputClass =
  'w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-brand-orange/40 focus-visible:ring-2 focus-visible:ring-brand-orange/30';
const labelClass = 'text-[11px] font-bold uppercase tracking-wide text-muted-foreground';

function defaultCategoryId(catalog: StoreCatalog): string {
  const first = catalog.categories.find((c) => c.id !== 'all');
  return first?.id ?? catalog.categories[0]?.id ?? 'mock-exams';
}

function newStoreProduct(catalog: StoreCatalog): StoreProduct {
  return {
    id: `product-${Date.now()}`,
    title: 'New product',
    description: '',
    categoryId: defaultCategoryId(catalog),
    price: 0,
    currency: 'USD',
    displayPrice: '$0.00',
    visible: true,
    sortOrder: catalog.products.length,
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

  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [dragIndex, setDragIndex] = React.useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = React.useState<number | null>(null);

  const visibleCount = config.products.filter((p) => p.visible).length;
  const categoryName = (id: string) =>
    config.categories.find((c) => c.id === id)?.name ?? id;

  const editingIndex = config.products.findIndex((p) => p.id === editingId);
  const editing = editingIndex >= 0 ? config.products[editingIndex] : null;

  const updateProduct = (idx: number, patch: Partial<StoreProduct>) => {
    setConfig((c) => {
      const products = [...c.products];
      products[idx] = { ...products[idx], ...patch };
      return { ...c, products };
    });
  };

  const addProduct = () => {
    const product = newStoreProduct(config);
    setConfig((c) => ({ ...c, products: [...c.products, product] }));
    setEditingId(product.id);
  };

  const removeProduct = (id: string) => {
    const product = config.products.find((p) => p.id === id);
    if (product && !window.confirm(`Remove "${product.title || product.id}" from the catalog?`)) {
      return;
    }
    setConfig((c) => ({
      ...c,
      products: c.products.filter((p) => p.id !== id).map((p, i) => ({ ...p, sortOrder: i })),
    }));
    if (editingId === id) setEditingId(null);
  };

  const reorder = (from: number, to: number) => {
    if (from === to || from < 0 || to < 0) return;
    setConfig((c) => {
      const products = [...c.products];
      const [moved] = products.splice(from, 1);
      products.splice(to, 0, moved);
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
      <GlassCard className="p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange">
              <Package className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Products</h3>
              <p className="text-xs text-muted-foreground">
                {config.products.length} total · {visibleCount} visible · drag cards to reorder
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

        {config.products.length === 0 ? (
          <p className="rounded-xl border border-dashed border-white/15 py-10 text-center text-sm text-muted-foreground">
            No products yet. Click <span className="font-semibold text-foreground">Add product</span> to create one.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {config.products.map((product, idx) => {
              const imageUrl = product.image?.url ?? product.imageUrl ?? '';
              return (
                <div
                  key={product.id}
                  draggable
                  onDragStart={(e) => {
                    setDragIndex(idx);
                    e.dataTransfer.effectAllowed = 'move';
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                    if (dragOverIndex !== idx) setDragOverIndex(idx);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (dragIndex !== null) reorder(dragIndex, idx);
                    setDragIndex(null);
                    setDragOverIndex(null);
                  }}
                  onDragEnd={() => {
                    setDragIndex(null);
                    setDragOverIndex(null);
                  }}
                  className={cn(
                    'group flex flex-col rounded-2xl border bg-white/[0.03] p-3 transition-all',
                    dragOverIndex === idx && dragIndex !== idx
                      ? 'border-brand-orange/60 ring-2 ring-brand-orange/30'
                      : 'border-white/10',
                    dragIndex === idx && 'opacity-50',
                    !product.visible && 'opacity-70',
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="mt-0.5 cursor-grab text-muted-foreground/70 active:cursor-grabbing"
                      title="Drag to reorder"
                      aria-hidden
                    >
                      <GripVertical className="h-4 w-4" />
                    </span>
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/5">
                      {imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={imageUrl} alt="" draggable={false} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-center text-[9px] leading-tight text-muted-foreground">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {product.title || 'Untitled product'}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{categoryName(product.categoryId)}</p>
                      <p className="mt-0.5 text-sm font-bold text-brand-orange">{product.displayPrice}</p>
                    </div>
                    <span
                      className={cn(
                        'inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold',
                        product.visible
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                          : 'bg-white/10 text-muted-foreground',
                      )}
                    >
                      {product.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    </span>
                  </div>

                  {product.badge ? (
                    <span className="mt-3 inline-flex w-fit items-center rounded-full bg-brand-purple/15 px-2 py-0.5 text-[10px] font-bold text-brand-purple">
                      {product.badge}
                    </span>
                  ) : null}

                  <div className="mt-3 flex items-center gap-2 border-t border-white/10 pt-3">
                    <button
                      type="button"
                      onClick={() => setEditingId(product.id)}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-foreground hover:border-brand-orange/40 hover:text-brand-orange"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => updateProduct(idx, { visible: !product.visible })}
                      aria-label={product.visible ? 'Hide product' : 'Show product'}
                      className="rounded-lg border border-white/10 p-2 text-muted-foreground hover:border-brand-orange/40 hover:text-brand-orange"
                    >
                      {product.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeProduct(product.id)}
                      aria-label="Remove product"
                      className="rounded-lg border border-white/10 p-2 text-red-500 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </GlassCard>

      {editing ? (
        <ModalPortal>
          <div
            className="fixed inset-0 z-modal flex flex-col p-3 sm:p-4 md:p-6"
            role="dialog"
            aria-modal="true"
            aria-label={`Edit ${editing.title || 'product'}`}
          >
            <button
              type="button"
              className="absolute inset-0 bg-black/65 backdrop-blur-[2px]"
              aria-label="Close editor"
              onClick={() => setEditingId(null)}
            />
            <div className="relative z-10 mx-auto flex max-h-full w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl ring-1 ring-foreground/10">
              <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-card px-5 py-4">
                <div className="min-w-0">
                  <h3 className="truncate text-lg font-bold">{editing.title || 'Untitled product'}</h3>
                  <p className="font-mono text-[11px] text-muted-foreground">{editing.id}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="rounded-lg bg-brand-orange px-3 py-2 text-sm font-bold text-white hover:opacity-90"
                >
                  Done
                </button>
              </div>

              <div className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-muted/5 px-5 py-5">
                <div className="flex items-start gap-3">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/5">
                    {editing.image?.url ?? editing.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={editing.image?.url ?? editing.imageUrl ?? ''}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-center text-[9px] leading-tight text-muted-foreground">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <MediaPicker
                      label="Product image"
                      value={editing.image?.url ?? editing.imageUrl ?? ''}
                      onChange={(url) => {
                        const trimmed = url.trim();
                        updateProduct(editingIndex, {
                          imageUrl: trimmed || undefined,
                          image: trimmed
                            ? { id: `product-img-${editing.id}`, url: trimmed, alt: editing.title }
                            : undefined,
                        });
                      }}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-[1fr_160px]">
                  <Field label="Title">
                    <input
                      value={editing.title}
                      onChange={(e) => updateProduct(editingIndex, { title: e.target.value })}
                      placeholder="Product title"
                      className={cn(inputClass, 'font-semibold')}
                    />
                  </Field>
                  <Field label="Badge" hint="Optional, e.g. Popular">
                    <input
                      value={editing.badge ?? ''}
                      onChange={(e) =>
                        updateProduct(editingIndex, { badge: e.target.value.trim() || undefined })
                      }
                      placeholder="—"
                      className={inputClass}
                    />
                  </Field>
                </div>

                <Field label="Description">
                  <textarea
                    value={editing.description}
                    onChange={(e) => updateProduct(editingIndex, { description: e.target.value })}
                    placeholder="Short product description"
                    className={cn(inputClass, 'h-20 resize-y leading-relaxed')}
                  />
                </Field>

                <div className="grid gap-4 sm:grid-cols-3">
                  <Field label="Category">
                    <select
                      value={editing.categoryId}
                      onChange={(e) => updateProduct(editingIndex, { categoryId: e.target.value })}
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
                        value={editing.currency}
                        onChange={(e) =>
                          updateProduct(editingIndex, { currency: e.target.value.toUpperCase() })
                        }
                        className={cn(inputClass, 'w-16 text-center')}
                        aria-label="Currency"
                      />
                      <input
                        type="number"
                        min={0}
                        step={0.01}
                        value={editing.price}
                        onChange={(e) => {
                          const price = Number(e.target.value) || 0;
                          updateProduct(editingIndex, { price, displayPrice: `$${price.toFixed(2)}` });
                        }}
                        className={inputClass}
                      />
                    </div>
                  </Field>
                  <Field label="Display price" hint="Shown on the card">
                    <input
                      value={editing.displayPrice}
                      onChange={(e) => updateProduct(editingIndex, { displayPrice: e.target.value })}
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
                        value={editing.rating ?? ''}
                        onChange={(e) =>
                          updateProduct(editingIndex, {
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
                      value={editing.reviewCount ?? ''}
                      onChange={(e) =>
                        updateProduct(editingIndex, {
                          reviewCount: e.target.value === '' ? undefined : Number(e.target.value),
                        })
                      }
                      placeholder="—"
                      className={inputClass}
                    />
                  </Field>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => updateProduct(editingIndex, { visible: !editing.visible })}
                      className={cn(
                        'inline-flex h-[38px] w-full items-center justify-center gap-2 rounded-lg border px-3 text-sm font-semibold transition-colors',
                        editing.visible
                          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'border-white/10 bg-white/5 text-muted-foreground',
                      )}
                    >
                      {editing.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      {editing.visible ? 'Visible in store' : 'Hidden'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="shrink-0 border-t border-white/10 bg-card px-5 py-3 text-xs text-muted-foreground">
                Changes save to draft automatically. Publish on the store page to update the live site.
              </div>
            </div>
          </div>
        </ModalPortal>
      ) : null}
    </SiteDocumentEditorShell>
  );
}
