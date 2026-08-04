'use client';

import React, { useState } from 'react';
import { Database, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { CTAButton } from '@/components/ui/CTAButton';
import { FIELD_KEYS, buildAllSeedDocuments } from '@pms/site-content';
import { WebsiteDataService } from '@/services/WebsiteDataService';
import { validateFieldContent } from '@pms/site-content';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Input } from '@/components/ui/input';

const SEED_DRAFT_CONFIRMATION = 'SEED WEBSITE CONTENT';
const SEED_AND_PUBLISH_CONFIRMATION = 'SEED AND PUBLISH WEBSITE CONTENT';

export function SiteContentMigratePage() {
  const [status, setStatus] = useState<'idle' | 'running' | 'done' | 'error'>('idle');
  const [log, setLog] = useState<string[]>([]);
  const [publish, setPublish] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const requiredConfirmation = publish
    ? SEED_AND_PUBLISH_CONFIRMATION
    : SEED_DRAFT_CONFIRMATION;

  const append = (line: string) => setLog((prev) => [...prev, line]);

  const runSeed = async () => {
    if (confirmationText !== requiredConfirmation || status === 'running') return;
    setConfirmDialogOpen(false);
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
      setConfirmationText('');
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
          This protected action upserts by field key. Review the exact mode and confirmation before running it.
        </p>
      </div>

      <GlassCard className="p-6 space-y-4">
        <p className="text-sm text-slate-600">
          Documents: {Object.values(FIELD_KEYS).filter((k) => k !== FIELD_KEYS.GLOBAL_CONTENT && k !== FIELD_KEYS.SITE_SETTINGS).join(', ')}
        </p>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={publish}
            onChange={(e) => {
              setPublish(e.target.checked);
              setConfirmationText('');
              setConfirmDialogOpen(false);
            }}
          />
          Publish immediately after seed
        </label>
        <div className="space-y-2">
          <label htmlFor="site-content-seed-confirmation" className="text-sm font-semibold text-foreground">
            Type <code>{requiredConfirmation}</code> to continue
          </label>
          <Input
            id="site-content-seed-confirmation"
            value={confirmationText}
            onChange={(event) => setConfirmationText(event.target.value)}
            autoComplete="off"
          />
        </div>
        <CTAButton
          onClick={() => setConfirmDialogOpen(true)}
          disabled={status === 'running' || confirmationText !== requiredConfirmation}
          className="gap-2"
        >
          {status === 'running' ? 'Seeding…' : 'Review seed'}
          <Send className="h-4 w-4" />
        </CTAButton>
      </GlassCard>

      <ConfirmDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        title={publish ? 'Seed and publish website content?' : 'Seed hidden website drafts?'}
        description={
          publish
            ? 'This will save every validated seed document and then publish it. No action runs until you confirm.'
            : 'This will save validated seed documents as drafts only. No action runs until you confirm.'
        }
        confirmLabel={publish ? 'Seed and publish' : 'Seed drafts'}
        confirmVariant="brand"
        confirmDisabled={confirmationText !== requiredConfirmation || status === 'running'}
        onConfirm={() => void runSeed()}
      />

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
