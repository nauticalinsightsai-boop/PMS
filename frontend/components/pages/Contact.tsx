'use client';
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, MessageSquare } from "lucide-react";
import { useWebsiteData } from "@/services/WebsiteDataService";

export function Contact() {
  const { get } = useWebsiteData();

  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-slate-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="font-heading text-4xl font-bold text-slate-900 mb-6">
              {get('contact_title', 'Get in Touch')}
            </h1>
            <p className="text-lg text-muted-foreground">
              {get('contact_subtitle', 'Have questions about our certifications or membership? Our team is here to help you navigate your career path.')}
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-4 space-y-8">
              <div className="flex gap-4">
                <div className="p-3 rounded-xl bg-brand-purple/10 text-brand-purple h-fit">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold">Email Us</h3>
                  <p className="text-sm text-muted-foreground mt-1">support@pmstructure.com</p>
                  <p className="text-xs text-muted-foreground mt-1">We typically respond within 24 hours.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="p-3 rounded-xl bg-brand-orange/10 text-brand-orange h-fit">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold">Call Us</h3>
                  <p className="text-sm text-muted-foreground mt-1">+1 (555) 123-4567</p>
                  <p className="text-xs text-muted-foreground mt-1">Mon-Fri, 9am-6pm EST</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="p-3 rounded-xl bg-indigo-600/10 text-indigo-600 h-fit">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold">Our Office</h3>
                  <p className="text-sm text-muted-foreground mt-1">123 Project Way, Suite 400</p>
                  <p className="text-sm text-muted-foreground">London, UK EC1A 1BB</p>
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
                  <Button className="w-full bg-brand-purple hover:bg-brand-purple/90">Start Chat</Button>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-8">
              <Card className="border-slate-100 shadow-xl p-4 md:p-8">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input id="first-name" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input id="last-name" placeholder="Doe" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="john@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="How can we help?" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="Tell us more about your inquiry..." className="min-h-[150px]" />
                  </div>
                  <Button className="w-full h-12 bg-brand-purple hover:bg-brand-purple/90 text-lg">Send Message</Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
