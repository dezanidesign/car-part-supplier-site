"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { ShoppingBag, Menu, X, ChevronDown, ChevronRight, ChevronLeft } from "lucide-react";
import { useCartStore } from "@/lib/store";
import ShopMegaMenu from "./ShopMegaMenu";
import { SITE_EMAIL, SITE_LOGO_PATH } from "@/lib/siteContent";

const mainNavItems = [
  { href: "/blog", label: "Blog" },
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

  const [isShopOpen, setIsShopOpen] = useState(false);

  const cartItemCount = useCartStore((state) => state.getItemCount());
  
  // Refs for mobile menu scroll containers
  const mainMenuRef = useRef<HTMLDivElement>(null);
  const shopMenuRef = useRef<HTMLDivElement>(null);
  const desktopShopRef = useRef<HTMLDivElement>(null);
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
  const openShop = (open: boolean) => {
    setIsShopOpen(open);
  };

  useEffect(() => {
    if (!isShopOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsShopOpen(false);
      }
    };

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (target && desktopShopRef.current?.contains(target)) return;
      setIsShopOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [isShopOpen]);

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
    setMobileView('main');
  };

  return (
    <nav
      className={`fixed top-[var(--topbar-height)] w-full h-[var(--nav-height)] z-50 px-6 md:px-10 xl:px-16 py-4 lg:py-3 xl:py-4 flex items-center justify-between gap-4 lg:grid lg:grid-cols-[110px_minmax(0,1fr)_auto] xl:grid-cols-[130px_minmax(0,1fr)_auto] lg:gap-5 xl:gap-6 transition-all duration-500 ${
        scrolled
          ? "bg-black/90 backdrop-blur-md border-b border-white/5"
          : "bg-transparent"
      }`}
      style={isMenuOpen ? { zIndex: 9200 } : undefined}
    >
      {/* ======================= LOGO ======================= */}
      <Link href="/" className="relative z-[250] block shrink-0 w-[60px] h-[20px] sm:w-[72px] sm:h-[24px] lg:w-[110px] lg:h-[36px] xl:w-[130px] xl:h-[42px] overflow-hidden lg:justify-self-start">
        <Image
          src={SITE_LOGO_PATH}
          alt="FDL Bespoke"
          fill
          sizes="(min-width: 1280px) 130px, (min-width: 1024px) 110px, (min-width: 640px) 72px, 60px"
          className="object-contain object-left"
          priority
        />
      </Link>

      {/* ======================= DESKTOP MENU ======================= */}
      <div className="hidden lg:flex min-w-0 justify-center gap-6 xl:gap-8 font-medium text-[11px] xl:text-xs tracking-[0.18em] uppercase text-white items-center justify-self-center">
        {/* Services Link */}
        <Link href="/services" className="hover:text-[var(--accent)] transition-colors font-bold py-4">
          SERVICES
        </Link>

        {/* Defender Link */}
        <Link href="/defender" className="hover:text-[var(--accent)] transition-colors font-bold py-4">
          DEFENDER
        </Link>

        {/* SHOP Dropdown (Desktop Mega Menu) */}
        <div
          ref={desktopShopRef}
          className="relative group h-full flex items-center"
          onFocus={() => openShop(true)}
          onBlur={(event) => {
            const nextFocus = event.relatedTarget as Node | null;
            if (!nextFocus || !event.currentTarget.contains(nextFocus)) {
              openShop(false);
            }
          }}
        >
          <button
            type="button"
            onClick={() => openShop(true)}
            onKeyDown={(event) => {
              if (event.key === "Escape") openShop(false);
              if (event.key === "ArrowDown") openShop(true);
            }}
            aria-expanded={isShopOpen}
            aria-haspopup="true"
            aria-controls="shop-menu-panel"
            className="hover:text-[var(--accent)] transition-colors font-bold flex items-center gap-1 py-4 whitespace-nowrap"
          >
            SHOP PARTS <ChevronDown size={12} />
          </button>
          <div
            id="shop-menu-panel"
            className={`fixed left-1/2 top-[var(--header-offset)] z-[240] -translate-x-1/2 transition-all duration-300 ${
              isShopOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 translate-y-4 invisible"
            }`}
            style={{ zIndex: 240 }}
          >
             <div style={{ width: "calc(100vw - 2rem)", maxWidth: "980px" }}>
                <ShopMegaMenu onNavigate={() => openShop(false)} />
             </div>
          </div>
        </div>

        {/* Standard Links */}
        {mainNavItems.map((item) => (
          <Link key={item.href} href={item.href} className="hover:text-[var(--accent)] transition-colors font-bold">
            {item.label}
          </Link>
        ))}
        <Link href="/contact" className="text-[var(--accent)] hover:text-white transition-colors font-bold">
          REQUEST QUOTE
        </Link>
      </div>

      {/* ======================= ICONS & TOGGLE ======================= */}
      <div className="flex items-center gap-6 xl:gap-8 relative z-[250] shrink-0 lg:justify-self-end">
        <Link href="/cart" className="relative group" aria-label="View cart">
          <ShoppingBag className="text-white group-hover:text-[var(--accent)] transition-colors" size={22} />
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-[var(--accent)] text-black text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold shadow-lg">
              {cartItemCount}
            </span>
          )}
        </Link>
        <button
          className="lg:hidden text-white p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-controls="mobile-menu"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* ======================= MOBILE MENU (Enkahnz Style) ======================= */}
      <div
        id="mobile-menu"
        className={`fixed top-0 left-0 right-0 bottom-0 bg-black z-[200] lg:hidden transition-all duration-300 ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="h-full flex flex-col relative overflow-hidden">
          
          {/* VIEW 1: MAIN MENU */}
          <div ref={mainMenuRef} className={`flex flex-col gap-6 transition-transform duration-500 absolute inset-0 pt-[120px] px-8 pb-8 overflow-y-auto ${mobileView === 'main' ? "translate-x-0" : "-translate-x-full"}`}>
            
            {/* Services Link */}
            <div className="border-b border-white/10 pb-6">
               <Link href="/services" onClick={() => setIsMenuOpen(false)} className="font-display text-xl uppercase font-bold text-white hover:text-[var(--accent)] block py-2 transition-colors">
                 Services
               </Link>
            </div>

            {/* Defender Link */}
            <div className="border-b border-white/10 pb-6">
               <Link href="/defender" onClick={() => setIsMenuOpen(false)} className="font-display text-xl uppercase font-bold text-white hover:text-[var(--accent)] block py-2 transition-colors flex items-center justify-between">
                 <span>Defender</span>
                 <span className="text-[9px] font-mono text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-1 tracking-widest">SPECIALIST</span>
               </Link>
            </div>

            {/* Shop Button (Triggers Slide) */}
            <div className="border-b border-white/10 pb-6">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-4 block">Shop</span>
              <button 
                onClick={() => setMobileView('shop')}
                className="w-full flex items-center justify-between text-xl uppercase font-bold text-white hover:text-[var(--accent)] py-2 group"
              >
                <span>Shop Parts</span>
                <ChevronRight size={20} className="text-white/50 group-hover:text-[var(--accent)]" />
              </button>
            </div>

            {/* Other Links */}
            <div className="flex flex-col gap-4">
              {mainNavItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)} className="font-display text-xl uppercase font-bold text-white hover:text-[var(--accent)] transition-colors">
                  {item.label}
                </Link>
              ))}
            </div>
            
            {/* Footer Contact */}
            <div className="mt-auto pt-8 pb-12">
               <a href="tel:07869022673" className="text-white text-lg font-bold">07869 022673</a>
               <a href={`mailto:${SITE_EMAIL}`} className="block text-gray-400 text-sm mt-3 hover:text-white transition-colors">
                 {SITE_EMAIL}
               </a>
               <p className="text-gray-500 text-sm mt-2">Unit C3, 511 Bradford Rd, Batley</p>
            </div>
          </div>

          {/* VIEW 2: SHOP SUB-MENU */}
          <div ref={shopMenuRef} className={`flex flex-col h-full transition-transform duration-500 absolute inset-0 pt-[120px] px-8 pb-8 bg-black overflow-y-auto ${mobileView === 'shop' ? "translate-x-0" : "translate-x-full"}`}>
            
            {/* Back Button Header */}
            <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-4">
              <button 
                onClick={() => setMobileView('main')}
                className="flex items-center gap-2 text-[var(--accent)] text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
              >
                <ChevronLeft size={14} /> Back
              </button>
              <span className="text-white font-display font-bold uppercase tracking-widest">Shop Parts</span>
            </div>

            <div className="pb-20">
              <ShopMegaMenu
                variant="mobile"
                onNavigate={closeMobileMenu}
              />
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
}
