'use client';

import React, { useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';

interface OrderRow {
  id: string;
  offering_id: string;
  region_id: string;
  email: string;
  usd_cents: number;
  status: string;
  created_at: string;
}

export function BookingsOrders() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/orders')
      .then((r) => r.json())
      .then((body) => {
        if (body.error) setError(body.error);
        else setOrders(body.orders ?? []);
      })
      .catch(() => setError('Failed to load orders'));
  }, []);

  return (
    <GlassCard className="p-6">
      <h2 className="text-xl font-bold mb-4">Client bookings (orders)</h2>
      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
      {!error && orders.length === 0 && (
        <p className="text-sm text-muted-foreground">No orders yet. Configure Supabase and run checkout.</p>
      )}
      <ul className="space-y-3">
        {orders.map((o) => (
          <li key={o.id} className="rounded-lg border p-3 text-sm">
            <div className="font-semibold">{o.offering_id}</div>
            <div className="text-muted-foreground">
              {o.email} · {o.region_id} · ${(o.usd_cents / 100).toFixed(2)} · {o.status}
            </div>
            <div className="text-[10px] text-muted-foreground mt-1">{o.created_at}</div>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}
