"use client";

import { useState } from "react";

type TintPreviewSliderProps = {
  imageSrc?: string;
  imageAlt?: string;
  compact?: boolean;
};

export default function TintPreviewSlider({
  imageSrc = "/gallery/audi/5B1A3695.jpg",
  imageAlt = "Vehicle privacy glass preview",
  compact = false,
}: TintPreviewSliderProps) {
  const [tintLevel, setTintLevel] = useState(50);

  return (
    <div
      className={`group relative w-full overflow-hidden border border-white/5 bg-[#111] ${
        compact ? "aspect-[4/3]" : "h-[50vh] md:h-[60vh]"
      }`}
    >
      <img src={imageSrc} className="h-full w-full object-cover" alt={imageAlt} />

      <div
        className="pointer-events-none absolute inset-0 bg-black transition-opacity duration-100"
        style={{ opacity: tintLevel / 100 }}
      />

      <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/60 px-4 py-2 backdrop-blur-sm md:left-6 md:top-6">
        <span className="text-[10px] font-bold uppercase tracking-widest text-white md:text-xs">
          Interactive Preview
        </span>
      </div>

      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-black/80 to-transparent p-4 md:p-8">
        <div className="mx-auto max-w-2xl rounded-xl border border-white/10 bg-black/45 p-4 backdrop-blur-md md:p-6">
          <div className="mb-4 flex justify-between text-[10px] font-bold uppercase tracking-widest text-white md:text-xs">
            <span>Clear</span>
            <span className="text-[var(--accent)]">Limo Black ({tintLevel}%)</span>
          </div>
          <input
            type="range"
            min="0"
            max="95"
            value={tintLevel}
            onChange={(event) => setTintLevel(Number(event.target.value))}
            className="w-full"
            aria-label="Preview tint level"
          />
          {!compact && (
            <p className="mt-4 text-center text-xs text-gray-400">
              Drag the slider to preview different tint levels
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
