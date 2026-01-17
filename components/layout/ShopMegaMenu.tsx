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

          {/* RIGHT SIDE: FEATURED (25% Width) */}
          {/* Added sticky positioning so the image stays in view while you scroll the list */}
          <div className="w-1/4 border-l border-white/10 pl-12 hidden lg:block relative">
            <div className="sticky top-0 flex flex-col h-full">
              
              <div>
                <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-6 opacity-80">
                  Featured Collection
                </h4>
                
                {/* Promo Card */}
                <Link 
                  href="/shop/carbon-fiber" 
                  onClick={onNavigate}
                  className="group/card block relative aspect-[4/5] w-full overflow-hidden bg-[#111] mb-6"
                >
                  <div className="absolute inset-0 bg-neutral-900 group-hover/card:scale-105 transition-transform duration-700">
                     {/* Placeholder Image */}
                     <img 
                       src="https://images.unsplash.com/photo-1603584173870-7b299f589836?q=80&w=800&auto=format&fit=crop" 
                       alt="Carbon Fiber Kits"
                       className="w-full h-full object-cover opacity-60 group-hover/card:opacity-80 transition-opacity duration-500"
                     />
                  </div>
                  
                  <div className="absolute bottom-0 left-0 p-6 w-full bg-gradient-to-t from-black to-transparent">
                    <span className="text-[var(--accent-orange)] text-xs font-bold uppercase tracking-widest mb-2 block">
                      New Arrival
                    </span>
                    <p className="text-white text-xl font-display font-bold leading-tight">
                      Carbon Fiber Aero Kits
                    </p>
                  </div>
                </Link>
              </div>

              {/* Quick Action Button */}
              <Link 
                href="/shop" 
                onClick={onNavigate}
                className="flex items-center justify-between text-white border border-white/20 px-6 py-4 hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-widest text-xs font-bold mt-auto"
              >
                <span>View All Parts</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}