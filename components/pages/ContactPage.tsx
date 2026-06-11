'use client';

import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import QuoteForm from '../forms/QuoteForm';
import CollectionDeliverySection from '@/components/shared/CollectionDeliverySection';
import {
  SITE_ADDRESS,
  SITE_EMAIL,
  SITE_EMAIL_LINK,
  SITE_HOURS,
  SITE_LOCATION,
  SITE_PHONE_DISPLAY,
  SITE_PHONE_LINK,
  SITE_SOCIALS,
  QUOTE_PROCESS_STEPS,
} from '@/lib/siteContent';

const ContactPage = () => (
  <div className="min-h-screen bg-[var(--bg-dark)] pb-24 animate-in fade-in duration-700 [--section-bg:var(--bg-dark)]">
    <div className="max-w-[1920px] mx-auto px-6 md:px-16">
      {/* Header */}
      <div className="mb-16 md:mb-24">
        <span className="text-[var(--accent)] text-xs font-bold uppercase tracking-widest mb-4 block">Get In Touch</span>
        <h1 className="font-display text-5xl md:text-8xl font-bold uppercase text-white leading-[0.9] mb-6">
          Contact <span className="text-outline-accent">Us</span>
        </h1>
      </div>

      <div className="grid lg:grid-cols-5 gap-12 lg:gap-24">
        {/* Left: Business Info */}
        <div className="lg:col-span-2">
          <div className="header-sticky-gap space-y-10 lg:sticky">
            <div>
              <h3 className="font-display text-2xl text-white font-bold uppercase mb-6">Visit Us</h3>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <MapPin size={18} className="text-[var(--accent)] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-white text-sm font-bold">{SITE_LOCATION}</p>
                    <p className="text-gray-400 text-sm">{SITE_ADDRESS}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Phone size={18} className="text-[var(--accent)] flex-shrink-0" />
                  <a href={SITE_PHONE_LINK} className="text-white text-sm font-bold hover:text-[var(--accent)] transition-colors">
                    {SITE_PHONE_DISPLAY}
                  </a>
                </div>
                <div className="flex items-center gap-4">
                  <Mail size={18} className="text-[var(--accent)] flex-shrink-0" />
                  <a href={SITE_EMAIL_LINK} className="text-white text-sm font-bold hover:text-[var(--accent)] transition-colors">
                    {SITE_EMAIL}
                  </a>
                </div>
                <div className="flex items-start gap-4">
                  <Clock size={18} className="text-[var(--accent)] flex-shrink-0 mt-0.5" />
                  <div className="text-gray-400 text-sm leading-relaxed">
                    {SITE_HOURS.map((entry) => (
                      <div key={entry}>{entry}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-8">
              <h3 className="font-display text-lg text-white font-bold uppercase mb-4">Follow Us</h3>
              <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <a href={SITE_SOCIALS.instagram.href} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent)] transition-colors">
                  {SITE_SOCIALS.instagram.label}
                </a>
                <a href={SITE_SOCIALS.facebook.href} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent)] transition-colors">
                  {SITE_SOCIALS.facebook.label}
                </a>
                <a href={SITE_SOCIALS.tiktok.href} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent)] transition-colors">
                  {SITE_SOCIALS.tiktok.label}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Quote Form */}
        <div className="lg:col-span-3">
          <div className="bg-[var(--bg-card)] p-6 md:p-12 border border-white/5">
            <h2 className="font-display text-2xl md:text-3xl font-bold uppercase text-white mb-2">
              Need a Part, Retrofit or Custom Build Quote?
            </h2>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              Send your vehicle details and what you&apos;re looking for. We&apos;ll help confirm compatibility, availability, installation options and the next step.
            </p>
            <div className="mb-8 grid gap-3 md:grid-cols-3">
              {QUOTE_PROCESS_STEPS.map((step, index) => (
                <div key={step} className="border border-white/10 bg-black/20 p-4">
                  <span className="mb-3 block text-[10px] font-bold text-[var(--accent)]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="text-xs leading-relaxed text-gray-300">{step}</p>
                </div>
              ))}
            </div>
            <QuoteForm />
          </div>
        </div>
      </div>
    </div>
    <CollectionDeliverySection className="mt-16 md:mt-24" />
  </div>
);

export default ContactPage;
