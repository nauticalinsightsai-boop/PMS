'use client';

import { useEffect, useState } from 'react';
import { getCookiesDocument } from '@/content/legal';
import { LegalDocumentLayout } from '@/components/legal/LegalDocumentLayout';
import {
  readStoredConsent,
  rejectNonEssentialConsent,
  writeStoredConsent,
} from '@/lib/legal/consent';

export function LegalCookiesPage() {
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const categories = readStoredConsent()?.categories;
    setAnalytics(categories?.analytics === true);
    setMarketing(categories?.marketing === true);
  }, []);

  const save = () => {
    writeStoredConsent({ necessary: true, analytics, marketing });
    setSaved(true);
  };

  const reject = () => {
    rejectNonEssentialConsent();
    setAnalytics(false);
    setMarketing(false);
    setSaved(true);
  };

  return (
    <LegalDocumentLayout document={getCookiesDocument()}>
      <section
        aria-labelledby="cookie-preferences-heading"
        className="mt-12 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900"
      >
        <h2
          id="cookie-preferences-heading"
          className="font-heading text-2xl font-bold text-slate-900 dark:text-white"
        >
          Cookie preferences
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Necessary storage stays enabled. You can change or withdraw optional consent at any time.
        </p>
        <div className="mt-6 space-y-4">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={analytics}
              onChange={(event) => {
                setAnalytics(event.target.checked);
                setSaved(false);
              }}
              className="mt-1 h-4 w-4"
            />
            <span>
              <span className="block font-bold text-slate-900 dark:text-white">Analytics</span>
              <span className="text-sm text-slate-600 dark:text-slate-300">
                Helps us understand site usage through Google Analytics.
              </span>
            </span>
          </label>
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={marketing}
              onChange={(event) => {
                setMarketing(event.target.checked);
                setSaved(false);
              }}
              className="mt-1 h-4 w-4"
            />
            <span>
              <span className="block font-bold text-slate-900 dark:text-white">Marketing</span>
              <span className="text-sm text-slate-600 dark:text-slate-300">
                Enables Meta measurement and advertising click-ID attribution.
              </span>
            </span>
          </label>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={save}
            className="rounded-full bg-brand-orange px-5 py-2.5 text-sm font-bold text-white hover:opacity-90"
          >
            Save preferences
          </button>
          <button
            type="button"
            onClick={reject}
            className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-bold text-slate-800 dark:border-slate-600 dark:text-white"
          >
            Reject optional cookies
          </button>
          {saved ? (
            <span role="status" className="self-center text-sm font-medium text-emerald-700">
              Preferences saved.
            </span>
          ) : null}
        </div>
      </section>
    </LegalDocumentLayout>
  );
}
