'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import BeforeAfterSlider from '../BeforeAfterSlider';

export default function TransformationSection() {
  return (
    <section className="py-12 md:py-24 px-6 md:px-16 bg-[#030303] [--section-bg:#030303]">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-16 items-center">
          <div className="lg:col-span-2 order-2 lg:order-1">
            <span className="text-[var(--accent)] text-[10px] md:text-xs font-bold uppercase tracking-widest mb-3 md:mb-4 block">
              Workshop Proof
            </span>
            <h2 className="font-display text-2xl md:text-5xl font-bold uppercase text-white leading-[0.95] mb-4 md:mb-6">
              See the Finish Before You Enquire<span className="text-[var(--accent)]">.</span>
            </h2>
            <p className="text-gray-400 text-xs md:text-base leading-relaxed mb-6 md:mb-8">
              Explore real FDL work before choosing parts, fitment or a custom quote. The gallery supports the buying journey rather than replacing it.
            </p>
            <Link href="/gallery" className="inline-flex items-center gap-3 text-white text-xs md:text-sm font-bold uppercase tracking-widest hover:text-[var(--accent)] transition-colors group">
              <span>View Full Gallery</span>
              <ArrowRight size={14} className="md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="lg:col-span-3 order-1 lg:order-2">
            <BeforeAfterSlider
              beforeImage="/gallery/before.png"
              afterImage="/gallery/after.jpg"
              beforeLabel="Before"
              afterLabel="After"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
