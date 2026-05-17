'use client';
import { motion } from "motion/react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, HelpCircle } from "lucide-react";
import { useWebsiteData } from "@/services/WebsiteDataService";

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
    question: "Do you offer a pass guarantee?",
    answer: "We offer a 'Pass on First Try' guarantee for our Professional members. If you complete our full study pathway and don't pass, we will provide additional coaching and pay for your re-examination fee."
  },
  {
    question: "Can I access the community without a paid membership?",
    answer: "Yes, we have public forums available for free members. However, private mentorship groups and expert-led Q&A sessions are reserved for Professional and Enterprise members."
  }
];

export function FAQ() {
  const { get } = useWebsiteData();

  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-white py-16 md:py-24 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex p-3 rounded-2xl bg-brand-purple/10 text-brand-purple mb-6">
              <HelpCircle className="h-8 w-8" />
            </div>
            <h1 className="font-heading text-4xl font-bold text-slate-900 mb-6">
              {get('faq_title', 'Frequently Asked Questions')}
            </h1>
            <p className="text-slate-500 mb-8 max-w-lg mx-auto">
              {get('faq_subtitle', 'Find answers to common questions about our certifications, community, and support.')}
            </p>
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search for answers..." className="pl-10 h-12" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Accordion {...({ type: "single", collapsible: true } as any)} className="w-full space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-white px-6 rounded-2xl border border-slate-100 shadow-sm">
                  <AccordionTrigger className="text-left font-bold py-6 hover:text-brand-purple hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 pb-6 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
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
