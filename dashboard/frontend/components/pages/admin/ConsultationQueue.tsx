'use client';

import React, { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';

interface ConsultationRow {
  id: string;
  email?: string;
  created_at: string;
  payload?: { offeringId?: string; name?: string };
  metadata?: { approvalStatus?: string };
}

export function ConsultationQueue() {
  const [items, setItems] = useState<ConsultationRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const load = () => {
    fetch('/api/admin/consultations')
      .then((r) => r.json())
      .then((body) => {
        if (body.error) setError(body.error);
        else setItems(body.consultations ?? []);
      })
      .catch(() => setError('Failed to load consultations'));
  };

  useEffect(() => {
    load();
  }, []);

  const approve = async (id: string) => {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/consultations/${id}/approve`, { method: 'PATCH' });
      const body = await res.json();
      if (body.error) setError(body.error);
      else load();
    } finally {
      setLoadingId(null);
    }
  };

  const pending = items.filter((i) => i.metadata?.approvalStatus !== 'approved');

  return (
    <GlassCard className="p-6">
      <h2 className="text-xl font-bold mb-2">Mastery consultation queue</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Approve requests to allow checkout for consultation_required offerings (§K.3).
      </p>
      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
      {pending.length === 0 && !error && (
        <p className="text-sm text-muted-foreground">No pending consultations.</p>
      )}
      <ul className="space-y-3">
        {pending.map((row) => (
          <li key={row.id} className="rounded-lg border p-4 text-sm flex flex-wrap justify-between gap-4">
            <div>
              <div className="font-semibold">{row.email ?? 'No email'}</div>
              <div className="text-muted-foreground text-xs mt-1">
                Offering: {row.payload?.offeringId ?? '—'} · {row.created_at}
              </div>
            </div>
            <Button
              size="sm"
              disabled={loadingId === row.id}
              onClick={() => approve(row.id)}
            >
              {loadingId === row.id ? 'Approving…' : 'Approve checkout'}
            </Button>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}
