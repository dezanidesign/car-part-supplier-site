'use client';

import React from 'react';
import QuoteForm from '../forms/QuoteForm';
import { QUOTE_PROCESS_STEPS } from '@/lib/siteContent';

export default function QuoteSection() {
  return (
    <section className="py-16 md:py-32 px-6 md:px-16 bg-[#080808] [--section-bg:#080808]">
      <div className="max-w-4xl mx-auto text-center mb-10 md:mb-16">
        <h2 className="font-display text-3xl md:text-6xl font-bold uppercase text-white mb-3 md:mb-6">
          Need a Part, Retrofit or Custom Build Quote<span className="text-[var(--accent)]">?</span>
        </h2>
        <p className="text-gray-400 text-sm md:text-base leading-relaxed">
          Send your vehicle details and what you&apos;re looking for. FDL Bespoke can advise on compatibility, sourcing, installation options and the best next step.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div className="border border-white/10 bg-white/[0.02] p-6 md:p-8">
          <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--accent)]">
            What Happens Next
          </p>
          <div className="space-y-5">
            {QUOTE_PROCESS_STEPS.map((step, index) => (
              <div key={step} className="flex gap-4">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center border border-white/10 text-xs font-bold text-[var(--accent)]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="pt-1 text-sm font-medium text-gray-200">{step}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 border-t border-white/10 pt-6">
            <p className="text-xs leading-relaxed text-gray-500">
              Fitment, availability and installation options are confirmed before any next step is agreed.
            </p>
          </div>
        </div>

        <div className="bg-[var(--bg-card)] p-6 md:p-12 border border-white/5">
          <QuoteForm />
        </div>
      </div>
    </section>
  );
}
