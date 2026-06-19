'use client';
import * as React from "react";
import { Suspense } from 'react';
import { ContactRegionalExtras } from '@/components/ContactRegionalExtras';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Globe, MessageSquare, MessageCircle } from "lucide-react";
import { useWebsiteData } from "@/services/WebsiteDataService";
import { SectionAmbience, sectionSurface } from "@/components/SectionAmbience";
import { submitPublicInteraction } from '@/lib/interactions/submit-public';
import { useSimpleFormRecovery } from '@/components/conversion-recovery/useSimpleFormRecovery';
import {
  getPmsWhatsAppDisplay,
  getPmsWhatsAppUrl,
  isWhatsAppConfigured,
  PMS_REGIONAL_SUPPORT_NOTE,
  PMS_SUPPORT_EMAIL,
} from '@/config/pms-site';
import { TrackedContactLink } from '@/components/analytics/TrackedContactLink';
import { PageHeroWithImage } from '@/components/marketing/PageMarketingImage';
import { MARKETING_PAGE_IMAGES } from '@/lib/marketing-stock-images';

export function Contact() {
  const { get } = useWebsiteData();
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [subject, setSubject] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [formError, setFormError] = React.useState<string | null>(null);
  const [formSent, setFormSent] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const { touch, onSuccess } = useSimpleFormRecovery({
    variant: 'contact_partial',
    isDone: formSent,
    hasPartialData: Boolean(
      firstName.trim() || lastName.trim() || email.trim() || subject.trim() || message.trim(),
    ),
    parentSurface: 'contact',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !message) {
      setFormError("Please enter your email and message.");
      setFormSent(false);
      return;
    }
    setFormError(null);
    setSubmitting(true);
    const pagePath = typeof window !== 'undefined' ? window.location.pathname : undefined;
    const res = await submitPublicInteraction({
      source: 'contact',
      subject: subject || 'Contact form inquiry',
      email,
      formContext: {
        formId: 'contact_page',
        formLabel: 'Contact page',
        pagePath,
      },
      payload: {
        firstName,
        lastName,
        message,
        subject,
      },
    });
    setSubmitting(false);
    if (!res.ok) {
      setFormError(res.error ?? 'Could not send your message. Please try again.');
      setFormSent(false);
      return;
    }
    onSuccess();
    setFormSent(true);
    setFirstName('');
    setLastName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <section className={sectionSurface('blend', 'py-16 md:py-24')}>
        <SectionAmbience tone="blend" />
        <div className="container relative z-10 mx-auto">
          <PageHeroWithImage image={MARKETING_PAGE_IMAGES.contact} priority>
            <div className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
              <h1 className="font-heading text-4xl font-bold text-slate-900 dark:text-white mb-6">
                {get('contact_title', 'Get in Touch')}
              </h1>
              <p className="text-lg text-muted-foreground">
                {get('contact_subtitle', 'Have questions about our certifications or membership? Our team is here to help you navigate your career path.')}
              </p>
            </div>
          </PageHeroWithImage>
        </div>
      </section>

      <section className={sectionSurface('soft', 'py-20')}>
        <SectionAmbience tone="soft" />
        <div className="container relative z-10 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-4 space-y-8">
              <h2 className="text-2xl font-bold tracking-tight">Contact information</h2>
              <div className="flex gap-4">
                <div className="p-3 rounded-xl bg-brand-purple/10 text-brand-purple h-fit">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold">Email Us</h3>
                  <TrackedContactLink
                    href={`mailto:${PMS_SUPPORT_EMAIL}`}
                    contactMethod="email"
                    contactContext="general"
                    ctaText="Contact page email"
                    className="text-sm text-muted-foreground mt-1 hover:text-brand-orange transition-colors"
                  >
                    {PMS_SUPPORT_EMAIL}
                  </TrackedContactLink>
                  <p className="text-xs text-muted-foreground mt-1">We typically respond within 24 hours.</p>
                </div>
              </div>
              {isWhatsAppConfigured() ? (
                <div className="flex gap-4">
                  <div className="p-3 rounded-xl bg-green-600/10 text-green-600 h-fit">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold">WhatsApp</h3>
                    <TrackedContactLink
                      href={getPmsWhatsAppUrl()}
                      contactMethod="whatsapp"
                      contactContext="general"
                      ctaText="Contact page WhatsApp"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground mt-1 hover:text-brand-orange transition-colors"
                    >
                      {getPmsWhatsAppDisplay()}
                    </TrackedContactLink>
                    <p className="text-xs text-muted-foreground mt-1">Message us for pathway or enrollment questions.</p>
                  </div>
                </div>
              ) : null}
              <div className="flex gap-4">
                <div className="p-3 rounded-xl bg-indigo-600/10 text-indigo-600 h-fit">
                  <Globe className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold">Regional support</h3>
                  <p className="text-sm text-muted-foreground mt-1">{PMS_REGIONAL_SUPPORT_NOTE}</p>
                </div>
              </div>
              <Card className="bg-slate-900 text-white border-none overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-brand-orange" /> Live Chat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-300 mb-4">Need immediate help? Chat with our support experts right now.</p>
                  <Button type="button" disabled variant="outline" className="w-full">
                    Start Chat (coming soon)
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-8">
              <h2 className="text-2xl font-bold tracking-tight mb-6">Send a message</h2>
              <Card className="border-slate-100 shadow-xl p-4 md:p-8">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input
                        id="first-name"
                        name="first-name"
                        placeholder="John"
                        value={firstName}
                        onChange={(e) => {
                          setFirstName(e.target.value);
                          touch();
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input
                        id="last-name"
                        name="last-name"
                        placeholder="Doe"
                        value={lastName}
                        onChange={(e) => {
                          setLastName(e.target.value);
                          touch();
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        touch();
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="How can we help?"
                      value={subject}
                      onChange={(e) => {
                        setSubject(e.target.value);
                        touch();
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us more about your inquiry..."
                      className="min-h-[150px]"
                      required
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        touch();
                      }}
                    />
                  </div>
                  {formError && (
                    <p className="text-sm text-destructive font-medium" role="alert">{formError}</p>
                  )}
                  {formSent && !formError && (
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium" role="status">
                      Thank you: your message has been received. We will respond shortly.
                    </p>
                  )}
                  <Button type="submit" variant="brand" className="w-full h-12 text-lg" disabled={submitting}>
                    {submitting ? 'Sending…' : 'Send Message'}
                  </Button>
                </form>
                <Suspense fallback={null}>
                  <ContactRegionalExtras />
                </Suspense>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}