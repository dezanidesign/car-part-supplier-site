'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
} from 'lucide-react';
import { SERVICE_MEDIA } from '@/lib/curatedMedia';

// ============================================================================
// SERVICE DATA
// ============================================================================

const SERVICES = [
  {
    id: 'bodykits',
    num: '01',
    title: 'Bodykits',
    icon: Layers,
    description: 'Transform the profile of your vehicle with precision-fitted performance bodykits. From subtle enhancements to full wide-body conversions, every panel is aligned with OEM-level accuracy.',
    subServices: [
      { name: 'Performance Bodykits', desc: 'Full wide-body and aero packages from leading manufacturers.' },
      { name: 'Exterior Splitter Kits', desc: 'Front splitters, side skirts, and rear diffusers for aggressive stance.' },
      { name: 'Carbon Fibre', desc: 'Genuine carbon fibre components — bonnets, mirrors, spoilers, and trim.' },
      { name: 'Facelift Conversions', desc: 'Factory-level upgrades to bring your vehicle up to latest-model specification.' },
    ],
    image: SERVICE_MEDIA.bodykits.src,
  },
  {
    id: 'alloy-refurb',
    num: '02',
    title: 'Alloy Wheels Refurbishment',
    icon: CircleDot,
    description: 'Restore or completely transform your alloys with our expert refurbishment services. From kerb damage repair to full custom finishes.',
    subServices: [
      { name: 'Powdercoating', desc: 'Durable, high-quality colour finishes with industry-standard powder coating.' },
      { name: 'Diamond Cutting', desc: 'CNC precision diamond-cut finish for a factory-fresh look.' },
      { name: 'Custom Coatings', desc: 'Bespoke colour matching and multi-tone finishes.' },
      { name: 'Buckles & Welding Repairs', desc: 'Structural repairs including buckle straightening and alloy welding.' },
    ],
    image: SERVICE_MEDIA["alloy-refurb"].src,
  },
  {
    id: 'privacy-glass',
    num: '03',
    title: 'Privacy Glass',
    icon: Eye,
    description: 'Premium window tinting with Enkahnz ceramic films — 99% UV rejection, heat reduction, and enhanced privacy. Full panel disassembly for flawless, edge-to-edge coverage.',
    subServices: [
      { name: 'Window Tints', desc: 'Automotive tinting in a range of shades from light to limo black.' },
      { name: 'Commercial Tinting', desc: 'Building and office window films for privacy, heat reduction, and branding.' },
    ],
    image: SERVICE_MEDIA["privacy-glass"].src,
    faq: [
      { q: 'Is window tinting legal in the UK?', a: 'Front windscreen must allow 75% light through, front sides 70%. Rear windows have no restriction. We ensure all tints meet legal requirements.' },
      { q: 'How long does tinting take?', a: 'A full vehicle typically takes 2-4 hours. We remove panels for a flawless finish with no visible edges.' },
      { q: 'Will tinting affect my visibility at night?', a: 'Our ceramic films maintain excellent clarity. We recommend lighter shades for drivers who frequently drive at night.' },
      { q: 'How long does window tint last?', a: 'Our Enkahnz ceramic films come with a lifetime warranty against peeling, bubbling, and discolouration.' },
    ],
  },
  {
    id: 'light-tinting',
    num: '04',
    title: 'Headlight & Taillight Tinting',
    icon: Lightbulb,
    description: 'Subtle smoke or full blackout tinting for headlights and taillights. Precision-applied film that transforms the look of your vehicle while maintaining light output.',
    subServices: [
      { name: 'Headlight Tinting', desc: 'Light smoke to medium tint options that maintain brightness and legality.' },
      { name: 'Taillight Tinting', desc: 'Full blackout or tinted finishes for a sleek, murdered-out aesthetic.' },
    ],
    image: SERVICE_MEDIA["light-tinting"].src,
  },
  {
    id: 'wrapping',
    num: '05',
    title: 'Vehicle Wrapping',
    icon: Paintbrush,
    description: 'Complete colour changes, partial wraps, and commercial branding using premium vinyl from 3M and Avery Dennison. A cost-effective alternative to a full respray.',
    subServices: [
      { name: 'Full Wraps', desc: 'Complete colour change wraps in gloss, matte, satin, or chrome finishes.' },
      { name: 'Partial Wraps', desc: 'Roof wraps, bonnet wraps, mirror caps, and accent panels.' },
      { name: 'Dechroming', desc: 'Black-out or colour-match chrome trim for a cleaner, modern aesthetic.' },
      { name: 'Fleet Branding', desc: 'Commercial vehicle livery and fleet graphics for businesses.' },
    ],
    image: SERVICE_MEDIA.wrapping.src,
  },
  {
    id: 'detailing-ppf',
    num: '06',
    title: 'Detailing & PPF',
    icon: Sparkles,
    description: 'Protect your paintwork with the latest in ceramic coatings and paint protection film. Our accredited installers deliver showroom finishes that last.',
    subServices: [
      { name: 'Ceramic Coatings', desc: 'Multi-layer ceramic protection for paint, wheels, and glass. Hydrophobic and UV resistant.' },
      { name: 'Paint Protection Film', desc: 'Self-healing PPF applied to high-impact areas or full vehicle coverage.' },
    ],
    image: SERVICE_MEDIA["detailing-ppf"].src,
  },
  {
    id: 'security',
    num: '07',
    title: 'Vehicle Security',
    subtitle: 'Protect Your Investment',
    icon: Shield,
    description: 'Certified installation of leading vehicle security systems. From immobilisers to tracking, we provide complete peace of mind for your vehicle.',
    subServices: [
      { name: 'Ghost Immobiliser', desc: 'Autowatch Ghost II — the ultimate aftermarket immobiliser. Undetectable and insurance approved.' },
      { name: 'Trackers', desc: 'GPS tracking systems with 24/7 monitoring and smartphone alerts.' },
      { name: 'Dashcams', desc: 'Front and rear dashcam installation with hardwired parking mode.' },
      { name: 'Reverse Cameras & Sensors', desc: 'OEM-style reversing cameras and parking sensors fitted to any vehicle.' },
    ],
    image: SERVICE_MEDIA.security.src,
  },
  {
    id: 'accident-repair',
    num: '08',
    title: 'Accident Repair',
    icon: Wrench,
    description: 'Insurance-approved accident repair and bodywork restoration. From minor scuffs to major panel damage, we restore your vehicle to factory condition.',
    subServices: [
      { name: 'Insurance Approved Repairs', desc: 'We work directly with insurers to manage your claim from start to finish.' },
      { name: 'Panel Repair & Replacement', desc: 'Dent removal, panel beating, and full panel replacement.' },
      { name: 'Paint Refinishing', desc: 'Colour-matched resprays using Spies Hecker premium paint systems.' },
    ],
    image: SERVICE_MEDIA["accident-repair"].src,
    badge: 'Insurance Approved',
  },
  {
    id: 'alloy-packages',
    num: '09',
    title: 'Alloy Wheel Packages',
    icon: Disc,
    description: 'Complete alloy wheel and tyre packages sourced, fitted, and balanced in-house. From 18" to 24", we supply premium wheels for all makes and models.',
    subServices: [
      { name: 'Alloy Wheel & Tyre Packages', desc: 'Complete wheel and tyre sets supplied, fitted, and balanced.' },
      { name: 'Wheel Spacers', desc: 'Precision hub-centric spacers for wider stance and improved fitment.' },
      { name: 'TPMS Sensors', desc: 'OEM tyre pressure monitoring sensors programmed and fitted.' },
    ],
    image: SERVICE_MEDIA["alloy-packages"].src,
  },
];

// ============================================================================
// FAQ ACCORDION
// ============================================================================

function FAQSection({ items }: { items: { q: string; a: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mt-8 border-t border-white/10 pt-8">
      <h4 className="text-[var(--accent)] text-xs font-bold uppercase tracking-widest mb-6">Frequently Asked Questions</h4>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="border border-white/5">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between p-4 text-left text-white text-sm font-medium hover:bg-white/5 transition-colors"
            >
              <span>{item.q}</span>
              <ChevronDown size={16} className={`text-gray-500 transition-transform duration-300 flex-shrink-0 ml-4 ${openIndex === i ? 'rotate-180 text-[var(--accent)]' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${openIndex === i ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
              <p className="px-4 pb-4 text-gray-400 text-sm leading-relaxed">{item.a}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// SERVICES PAGE
// ============================================================================

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-dark)] pb-24 animate-in fade-in duration-700 [--section-bg:var(--bg-dark)]">
      {/* Hero */}
      <div className="px-6 md:px-16 max-w-[1920px] mx-auto mb-16 md:mb-24">
        <span className="text-[var(--accent)] text-xs font-bold uppercase tracking-widest mb-4 block">What We Do</span>
        <h1 className="font-display text-5xl md:text-8xl font-bold uppercase text-white leading-[0.9] mb-6">
          Our <span className="text-outline-accent">Services</span>
        </h1>
        <p className="text-gray-400 text-base md:text-lg max-w-2xl leading-relaxed">
          From bodykit installations to vehicle security, every service is delivered with precision and an obsession for detail.
        </p>
      </div>

      {/* Service Sections */}
      <div className="space-y-0">
        {SERVICES.map((service, idx) => {
          const isReversed = idx % 2 !== 0;
          const Icon = service.icon;

          return (
            <section
              key={service.id}
              id={service.id}
              className={`px-6 md:px-16 py-16 md:py-24 ${idx % 2 === 0 ? 'bg-[var(--bg-dark)]' : 'bg-[#080808]'}`}
            >
              <div className="max-w-[1920px] mx-auto">
                <div className={`grid lg:grid-cols-2 gap-12 lg:gap-24 items-center ${isReversed ? '' : ''}`}>
                  {/* Content */}
                  <div className={`${isReversed ? 'lg:order-2' : 'lg:order-1'}`}>
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
                      <p className="text-[var(--accent)] text-xs font-bold uppercase tracking-widest mb-2">{service.subtitle}</p>
                    )}

                    <h2 className="font-display text-3xl md:text-5xl font-bold uppercase text-white mb-6 leading-[0.95]">
                      {service.title}
                    </h2>

                    <p className="text-gray-400 leading-relaxed mb-8 max-w-lg">
                      {service.description}
                    </p>

                    {/* Sub-services */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                      {service.subServices.map((sub, j) => (
                        <div key={j} className="border border-white/5 p-4 hover:border-[var(--accent)]/30 transition-colors group">
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

                    {/* FAQ (only for Privacy Glass) */}
                    {service.faq && <FAQSection items={service.faq} />}

                    {/* CTA */}
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-3 text-white text-xs font-bold uppercase tracking-widest hover:text-[var(--accent)] transition-colors group mt-4"
                    >
                      <span>Get a Quote</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>

                  {/* Image */}
                  <div className={`${isReversed ? 'lg:order-1' : 'lg:order-2'}`}>
                    <div className="aspect-[4/3] w-full overflow-hidden border border-white/5 relative group">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                      />
                      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 border border-white/10">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white">{service.num} — {service.title}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <section className="px-6 md:px-16 py-16 md:py-24 bg-[#080808] border-t border-white/10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-5xl font-bold uppercase text-white mb-6">
            Ready to Start<span className="text-[var(--accent)]">?</span>
          </h2>
          <p className="text-gray-400 text-sm md:text-base mb-8 max-w-xl mx-auto">
            Get in touch for a free, no-obligation quote. We&apos;ll work with you to bring your vision to life.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 bg-white text-black px-8 md:px-12 py-4 md:py-5 font-bold uppercase tracking-widest text-xs md:text-sm hover:bg-[var(--accent)] hover:text-black transition-all duration-300"
          >
            <span>Request a Quote</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
