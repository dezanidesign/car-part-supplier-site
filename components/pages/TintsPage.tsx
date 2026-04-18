'use client';

import { Shield, Sun, Lock, Sparkles } from 'lucide-react';
import Link from 'next/link';
import TintPreviewSlider from '@/components/shared/TintPreviewSlider';

const TintsPage = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-dark)] animate-in fade-in duration-700">
       {/* Hero Section */}
       <div className="pb-16 px-6 md:px-16">
          <div className="max-w-7xl mx-auto">
             <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 border-b border-white/10 pb-8">
                <div>
                   <span className="text-[var(--accent)] text-xs font-bold uppercase tracking-widest mb-4 block">Enkahnz Film Systems</span>
                   <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold uppercase text-white leading-none">
                      Premium<br/>Privacy <span className="text-outline">Glass</span>
                   </h1>
                </div>
                <div className="text-left lg:text-right mt-6 lg:mt-0">
                   <div className="flex items-center lg:justify-end gap-2 text-[var(--accent)] mb-2">
                      <Shield size={18} />
                      <span className="font-bold text-sm">Ceramic Technology</span>
                   </div>
                   <p className="text-gray-500 uppercase tracking-widest text-xs">99% UV Rejection • Factory Finish</p>
                </div>
             </div>

             <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-3xl mb-16">
                Our specialist window films do more than transform the look of your vehicle—they deliver a host of practical advantages. Installed in-house by trained experts, Enkahnz privacy glass enhances both style and performance with a finish indistinguishable from factory standards.
             </p>

             <div className="mb-16">
                <TintPreviewSlider imageAlt="Vehicle Privacy Glass" />
             </div>

             {/* Key Benefits Grid */}
             <div className="mb-20">
                <h2 className="font-display text-3xl md:text-4xl font-bold uppercase text-white mb-10">
                   Key <span className="text-[var(--accent)]">Benefits</span>
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                   <div className="bg-[#0a0a0a] border border-white/5 p-6 md:p-8 hover:border-[var(--accent)] transition-all duration-300 group">
                      <Shield className="w-10 h-10 text-[var(--accent)] mb-4 group-hover:scale-110 transition-transform" />
                      <h3 className="font-display text-xl font-bold uppercase text-white mb-3">Enhanced Privacy</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                         Greater interior discretion and security for you and your valuables.
                      </p>
                   </div>

                   <div className="bg-[#0a0a0a] border border-white/5 p-6 md:p-8 hover:border-[var(--accent)] transition-all duration-300 group">
                      <Sun className="w-10 h-10 text-[var(--accent)] mb-4 group-hover:scale-110 transition-transform" />
                      <h3 className="font-display text-xl font-bold uppercase text-white mb-3">UV Protection</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                         99% UV rejection preserves furniture, leather, and trims from sun damage.
                      </p>
                   </div>

                   <div className="bg-[#0a0a0a] border border-white/5 p-6 md:p-8 hover:border-[var(--accent)] transition-all duration-300 group">
                      <Sparkles className="w-10 h-10 text-[var(--accent)] mb-4 group-hover:scale-110 transition-transform" />
                      <h3 className="font-display text-xl font-bold uppercase text-white mb-3">Heat Reduction</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                         Significantly reduced cabin temperature during warmer months for comfort.
                      </p>
                   </div>

                   <div className="bg-[#0a0a0a] border border-white/5 p-6 md:p-8 hover:border-[var(--accent)] transition-all duration-300 group">
                      <Lock className="w-10 h-10 text-[var(--accent)] mb-4 group-hover:scale-110 transition-transform" />
                      <h3 className="font-display text-xl font-bold uppercase text-white mb-3">Added Security</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                         Protection against opportunistic theft and smash-and-grab attempts.
                      </p>
                   </div>
                </div>
             </div>
          </div>
       </div>

       {/* The FDL Effect - Full Width Dark Section */}
       <div className="bg-[#030303] [--section-bg:#030303] border-y border-white/5 py-20 md:py-32 px-6 md:px-16">
          <div className="max-w-7xl mx-auto">
             <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                {/* Left: Content */}
                <div>
                   <span className="text-[var(--accent)] text-xs font-bold uppercase tracking-widest mb-4 block">Our Process</span>
                   <h2 className="font-display text-4xl md:text-6xl font-bold uppercase text-white leading-none mb-8">
                      The FDL<br/><span className="text-outline">Effect</span><span className="text-[var(--accent)]">.</span>
                   </h2>
                   <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-8">
                      At FDL, excellence means going beyond the ordinary. Where others cut corners, we raise the benchmark.
                   </p>
                   <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-6">
                      Unlike competitors who apply film only to the exposed surface, our technicians <span className="text-white font-bold">fully dismantle door panels</span> to achieve edge-to-edge coverage across the entire glass pane—delivering a flawless, seamless finish.
                   </p>
                   <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-12">
                      This uncompromising process ensures no bubbling, no peeling, and no shortcuts—just a refined, factory-level result built to last.
                   </p>

                   {/* Stats */}
                   <div className="grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
                      <div>
                         <div className="font-display text-3xl md:text-4xl font-bold text-[var(--accent)] mb-2">99%</div>
                         <div className="text-gray-500 text-xs uppercase tracking-widest">UV Block</div>
                      </div>
                      <div>
                         <div className="font-display text-3xl md:text-4xl font-bold text-[var(--accent)] mb-2">100%</div>
                         <div className="text-gray-500 text-xs uppercase tracking-widest">Coverage</div>
                      </div>
                      <div>
                         <div className="font-display text-3xl md:text-4xl font-bold text-[var(--accent)] mb-2">OEM+</div>
                         <div className="text-gray-500 text-xs uppercase tracking-widest">Finish</div>
                      </div>
                   </div>
                </div>

                {/* Right: Image/Visual */}
                <div className="relative">
                   <div className="aspect-[4/5] bg-[#111] border border-white/5 overflow-hidden">
                      <img
                         src="/gallery/range-rover/5B1A5027.jpg"
                         alt="FDL Installation Process"
                         className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                      />
                   </div>
                   <div className="absolute -bottom-6 -right-6 bg-[var(--accent)] p-8 md:p-10 max-w-xs">
                      <p className="text-black font-display text-lg md:text-xl font-bold uppercase leading-tight">
                         "Where others stop, we continue."
                      </p>
                   </div>
                </div>
             </div>
          </div>
       </div>

       {/* CTA Section */}
       <div className="py-20 md:py-32 px-6 md:px-16">
          <div className="max-w-4xl mx-auto text-center">
             <h2 className="font-display text-3xl md:text-5xl font-bold uppercase text-white mb-6">
                Ready to Transform<span className="text-[var(--accent)]">?</span>
             </h2>
             <p className="text-gray-400 text-sm md:text-base mb-10 max-w-2xl mx-auto">
                Experience the difference of professionally installed privacy glass with genuine Enkahnz film systems.
             </p>
             <Link href="/contact" className="inline-block px-12 py-5 bg-white text-black font-bold uppercase tracking-widest hover:bg-[var(--accent)] hover:text-black transition-all duration-300">
                Request Quote
             </Link>
          </div>
       </div>
    </div>
  );
};

export default TintsPage;
