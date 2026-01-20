"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react"; 
import { SHOP_CATEGORIES } from "@/lib/shopCategories";

type Props = {
  onNavigate?: () => void;
  className?: string;
};

export default function ShopMegaMenu({ onNavigate, className = "" }: Props) {
  return (
    // FIX 1: Added max-h-[85vh] and overflow-y-auto to the main container
    // This ensures the menu never exceeds 85% of screen height and scrolls internally
    <div className={`w-full bg-[#050505] border-t border-white/10 shadow-2xl max-h-[85vh] overflow-y-auto ${className}`}>
      
      {/* Reduced padding from py-12 to py-8 to save space */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex w-full">
          
          {/* LEFT SIDE: CATEGORY GRID (75% Width) */}
          <div className="w-3/4 pr-12">
            {/* Reduced gap-y-12 to gap-y-10 to pull groups closer together */}
            <div className="grid grid-cols-4 gap-x-8 gap-y-10">
              {SHOP_CATEGORIES.map((make) => (
                <div key={make.slug} className="group flex flex-col items-start">
                  
                  {/* Brand Header */}
                  <div className="flex items-center gap-3 mb-4"> {/* Reduced mb-6 to mb-4 */}
                    <span className="h-[1px] w-4 bg-[var(--accent-orange)]"></span>
                    <h3 className="font-display text-lg font-bold uppercase tracking-widest text-white">
                      {make.label}
                    </h3>
                  </div>

                  {/* Models List */}
                  <ul className="flex flex-col gap-2 border-l border-white/5 pl-4 w-full">
                    {make.models.map((model) => (
                      <li key={`${make.slug}-${model.slug}`}>
                        <Link
                          href={`/shop/${model.slug}`}
                          onClick={onNavigate}
                          className="block text-sm text-[var(--text-muted)] hover:text-white hover:translate-x-1 transition-all duration-300 font-medium tracking-wide uppercase"
                        >
                          {model.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE: CUSTOM BUILD CTA (25% Width) */}
          <div className="w-1/4 border-l border-white/10 pl-12 hidden lg:block relative">
            <div className="sticky top-0 flex flex-col gap-8">

              {/* Header Section */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="h-[1px] w-6 bg-[var(--accent-orange)]"></span>
                  <h4 className="text-white font-display font-bold uppercase tracking-widest text-sm">
                    Can't Find It?
                  </h4>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  We source rare OEM and aftermarket components for all premium marques.
                </p>
              </div>

              {/* Services Card */}
              <div className="bg-[#0a0a0a] border border-white/5 p-6 hover:border-[var(--accent-orange)]/30 transition-all duration-300 group">
                <p className="text-white text-xs font-bold uppercase tracking-widest mb-4 text-[var(--accent-orange)]">
                  Specialist Sourcing
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-gray-400 text-xs group-hover:text-gray-300 transition-colors">
                    <span className="w-1 h-1 rounded-full bg-[var(--accent-orange)]"></span>
                    <span>OEM Parts</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-400 text-xs group-hover:text-gray-300 transition-colors">
                    <span className="w-1 h-1 rounded-full bg-[var(--accent-orange)]"></span>
                    <span>Limited Edition</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-400 text-xs group-hover:text-gray-300 transition-colors">
                    <span className="w-1 h-1 rounded-full bg-[var(--accent-orange)]"></span>
                    <span>Bespoke Fabrication</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link
                  href="/contact"
                  onClick={onNavigate}
                  className="group flex items-center justify-between text-black bg-[var(--accent-orange)] px-6 py-4 hover:bg-white transition-all duration-300 uppercase tracking-widest text-xs font-bold"
                >
                  <span>Request Part</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/shop"
                  onClick={onNavigate}
                  className="group flex items-center justify-between text-white border border-white/20 px-6 py-4 hover:border-[var(--accent-orange)] hover:bg-[var(--accent-orange)]/10 transition-all duration-300 uppercase tracking-widest text-xs font-bold"
                >
                  <span>View All Parts</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}