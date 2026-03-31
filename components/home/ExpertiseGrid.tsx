'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { HOME_EXPERTISE_MEDIA } from '@/lib/curatedMedia';
import { HOME_SERVICE_TILES } from '@/lib/serviceContent';
import { CONVERSION_COPY } from '@/lib/siteContent';

function ServiceTile({ tile }: { tile: (typeof HOME_SERVICE_TILES)[number] }) {
  return (
    <Link
      href={tile.href}
      className="group relative border border-white/5 min-h-[320px] md:min-h-[420px] overflow-hidden"
    >
      <div className="absolute inset-0 bg-black">
        {tile.media.type === 'video' ? (
          <video
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            src={tile.media.src}
            poster={tile.media.poster}
            muted
            playsInline
            loop
            autoPlay
            preload="metadata"
          />
        ) : (
          <img
            src={tile.media.src}
            alt={tile.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10" />
      </div>

      <div className="relative z-10 h-full p-6 md:p-8 flex flex-col justify-end">
        {tile.chips && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tile.chips.map((chip) => (
              <span
                key={chip}
                className="border border-white/15 bg-black/35 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.22em] text-white/85"
              >
                {chip}
              </span>
            ))}
          </div>
        )}

        <h3 className="font-display text-2xl md:text-3xl font-bold uppercase text-white mb-3 leading-[0.95]">
          {tile.title}
        </h3>
        <p className="text-gray-300 text-sm leading-relaxed mb-5 max-w-sm">
          {tile.description}
        </p>
        <span className="inline-flex items-center gap-3 text-[var(--accent)] text-[10px] font-bold uppercase tracking-[0.22em]">
          <span>{CONVERSION_COPY.likeWhatYouSee}</span>
          <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </Link>
  );
}

export default function ExpertiseGrid() {
  return (
    <section className="py-16 md:py-32 px-6 md:px-16 bg-[var(--bg-dark)] [--section-bg:var(--bg-dark)]">
      <div className="max-w-[1920px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-20 border-b border-white/10 pb-6 md:pb-8">
          <div>
            <h2 className="font-display text-3xl md:text-5xl font-bold uppercase text-white mb-3 md:mb-0">
              Our <span className="text-outline-strong">Expertise</span>
            </h2>
            <p className="text-gray-500 font-bold uppercase text-[10px] md:text-xs tracking-widest mt-3 max-w-sm">
              Visual entry points into the work people ask for most.
            </p>
          </div>
          <Link
            href="/services"
            className="mt-6 md:mt-0 inline-flex items-center gap-3 text-[var(--accent)] text-[10px] font-bold uppercase tracking-[0.22em] hover:text-white transition-colors"
          >
            <span>View Services</span>
            <ArrowRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-4 md:mb-8">
          {HOME_SERVICE_TILES.map((tile) => (
            <ServiceTile key={tile.key} tile={tile} />
          ))}
        </div>

        <div className="relative overflow-hidden min-h-[320px] md:min-h-[500px] border border-white/5 group">
          <img
            src={HOME_EXPERTISE_MEDIA.src}
            alt={HOME_EXPERTISE_MEDIA.title}
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
