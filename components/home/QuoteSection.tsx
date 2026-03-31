'use client';

import React from 'react';
import QuoteForm from '../forms/QuoteForm';

export default function QuoteSection() {
  return (
    <section className="py-16 md:py-32 px-6 md:px-16 bg-[#080808] [--section-bg:#080808]">
      <div className="max-w-4xl mx-auto text-center mb-10 md:mb-16">
        <h2 className="font-display text-3xl md:text-6xl font-bold uppercase text-white mb-3 md:mb-6">
          Quote <span className="text-outline-strong">Request</span>
        </h2>
        <p className="text-gray-500 text-xs md:text-sm">Get a custom quote for your project</p>
      </div>

      <div className="max-w-3xl mx-auto bg-[var(--bg-card)] p-6 md:p-12 border border-white/5">
        <QuoteForm />
      </div>
    </section>
  );
}
