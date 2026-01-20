"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { ShoppingBag, Menu, X, ChevronDown, ChevronRight, ChevronLeft } from "lucide-react";
import { useCartStore } from "@/lib/store";
import ShopMegaMenu from "./ShopMegaMenu";
import { SHOP_CATEGORIES } from "@/lib/shopCategories"; // Ensure you import your data

// ============================================================================
// NAV ITEMS
// ============================================================================

const customisationItems = [
  { href: "/customisation/bodykits", label: "Bodykits" },
  { href: "/customisation/alloys", label: "Alloy Wheels" },
  { href: "/customisation/styling", label: "Styling" },
  { href: "/customisation/tints", label: "Tints & Privacy" },
  { href: "/customisation/interiors", label: "Interior Conversions" },
];

const mainNavItems = [
  { href: "/gallery", label: "Gallery" },
  { href: "/info", label: "Info" },
  { href: "/contact", label: "Contact Us" },
];

// ============================================================================
// COMPONENT
// ============================================================================

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // NEW: Track which "view" the mobile menu is showing
  const [mobileView, setMobileView] = useState<'main' | 'shop'>('main');
  // NEW: Track which brand is expanded in mobile shop view
  const [expandedBrand, setExpandedBrand] = useState<string | null>(null);

  const [isCustomisationOpen, setIsCustomisationOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);

  const cartItemCount = useCartStore((state) => state.getItemCount());
  
  // Refs for mobile menu scroll containers
  const mainMenuRef = useRef<HTMLDivElement>(null);
  const shopMenuRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      // Save current scroll position
      scrollPositionRef.current = window.scrollY;
      
      // Reset scroll position of menu containers when menu opens
      if (mainMenuRef.current) mainMenuRef.current.scrollTop = 0;
      if (shopMenuRef.current) shopMenuRef.current.scrollTop = 0;
      
      // Lock body scroll and position
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // Reset mobile view when menu closes
      setTimeout(() => setMobileView('main'), 300);
      
      // Restore body scroll and position
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      
      // Restore scroll position
      window.scrollTo(0, scrollPositionRef.current);
    }
    
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Desktop Hover Handlers
  const openCustomisation = (open: boolean) => {
    setIsCustomisationOpen(open);
    if (open) setIsShopOpen(false);
  };
  const openShop = (open: boolean) => {
    setIsShopOpen(open);
    if (open) setIsCustomisationOpen(false);
  };

  const toggleBrand = (slug: string) => {
    setExpandedBrand(expandedBrand === slug ? null : slug);
  };

  return (
    <nav
      className={`fixed w-full z-50 px-6 md:px-16 py-6 flex justify-between items-center transition-all duration-500 top-[36px] ${
        scrolled
          ? "bg-black/90 backdrop-blur-md border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      {/* ======================= LOGO ======================= */}
      <Link href="/" className="relative z-[250]">
        <Image
          src="https://fdlbespoke.co.uk/wp-content/uploads/2025/06/cropped-cropped-FDL-UK-Logo-White-Sq.png"
          alt="FDL Bespoke"
          width={85}
          height={85}
          className="h-[70px] w-auto md:h-[85px]"
          priority
        />
      </Link>

      {/* ======================= DESKTOP MENU ======================= */}
      <div className="hidden lg:flex gap-12 font-medium text-xs tracking-[0.2em] uppercase text-white items-center">
        {/* Customisation Dropdown */}
        <div
          className="relative group h-full flex items-center"
          onMouseEnter={() => openCustomisation(true)}
          onMouseLeave={() => openCustomisation(false)}
        >
          <button className="hover:text-[var(--accent-orange)] transition-colors font-bold flex items-center gap-1 py-4">
            CUSTOMISATION <ChevronDown size={12} />
          </button>
          <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-300 ${isCustomisationOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 translate-y-4 invisible"}`}>
            <div className="bg-black border border-white/10 min-w-[260px] flex flex-col shadow-2xl backdrop-blur-xl">
              {customisationItems.map((item) => (
                <Link key={item.href} href={item.href} className="px-8 py-5 hover:bg-[var(--accent-orange)] hover:text-white transition-colors border-b border-white/5 last:border-b-0 text-[10px] tracking-widest font-bold uppercase">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* SHOP Dropdown (Desktop Mega Menu) */}
        <div
          className="relative group h-full flex items-center"
          onMouseEnter={() => openShop(true)}
          onMouseLeave={() => openShop(false)}
        >
          <button className="hover:text-[var(--accent-orange)] transition-colors font-bold flex items-center gap-1 py-4">
            SHOP <ChevronDown size={12} />
          </button>
          <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-300 ${isShopOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 translate-y-4 invisible"}`}>
             {/* Uses your new ShopMegaMenu component */}
             <div className="bg-black/95 border border-white/10 shadow-2xl backdrop-blur-xl">
               <div className="w-[min(1400px,92vw)] px-10 py-10">
                  <ShopMegaMenu onNavigate={() => openShop(false)} />
               </div>
             </div>
          </div>
        </div>

        {/* Standard Links */}
        {mainNavItems.map((item) => (
          <Link key={item.href} href={item.href} className="hover:text-[var(--accent-orange)] transition-colors font-bold">
            {item.label}
          </Link>
        ))}
      </div>

      {/* ======================= ICONS & TOGGLE ======================= */}
      <div className="flex items-center gap-8 relative z-[250]">
        <Link href="/cart" className="relative group">
          <ShoppingBag className="text-white group-hover:text-[var(--accent-orange)] transition-colors" size={22} />
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-[var(--accent-orange)] text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold shadow-lg">
              {cartItemCount}
            </span>
          )}
        </Link>
        <button
          className="lg:hidden text-white p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* ======================= MOBILE MENU (Enkahnz Style) ======================= */}
      <div className={`fixed top-0 left-0 right-0 bottom-0 bg-black z-[200] lg:hidden transition-all duration-300 ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
        <div className="h-full flex flex-col relative overflow-hidden">
          
          {/* VIEW 1: MAIN MENU */}
          <div ref={mainMenuRef} className={`flex flex-col gap-6 transition-transform duration-500 absolute inset-0 pt-[120px] px-8 pb-8 overflow-y-auto ${mobileView === 'main' ? "translate-x-0" : "-translate-x-full"}`}>
            
            {/* Customisation Links */}
            <div className="border-b border-white/10 pb-6">
               <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-4 block">Customisation</span>
               {customisationItems.map((item) => (
                 <Link key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)} className="font-display text-xl uppercase font-bold text-white hover:text-[var(--accent-orange)] block py-2 transition-colors">
                   {item.label}
                 </Link>
               ))}
            </div>

            {/* Shop Button (Triggers Slide) */}
            <div className="border-b border-white/10 pb-6">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-4 block">Store</span>
              <button 
                onClick={() => setMobileView('shop')}
                className="w-full flex items-center justify-between font-display text-xl uppercase font-bold text-white hover:text-[var(--accent-orange)] py-2 group"
              >
                <span>Shop Parts</span>
                <ChevronRight size={20} className="text-white/50 group-hover:text-[var(--accent-orange)]" />
              </button>
            </div>

            {/* Other Links */}
            <div className="flex flex-col gap-4">
              {mainNavItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)} className="font-display text-xl uppercase font-bold text-white hover:text-[var(--accent-orange)] transition-colors">
                  {item.label}
                </Link>
              ))}
            </div>
            
            {/* Footer Contact */}
            <div className="mt-auto pt-8 pb-12">
               <a href="tel:07869022673" className="text-white text-lg font-bold">07869 022673</a>
               <p className="text-gray-500 text-sm mt-2">Unit C3, 511 Bradford Rd, Batley</p>
            </div>
          </div>

          {/* VIEW 2: SHOP SUB-MENU */}
          <div ref={shopMenuRef} className={`flex flex-col h-full transition-transform duration-500 absolute inset-0 pt-[120px] px-8 pb-8 bg-black overflow-y-auto ${mobileView === 'shop' ? "translate-x-0" : "translate-x-full"}`}>
            
            {/* Back Button Header */}
            <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-4">
              <button 
                onClick={() => setMobileView('main')}
                className="flex items-center gap-2 text-[var(--accent-orange)] text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
              >
                <ChevronLeft size={14} /> Back
              </button>
              <span className="text-white font-display font-bold uppercase tracking-widest">Shop Categories</span>
            </div>

            {/* Shop Categories Accordion */}
            <div className="flex flex-col pb-20">
               {/* Quick Link to All */}
               <Link href="/shop" onClick={() => setIsMenuOpen(false)} className="py-4 border-b border-white/10 text-white font-bold uppercase tracking-widest text-sm flex justify-between items-center">
                  All Products <ChevronRight size={16} className="opacity-50" />
               </Link>

               {/* Categories from Data */}
               {SHOP_CATEGORIES.map((make) => (
                 <div key={make.slug} className="border-b border-white/10">
                   <button 
                     onClick={() => toggleBrand(make.slug)}
                     className="w-full py-4 flex items-center justify-between text-white hover:text-[var(--accent-orange)] transition-colors"
                   >
                     <span className="font-display font-bold uppercase tracking-wider">{make.label}</span>
                     <ChevronDown 
                       size={16} 
                       className={`transition-transform duration-300 ${expandedBrand === make.slug ? "rotate-180 text-[var(--accent-orange)]" : "text-white/50"}`} 
                     />
                   </button>
                   
                   {/* Expanded List */}
                   <div className={`overflow-hidden transition-all duration-300 ${expandedBrand === make.slug ? "max-h-[500px] opacity-100 mb-4" : "max-h-0 opacity-0"}`}>
                     <div className="flex flex-col gap-3 pl-4 border-l border-white/10 ml-1">
                       {make.models.map((model) => (
                         <Link 
                           key={model.slug} 
                           href={`/shop/${model.slug}`}
                           onClick={() => setIsMenuOpen(false)}
                           className="text-sm text-gray-400 hover:text-white uppercase tracking-wide block py-1"
                         >
                           {model.label}
                         </Link>
                       ))}
                     </div>
                   </div>
                 </div>
               ))}
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
}