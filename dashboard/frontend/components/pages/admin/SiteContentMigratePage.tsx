'use client';

import React, { useState } from 'react';
import { Database, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { CTAButton } from '@/components/ui/CTAButton';
import { FIELD_KEYS, buildAllSeedDocuments } from '@pms/site-content';
import { WebsiteDataService } from '@/services/WebsiteDataService';
import { validateFieldContent } from '@pms/site-content';

export function SiteContentMigratePage() {
  const [status, setStatus] = useState<'idle' | 'running' | 'done' | 'error'>('idle');
  const [log, setLog] = useState<string[]>([]);
  const [publish, setPublish] = useState(false);

  const append = (line: string) => setLog((prev) => [...prev, line]);

  const runSeed = async () => {
    setStatus('running');
    setLog([]);
    const docs = buildAllSeedDocuments();
    try {
      for (const doc of docs) {
        const check = validateFieldContent(doc.field_key, doc.content);
        if (!check.success) {
          throw new Error(`Validation failed: ${doc.field_key}`);
        }
        await WebsiteDataService.saveDraft(doc.field_key, doc.content as Record<string, unknown>);
        append(`Saved draft: ${doc.field_key}`);
        if (publish) {
          await WebsiteDataService.publish(doc.field_key);
          append(`Published: ${doc.field_key}`);
        }
      }
      setStatus('done');
      append(`Completed ${docs.length} documents.`);
    } catch (err) {
      setStatus('error');
      append(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Database className="h-8 w-8 text-brand-orange" />
          Site content migration
        </h1>
        <p className="text-slate-500 mt-2">
          Seed default CMS documents into Supabase <code className="text-sm">website_data</code>.
          Safe to re-run — upserts by field key.
        </p>
      </div>

      <GlassCard className="p-6 space-y-4">
        <p className="text-sm text-slate-600">
          Documents: {Object.values(FIELD_KEYS).filter((k) => k !== FIELD_KEYS.GLOBAL_CONTENT && k !== FIELD_KEYS.SITE_SETTINGS).join(', ')}
        </p>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" checked={publish} onChange={(e) => setPublish(e.target.checked)} />
          Publish immediately after seed
        </label>
        <CTAButton onClick={runSeed} disabled={status === 'running'} className="gap-2">
          {status === 'running' ? 'Seeding…' : 'Run seed'}
          <Send className="h-4 w-4" />
        </CTAButton>
      </GlassCard>

      {log.length > 0 && (
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            {status === 'done' && <CheckCircle2 className="h-5 w-5 text-green-600" />}
            {status === 'error' && <AlertCircle className="h-5 w-5 text-red-600" />}
            <span className="font-bold">Log</span>
          </div>
          <ul className="text-sm font-mono space-y-1 text-slate-600">
            {log.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </GlassCard>
      )}
    </div>
  );
}
