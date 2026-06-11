'use client';

import Link from 'next/link';
import { ArrowRight, Search, Sparkles, Wrench } from 'lucide-react';
import { BUYING_REASSURANCE_POINTS } from '@/lib/siteContent';

const JOURNEYS = [
  {
    title: 'Shop Parts',
    copy: 'Find curated exterior, performance, carbon, exhaust and styling parts by vehicle.',
    href: '/shop',
    cta: 'Browse Parts',
    icon: Search,
  },
  {
    title: 'Request a Build or Retrofit',
    copy: "Need installation, conversion work, coding, security, or bespoke styling? Send your vehicle details and we'll advise the next step.",
    href: '/contact',
    cta: 'Request a Quote',
    icon: Wrench,
  },
  {
    title: 'Source a Rare Part',
    copy: 'Looking for an OEM, aftermarket, limited edition or hard-to-find component? Send us the part or vehicle details.',
    href: '/contact?message=Hi%20FDL%20Bespoke%2C%0A%0AI%27m%20looking%20for%20help%20sourcing%20a%20part.%20Please%20let%20me%20know%20what%20details%20you%20need.',
    cta: 'Request Part',
    icon: Sparkles,
  },
];

export default function JourneySplit() {
  return (
    <section
      id="shop-by-vehicle"
      className="px-6 py-14 md:px-16 md:py-24 bg-[#080808] [--section-bg:#080808] border-y border-white/5"
    >
      <div className="mx-auto max-w-[1920px]">
        <div className="mb-10 flex flex-col gap-5 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--accent)]">
              Choose Your Route
            </p>
            <h2 className="font-display text-3xl font-bold uppercase leading-tight text-white md:text-5xl">
              Parts, Styling or a Bespoke Quote
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-gray-400">
            Start with the route that matches what you need. FDL Bespoke can help with parts,
            fitment, sourcing and complete vehicle upgrades.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 md:gap-5">
          {JOURNEYS.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                href={item.href}
                className="group flex min-h-[260px] flex-col justify-between border border-white/10 bg-[#0f0f0f] p-6 transition-all duration-300 hover:border-[var(--accent)]/50 hover:bg-[#121212] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/70 md:p-8"
              >
                <div>
                  <div className="mb-7 flex h-11 w-11 items-center justify-center border border-white/10 bg-black/40 text-[var(--accent)] transition-colors group-hover:border-[var(--accent)]/40">
                    <Icon size={20} />
                  </div>
                  <h3 className="mb-4 font-display text-2xl font-bold uppercase leading-tight text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-400">{item.copy}</p>
                </div>

                <span className="mt-8 inline-flex w-fit items-center gap-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--accent)] transition-colors group-hover:text-white">
                  {item.cta}
                  <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 grid gap-3 border-t border-white/10 pt-6 sm:grid-cols-2 lg:grid-cols-6">
          {BUYING_REASSURANCE_POINTS.map((point) => (
            <div
              key={point}
              className="flex items-center gap-3 text-xs font-medium text-gray-300"
            >
              <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent)]" />
              <span>{point}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
