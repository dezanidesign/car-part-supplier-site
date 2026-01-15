"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ShoppingBag, Menu, X, ChevronDown } from "lucide-react";
import { useCartStore } from "@/lib/store";

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
  { href: "/shop", label: "Shop" },
  { href: "/info", label: "Info" },
  { href: "/contact", label: "Contact Us" },
];

// ============================================================================
// NAVIGATION COMPONENT
// ============================================================================

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const cartItemCount = useCartStore((state) => state.getItemCount());

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <nav
      className={`fixed w-full z-50 px-6 md:px-16 py-6 flex justify-between items-center transition-all duration-500 ${
        scrolled
          ? "bg-black/90 backdrop-blur-md border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      {/* Logo */}
      <Link
        href="/"
        className="cursor-pointer hover-trigger opacity-90 hover:opacity-100 transition-opacity relative z-10"
      >
        <Image
          src="https://fdlbespoke.co.uk/wp-content/uploads/2025/06/cropped-cropped-FDL-UK-Logo-White-Sq.png"
          alt="FDL Bespoke"
          width={85}
          height={85}
          className="h-[70px] w-auto md:h-[85px]"
          priority
        />
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex gap-12 font-medium text-xs tracking-[0.2em] uppercase text-white items-center">
        {/* Customisation Dropdown */}
        <div
          className="relative group h-full flex items-center"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          <button className="hover:text-[var(--accent-orange)] transition-colors hover-trigger font-bold flex items-center gap-1 py-4">
            CUSTOMISATION <ChevronDown size={12} />
          </button>
          <div
            className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-300 ${
              isDropdownOpen
                ? "opacity-100 translate-y-0 visible"
                : "opacity-0 translate-y-4 invisible"
            }`}
          >
            <div className="bg-black border border-white/10 min-w-[260px] flex flex-col shadow-2xl backdrop-blur-xl">
              {customisationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-8 py-5 hover:bg-[var(--accent-orange)] hover:text-white transition-colors border-b border-white/5 last:border-b-0 text-[10px] tracking-widest font-bold uppercase"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Main Nav Items */}
        {mainNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="hover:text-[var(--accent-orange)] transition-colors hover-trigger font-bold"
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Right Side - Cart & Mobile Menu Toggle */}
      <div className="flex items-center gap-8">
        {/* Cart Button */}
        <Link href="/cart" className="relative hover-trigger group">
          <ShoppingBag
            className="text-white group-hover:text-[var(--accent-orange)] transition-colors"
            size={22}
          />
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-[var(--accent-orange)] text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold shadow-lg">
              {cartItemCount}
            </span>
          )}
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden text-white hover-trigger p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-[100px] bg-black z-40 lg:hidden animate-in slide-in-from-top-4 duration-300">
          <div className="p-8 flex flex-col gap-6 overflow-y-auto h-full">
            {/* Customisation Section */}
            <div className="border-b border-white/10 pb-6">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-4 block">
                Customisation
              </span>
              {customisationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="font-display text-xl uppercase font-bold text-white hover:text-[var(--accent-orange)] block py-3 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Main Navigation */}
            <div className="flex flex-col gap-4">
              {mainNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="font-display text-2xl uppercase font-bold text-[var(--accent-orange)] hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Contact Info */}
            <div className="mt-auto pt-8 border-t border-white/10">
              <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">
                Contact
              </p>
              <a
                href="tel:07869022673"
                className="text-white text-lg font-bold hover:text-[var(--accent-orange)] transition-colors"
              >
                07869 022673
              </a>
              <p className="text-gray-500 text-sm mt-4">
                Unit C3, 511 Bradford Rd, Batley WF17 8LL
              </p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
