'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const CAROUSEL_IMAGES = [
  {
    src: "/gallery/audi/1.jpg",
    alt: "FDL Bespoke Audi detailing showcase",
  },
  {
    src: "/gallery/bmw/5B1A84851.jpg",
    alt: "FDL Bespoke BMW detailing close-up",
  },
  {
    src: "/gallery/audi/5B1A3705.jpg",
    alt: "FDL Bespoke Audi transformation feature",
  },
  {
    src: "/gallery/range-rover/5B1A5031.jpg",
    alt: "FDL Bespoke Range Rover exterior finish",
  },
];

export default function HeroCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalSlides = CAROUSEL_IMAGES.length;

  const state = useRef({
    isDragging: false,
    startPos: 0,
    currentTranslate: 0,
    prevTranslate: 0,
    animationID: 0,
    currentIndex: 0,
    isTransitioning: false,
    autoPlayTimer: null as ReturnType<typeof setInterval> | null
  });

  const getSlideWidth = () => containerRef.current ? containerRef.current.clientWidth : 0;

  const setSliderPosition = () => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${state.current.currentTranslate}px)`;
    }
  };

  const animation = () => {
    setSliderPosition();
    if (state.current.isDragging) requestAnimationFrame(animation);
  };

  const goToSlide = useCallback((index: number) => {
    let newIndex = index;
    if (newIndex < 0) newIndex = totalSlides - 1;
    if (newIndex >= totalSlides) newIndex = 0;

    state.current.currentIndex = newIndex;
    setCurrentIndex(newIndex);
    state.current.isTransitioning = true;

    if (trackRef.current) {
      trackRef.current.style.transition = 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)';
      state.current.currentTranslate = newIndex * -getSlideWidth();
      state.current.prevTranslate = state.current.currentTranslate;
      trackRef.current.style.transform = `translateX(${state.current.currentTranslate}px)`;
    }
  }, [totalSlides]);

  useEffect(() => {
    const startAutoPlay = () => {
      stopAutoPlay();
      state.current.autoPlayTimer = setInterval(() => {
        if (!state.current.isDragging) {
          goToSlide(state.current.currentIndex + 1);
        }
      }, 6000);
    };

    const stopAutoPlay = () => {
      if (state.current.autoPlayTimer) clearInterval(state.current.autoPlayTimer);
    };

    startAutoPlay();
    return () => stopAutoPlay();
  }, [goToSlide]);

  const handleTouchStart = (e: React.MouseEvent | React.TouchEvent) => {
    state.current.isDragging = true;
    state.current.startPos = 'touches' in e ? e.touches[0].clientX : e.pageX;
    if (trackRef.current) trackRef.current.style.transition = 'none';
    state.current.animationID = requestAnimationFrame(animation);
  };

  const handleTouchMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (state.current.isDragging) {
      const currentPosition = 'touches' in e ? e.touches[0].clientX : e.pageX;
      const currentMove = currentPosition - state.current.startPos;
      state.current.currentTranslate = state.current.prevTranslate + currentMove;
    }
  };

  const handleTouchEnd = () => {
    state.current.isDragging = false;
    cancelAnimationFrame(state.current.animationID);
    const movedBy = state.current.currentTranslate - state.current.prevTranslate;

    if (movedBy < -75) goToSlide(state.current.currentIndex + 1);
    else if (movedBy > 75) goToSlide(state.current.currentIndex - 1);
    else goToSlide(state.current.currentIndex);
  };

  return (
    <div
      className="fdl-hero-wrapper hero-bleed"
      id="fdlHero"
      ref={containerRef}
      onMouseDown={handleTouchStart}
      onMouseMove={handleTouchMove}
      onMouseUp={handleTouchEnd}
      onMouseLeave={() => { if (state.current.isDragging) handleTouchEnd(); }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="fdl-track" ref={trackRef}>
        {CAROUSEL_IMAGES.map((image, idx) => (
          <div className="fdl-slide" key={idx}>
            <img src={image.src} alt={image.alt} draggable="false" />
          </div>
        ))}
      </div>

      <div className="fdl-overlay"></div>

      <div className="hero-bleed-inner relative p-6 md:p-16 pointer-events-none z-10 pb-32 md:pb-40">
        <div className="overflow-hidden mb-6 md:mb-8">
          <h1 className="font-display text-5xl md:text-8xl lg:text-9xl font-bold uppercase leading-[0.85] text-white tracking-tight">
            FDL<span className="text-[var(--accent)]">.</span>
          </h1>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-t border-white/20 pt-6 md:pt-8 gap-6 md:gap-12">
          <div className="max-w-2xl">
            <p className="font-display text-lg md:text-2xl uppercase font-bold leading-tight text-white mb-6 md:mb-8">
              Defined by Detail.<br />Driven by Passion.
            </p>
            <Link href="/shop" className="pointer-events-auto inline-flex items-center gap-3 bg-white text-black px-6 md:px-8 py-3 md:py-4 font-bold uppercase tracking-widest text-xs md:text-sm hover:bg-[var(--accent)] hover:text-black transition-all duration-300 group">
              <ShoppingBag size={16} className="md:w-5 md:h-5" />
              <span>Shop Now</span>
              <ArrowRight size={14} className="md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="flex items-center gap-3 text-[var(--accent)] font-bold uppercase text-xs tracking-widest whitespace-nowrap">
            <span className="w-2 h-2 bg-[var(--accent)] rounded-full animate-pulse"></span>
            Workshop Active
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-6 md:p-16 flex justify-between items-end z-20 pointer-events-none">
        <div className="flex gap-3 md:gap-4 pointer-events-auto">
          <button onClick={() => goToSlide(state.current.currentIndex - 1)} className="w-12 h-12 md:w-14 md:h-14 border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all bg-black/20 backdrop-blur-sm">
            <ChevronLeft size={20} className="md:w-6 md:h-6" />
          </button>
          <button onClick={() => goToSlide(state.current.currentIndex + 1)} className="w-12 h-12 md:w-14 md:h-14 border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all bg-black/20 backdrop-blur-sm">
            <ChevronRight size={20} className="md:w-6 md:h-6" />
          </button>
        </div>

        <div className="flex gap-4 md:gap-8 items-baseline pointer-events-auto">
          {CAROUSEL_IMAGES.map((_, idx) => (
            <div
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`cursor-pointer transition-all duration-500 font-display font-bold ${currentIndex === idx ? 'text-3xl md:text-6xl text-white' : 'text-xs md:text-sm text-white/30 hover:text-white/60'}`}
            >
              0{idx + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
