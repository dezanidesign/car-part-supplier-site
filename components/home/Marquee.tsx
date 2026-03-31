'use client';

import React from 'react';

export default function Marquee() {
  return (
    <div className="py-6 bg-[var(--bg-card)] border-y border-white/5 text-white overflow-hidden z-10 relative">
      <div className="marquee-container">
        <div className="marquee-content font-display text-sm font-bold uppercase tracking-[0.3em] items-center text-[#888]">
          {[...Array(8)].map((_, i) => (
            <React.Fragment key={i}>
              <span className="text-[var(--accent)] mx-8">&ndash;</span> Aerodynamics
              <span className="text-[var(--accent)] mx-8">&ndash;</span> Carbon Fibre
              <span className="text-[var(--accent)] mx-8">&ndash;</span> Performance
              <span className="text-[var(--accent)] mx-8">&ndash;</span> Bodykits
              <span className="text-[var(--accent)] mx-8">&ndash;</span> Bespoke Styling
              <span className="text-[var(--accent)] mx-8">&ndash;</span> Security
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
