'use client';

/** Shared image URL picker for CMS editors */
export function MediaPicker({
  value,
  onChange,
  label = 'Image URL',
}: {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
      <input
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://… or upload via Media Library"
        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-brand-orange"
      />
      {value ? (
        <img src={value} alt="" className="mt-2 h-24 w-auto rounded-xl border border-white/10 object-cover" />
      ) : null}
    </label>
  );
}
