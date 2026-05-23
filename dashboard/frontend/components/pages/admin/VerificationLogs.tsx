'use client';

import React, { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';

interface LogRow {
  id: string;
  region_id: string | null;
  residence_country: string | null;
  billing_country: string | null;
  verified: boolean;
  created_at: string;
}

export function VerificationLogs() {
  const [logs, setLogs] = useState<LogRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/verification-logs')
      .then((r) => r.json())
      .then((body) => {
        if (body.error) setError(body.error);
        else setLogs(body.logs ?? []);
      })
      .catch(() => setError('Failed to load verification logs'));
  }, []);

  return (
    <GlassCard className="p-6">
      <h2 className="text-xl font-bold mb-4">Region verification log</h2>
      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
      {!error && logs.length === 0 && (
        <p className="text-sm text-muted-foreground">No verification events yet.</p>
      )}
      <ul className="space-y-3">
        {logs.map((l) => (
          <li key={l.id} className="rounded-lg border p-3 text-sm flex justify-between gap-4">
            <div>
              <div className="font-semibold">{l.region_id ?? '—'}</div>
              <div className="text-muted-foreground text-xs">
                {l.residence_country} / {l.billing_country}
              </div>
            </div>
            <span
              className={
                l.verified
                  ? 'text-green-600 text-xs font-bold'
                  : 'text-amber-600 text-xs font-bold'
              }
            >
              {l.verified ? 'Verified' : 'Failed'}
            </span>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}
