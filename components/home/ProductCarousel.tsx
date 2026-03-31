'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

interface Product {
  slug: string;
  name: string;
  image: string;
  price: string;
  category: string;
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
        <div className="px-6 md:px-16 mb-8 md:mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-3 md:gap-0">
          <div>
            <h2 className="font-display text-3xl md:text-5xl font-bold uppercase text-white mb-2 md:mb-0">Curated <span className="text-[var(--accent)]">Parts</span></h2>
            <p className="text-gray-500 text-xs md:hidden">Swipe to explore &rarr;</p>
          </div>
          <div className="hidden md:flex gap-4 text-xs font-bold uppercase tracking-widest text-gray-500 items-center">
            <span>Drag to Explore</span>
            <div className="w-12 h-[1px] bg-[var(--accent)]"></div>
          </div>
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
                className="prod-carousel-item relative w-[240px] md:w-[350px] aspect-square rounded-lg md:rounded-xl overflow-hidden bg-[var(--bg-card)] group block flex-shrink-0"
              >
                <img src={p.image} alt={p.name} className="w-full h-full object-cover pointer-events-none" />
                <div className="prod-overlay absolute inset-0 flex flex-col justify-end p-4 md:p-6 pointer-events-none">
                  <p className="text-[var(--accent)] text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1 md:mb-2">{p.category}</p>
                  <h3 className="font-display text-base md:text-xl text-white font-bold leading-tight mb-1">{p.name}</h3>
                  <p className="text-white font-medium text-sm md:text-base">&pound;{p.price}</p>
                </div>
              </Link>
            ))}

            <Link
              href="/shop"
              className="prod-carousel-item w-[240px] md:w-[350px] aspect-square rounded-lg md:rounded-xl overflow-hidden bg-gradient-to-br from-[var(--accent)] to-[#D9C27E] flex flex-col items-center justify-center text-center p-6 md:p-8 cursor-pointer flex-shrink-0"
            >
              <ShoppingBag size={40} className="text-white mb-3 md:mb-4 md:w-12 md:h-12" />
              <h3 className="font-display text-xl md:text-2xl text-white font-bold mb-2">Shop All</h3>
              <p className="text-white/90 text-xs md:text-sm">Browse the full collection</p>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
