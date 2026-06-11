"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { HomeHeroSlide } from "@/lib/curatedMedia";

type Props = {
  slides: HomeHeroSlide[];
};

export default function HeroCarousel({ slides }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalSlides = slides.length;
  const currentSlide = slides[currentIndex] || slides[0];

  const state = useRef({
    isDragging: false,
    hasDragged: false,
    startPos: 0,
    currentTranslate: 0,
    prevTranslate: 0,
    animationID: 0,
    currentIndex: 0,
    autoPlayTimer: null as ReturnType<typeof setInterval> | null,
  });

  const getSlideWidth = () => (containerRef.current ? containerRef.current.clientWidth : 0);

  const setSliderPosition = () => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${state.current.currentTranslate}px)`;
    }
  };

  const animation = () => {
    setSliderPosition();
    if (state.current.isDragging) requestAnimationFrame(animation);
  };

  const goToSlide = useCallback(
    (index: number) => {
      if (totalSlides === 0) return;

      let newIndex = index;
      if (newIndex < 0) newIndex = totalSlides - 1;
      if (newIndex >= totalSlides) newIndex = 0;

      state.current.currentIndex = newIndex;
      setCurrentIndex(newIndex);

      if (trackRef.current) {
        trackRef.current.style.transition = "transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)";
        state.current.currentTranslate = newIndex * -getSlideWidth();
        state.current.prevTranslate = state.current.currentTranslate;
        trackRef.current.style.transform = `translateX(${state.current.currentTranslate}px)`;
      }
    },
    [totalSlides],
  );

  useEffect(() => {
    const stopAutoPlay = () => {
      if (state.current.autoPlayTimer) clearInterval(state.current.autoPlayTimer);
    };

    stopAutoPlay();
    state.current.autoPlayTimer = setInterval(() => {
      if (!state.current.isDragging) {
        goToSlide(state.current.currentIndex + 1);
      }
    }, 6000);

    return () => stopAutoPlay();
  }, [goToSlide]);

  const handleTouchStart = (event: React.MouseEvent | React.TouchEvent) => {
    state.current.isDragging = true;
    state.current.hasDragged = false;
    state.current.startPos = "touches" in event ? event.touches[0].clientX : event.pageX;
    if (trackRef.current) trackRef.current.style.transition = "none";
    state.current.animationID = requestAnimationFrame(animation);
  };

  const handleTouchMove = (event: React.MouseEvent | React.TouchEvent) => {
    if (!state.current.isDragging) return;

    const currentPosition = "touches" in event ? event.touches[0].clientX : event.pageX;
    const currentMove = currentPosition - state.current.startPos;
    if (Math.abs(currentMove) > 8) state.current.hasDragged = true;
    state.current.currentTranslate = state.current.prevTranslate + currentMove;
  };

  const handleTouchEnd = () => {
    state.current.isDragging = false;
    cancelAnimationFrame(state.current.animationID);
    const movedBy = state.current.currentTranslate - state.current.prevTranslate;

    if (movedBy < -75) goToSlide(state.current.currentIndex + 1);
    else if (movedBy > 75) goToSlide(state.current.currentIndex - 1);
    else goToSlide(state.current.currentIndex);

    window.setTimeout(() => {
      state.current.hasDragged = false;
    }, 0);
  };

  if (slides.length === 0) return null;

  return (
    <div
      className="fdl-hero-wrapper hero-bleed"
      id="fdlHero"
      ref={containerRef}
      onMouseDown={handleTouchStart}
      onMouseMove={handleTouchMove}
      onMouseUp={handleTouchEnd}
      onMouseLeave={() => {
        if (state.current.isDragging) handleTouchEnd();
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="fdl-track" ref={trackRef}>
        {slides.map((slide, idx) => (
          <div
            className="fdl-slide cursor-grab active:cursor-grabbing"
            key={slide.slug}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              sizes="100vw"
              priority={idx === 0}
              draggable={false}
            />
          </div>
        ))}
      </div>

      <div className="fdl-overlay" />

      <div className="hero-bleed-inner pointer-events-none relative z-10 px-6 pb-40 md:px-16 md:pb-36">
        <div className="max-w-4xl border-l-2 border-[var(--accent)] pl-5 md:pl-7">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.26em] text-[var(--accent)] md:text-xs">
            FDL Bespoke - Premium Vehicle Specialists
          </p>
          <h1 className="font-display max-w-[16ch] text-4xl font-bold uppercase leading-[0.96] text-white md:text-6xl lg:text-7xl">
            Premium parts, styling &amp; bespoke conversions<span className="text-[var(--accent)]">.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-200 md:mt-5 md:text-base">
            Shop curated vehicle parts or speak to FDL about fitment, sourcing, retrofits and custom builds.
          </p>
          <div className="pointer-events-auto mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap md:mt-7">
            <Link
              href="/shop"
              className="group inline-flex items-center justify-center gap-3 bg-white px-6 py-3 text-xs font-bold uppercase tracking-widest text-black transition-all duration-300 hover:bg-[var(--accent)] hover:text-black md:px-7 md:py-3.5"
              aria-label="Shop vehicle parts"
            >
              <ShoppingBag size={16} />
              <span>Shop Parts</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/contact"
              className="group inline-flex items-center justify-center gap-3 border border-white/30 bg-black/25 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-sm transition-all duration-300 hover:border-white hover:bg-white hover:text-black md:px-7 md:py-3.5"
              aria-label="Request a quote"
            >
              <span>Request a Quote</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="#shop-by-vehicle"
              className="hidden items-center justify-center px-2 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent)] transition-colors hover:text-white sm:inline-flex"
            >
              Browse by Vehicle
            </Link>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 z-20 flex w-full items-end justify-between p-6 md:p-12">
        <div className="pointer-events-auto flex gap-3 md:gap-4">
          <button
            type="button"
            onClick={() => goToSlide(state.current.currentIndex - 1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/30 text-white backdrop-blur-sm transition-all hover:bg-white hover:text-black md:h-12 md:w-12"
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => goToSlide(state.current.currentIndex + 1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/30 text-white backdrop-blur-sm transition-all hover:bg-white hover:text-black md:h-12 md:w-12"
            aria-label="Next slide"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="pointer-events-auto hidden items-baseline gap-3 sm:flex md:gap-5">
          {slides.map((slide, idx) => (
            <button
              type="button"
              key={slide.slug}
              onClick={() => goToSlide(idx)}
              className={`font-display cursor-pointer font-bold transition-all duration-500 ${
                currentIndex === idx
                  ? "text-2xl text-white md:text-3xl"
                  : "text-xs text-white/30 hover:text-white/60 md:text-sm"
              }`}
              aria-label={`Show ${slide.label}`}
            >
              {String(idx + 1).padStart(2, "0")}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
