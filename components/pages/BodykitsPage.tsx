'use client';

import { Layers, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const BodykitsPage = () => (
  <div className="min-h-screen bg-[var(--bg-dark)] pt-32 pb-24 px-6 md:px-16 animate-in fade-in duration-700">
    <div className="max-w-[1920px] mx-auto grid lg:grid-cols-2 gap-12 lg:gap-24">
       <div className="lg:sticky lg:top-32 h-fit order-2 lg:order-1">
          <span className="text-[var(--accent-orange)] text-xs font-bold uppercase tracking-widest mb-6 block flex items-center"><Layers size={16} className="mr-2"/> Engineering</span>
          <h1 className="font-display text-5xl md:text-7xl font-bold uppercase text-white leading-[0.9] mb-8">
             Precision <br/> <span className="text-outline">Fitment</span>
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed font-light mb-12 border-l-2 border-white/10 pl-6">
             "At FDL, we believe the fit is every bit as important as the finish. Every panel is aligned with precision, every contour flows seamlessly."
          </p>
          
          <div className="space-y-12">
             <div>
                <h3 className="font-display text-2xl text-white font-bold uppercase mb-4">In-House Fitting & Paintwork</h3>
                <p className="text-gray-500 leading-relaxed">
                   All bodykits are expertly installed and painted in-house by our skilled technicians. From preparation through to paint, each vehicle undergoes a rigorous quality control process to deliver a flawless, factory-level finish.
                </p>
             </div>
             <div>
                <h3 className="font-display text-2xl text-white font-bold uppercase mb-4">Material Excellence</h3>
                <p className="text-gray-500 leading-relaxed">
                   We offer solutions tailored to different budgets. Kits are available in PU plastic, PP, GRP (fibreglass), and carbon fibre, depending on your vehicle and specification.
                </p>
             </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-white/10">
             <Link href="/contact" className="flex items-center gap-4 text-white hover:text-[var(--accent-orange)] transition-colors group">
                <span className="font-display font-bold uppercase text-xl">Start Your Build</span>
                <ArrowRight className="group-hover:translate-x-2 transition-transform" />
             </Link>
          </div>
       </div>

       <div className="order-1 lg:order-2 space-y-4">
          <div className="aspect-[4/5] w-full overflow-hidden">
             <img src="/gallery/land-rover/5B1A6489.jpg" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="aspect-square w-full bg-[#111] border border-white/5 flex flex-col justify-center items-center p-6 text-center group hover:border-[var(--accent-orange)] transition-colors">
                <span className="font-display text-4xl text-white font-bold mb-2 group-hover:scale-110 transition-transform">100%</span>
                <span className="text-[10px] uppercase tracking-widest text-gray-500">Fitment Guarantee</span>
             </div>
             <div className="aspect-square w-full bg-[#111] border border-white/5 flex flex-col justify-center items-center p-6 text-center group hover:border-[var(--accent-orange)] transition-colors">
                <span className="font-display text-4xl text-white font-bold mb-2 group-hover:scale-110 transition-transform">OEM+</span>
                <span className="text-[10px] uppercase tracking-widest text-gray-500">Finish Standard</span>
             </div>
          </div>
       </div>
    </div>
  </div>
);

export default BodykitsPage;
