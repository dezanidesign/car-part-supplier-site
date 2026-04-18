'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ChevronDown,
  Layers,
  CircleDot,
  Eye,
  Lightbulb,
  Shield,
  Sparkles,
  Check,
  Phone,
  MessageSquare,
} from 'lucide-react';
import QuoteForm from '@/components/forms/QuoteForm';
import VehicleMediaShowcase from '@/components/shop/VehicleMediaShowcase';
import type { WooProduct } from '@/lib/woo';
import {
  DEFENDER_ALL_MEDIA,
  DEFENDER_HERO_IMAGE,
} from '@/lib/curatedMedia';

// ============================================================================
// GALLERY IMAGES
// ============================================================================

// ============================================================================
// UPGRADE CATEGORIES
// ============================================================================

const UPGRADE_CATEGORIES = [
  {
    icon: Layers,
    num: '01',
    title: 'Bodykits & Exterior Styling',
    desc: 'Widen the stance, sharpen the lines, transform road presence. From full conversion kits to individual splitter and diffuser upgrades — fitted and finished to factory standard.',
  },
  {
    icon: CircleDot,
    num: '02',
    title: 'Alloy Wheels & Tyres',
    desc: 'The right wheel defines the character of a Defender build. We supply and fit forged and cast alloy packages chosen for fitment, finish, and your intended use.',
  },
  {
    icon: Sparkles,
    num: '03',
    title: 'Carbon Fibre & Gloss Black',
    desc: 'Interior and exterior carbon details for an aggressive, refined edge. Bonnet vents, mirror caps, side steps, and bespoke trim — precisely installed for a cohesive aesthetic.',
  },
  {
    icon: Eye,
    num: '04',
    title: 'Window Tints & Privacy Glass',
    desc: 'Privacy and solar glass tinting applied with precision-cut film. Legal tints for daily driving through to deep-tinted glass for a more commanding, distinctive appearance.',
  },
  {
    icon: Lightbulb,
    num: '05',
    title: 'Lighting Upgrades',
    desc: 'Headlight and taillight styling packages that give your Defender a more contemporary, distinctive face — from subtle tinting to full light bar integrations.',
  },
  {
    icon: Shield,
    num: '06',
    title: 'Vehicle Security',
    desc: 'Ghost immobilisers, GPS tracking, and dashcams for complete peace of mind. Certified installations that protect your investment without affecting vehicle aesthetics.',
  },
];

// ============================================================================
// TRUST POINTS
// ============================================================================

const TRUST_POINTS = [
  {
    title: 'Supplied & Fitted',
    desc: 'End-to-end — we source, prepare, and fit. One point of contact from enquiry to collection.',
  },
  {
    title: 'Precision Fitment',
    desc: 'Panel alignment, paint match, and finish are non-negotiable. Every component is installed to exact specification.',
  },
  {
    title: 'Tailored Consultation',
    desc: 'We discuss your vehicle, your brief, and your budget before recommending anything. No generic packages.',
  },
  {
    title: 'Premium Components',
    desc: 'We work exclusively with quality components, premium vinyl, and proven hardware — not budget alternatives.',
  },
  {
    title: 'Specialist Experience',
    desc: 'Years of Defender-specific work. We know these vehicles and we know how to make them look exceptional.',
  },
  {
    title: 'Detail-Focused Finish',
    desc: 'The difference between a good build and a great one is in the details. We obsess over them so you don\'t have to.',
  },
];

// ============================================================================
// PROCESS
// ============================================================================

const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Tell Us About Your Defender',
    desc: 'Share your model, year, current spec, and any relevant details about your vehicle.',
  },
  {
    step: '02',
    title: 'Share Your Vision',
    desc: 'Whether you have a clear build in mind or just a direction, we work from it.',
  },
  {
    step: '03',
    title: 'We Advise the Right Approach',
    desc: 'We recommend the best products, finishes, and installation strategy for your specific vehicle and goals.',
  },
  {
    step: '04',
    title: 'We Source, Prepare & Fit',
    desc: 'All procurement, preparation, and precision installation handled in-house at our Batley workshop.',
  },
  {
    step: '05',
    title: 'Collect a Transformed Vehicle',
    desc: 'Drive away in a Defender that looks exactly as you envisioned — nothing left to chance.',
  },
];

// ============================================================================
// FAQ DATA
// ============================================================================

const FAQ_ITEMS = [
  {
    q: 'Do you work on all Defender models, including the L663 and classic 90/110?',
    a: 'Yes. We work across the full Defender range — the current L663 in both 90 and 110 configurations, as well as classic models. Fitment and parts availability specific to your vehicle is discussed during your consultation.',
  },
  {
    q: 'Are all upgrades tailored to each individual vehicle?',
    a: 'Every build is discussed and quoted individually. We don\'t offer one-size-fits-all packages because every vehicle and every owner has a different brief. Your quote will be specific to your Defender, its model year, and your specification.',
  },
  {
    q: 'Do you supply and fit everything in-house?',
    a: 'Yes. We handle sourcing, preparation, and fitting at our Batley workshop. You deal with us directly from enquiry through to collection — no third parties involved in the installation process.',
  },
  {
    q: 'Can I enquire about a full transformation or just a single upgrade?',
    a: 'Absolutely. We work with clients at every stage — from a single styling element through to a complete build. Whatever scope you\'re considering, get in touch and we\'ll work from there.',
  },
  {
    q: 'How do I get a quote for my Defender build?',
    a: 'Use the enquiry form on this page, call us directly on 07869 022673, or message us on Instagram. The more detail you can share about your vehicle and brief, the more precise our initial response will be.',
  },
  {
    q: 'How long does a typical build take?',
    a: 'Timescales vary depending on scope, parts availability, and workshop schedule. We\'ll give you a clear timeline during your consultation — we won\'t take your vehicle without a firm commitment on delivery.',
  },
];

// ============================================================================
// FAQ ACCORDION
// ============================================================================

function FAQAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="divide-y divide-white/10">
      {items.map((item, i) => (
        <div key={i} className="py-6">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-start justify-between gap-6 text-left group"
          >
            <span className="font-display font-bold text-white text-base md:text-lg uppercase tracking-wide group-hover:text-[var(--accent)] transition-colors leading-snug">
              {item.q}
            </span>
            <ChevronDown
              size={18}
              className={`flex-shrink-0 mt-1 text-[var(--accent)] transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              openIndex === i ? 'max-h-96 mt-4 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <p className="text-gray-400 leading-relaxed border-l-2 border-[var(--accent)]/30 pl-4">
              {item.a}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function DefenderPage({ products }: { products: WooProduct[] }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-dark)] text-white">

      {/* ==================================================================
          SECTION 1: HERO
          ================================================================== */}
      <section className="hero-bleed relative overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src={DEFENDER_HERO_IMAGE.src}
            alt={DEFENDER_HERO_IMAGE.title}
            fill
            className="object-cover object-center"
            priority
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/78 to-[#050505]/18" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/88 via-[#050505]/38 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_left_center,rgba(5,5,5,0.35),transparent_48%)]" />
        </div>

        {/* Content */}
        <div
          className={`hero-bleed-inner relative z-10 px-6 md:px-16 pb-12 md:pb-16 lg:pb-20 max-w-[1920px] w-full transition-all duration-1000 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <p className="text-[var(--accent)] text-[10px] md:text-[11px] font-bold uppercase tracking-[0.35em] mb-6 md:mb-8">
            FDL Bespoke - Defender Specialist
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-end">
            <div className="lg:col-span-7">
              <h1
                className="font-display font-bold uppercase leading-[0.92] tracking-tight max-w-[11ch]"
                style={{ fontSize: 'clamp(3.25rem, 7vw, 6.75rem)' }}
              >
                Defender upgrades<span className="text-[var(--accent)]">.</span>
                <br />
                Bespoke styling<span className="text-[var(--accent)]">.</span>
              </h1>
            </div>

            <div className="lg:col-span-4 lg:col-start-9">
              <p className="text-gray-200/95 text-base md:text-lg leading-relaxed max-w-md mb-8 font-light">
                Premium upgrades for Land Rover Defender owners who demand more than
                standard. Supplied, fitted, and finished in-house at our West Yorkshire workshop.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="#enquire"
                  className="bg-[var(--accent)] text-black font-bold uppercase tracking-[0.15em] px-8 py-4 rounded-full hover:brightness-110 transition-all flex items-center gap-2 text-sm"
                >
                  Start Your Build <ArrowRight size={16} />
                </Link>
                <Link
                  href="#builds"
                  className="border border-white/20 text-white font-bold uppercase tracking-[0.15em] px-8 py-4 rounded-full hover:bg-white hover:text-black transition-all text-sm"
                >
                  View Builds
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================
          SECTION 2: POSITIONING INTRO
          ================================================================== */}
      <section className="px-6 md:px-16 py-20 md:py-28 bg-[#080808] [--section-bg:#080808] border-y border-white/5">
        <div className="max-w-[1920px] mx-auto">
          <div className="grid md:grid-cols-3 gap-12 md:gap-16 items-start">
            <div className="md:col-span-2">
              <p className="text-[var(--accent)] text-[10px] font-bold uppercase tracking-[0.35em] mb-6">
                Our Approach
              </p>
              <h2 className="font-display text-3xl md:text-5xl font-bold uppercase leading-[1.02] tracking-tight mb-8">
                Every Defender Build<br />
                <span className="text-outline">Starts with a Conversation</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed max-w-2xl">
                We don&apos;t do off-the-shelf. Every Defender that comes through our workshop
                receives a tailored consultation, a bespoke approach, and a finish that reflects
                the brief — not a catalogue. Whether you&apos;re after a single upgrade or a complete
                transformation, we supply, fit, and finish everything in-house so every element
                works together.
              </p>
            </div>
            <div className="flex flex-col gap-7 pt-0 md:pt-14">
              <div className="border-l-2 border-[var(--accent)] pl-6">
                <p className="text-white font-bold font-display uppercase text-base tracking-wide">
                  West Yorkshire
                </p>
                <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                  Based in Batley — serving Defender owners across the UK.
                </p>
              </div>
              <div className="border-l-2 border-white/10 pl-6">
                <p className="text-white font-bold font-display uppercase text-base tracking-wide">
                  Supplied &amp; Fitted
                </p>
                <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                  End-to-end. We handle procurement, preparation, and installation.
                </p>
              </div>
              <div className="border-l-2 border-white/10 pl-6">
                <p className="text-white font-bold font-display uppercase text-base tracking-wide">
                  Tailored Quotes Only
                </p>
                <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                  Every quote is specific to your vehicle, spec, and brief.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================
          SECTION 4: GALLERY / BUILDS
          ================================================================== */}
      <section id="builds" className="py-20 md:py-28 bg-[#080808] [--section-bg:#080808] border-y border-white/5">
        <div className="px-6 md:px-16 max-w-[1920px] mx-auto mb-12 md:mb-16">
          <p className="text-[var(--accent)] text-[10px] font-bold uppercase tracking-[0.35em] mb-4">
            Our Work
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h2 className="font-display text-3xl md:text-5xl font-bold uppercase leading-tight">
              Defender Builds<br />
              <span className="text-outline">From Our Workshop</span>
            </h2>
            <Link
              href="/gallery"
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors font-bold uppercase tracking-widest"
            >
              Full Gallery <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div className="px-6 md:px-16 max-w-[1920px] mx-auto">
          <VehicleMediaShowcase
            media={DEFENDER_ALL_MEDIA}
            categoryLabel="Defender"
            brandLabel="Land Rover"
            intro="All Defender stills and clips from the source archive, ordered image carousel first and video reels below."
          />
        </div>
      </section>


      {/* ==================================================================
          SECTION 3: UPGRADE CATEGORIES
          ================================================================== */}
      <section className="px-6 md:px-16 py-20 md:py-28 bg-[var(--bg-dark)]">
        <div className="max-w-[1920px] mx-auto">
          <div className="mb-14 md:mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="text-[var(--accent)] text-[10px] font-bold uppercase tracking-[0.35em] mb-4">
                Upgrade Categories
              </p>
              <h2 className="font-display text-3xl md:text-5xl font-bold uppercase leading-tight">
                What We Do<br />
                <span className="text-outline">for Your Defender</span>
              </h2>
            </div>
            <p className="text-gray-500 text-sm max-w-sm leading-relaxed">
              A focused range of services for serious Defender owners. All quoted
              individually — no packages, no guesswork.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {UPGRADE_CATEGORIES.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <div
                  key={i}
                  className="group border border-white/5 p-8 md:p-10 hover:border-[var(--accent)]/20 hover:bg-[#0a0a0a] transition-all duration-300 flex flex-col gap-6"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-1">
                      {cat.num}
                    </span>
                    <Icon
                      size={20}
                      className="text-gray-600 group-hover:text-[var(--accent)] transition-colors duration-300"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-lg font-bold uppercase text-white mb-3 leading-snug">
                      {cat.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{cat.desc}</p>
                  </div>
                  <Link
                    href="#enquire"
                    className="flex items-center gap-2 text-[var(--accent)] text-[10px] font-bold uppercase tracking-[0.25em] hover:gap-4 transition-all mt-auto"
                  >
                    Enquire <ArrowRight size={11} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* ==================================================================
          SECTION 5: WHY FDL
          ================================================================== */}
      <section className="px-6 md:px-16 py-20 md:py-28 bg-[var(--bg-dark)]">
        <div className="max-w-[1920px] mx-auto">
          <div className="mb-14 md:mb-20">
            <p className="text-[var(--accent)] text-[10px] font-bold uppercase tracking-[0.35em] mb-4">
              Why Choose Us
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-bold uppercase leading-tight">
              Built on Precision.<br />
              <span className="text-outline">Defined by Detail.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
            {TRUST_POINTS.map((point, i) => (
              <div
                key={i}
                className="bg-[var(--bg-dark)] p-8 md:p-10 hover:bg-[#0a0a0a] transition-colors group"
              >
                <div className="flex items-center gap-3 mb-5">
                  <Check size={13} className="text-[var(--accent)]" />
                  <span className="font-mono text-[10px] text-white/25">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold uppercase text-white mb-3 group-hover:text-[var(--accent)] transition-colors">
                  {point.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{point.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================================
          SECTION 6: PROCESS
          ================================================================== */}
      <section className="px-6 md:px-16 py-20 md:py-28 bg-[#080808] border-y border-white/5">
        <div className="max-w-[1920px] mx-auto">
          <div className="mb-14 md:mb-20">
            <p className="text-[var(--accent)] text-[10px] font-bold uppercase tracking-[0.35em] mb-4">
              The Process
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-bold uppercase leading-tight">
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6">
            {PROCESS_STEPS.map((s, i) => (
              <div key={i} className="relative">
                {/* Connector line (desktop only) */}
                {i < PROCESS_STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-[18px] left-full w-full h-px bg-white/8 z-0 -translate-x-6" />
                )}
                <div className="relative z-10">
                  <span className="font-mono text-2xl md:text-3xl font-bold text-[var(--accent)] block mb-4">
                    {s.step}
                  </span>
                  <h3 className="font-display text-sm font-bold uppercase text-white mb-2 leading-snug">
                    {s.title}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 pt-10 border-t border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <p className="text-gray-400 text-base">Ready to start the conversation?</p>
            <Link
              href="#enquire"
              className="bg-[var(--accent)] text-black font-bold uppercase tracking-[0.15em] px-8 py-4 rounded-full hover:brightness-110 transition-all flex items-center gap-2 text-sm self-start sm:self-auto"
            >
              Request a Quote <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ==================================================================
          SECTION 7: FAQ
          ================================================================== */}
      <section className="px-6 md:px-16 py-20 md:py-28 bg-[var(--bg-dark)]">
        <div className="max-w-[1920px] mx-auto">
          <div className="grid md:grid-cols-12 gap-12 md:gap-16">
            <div className="md:col-span-4">
              <p className="text-[var(--accent)] text-[10px] font-bold uppercase tracking-[0.35em] mb-4">
                FAQ
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold uppercase leading-tight mb-6">
                Questions About Your Build
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                Can&apos;t find what you need? Get in touch directly and we&apos;ll answer any questions
                about your specific vehicle or brief.
              </p>
              <Link
                href="#enquire"
                className="flex items-center gap-2 text-[var(--accent)] text-[10px] font-bold uppercase tracking-[0.25em] hover:gap-4 transition-all"
              >
                Ask a Question <ArrowRight size={11} />
              </Link>
            </div>
            <div className="md:col-span-8">
              <FAQAccordion items={FAQ_ITEMS} />
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================
          SECTION 8: DEFENDER PRODUCTS (WooCommerce)
          ================================================================== */}
      {products.length > 0 && (
        <section className="px-6 md:px-16 py-20 md:py-28 bg-[#080808] [--section-bg:#080808] border-t border-white/5">
          <div className="max-w-[1920px] mx-auto">
            <div className="mb-14 md:mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <p className="text-[var(--accent)] text-[10px] font-bold uppercase tracking-[0.35em] mb-4">
                  Shop
                </p>
                <h2 className="font-display text-3xl md:text-5xl font-bold uppercase leading-tight">
                  Defender<br />
                  <span className="text-outline">Products</span>
                </h2>
              </div>
              <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                Defender-specific parts and accessories. All items available supplied and fitted —
                enquire for fitment advice and pricing.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {products.slice(0, 12).map((product) => {
                const img = product.images?.[0]?.src;
                return (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    className="group border border-white/5 hover:border-[var(--accent)]/25 transition-all duration-300 block overflow-hidden"
                  >
                    <div className="aspect-square bg-white/5 overflow-hidden">
                      {img ? (
                        <img
                          src={img}
                          alt={product.name}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/10">
                          <Layers size={40} />
                        </div>
                      )}
                    </div>
                    <div className="p-4 md:p-5">
                      <h3 className="font-bold text-white text-xs md:text-sm uppercase tracking-wide line-clamp-2 group-hover:text-[var(--accent)] transition-colors mb-3 leading-snug">
                        {product.name}
                      </h3>
                      <span className="flex items-center gap-1.5 text-[var(--accent)] text-[10px] font-bold uppercase tracking-widest">
                        View Product <ArrowRight size={10} />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {products.length > 12 && (
              <div className="text-center mt-12">
                <Link
                  href="/shop/land-rover-defender"
                  className="border border-white/20 text-white font-bold uppercase tracking-[0.15em] px-8 py-4 rounded-full hover:bg-white hover:text-black transition-all text-sm inline-flex items-center gap-2"
                >
                  View All Defender Products <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ==================================================================
          SECTION 9: FINAL CTA / ENQUIRY
          ================================================================== */}
      <section
        id="enquire"
        className="px-6 md:px-16 py-20 md:py-28 bg-[var(--bg-dark)] border-t border-white/5"
      >
        <div className="max-w-[1920px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

            {/* Left: copy */}
            <div>
              <p className="text-[var(--accent)] text-[10px] font-bold uppercase tracking-[0.35em] mb-6">
                Get in Touch
              </p>
              <h2
                className="font-display font-bold uppercase leading-[0.92] tracking-tight mb-8"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
              >
                Plan Your<br />
                Defender<span className="text-[var(--accent)]">.</span><br />
                <span className="text-outline">Build.</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-lg">
                Send us your Defender details and brief. We&apos;ll come back with expert advice
                and a tailored quote — no generic pricing, no obligation.
              </p>

              <div className="flex flex-col gap-4 mb-10">
                <a
                  href="tel:07869022673"
                  className="flex items-center gap-3 text-white hover:text-[var(--accent)] transition-colors"
                >
                  <Phone size={15} className="text-[var(--accent)] flex-shrink-0" />
                  <span className="font-bold">07869 022673</span>
                </a>
                <a
                  href="https://www.instagram.com/fdl.bespoke.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white hover:text-[var(--accent)] transition-colors"
                >
                  <MessageSquare size={15} className="text-[var(--accent)] flex-shrink-0" />
                  <span className="font-bold">@fdl.bespoke.uk</span>
                </a>
              </div>

              <div className="border border-white/5 bg-white/[0.02] p-6">
                <p className="text-xs text-gray-500 leading-relaxed">
                  <span className="text-white font-bold">Good to know: </span>
                  Quotes are tailored to your specific vehicle, model year, chosen upgrades,
                  paint specification, and installation requirements. Prices are not listed on
                  this page — every build is quoted individually.
                </p>
              </div>
            </div>

            {/* Right: form */}
            <div>
              <QuoteForm defaultMakeModel="Land Rover Defender" />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
