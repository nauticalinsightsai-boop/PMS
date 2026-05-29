import type React from 'react';
import type { CmsStatus } from '@/lib/cms/types';
import { CMS_STATUS_LABEL } from '@/lib/cms/types';
import { cn } from '@/lib/utils';

export function cmsStatusBadge(status: CmsStatus) {
  return cn(
    'inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide',
    status === 'active' && 'bg-green-500/10 text-green-600',
    status === 'draft' && 'bg-muted text-muted-foreground',
  );
}

export function cmsStatusLabel(status: CmsStatus): string {
  return CMS_STATUS_LABEL[status];
}

export function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="mb-1.5 block text-sm font-semibold text-foreground">
      {children}
      {required ? <span className="text-destructive"> *</span> : null}
    </label>
  );
}

export function SectionCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h2 className="mb-5 flex items-center gap-2 text-lg font-bold font-heading">
        <Icon size={18} className="text-muted-foreground" aria-hidden />
        {title}
      </h2>
      {children}
    </section>
  );
}

export function FeatureImageField({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') onChange(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <input
        id="cms-feature-image-upload"
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) handleUpload(file);
        }}
      />
      {value ? (
        <>
          <div className="overflow-hidden rounded-xl border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="Feature preview" className="max-h-72 w-full object-cover" />
          </div>
          <div className="flex flex-wrap gap-2">
            <label
              htmlFor="cms-feature-image-upload"
              className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-lg border border-input bg-background px-4 text-sm font-medium hover:bg-muted/50"
            >
              Replace Image
            </label>
            <button
              type="button"
              onClick={() => onChange('')}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-input bg-background px-4 text-sm font-medium text-destructive hover:bg-muted/50"
            >
              Remove Image
            </button>
          </div>
        </>
      ) : (
        <label
          htmlFor="cms-feature-image-upload"
          className="flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/20 px-6 py-12 text-center transition-colors hover:border-foreground/20 hover:bg-muted/30"
        >
          <span className="text-sm font-semibold text-foreground">Upload Image</span>
          <span className="text-xs text-muted-foreground">PNG, JPG or WEBP up to 5MB</span>
        </label>
      )}
    </div>
  );
}
