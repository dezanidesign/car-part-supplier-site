'use client';

import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import QuoteForm from '../forms/QuoteForm';

const ContactPage = () => (
  <div className="min-h-screen bg-[var(--bg-dark)] pb-24 px-6 md:px-16 animate-in fade-in duration-700 [--section-bg:var(--bg-dark)]">
    <div className="max-w-[1920px] mx-auto">
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
                    <p className="text-white text-sm font-bold">Unit C3, 511 Bradford Rd</p>
                    <p className="text-gray-400 text-sm">Batley, WF17 8LL</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Phone size={18} className="text-[var(--accent)] flex-shrink-0" />
                  <a href="tel:07869022673" className="text-white text-sm font-bold hover:text-[var(--accent)] transition-colors">
                    07869 022673
                  </a>
                </div>
                <div className="flex items-center gap-4">
                  <Mail size={18} className="text-[var(--accent)] flex-shrink-0" />
                  <a href="mailto:info@fdlbespoke.co.uk" className="text-white text-sm font-bold hover:text-[var(--accent)] transition-colors">
                    info@fdlbespoke.co.uk
                  </a>
                </div>
                <div className="flex items-center gap-4">
                  <Clock size={18} className="text-[var(--accent)] flex-shrink-0" />
                  <span className="text-gray-400 text-sm">Thu - Sat: 10am - Close</span>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-8">
              <h3 className="font-display text-lg text-white font-bold uppercase mb-4">Follow Us</h3>
              <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <a href="https://www.instagram.com/fdlbespoke" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent)] transition-colors">
                  Instagram
                </a>
                <a href="https://www.facebook.com/fdlbespoke" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent)] transition-colors">
                  Facebook
                </a>
                <a href="https://www.tiktok.com/@fdlbespoke" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent)] transition-colors">
                  TikTok
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Quote Form */}
        <div className="lg:col-span-3">
          <div className="bg-[var(--bg-card)] p-6 md:p-12 border border-white/5">
            <h2 className="font-display text-2xl md:text-3xl font-bold uppercase text-white mb-2">Quote Request</h2>
            <p className="text-gray-500 text-sm mb-8">Fill in the details below and we&apos;ll get back to you with a custom quote.</p>
            <QuoteForm />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ContactPage;
