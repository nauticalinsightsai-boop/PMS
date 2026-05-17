'use client';
import { motion } from "motion/react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Info, Zap, Target, Clock, Tag } from "lucide-react";
import Link from "next/link";
import * as siteData from "@/data/siteData";

export function Compare() {
  // Select a few key certifications to compare by default
  const compareIds = ["pmp", "capm", "pmi-acp", "prince2"];
  const compareCerts = siteData.certifications.filter(c => compareIds.includes(c.id));

  const features = [
    { label: "Primary Value", key: "outputValue" },
    { label: "Target Audience", key: "targetAudience" },
    { label: "Foundation Price", key: "foundationPrice" },
    { label: "Professional Price", key: "professionalPrice" },
    { label: "Elite Price", key: "elitePrice" },
    { label: "Exam Format", key: "examFormat" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950">
      <section className="bg-slate-50 dark:bg-slate-900/30 py-24 md:py-32 border-b border-slate-100 dark:border-slate-800">
        <div className="container mx-auto px-4 text-center">
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

      <section className="py-24">
        <div className="container mx-auto px-4">
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
                      let value: any = "";
                      if (feature.key === "foundationPrice") value = `$${cert.pricing.Foundation.price}`;
                      else if (feature.key === "professionalPrice") value = `$${cert.pricing.Professional.price}`;
                      else if (feature.key === "elitePrice") value = `$${cert.pricing.Elite.price}`;
                      else value = (cert as any)[feature.key] || "Contact for details";

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
        </div>
      </section>

      <section className="py-24 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-800">
        <div className="container mx-auto px-4">
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
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <Button className="bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-brand-orange dark:hover:bg-brand-orange dark:hover:text-white text-white h-14 px-10 rounded-2xl font-bold text-lg transition-all">
                    Talk to an Advisor
                  </Button>
                  <Button variant="outline" className="border-slate-200 dark:border-slate-700 h-14 px-10 rounded-2xl font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                    Download Guide
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
