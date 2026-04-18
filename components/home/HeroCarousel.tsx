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

      <div className="hero-bleed-inner relative z-10 p-6 pb-32 pointer-events-none md:p-16 md:pb-40">
        <div className="mb-6 overflow-hidden md:mb-8">
          <h1 className="font-display text-5xl font-bold uppercase leading-[0.85] text-white tracking-tight md:text-8xl lg:text-9xl">
            FDL<span className="text-[var(--accent)]">.</span>
          </h1>
        </div>
        <div className="flex flex-col items-start justify-between gap-6 border-t border-white/20 pt-6 md:flex-row md:items-end md:gap-12 md:pt-8">
          <div className="max-w-2xl">
            <p className="font-display mb-6 text-lg font-bold uppercase leading-tight text-white md:mb-8 md:text-2xl">
              Defined by Detail.<br />Driven by Passion.
            </p>
            <Link
              href={currentSlide.href}
              className="pointer-events-auto inline-flex items-center gap-3 bg-white px-6 py-3 text-xs font-bold uppercase tracking-widest text-black transition-all duration-300 hover:bg-[var(--accent)] hover:text-black md:px-8 md:py-4 md:text-sm group"
              aria-label={`Shop ${currentSlide.label}`}
            >
              <ShoppingBag size={16} className="md:h-5 md:w-5" />
              <span>Shop Now</span>
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1 md:h-4 md:w-4" />
            </Link>
          </div>
          <div className="flex items-center gap-3 whitespace-nowrap text-xs font-bold uppercase tracking-widest text-[var(--accent)]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--accent)]" />
            Workshop Active
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 z-20 flex w-full items-end justify-between p-6 md:p-16">
        <div className="pointer-events-auto flex gap-3 md:gap-4">
          <button
            type="button"
            onClick={() => goToSlide(state.current.currentIndex - 1)}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/20 text-white backdrop-blur-sm transition-all hover:bg-white hover:text-black md:h-14 md:w-14"
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} className="md:h-6 md:w-6" />
          </button>
          <button
            type="button"
            onClick={() => goToSlide(state.current.currentIndex + 1)}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/20 text-white backdrop-blur-sm transition-all hover:bg-white hover:text-black md:h-14 md:w-14"
            aria-label="Next slide"
          >
            <ChevronRight size={20} className="md:h-6 md:w-6" />
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
                  ? "text-3xl text-white md:text-5xl"
                  : "text-xs text-white/30 hover:text-white/60 md:text-sm"
              }`}
              aria-label={`Show ${slide.label}`}
            >
              {String(idx + 1).padStart(2, "0")}
            </button>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-28 right-6 z-20 hidden max-w-[220px] text-right md:block md:right-16">
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--accent)]">
          {slides[currentIndex]?.label}
        </p>
      </div>
    </div>
  );
}
