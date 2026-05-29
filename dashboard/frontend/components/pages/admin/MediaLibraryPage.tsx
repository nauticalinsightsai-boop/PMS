'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { supabase } from '@/lib/supabase';

type MediaItem = {
  name: string;
  url: string;
  created_at: string;
};

export function MediaLibraryPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    const { data, error } = await supabase.storage.from('site-media').list('', { limit: 100 });
    if (error) {
      console.error(error);
      return;
    }
    const mapped = (data ?? [])
      .filter((f) => f.name && !f.name.startsWith('.'))
      .map((f) => {
        const { data: pub } = supabase.storage.from('site-media').getPublicUrl(f.name);
        return { name: f.name, url: pub.publicUrl, created_at: f.created_at ?? '' };
      });
    setItems(mapped);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const path = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from('site-media').upload(path, file, { upsert: false });
    setUploading(false);
    if (error) {
      alert(error.message);
      return;
    }
    await load();
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <ImageIcon className="h-7 w-7 text-brand-orange" />
        Media library
      </h1>
      <GlassCard className="p-6">
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-orange text-white text-sm font-bold">
            <Upload className="h-4 w-4" />
            {uploading ? 'Uploading…' : 'Upload image'}
          </span>
          <input type="file" accept="image/*" className="hidden" onChange={onUpload} disabled={uploading} />
        </label>
      </GlassCard>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <GlassCard key={item.name} className="p-2 overflow-hidden">
            <img src={item.url} alt={item.name} className="w-full aspect-square object-cover rounded-xl" />
            <p className="text-xs truncate mt-2 font-mono">{item.name}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
