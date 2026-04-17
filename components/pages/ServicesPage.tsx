'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Layers,
  CircleDot,
  Eye,
  Lightbulb,
  Paintbrush,
  Sparkles,
  Shield,
  Wrench,
  Disc,
  ArrowRight,
  ChevronDown,
  CheckCircle,
  Type,
} from 'lucide-react';
import CollectionDeliverySection from '@/components/shared/CollectionDeliverySection';
import ExpandableVideo from '@/components/shared/ExpandableVideo';
import { SERVICES } from '@/lib/serviceContent';
import { CONVERSION_COPY } from '@/lib/siteContent';

const SERVICE_ICONS = {
  bodykits: Layers,
  'alloy-refurb': CircleDot,
  'privacy-glass': Eye,
  'light-tinting': Lightbulb,
  wrapping: Paintbrush,
  'detailing-ppf': Sparkles,
  security: Shield,
  'accident-repair': Wrench,
  'alloy-packages': Disc,
  branding: Type,
} as const;

function FAQSection({ items }: { items: { q: string; a: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mt-8 border-t border-white/10 pt-8">
      <h4 className="text-[var(--accent)] text-xs font-bold uppercase tracking-widest mb-6">
        Frequently Asked Questions
      </h4>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="border border-white/5">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between p-4 text-left text-white text-sm font-medium hover:bg-white/5 transition-colors"
            >
              <span>{item.q}</span>
              <ChevronDown
                size={16}
                className={`text-gray-500 transition-transform duration-300 flex-shrink-0 ml-4 ${
                  openIndex === i ? 'rotate-180 text-[var(--accent)]' : ''
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === i ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <p className="px-4 pb-4 text-gray-400 text-sm leading-relaxed">{item.a}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ServiceVisual({
  title,
  media,
}: {
  title: string;
  media: (typeof SERVICES)[number]['media'];
}) {
  return (
    <div className="aspect-[4/3] w-full overflow-hidden border border-white/5 relative group bg-black">
      {media.type === 'video' ? (
        <ExpandableVideo
          src={media.src}
          poster={media.poster}
          title={title}
          className="h-full w-full"
          videoClassName="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          buttonClassName="group-hover:border-white/20"
        />
      ) : (
        <Image
          src={media.src}
          alt={title}
          fill
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 border border-white/10">
        <span className="text-[10px] font-bold uppercase tracking-widest text-white">
          {title}
        </span>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-dark)] pb-24 animate-in fade-in duration-700 [--section-bg:var(--bg-dark)]">
      <div className="px-6 md:px-16 max-w-[1920px] mx-auto mb-16 md:mb-24">
        <span className="text-[var(--accent)] text-xs font-bold uppercase tracking-widest mb-4 block">
          What We Do
        </span>
        <h1 className="font-display text-5xl md:text-8xl font-bold uppercase text-white leading-[0.9] mb-6">
          Our <span className="text-outline-accent">Services</span>
        </h1>
        <p className="text-gray-400 text-base md:text-lg max-w-2xl leading-relaxed">
          Visual-first, detail-driven services built around real project work, factory-minded fitment, and clear conversion points.
        </p>
      </div>

      <div className="space-y-0">
        {SERVICES.map((service, idx) => {
          const isReversed = idx % 2 !== 0;
          const Icon = SERVICE_ICONS[service.id as keyof typeof SERVICE_ICONS] ?? Wrench;

          return (
            <section
              key={service.id}
              id={service.id}
              className={`px-6 md:px-16 py-16 md:py-24 ${idx % 2 === 0 ? 'bg-[var(--bg-dark)]' : 'bg-[#080808]'}`}
            >
              <div className="max-w-[1920px] mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                  <div className={isReversed ? 'lg:order-2' : 'lg:order-1'}>
                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-[var(--accent)] font-mono text-sm font-bold">/{service.num}</span>
                      <Icon size={20} className="text-gray-600" />
                      {service.badge && (
                        <span className="bg-[var(--accent)] text-black text-[10px] font-bold uppercase tracking-widest px-3 py-1">
                          {service.badge}
                        </span>
                      )}
                    </div>

                    {service.subtitle && (
                      <p className="text-[var(--accent)] text-xs font-bold uppercase tracking-widest mb-2">
                        {service.subtitle}
                      </p>
                    )}

                    <h2 className="font-display text-3xl md:text-5xl font-bold uppercase text-white mb-6 leading-[0.95]">
                      {service.title}
                    </h2>

                    <p className="text-gray-400 leading-relaxed mb-8 max-w-lg">
                      {service.description}
                    </p>

                    {service.chips && (
                      <div className="flex flex-wrap gap-2 mb-8">
                        {service.chips.map((chip) => (
                          <span
                            key={chip}
                            className="border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/80"
                          >
                            {chip}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                      {service.subServices.map((sub, j) => (
                        <div
                          key={j}
                          className="border border-white/5 p-4 hover:border-[var(--accent)]/30 transition-colors group"
                        >
                          <div className="flex items-start gap-3">
                            <CheckCircle size={14} className="text-[var(--accent)] mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="text-white text-sm font-bold mb-1">{sub.name}</h4>
                              <p className="text-gray-500 text-xs leading-relaxed">{sub.desc}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {service.faq && <FAQSection items={service.faq} />}

                    <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
                      <Link
                        href="/contact"
                        className="inline-flex items-center gap-3 text-white text-xs font-bold uppercase tracking-widest hover:text-[var(--accent)] transition-colors group"
                      >
                        <span>{CONVERSION_COPY.likeWhatYouSee}</span>
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <Link
                        href={`/services/${service.slug}`}
                        className="text-[10px] uppercase tracking-[0.22em] text-gray-500 hover:text-white transition-colors"
                      >
                        Service Page Preview
                      </Link>
                    </div>
                  </div>

                  <div className={isReversed ? 'lg:order-1' : 'lg:order-2'}>
                    <ServiceVisual title={service.title} media={service.media} />
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <CollectionDeliverySection />

      <section className="px-6 md:px-16 py-16 md:py-24 bg-[#080808] border-t border-white/10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-5xl font-bold uppercase text-white mb-6">
            Ready to Start<span className="text-[var(--accent)]">?</span>
          </h2>
          <p className="text-gray-400 text-sm md:text-base mb-8 max-w-xl mx-auto">
            From security upgrades to full conversions, we&apos;ll shape the right solution around your car and your brief.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 bg-white text-black px-8 md:px-12 py-4 md:py-5 font-bold uppercase tracking-widest text-xs md:text-sm hover:bg-[var(--accent)] hover:text-black transition-all duration-300"
          >
            <span>{CONVERSION_COPY.likeWhatYouSee}</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
