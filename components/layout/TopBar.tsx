'use client';

import { Phone, Mail, Facebook, Instagram, Music2 } from 'lucide-react';
import Link from 'next/link';

const TopBar = () => {
  return (
    <div className="fixed top-0 left-0 w-full bg-black/95 backdrop-blur-md border-b border-white/5 z-[100] overflow-hidden">
      <div className="max-w-[1920px] mx-auto px-6 md:px-16 py-2 flex justify-between items-center">
        {/* Left: Contact Info */}
        <div className="flex items-center gap-4 md:gap-6">
          <a
            href="tel:+447869022673"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group text-xs"
          >
            <Phone size={12} className="text-[var(--accent-orange)] group-hover:rotate-12 transition-transform" />
            <span className="hidden md:inline">+44 7869 022673</span>
          </a>
          <div className="hidden md:block w-[1px] h-3 bg-white/10"></div>
          <a
            href="mailto:Fdlbespokeuk@gmail.com"
            className="hidden md:flex items-center gap-2 text-gray-400 hover:text-white transition-colors group text-xs"
          >
            <Mail size={12} className="text-[var(--accent-orange)] group-hover:scale-110 transition-transform" />
            <span>Fdlbespokeuk@gmail.com</span>
          </a>
        </div>

        {/* Right: Social Media Links */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-gray-500 uppercase tracking-widest mr-2 hidden md:inline">Follow</span>

          <a
            href="https://www.facebook.com/fdlbespokeuk/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 flex items-center justify-center rounded-full border border-white/10 text-gray-400 hover:border-[var(--accent-orange)] hover:text-[var(--accent-orange)] transition-all duration-300 hover:scale-110"
            aria-label="Facebook"
          >
            <Facebook size={14} />
          </a>

          <a
            href="https://www.instagram.com/explore/locations/337310238/fdl-bespoke-uk/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 flex items-center justify-center rounded-full border border-white/10 text-gray-400 hover:border-[var(--accent-orange)] hover:text-[var(--accent-orange)] transition-all duration-300 hover:scale-110"
            aria-label="Instagram"
          >
            <Instagram size={14} />
          </a>

          <a
            href="https://www.tiktok.com/@fdl.uk"
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 flex items-center justify-center rounded-full border border-white/10 text-gray-400 hover:border-[var(--accent-orange)] hover:text-[var(--accent-orange)] transition-all duration-300 hover:scale-110"
            aria-label="TikTok"
          >
            <Music2 size={14} />
          </a>

          {/* Animated pulse indicator */}
          <div className="hidden md:flex items-center gap-2 ml-2 pl-3 border-l border-white/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-orange)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-orange)]"></span>
            </span>
            <span className="text-[9px] text-gray-500 uppercase tracking-widest">Open</span>
          </div>
        </div>
      </div>

      {/* Subtle animated gradient line */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--accent-orange)] to-transparent opacity-20 animate-pulse"></div>
    </div>
  );
};

export default TopBar;
