'use client';
import { motion } from "motion/react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, HelpCircle } from "lucide-react";
import { useWebsiteData } from "@/services/WebsiteDataService";
import { BRAND, CTAS } from "@/lib/brand-voice";
import { SectionAmbience, sectionSurface } from "@/components/SectionAmbience";
import { PricingComplianceNote } from "@/components/PricingComplianceNote";
import { REGION_COPY } from "@/lib/brand-voice";

const faqs = [
  {
    question: "What is the difference between PMP and CAPM?",
    answer: "The PMP (Project Management Professional) is for experienced project managers with at least 3 years of experience. The CAPM (Certified Associate in Project Management) is an entry-level certification for those with little to no experience but who want to demonstrate their fundamental knowledge."
  },
  {
    question: "How long does it take to prepare for the PMP exam?",
    answer: "Most students spend between 2 to 4 months preparing, depending on their existing knowledge and how much time they can dedicate each week. We recommend at least 100 hours of study time."
  },
  {
    question: "Are your practice exams updated for the 2024 format?",
    answer: "Yes, all our study materials and practice exams are updated annually to reflect the latest PMI Exam Content Outline (ECO). Our 2024 materials include predictive, agile, and hybrid methodologies."
  },
  {
    question: "Do you guarantee exam passes?",
    answer: `${BRAND.name} does not offer guaranteed pass claims. We provide structured preparation, mock exam practice, weak-area diagnosis, and readiness reviews so you can assess whether you are prepared before scheduling your exam.`
  },
  {
    question: "Can I access the community without a paid membership?",
    answer: "Yes, public community access is available on the free tier. Private study circles and mentor-led Q&A sessions are part of Professional and Mastery membership support."
  },
  {
    question: "How does regional pricing work?",
    answer: `${REGION_COPY.pricingSelector} ${REGION_COPY.southAsiaNote} Active members receive 20% off the displayed regional tuition price on certification pathways.`
  }
];

export function FAQ() {
  const { get } = useWebsiteData();

  return (
    <div className="flex flex-col min-h-screen">
      <section className={sectionSurface('cool', 'py-16 md:py-24 border-b border-sandstone/60 dark:border-slate-800')}>
        <SectionAmbience tone="cool" />
        <div className="container relative z-10 mx-auto">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex p-3 rounded-2xl bg-brand-purple/10 text-brand-purple mb-6">
              <HelpCircle className="h-8 w-8" />
            </div>
            <h1 className="font-heading text-4xl font-bold text-slate-900 dark:text-white mb-6">
              {get('faq_title', 'Frequently Asked Questions')}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-lg mx-auto">
              {get('faq_subtitle', 'Answers on certification pathways, readiness support, community access, and regional pricing.')}
            </p>
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search for answers..." className="pl-10 h-12" />
            </div>
          </div>
        </div>
      </section>

      <section className={sectionSurface('soft', 'py-20')}>
        <SectionAmbience tone="soft" />
        <div className="container relative z-10 mx-auto">
          <div className="max-w-3xl mx-auto">
            <Accordion {...({ type: "single", collapsible: true } as any)} className="w-full space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-white dark:bg-slate-900 px-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <AccordionTrigger className="text-left font-bold py-6 hover:text-brand-purple hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-slate-400 pb-6 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <div className="mt-12 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 bg-slate-50/50 dark:bg-slate-900/50">
              <h2 className="text-lg font-bold mb-4">Regional pricing policy</h2>
              <PricingComplianceNote />
            </div>
          </div>
        </div>
      </section>

      <section className={sectionSurface('warm', 'py-20')}>
        <SectionAmbience tone="warm" />
        <div className="container relative z-10 mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-muted-foreground mb-8">Can't find the answer you're looking for? Please chat to our friendly team.</p>
          <div className="flex justify-center gap-4">
            <Button className="bg-brand-purple hover:bg-brand-purple/90">Contact Support</Button>
            <Button variant="outline">Visit Help Center</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
