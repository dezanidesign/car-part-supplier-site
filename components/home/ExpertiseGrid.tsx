'use client';

import React from 'react';
import Link from 'next/link';
import { Wrench, Shield, RefreshCw, ArrowRight } from 'lucide-react';

const EXPERTISE_ITEMS = [
  {
    icon: Wrench,
    title: "Bespoke Conversions",
    desc: "Full vehicle transformations tailored to your exact specification — bodykits, carbon fibre, and complete builds."
  },
  {
    icon: Shield,
    title: "Vehicle Security",
    desc: "Ghost immobilisers, tracking systems, dashcams, and reverse cameras to protect your investment."
  },
  {
    icon: RefreshCw,
    title: "Facelift Conversions",
    desc: "Factory-level facelift upgrades that bring your vehicle up to the latest model specification."
  }
];

export default function ExpertiseGrid() {
  return (
    <section className="py-16 md:py-32 px-6 md:px-16 bg-[var(--bg-dark)] [--section-bg:var(--bg-dark)]">
      <div className="max-w-[1920px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-20 border-b border-white/10 pb-6 md:pb-8">
          <h2 className="font-display text-3xl md:text-5xl font-bold uppercase text-white mb-3 md:mb-0">
            Our <span className="text-outline-strong">Expertise</span>
          </h2>
          <p className="text-gray-500 font-bold uppercase text-[10px] md:text-xs tracking-widest max-w-xs md:text-right">
            Precision engineering for the exceptional.
          </p>
        </div>

        {/* Row 1: 3 equal cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-4 md:mb-8">
          {EXPERTISE_ITEMS.map((s, i) => (
            <div
              key={i}
              className="group border border-white/5 p-6 md:p-10 min-h-[240px] md:min-h-[340px] flex flex-col justify-between hover:bg-[#111] transition-all duration-500 hover:border-white/20"
            >
              <div className="flex justify-between items-start">
                <span className="font-mono text-xs font-bold bg-white text-black px-2 py-1">0{i + 1}</span>
                <s.icon className="w-6 h-6 md:w-8 md:h-8 text-gray-500 group-hover:text-[var(--accent)] transition-colors" />
              </div>
              <div>
                <h3 className="font-display text-xl md:text-2xl font-bold uppercase mb-3 md:mb-4 text-white group-hover:text-[var(--accent)] transition-colors">
                  {s.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-400 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Row 2: Full-width DEFENDER showcase */}
        <div className="relative overflow-hidden min-h-[320px] md:min-h-[500px] border border-white/5 group">
          <img
            src="/gallery/land-rover/5B1A6489.jpg"
            alt="Land Rover Defender"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          <div className="relative z-10 flex flex-col justify-center h-full p-8 md:p-16">
            <span className="font-mono text-xs font-bold bg-[var(--accent)] text-black px-2 py-1 w-fit mb-6">FEATURED</span>
            <h3 className="font-display text-4xl md:text-7xl font-bold uppercase text-white leading-[0.9] mb-4">
              Defender
            </h3>
            <p className="text-gray-300 max-w-md text-sm md:text-base mb-8">
              Iconic capability meets bespoke luxury. Full conversion packages, bodykit upgrades, and custom builds.
            </p>
            <Link
              href="/defender"
              className="inline-flex items-center gap-3 bg-white text-black px-6 md:px-8 py-3 md:py-4 font-bold uppercase tracking-widest text-xs md:text-sm hover:bg-[var(--accent)] hover:text-black transition-all duration-300 w-fit group/btn"
            >
              <span>Explore Builds</span>
              <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
