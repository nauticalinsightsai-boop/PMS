'use client';
import * as React from 'react';
import { motion } from "motion/react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import Link from "next/link";
import * as siteData from "@/data/siteData";
import { SectionAmbience, sectionSurface } from "@/components/SectionAmbience";
import { useRegion } from "@/contexts/RegionContext";
import {
  getListingPriceForCert,
  getOfferingsForSiteCert,
  getTierPriceDisplay,
  resolveFullPriceDisplay,
} from "@/lib/regional-catalogue";
import { PricingComplianceNote } from "@/components/PricingComplianceNote";

function ComparePriceCell({ siteId, tierId }: { siteId: string; tierId: string }) {
  const { regionId, gccCountry } = useRegion();
  const offering = getOfferingsForSiteCert(siteId).find((o) => o.tierId === tierId);
  if (!offering) return <span>—</span>;
  const full = resolveFullPriceDisplay(offering, regionId, gccCountry);
  return (
    <div className="space-y-1 text-sm">
      {full.showScholarshipLabels && full.original && (
        <div className="text-slate-400 line-through text-xs">{full.original}</div>
      )}
      <div className="font-bold text-slate-800 dark:text-slate-200">{full.active ?? '—'}</div>
      {full.membership && (
        <div className="text-brand-purple text-xs font-semibold">Member: {full.membership}</div>
      )}
    </div>
  );
}

export function Compare() {
  const { regionId, gccCountry } = useRegion();
  const compareIds = ["pmp", "capm", "pmi-acp", "prince2"];
  const compareCerts = siteData.certifications.filter(c => compareIds.includes(c.id));

  const features = [
    { label: "Primary Value", key: "outputValue" },
    { label: "Target Audience", key: "targetAudience" },
    { label: "Foundation Price", key: "foundationPrice" },
    { label: "Professional Price", key: "professionalPrice" },
    { label: "Mastery Price", key: "elitePrice" },
    { label: "Exam Format", key: "examFormat" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <section className={sectionSurface('purple', 'py-24 md:py-32 border-b border-sandstone/60 dark:border-slate-800')}>
        <SectionAmbience tone="purple" />
        <div className="container relative z-10 mx-auto text-center">
          <Badge className="mb-6 bg-brand-orange/10 text-brand-orange border-none px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]">
            Comparison Matrix
          </Badge>
          <h1 className="font-heading text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-8 tracking-tight">
            Compare <span className="text-brand-orange">Certifications</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
            Find the right certification for your current experience level and future career goals.
          </p>
        </div>
      </section>

      <section className={sectionSurface('soft', 'py-24')}>
        <SectionAmbience tone="soft" />
        <div className="container relative z-10 mx-auto">
          <div className="overflow-x-auto rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-900">
            <Table>
              <TableHeader className="bg-slate-900 dark:bg-slate-950 text-white">
                <TableRow className="hover:bg-slate-900 dark:hover:bg-slate-950 border-none">
                  <TableHead className="w-[250px] text-white font-bold py-8 px-8 text-lg">Key Features</TableHead>
                  {compareCerts.map(cert => (
                    <TableHead key={cert.id} className="text-white font-bold text-center py-8 px-6 min-w-[200px]">
                      <div className="text-brand-orange text-xs uppercase tracking-widest mb-2">{cert.familyId}</div>
                      <div className="text-xl tracking-tight">{cert.name}</div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {features.map((feature, index) => (
                  <TableRow key={feature.label} className={index % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50/50 dark:bg-slate-800/30"}>
                    <TableCell className="font-bold py-8 px-8 text-slate-900 dark:text-white border-r border-slate-100 dark:border-slate-800">
                      {feature.label}
                    </TableCell>
                    {compareCerts.map(cert => {
                      let value: React.ReactNode = "";
                      if (feature.key === "foundationPrice") {
                        value = <ComparePriceCell siteId={cert.id} tierId="foundation" />;
                      } else if (feature.key === "professionalPrice") {
                        const listing = getListingPriceForCert(cert.id, regionId, gccCountry);
                        value = listing.active ? (
                          <div className="space-y-1 text-sm">
                            {listing.showScholarship && listing.original && (
                              <div className="text-slate-400 line-through text-xs">{listing.original}</div>
                            )}
                            <div className="font-bold">{listing.active}</div>
                            {listing.membership && (
                              <div className="text-brand-purple text-xs font-semibold">Member: {listing.membership}</div>
                            )}
                          </div>
                        ) : (
                          getTierPriceDisplay(cert.id, 'professional', regionId, gccCountry) ?? '—'
                        );
                      } else if (feature.key === "elitePrice") {
                        const mastery = getOfferingsForSiteCert(cert.id).find((x) =>
                          ['mastery', 'mastery_corporate', 'mastery_advisory'].includes(x.tierId),
                        );
                        value = mastery ? (
                          <ComparePriceCell siteId={cert.id} tierId={mastery.tierId} />
                        ) : (
                          '—'
                        );
                      } else {
                        value = String((cert as unknown as Record<string, unknown>)[feature.key] ?? 'Contact for details');
                      }

                      return (
                        <TableCell key={`${cert.id}-${feature.key}`} className="text-center py-8 px-6 text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                          {value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
                <TableRow className="bg-white dark:bg-slate-900">
                  <TableCell className="font-bold py-12 px-8 text-slate-900 dark:text-white border-r border-slate-100 dark:border-slate-800">
                    Next Steps
                  </TableCell>
                  {compareCerts.map(cert => (
                    <TableCell key={`${cert.id}-cta`} className="text-center py-12 px-6">
                      <Link href={`/certifications/${cert.id}`}>
                        <Button size="lg" className="bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-brand-orange dark:hover:bg-brand-orange dark:hover:text-white text-white font-bold rounded-xl transition-all">
                          View Pathway
                        </Button>
                      </Link>
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <PricingComplianceNote className="mt-10 max-w-3xl mx-auto" />
        </div>
      </section>

      <section className={sectionSurface('warm', 'py-24 border-t border-sandstone/60 dark:border-slate-800')}>
        <SectionAmbience tone="warm" />
        <div className="container relative z-10 mx-auto">
          <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 p-12 md:p-16 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/5 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
              <div className="h-24 w-24 rounded-[2rem] bg-brand-orange/10 text-brand-orange flex items-center justify-center shrink-0">
                <Info className="h-12 w-12" />
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold mb-4 tracking-tight">Not sure which one to choose?</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed font-medium text-lg">
                  Our certification experts can help you map out a personalized professional development plan based on your experience and career aspirations.
                </p>
                <Link href="/contact">
                  <Button className="bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-brand-orange h-14 px-10 rounded-2xl font-bold text-lg">
                    Talk to an Advisor
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
