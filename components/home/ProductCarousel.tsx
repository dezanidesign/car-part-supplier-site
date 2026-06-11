'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { BUYING_REASSURANCE_POINTS } from '@/lib/siteContent';

interface Product {
  slug: string;
  name: string;
  image: string;
  price: string | number;
  category: string;
}

function formatPrice(price: Product['price']) {
  const numeric = Number(price);
  if (!Number.isFinite(numeric) || numeric <= 0) return 'Price on request';
  return numeric.toLocaleString('en-GB', {
    style: 'currency',
    currency: 'GBP',
  });
}

export default function ProductCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>([]);

  const state = useRef({
    isDown: false,
    startX: 0,
    scrollLeft: 0,
    isDragging: false
  });

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const res = await fetch('/api/products/featured');
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Failed to fetch featured products:', error);
      }
    };
    fetchFeaturedProducts();
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!trackRef.current) return;
    state.current.isDown = true;
    state.current.isDragging = false;
    state.current.startX = e.pageX - trackRef.current.offsetLeft;
    state.current.scrollLeft = trackRef.current.scrollLeft;
    trackRef.current.style.cursor = 'grabbing';
  };

  const handleMouseLeave = () => {
    if (!trackRef.current) return;
    state.current.isDown = false;
    trackRef.current.style.cursor = 'grab';
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!trackRef.current) return;
    state.current.isDown = false;
    trackRef.current.style.cursor = 'grab';
    if (state.current.isDragging) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!state.current.isDown || !trackRef.current) return;
    e.preventDefault();
    state.current.isDragging = true;
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - state.current.startX) * 1.5;
    trackRef.current.scrollLeft = state.current.scrollLeft - walk;
  };

  const handleProductClick = (e: React.MouseEvent) => {
    if (state.current.isDragging) {
      e.preventDefault();
    }
  };

  if (products.length === 0) return null;

  return (
    <section className="py-16 md:py-32 px-0 overflow-hidden bg-[var(--bg-dark)]">
      <div className="max-w-[1920px] mx-auto">
        <div className="px-6 md:px-16 mb-8 md:mb-12 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
          <div className="max-w-2xl">
            <p className="text-[var(--accent)] text-[10px] font-bold uppercase tracking-[0.28em] mb-4">
              Browse selected parts
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-bold uppercase text-white mb-3">
              Curated <span className="text-[var(--accent)]">Parts</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Shop selected parts with clear fitment, pricing and enquiry options.
              <span className="md:hidden"> Swipe through available parts.</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center gap-3 bg-white px-5 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-black transition-all hover:bg-[var(--accent)] md:text-xs"
            >
              <ShoppingBag size={14} />
              <span>View All Parts</span>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 border border-white/20 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white transition-all hover:border-[var(--accent)] hover:text-[var(--accent)] md:text-xs"
            >
              <span>Request a Part</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        <div className="mx-6 mb-8 grid gap-3 border border-white/10 bg-white/[0.02] p-4 md:mx-16 md:grid-cols-3 lg:grid-cols-6">
          {BUYING_REASSURANCE_POINTS.map((point) => (
            <div key={point} className="flex items-center gap-3 text-xs text-gray-300">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              <span>{point}</span>
            </div>
          ))}
        </div>

        <div
          className="overflow-x-auto no-scrollbar cursor-grab px-6 md:px-16 pb-8 md:pb-12"
          ref={trackRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          <div className="flex gap-4 md:gap-6 w-max">
            {products.map((p, idx) => (
              <Link
                key={p.slug || idx}
                href={`/product/${p.slug}`}
                onClick={handleProductClick}
                className="prod-carousel-item relative w-[260px] md:w-[350px] aspect-[4/5] overflow-hidden border border-white/10 bg-[var(--bg-card)] group block flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/70"
                aria-label={`View ${p.name}`}
              >
                <img src={p.image} alt={p.name} className="w-full h-full object-cover pointer-events-none" />
                <div className="prod-overlay absolute inset-0 flex flex-col justify-end p-4 md:p-6 pointer-events-none">
                  <p className="text-[var(--accent)] text-[10px] md:text-xs font-bold uppercase tracking-widest mb-2">{p.category}</p>
                  <h3 className="text-base md:text-lg text-white font-bold leading-tight mb-2 line-clamp-2">{p.name}</h3>
                  <p className="mb-3 text-gray-300 text-[11px] md:text-xs">Fitment advice available</p>
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-white font-semibold text-sm md:text-base">{formatPrice(p.price)}</p>
                    <span className="inline-flex items-center gap-2 bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-black transition-colors group-hover:bg-[var(--accent)]">
                      View <ArrowRight size={11} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}

            <Link
              href="/shop"
              className="prod-carousel-item w-[260px] md:w-[350px] aspect-[4/5] overflow-hidden bg-gradient-to-br from-[var(--accent)] to-[#D9C27E] flex flex-col items-center justify-center text-center p-6 md:p-8 cursor-pointer flex-shrink-0"
            >
              <ShoppingBag size={40} className="text-white mb-3 md:mb-4 md:w-12 md:h-12" />
              <h3 className="font-display text-xl md:text-2xl text-white font-bold mb-2">Shop All Parts</h3>
              <p className="text-white/90 text-xs md:text-sm">Browse by vehicle, price and fitment</p>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
