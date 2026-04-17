'use client';

import React from 'react';
import Link from 'next/link';
import { Star, Quote, ShoppingBag } from 'lucide-react';

const REVIEWS = [
  {
    name: "James H.",
    role: "Range Rover Sport SVR",
    text: "Absolute transformation. The carbon work is flawless and the fitment is OEM quality. FDL know exactly what they are doing.",
    date: "2 days ago"
  },
  {
    name: "Marcus T.",
    role: "Mercedes G63 AMG",
    text: "Professional from start to finish. The team handled the full body kit installation and wrap with incredible attention to detail.",
    date: "1 week ago"
  },
  {
    name: "Sarah L.",
    role: "Defender 90",
    text: "Best in the game for alloy upgrades. The 23s look incredible and the ride quality is still perfect. Highly recommended.",
    date: "2 weeks ago"
  }
];

export default function ReviewsSection() {
  return (
    <section className="py-16 md:py-24 px-6 md:px-16 bg-[#030303] border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 md:gap-4 mb-10 md:mb-16">
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-black md:text-xs">
            Google Reviews
          </span>
          <span className="text-white font-bold uppercase tracking-widest text-[10px] md:text-xs">5.0 Star Rating</span>
          <div className="h-[1px] flex-grow bg-white/10"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-8 mb-10 md:mb-16">
          {REVIEWS.map((review, i) => (
            <div key={review.name} className="bg-[#0a0a0a] border border-white/5 p-6 md:p-8 relative hover:border-[var(--accent)] transition-all duration-300 group">
              <Quote className="absolute top-6 right-6 md:top-8 md:right-8 text-[var(--accent)] opacity-20 w-6 h-6 md:w-8 md:h-8 group-hover:opacity-100 transition-opacity" />
              <div className="flex text-[var(--accent)] mb-4 md:mb-6">
                {[...Array(5)].map((_, j) => <Star key={j} size={12} fill="currentColor" className="mr-1 md:w-3.5 md:h-3.5" />)}
              </div>
              <p className="text-gray-300 text-xs md:text-sm leading-relaxed mb-6 md:mb-8 min-h-[60px] md:min-h-[80px]">&ldquo;{review.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-white/10 rounded-full flex items-center justify-center font-bold text-white text-xs md:text-sm">
                  {review.name[0]}
                </div>
                <div>
                  <p className="text-white font-bold text-xs md:text-sm">{review.name}</p>
                  <p className="text-[var(--accent)] text-[10px] md:text-xs uppercase tracking-widest">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center border-t border-white/5 pt-10 md:pt-16">
          <h3 className="font-display text-2xl md:text-4xl font-bold uppercase text-white mb-4 md:mb-6">
            Ready to Transform<span className="text-[var(--accent)]">?</span>
          </h3>
          <p className="text-gray-400 text-xs md:text-sm mb-6 md:mb-8 max-w-xl mx-auto">
            Browse our curated collection of premium parts and accessories, trusted by enthusiasts nationwide.
          </p>
          <Link href="/shop" className="inline-flex items-center gap-3 bg-white text-black px-8 md:px-12 py-4 md:py-5 font-bold uppercase tracking-widest text-xs md:text-sm hover:bg-[var(--accent)] hover:text-black transition-all duration-300">
            <ShoppingBag size={16} className="md:w-5 md:h-5" />
            <span>Browse Shop</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
