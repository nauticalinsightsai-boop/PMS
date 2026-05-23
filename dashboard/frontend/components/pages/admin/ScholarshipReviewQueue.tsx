'use client';

import React, { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';

interface Submission {
  id: string;
  source: string;
  email?: string;
  payload?: Record<string, unknown>;
  created_at: string;
}

export function ScholarshipReviewQueue() {
  const [items, setItems] = useState<Submission[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/scholarship-review')
      .then((r) => r.json())
      .then((body) => {
        if (body.error) setError(body.error);
        else setItems(body.submissions ?? []);
      })
      .catch(() => setError('Failed to load scholarship requests'));
  }, []);

  return (
    <GlassCard className="p-6">
      <h2 className="text-xl font-bold mb-4">Scholarship review queue</h2>
      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
      {!error && items.length === 0 && (
        <p className="text-sm text-muted-foreground">No scholarship review submissions yet.</p>
      )}
      <ul className="space-y-3">
        {items.map((s) => (
          <li key={s.id} className="rounded-lg border p-3 text-sm">
            <div className="font-semibold">{s.email ?? 'No email'}</div>
            <pre className="text-[10px] mt-2 overflow-auto max-h-24 bg-slate-50 dark:bg-slate-900 p-2 rounded">
              {JSON.stringify(s.payload, null, 2)}
            </pre>
            <div className="text-[10px] text-muted-foreground mt-1">{s.created_at}</div>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}
