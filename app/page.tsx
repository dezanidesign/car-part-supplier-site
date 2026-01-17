'use client';

// Global declarations for sandbox-style globals (optional in local Next project)
declare global {
  var __initial_auth_token: string | undefined;
  var __firebase_config: string | undefined;
  var __app_id: string | undefined;
}

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  ArrowRight, 
  Zap, 
  Armchair, 
  Briefcase, 
  Lock, 
  Plus, 
  Trash2, 
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Star,
  Quote,
  Target,
  PenTool,
  Settings,
  MapPin,
  Phone,
  Clock,
  Shield,
  Droplet,
  Layers,
  Palette,
  Eye,
  Maximize,
  MoveHorizontal
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged,
  signInWithCustomToken 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  onSnapshot, 
  doc, 
  deleteDoc, 
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';

// --- Firebase (DISABLED unless valid config exists) ---
const firebaseConfig =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    ? {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId:
          process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      }
    : null;

const firebaseApp = firebaseConfig ? initializeApp(firebaseConfig) : null;
const auth = firebaseApp ? getAuth(firebaseApp) : null;
const db = firebaseApp ? getFirestore(firebaseApp) : null;

const appId = firebaseConfig?.projectId ?? 'local-dev';

// --- Styles & Fonts ---
const GlobalStyles = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600&family=Syne:wght@400;700;800&display=swap');

      :root {
        --accent-orange: #FF4D00;
        --bg-dark: #050505;
        --bg-card: #0F0F0F;
        --text-main: #ffffff;
        --text-muted: #666666;
        --border-color: rgba(255, 255, 255, 0.08);
        --transition: cubic-bezier(0.25, 1, 0.5, 1);
      }

      body {
        font-family: 'Space Grotesk', sans-serif;
        background-color: var(--bg-dark);
        color: var(--text-main);
        overflow-x: hidden;
        cursor: none;
      }

      .font-display {
        font-family: 'Syne', sans-serif;
      }

      /* --- Custom Cursor --- */
      #cursor {
        width: 12px;
        height: 12px;
        background-color: white;
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        transition: width 0.3s, height 0.3s, background-color 0.3s, opacity 0.3s;
        mix-blend-mode: exclusion;
      }

      #cursor.hovered {
        width: 60px;
        height: 60px;
        background-color: var(--accent-orange);
        opacity: 0.8;
        mix-blend-mode: normal;
      }

      /* --- Noise Overlay --- */
      .noise {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: 9000;
        opacity: 0.03;
        background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyBAMAAADsEZWCAAAAGFBMVEUAAAA5OTkAAAAAAAAAAABMTExERERmZmZnOtAyAAAACHRSTlMAMwAqzMzM/wO30gAAAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAOElEQVQ4y2NgIBewMjAwMjBwMDBwMDIwMKA4FknADKaFQGYw60Amw6gD6Ri1g1E7GLWDUTsg2wEA6XQA8Z018fEAAAAASUVORK5CYII=');
      }

      /* --- Marquee --- */
      .marquee-container {
        overflow: hidden;
        white-space: nowrap;
        display: flex;
      }
      .marquee-content {
        display: flex;
        animation: marquee 80s linear infinite; 
      }
      @keyframes marquee {
        0% { transform: translateX(0); }
        100% { transform: translateX(-100%); }
      }

      /* --- Carousel Specifics --- */
      .fdl-hero-wrapper {
        position: relative;
        width: 100%;
        height: 100vh;
        background-color: #000;
        overflow: hidden;
        touch-action: pan-y;
        user-select: none;
      }
      @media (max-width: 768px) {
        .fdl-hero-wrapper { height: 70vh; }
      }

      .fdl-track {
        display: flex;
        width: 100%;
        height: 100%;
        will-change: transform;
        cursor: grab;
      }
      .fdl-track:active { cursor: grabbing; }

      .fdl-slide {
        min-width: 100%;
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
        flex-shrink: 0;
      }
      .fdl-slide img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        pointer-events: none;
      }

      .fdl-overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 60%;
        background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0) 100%);
        pointer-events: none;
        z-index: 1;
      }

      /* --- Utility --- */
      .hover-trigger { cursor: none; }
      .lux-input {
        background: transparent;
        border-bottom: 1px solid var(--border-color);
        color: white;
        transition: border-color 0.3s;
      }
      .lux-input:focus {
        outline: none;
        border-bottom-color: var(--accent-orange);
      }

      /* Scrollbar */
      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-track { background: var(--bg-dark); }
      ::-webkit-scrollbar-thumb { background: #333; }
      ::-webkit-scrollbar-thumb:hover { background: var(--accent-orange); }

      /* New Carousel Styles */
      .prod-carousel-item {
        transition: transform 0.4s var(--transition), box-shadow 0.4s var(--transition);
      }
      .prod-carousel-item:hover {
        transform: translateY(-8px);
        box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);
      }
      .prod-overlay {
        background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%);
        transform: translateY(20px);
        opacity: 0;
        transition: all 0.4s var(--transition);
      }
      .prod-carousel-item:hover .prod-overlay {
        transform: translateY(0);
        opacity: 1;
      }

      /* Dropdown Animation */
      .nav-dropdown {
        opacity: 0;
        transform: translateY(10px);
        visibility: hidden;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .group:hover .nav-dropdown {
        opacity: 1;
        transform: translateY(0);
        visibility: visible;
      }

      /* Range Slider Styling */
      input[type=range] {
        -webkit-appearance: none;
        width: 100%;
        background: transparent;
      }
      input[type=range]::-webkit-slider-thumb {
        -webkit-appearance: none;
        height: 20px;
        width: 20px;
        border-radius: 50%;
        background: #FF4D00;
        cursor: pointer;
        margin-top: -8px;
        border: 2px solid white;
        box-shadow: 0 0 10px rgba(255, 77, 0, 0.5);
      }
      input[type=range]::-webkit-slider-runnable-track {
        width: 100%;
        height: 4px;
        cursor: pointer;
        background: rgba(255,255,255,0.1);
        border-radius: 2px;
      }

      /* Text Stroke Utility */
      .text-outline {
        color: transparent;
        -webkit-text-stroke: 1px rgba(255,255,255,0.3);
      }
      .text-outline-strong {
        color: transparent;
        -webkit-text-stroke: 1px rgba(255,255,255,0.8);
      }
    `}</style>
  );
};


// --- Mock Data ---
const MOCK_PRODUCTS = [
  {
    id: 'm1',
    name: "Carbon Splitter V2",
    price: 1250,
    category: "Aero",
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: 'm2',
    name: "Forged Monoblock 23\"",
    price: 4800,
    category: "Wheels",
    image: "https://images.unsplash.com/photo-1583267746897-2cf415887172?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: 'm3',
    name: "Stealth PPF Full Kit",
    price: 3500,
    category: "Protection",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: 'm4',
    name: "Titanium Exhaust",
    price: 2800,
    category: "Performance",
    image: "https://images.unsplash.com/photo-1597687210387-e45b6f62b487?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: 'm5',
    name: "Alcantara Steering Wheel",
    price: 950,
    category: "Interior",
    image: "https://images.unsplash.com/photo-1570155308259-f4633a763784?auto=format&fit=crop&q=80&w=1000",
  }
];

const CAROUSEL_IMAGES = [
  "https://fdlbespoke.co.uk/wp-content/uploads/2025/07/1-scaled.jpg",
  "https://fdlbespoke.co.uk/wp-content/uploads/2025/07/5B1A84851-scaled.jpg",
  "https://fdlbespoke.co.uk/wp-content/uploads/2025/07/5B1A3705-scaled.jpg",
  "https://fdlbespoke.co.uk/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-14-at-18.26.23_b9abe7de-scaled.jpg"
];

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

// --- Utility Components ---

const CustomCursor = () => {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const moveCursor = (e) => {
      if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
      }
    };
    
    const addHover = () => cursor?.classList.add('hovered');
    const removeHover = () => cursor?.classList.remove('hovered');

    window.addEventListener('mousemove', moveCursor);
    
    const triggers = document.querySelectorAll('.hover-trigger, a, button, input, select');
    triggers.forEach(t => {
      t.addEventListener('mouseenter', addHover);
      t.addEventListener('mouseleave', removeHover);
    });

    const observer = new MutationObserver((mutations) => {
       const newTriggers = document.querySelectorAll('.hover-trigger, a, button');
       newTriggers.forEach(t => {
        t.removeEventListener('mouseenter', addHover);
        t.removeEventListener('mouseleave', removeHover);
        t.addEventListener('mouseenter', addHover);
        t.addEventListener('mouseleave', removeHover);
       });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      observer.disconnect();
    };
  }, []);

  return <div id="cursor" ref={cursorRef} className="hidden md:block"></div>;
};

// --- Standard Page Sections ---

const Marquee = () => (
  <div className="py-6 bg-[var(--bg-card)] border-y border-white/5 text-white overflow-hidden z-10 relative">
    <div className="marquee-container">
       <div className="marquee-content font-display text-sm font-bold uppercase tracking-[0.3em] items-center text-[#888]">
           {[...Array(8)].map((_, i) => (
             <React.Fragment key={i}>
               <span className="text-[var(--accent-orange)] mx-8">•</span> AERODYNAMICS 
               <span className="text-[var(--accent-orange)] mx-8">•</span> PERFORMANCE 
               <span className="text-[var(--accent-orange)] mx-8">•</span> CARBON FIBRE 
               <span className="text-[var(--accent-orange)] mx-8">•</span> BESPOKE INTERIORS
             </React.Fragment>
           ))}
       </div>
    </div>
  </div>
);

const ServicesGrid = () => (
  <section className="py-24 md:py-32 px-6 md:px-16 bg-[var(--bg-dark)]">
    <div className="max-w-[1920px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-20 border-b border-white/10 pb-8">
         <h2 className="font-display text-4xl md:text-5xl font-bold uppercase text-white">Our <span className="text-transparent" style={{ WebkitTextStroke: '1px white'}}>Expertise</span></h2>
         <p className="text-gray-500 font-bold uppercase text-xs tracking-widest max-w-xs text-right mt-6 md:mt-0">Precision engineering for the exceptional.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: Zap, title: "Performance", desc: "ECU tuning and exhaust systems designed to unlock your vehicle's true potential." },
          { icon: Armchair, title: "Interiors", desc: "Hand-stitched Italian leather and Alcantara re-trimming services." },
          { icon: Briefcase, title: "Sourcing", desc: "Access to rare OEM parts and limited edition aftermarket components." }
        ].map((s, i) => (
          <div key={i} className="group border border-white/5 p-10 min-h-[340px] flex flex-col justify-between hover:bg-[#111] transition-all duration-500 hover-trigger hover:border-white/20">
             <div className="flex justify-between items-start">
               <span className="font-mono text-xs font-bold bg-white text-black px-2 py-1">0{i+1}</span>
               <s.icon className="w-8 h-8 text-gray-500 group-hover:text-[var(--accent-orange)] transition-colors" />
             </div>
             <div>
               <h3 className="font-display text-2xl font-bold uppercase mb-4 text-white group-hover:text-[var(--accent-orange)] transition-colors">{s.title}</h3>
               <p className="text-sm text-gray-400 leading-relaxed max-w-xs">{s.desc}</p>
             </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ReviewsSection = () => (
  <section className="py-24 px-6 md:px-16 bg-[#030303] border-t border-white/5">
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-16">
         <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" className="w-6 h-6" alt="Google" />
         <span className="text-white font-bold uppercase tracking-widest text-xs">5.0 Star Rating</span>
         <div className="h-[1px] flex-grow bg-white/10"></div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        {REVIEWS.map((review, i) => (
          <div key={i} className="bg-[#0a0a0a] border border-white/5 p-8 relative hover:border-[var(--accent-orange)] transition-all duration-300 group">
             <Quote className="absolute top-8 right-8 text-[var(--accent-orange)] opacity-20 w-8 h-8 group-hover:opacity-100 transition-opacity" />
             <div className="flex text-[var(--accent-orange)] mb-6">
               {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" className="mr-1"/>)}
             </div>
             <p className="text-gray-300 leading-relaxed mb-8 min-h-[80px]">"{review.text}"</p>
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center font-bold text-white">
                  {review.name[0]}
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{review.name}</p>
                  <p className="text-[var(--accent-orange)] text-xs uppercase tracking-widest">{review.role}</p>
                </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const BookingSection = () => (
  <section className="py-24 md:py-32 px-6 md:px-16 bg-[#080808]">
     <div className="max-w-4xl mx-auto text-center mb-16">
        <h2 className="font-display text-4xl md:text-6xl font-bold uppercase text-white mb-6">Quote <span className="text-transparent" style={{ WebkitTextStroke: '1px white'}}>Request</span></h2>
        <p className="text-[var(--accent-orange)] text-[10px] font-bold uppercase tracking-[0.4em]">Response within 15 minutes</p>
     </div>

     <div className="max-w-3xl mx-auto bg-[var(--bg-card)] p-8 md:p-12 border border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
           <div className="group">
              <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2">Make</label>
              <input type="text" className="w-full bg-transparent border-b border-white/10 py-3 text-white focus:outline-none focus:border-[var(--accent-orange)] text-lg transition-colors" placeholder="e.g. Range Rover" />
           </div>
           <div className="group">
              <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2">Model</label>
              <input type="text" className="w-full bg-transparent border-b border-white/10 py-3 text-white focus:outline-none focus:border-[var(--accent-orange)] text-lg transition-colors" placeholder="Sport SVR" />
           </div>
        </div>
        <div className="mb-12">
           <label className="block text-[10px] font-bold uppercase text-gray-500 mb-2">Requirement</label>
           <select className="w-full bg-transparent border-b border-white/10 py-3 text-white focus:outline-none focus:border-[var(--accent-orange)] text-lg">
              <option className="bg-black">Full Body Kit Installation</option>
              <option className="bg-black">Carbon Fibre Enhancement</option>
              <option className="bg-black">Alloy Wheel Upgrade</option>
              <option className="bg-black">Vehicle Wrapping</option>
           </select>
        </div>
        <button className="w-full bg-white text-black py-5 font-bold uppercase tracking-widest text-xs hover:bg-[var(--accent-orange)] hover:text-white transition-all duration-300 hover-trigger">
           Submit Inquiry
        </button>
     </div>
  </section>
);

const Footer = () => (
  <footer className="bg-black py-20 px-6 md:px-16 border-t border-white/10 text-white">
     <div className="flex flex-col md:flex-row justify-between items-start gap-12">
        <div>
           <img src="https://fdlbespoke.co.uk/wp-content/uploads/2025/06/cropped-cropped-FDL-UK-Logo-White-Sq.png" className="w-16 mb-6 opacity-50" />
           <p className="text-gray-600 text-[10px] uppercase tracking-[0.4em]">Automotive Styling UK</p>
        </div>
        <div className="flex gap-16 text-[10px] font-bold uppercase tracking-widest text-gray-400">
           <div className="flex flex-col gap-4">
              <a href="#" className="hover:text-white transition-colors">Instagram</a>
              <a href="#" className="hover:text-white transition-colors">Facebook</a>
           </div>
           <div className="flex flex-col gap-4">
              <a href="#" className="hover:text-white transition-colors">Email Us</a>
           </div>
        </div>
     </div>
     <div className="mt-20 pt-8 border-t border-white/10 flex justify-between items-center text-[10px] text-gray-800 uppercase tracking-widest">
        <span>&copy; 2026 FDL Bespoke.</span>
        <span>Unit C3, 511 Bradford Rd, Batley WF17 8LL • 07869 022673</span>
     </div>
  </footer>
);

// --- Feature Components ---

const HeroCarousel = () => {
  const trackRef = useRef(null);
  const containerRef = useRef(null);
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
    autoPlayTimer: null
  });

  const getSlideWidth = () => containerRef.current ? containerRef.current.clientWidth : 0;

  const setSliderPosition = () => {
    if(trackRef.current) {
      trackRef.current.style.transform = `translateX(${state.current.currentTranslate}px)`;
    }
  };

  const animation = () => {
    setSliderPosition();
    if(state.current.isDragging) requestAnimationFrame(animation);
  };

  const goToSlide = useCallback((index) => {
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
        if(!state.current.isDragging) {
           goToSlide(state.current.currentIndex + 1);
        }
      }, 6000);
    };

    const stopAutoPlay = () => {
      if(state.current.autoPlayTimer) clearInterval(state.current.autoPlayTimer);
    };

    startAutoPlay();
    return () => stopAutoPlay();
  }, [goToSlide]);

  const handleTouchStart = (e) => {
    state.current.isDragging = true;
    state.current.startPos = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    if(trackRef.current) trackRef.current.style.transition = 'none';
    state.current.animationID = requestAnimationFrame(animation);
  };

  const handleTouchMove = (e) => {
    if (state.current.isDragging) {
      const currentPosition = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
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
      className="fdl-hero-wrapper hover-trigger" 
      id="fdlHero" 
      ref={containerRef}
      onMouseDown={handleTouchStart}
      onMouseMove={handleTouchMove}
      onMouseUp={handleTouchEnd}
      onMouseLeave={() => { if(state.current.isDragging) handleTouchEnd() }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="fdl-track" ref={trackRef}>
        {CAROUSEL_IMAGES.map((src, idx) => (
          <div className="fdl-slide" key={idx}>
            <img src={src} alt={`Slide ${idx}`} draggable="false" />
          </div>
        ))}
      </div>

      <div className="fdl-overlay"></div>

      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-16 pointer-events-none z-10 pb-32 md:pb-32">
         <div className="overflow-hidden mb-6">
            <h1 className="font-display text-5xl md:text-8xl lg:text-9xl font-bold uppercase leading-[0.85] text-white tracking-tight">
              Bespoke<span className="text-[var(--accent-orange)]">.</span>
            </h1>
         </div>
         <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-t border-white/20 pt-8">
            <p className="font-display text-lg md:text-2xl uppercase font-bold leading-tight max-w-xl text-white">
               Defined by Detail.<br/>Driven by Passion.
            </p>
            <div className="flex items-center gap-3 text-[var(--accent-orange)] font-bold uppercase text-xs tracking-widest mt-6 md:mt-0">
               <span className="w-2 h-2 bg-[var(--accent-orange)] rounded-full animate-pulse"></span>
               Workshop Active
            </div>
         </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-6 md:p-16 flex justify-between items-end z-20 pointer-events-none">
        <div className="flex gap-4 pointer-events-auto">
          <button onClick={() => goToSlide(state.current.currentIndex - 1)} className="w-14 h-14 border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all hover-trigger bg-black/20 backdrop-blur-sm">
            <ChevronLeft size={24} />
          </button>
          <button onClick={() => goToSlide(state.current.currentIndex + 1)} className="w-14 h-14 border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all hover-trigger bg-black/20 backdrop-blur-sm">
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="flex gap-8 items-baseline pointer-events-auto">
          {CAROUSEL_IMAGES.map((_, idx) => (
            <div 
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`cursor-pointer transition-all duration-500 font-display font-bold ${currentIndex === idx ? 'text-4xl md:text-6xl text-white' : 'text-sm text-white/30 hover:text-white/60'}`}
            >
              0{idx + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ProductCarousel = ({ products }) => {
  const displayProducts = products.length > 0 ? products : MOCK_PRODUCTS;
  const trackRef = useRef(null);
  
  const state = useRef({
    isDown: false,
    startX: 0,
    scrollLeft: 0,
    isDragging: false
  });

  const handleMouseDown = (e) => {
    state.current.isDown = true;
    state.current.isDragging = false;
    state.current.startX = e.pageX - trackRef.current.offsetLeft;
    state.current.scrollLeft = trackRef.current.scrollLeft;
    trackRef.current.style.cursor = 'grabbing';
  };

  const handleMouseLeave = () => {
    state.current.isDown = false;
    trackRef.current.style.cursor = 'grab';
  };

  const handleMouseUp = (e) => {
    state.current.isDown = false;
    trackRef.current.style.cursor = 'grab';
    if (state.current.isDragging) {
       e.preventDefault();
       e.stopPropagation();
    }
  };

  const handleMouseMove = (e) => {
    if (!state.current.isDown) return;
    e.preventDefault();
    state.current.isDragging = true;
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - state.current.startX) * 1.5; 
    trackRef.current.scrollLeft = state.current.scrollLeft - walk;
  };

  return (
    <section className="py-24 md:py-32 px-6 md:px-0 overflow-hidden bg-[var(--bg-dark)]">
      <div className="max-w-[1920px] mx-auto">
        <div className="px-6 md:px-16 mb-12 flex flex-col md:flex-row justify-between items-end">
            <h2 className="font-display text-4xl md:text-5xl font-bold uppercase text-white">Curated <span className="text-[var(--accent-orange)]">Parts</span></h2>
            <div className="hidden md:flex gap-4 text-xs font-bold uppercase tracking-widest text-gray-500 items-center">
              <span>Drag to Explore</span>
              <div className="w-12 h-[1px] bg-[var(--accent-orange)]"></div>
            </div>
        </div>

        <div 
          className="overflow-x-auto no-scrollbar cursor-grab px-6 md:px-16 pb-12"
          ref={trackRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
           <div className="flex gap-6 w-max">
              {displayProducts.map((p, idx) => (
                <div 
                  key={idx} 
                  className="prod-carousel-item relative w-[280px] md:w-[350px] aspect-square rounded-xl overflow-hidden bg-[var(--bg-card)] group hover-trigger"
                >
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover pointer-events-none" />
                    <div className="prod-overlay absolute inset-0 flex flex-col justify-end p-6 pointer-events-none">
                       <p className="text-[var(--accent-orange)] text-xs font-bold uppercase tracking-widest mb-2">{p.category}</p>
                       <h3 className="font-display text-xl text-white font-bold leading-tight mb-1">{p.name}</h3>
                       <p className="text-white font-medium">£{p.price}</p>
                    </div>
                </div>
              ))}
              
              <Link 
                href="/shop"
                className="prod-carousel-item w-[280px] md:w-[350px] aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-[var(--accent-orange)] to-[#ff8f66] flex flex-col items-center justify-center text-center p-8 cursor-pointer hover-trigger"
              >
                  <ArrowRight size={48} className="text-white mb-4" />
                  <h3 className="font-display text-2xl text-white font-bold">View All</h3>
                  <p className="text-white/90 text-sm mt-2">See full collection</p>
              </Link>
           </div>
        </div>
      </div>
    </section>
  );
};

// --- View Components ---

const InfoPage = () => {
  return (
    <div className="pt-32 pb-24 px-6 md:px-16 min-h-screen bg-[var(--bg-dark)]">
      {/* Hero */}
      <div className="max-w-[1920px] mx-auto mb-32">
         <h1 className="font-display text-5xl md:text-8xl font-bold uppercase text-white leading-[0.9] mb-12 animate-in slide-in-from-bottom-8 duration-700">
            The Pursuit of <br/> <span className="text-transparent" style={{ WebkitTextStroke: '1px var(--accent-orange)'}}>Perfection.</span>
         </h1>
         <div className="grid md:grid-cols-2 gap-16 animate-in slide-in-from-bottom-8 duration-700 delay-150">
            <div className="md:col-start-2">
               <div className="space-y-8">
                 <p className="text-xl text-gray-300 leading-relaxed font-light border-l-2 border-[var(--accent-orange)] pl-6">
                    "Automotive Styling Solutions. We specialise in Bodykit Transformations, Carbon Fibre Packages, Alloy Wheel Refurbishment, and Diamond Cutting Services."
                 </p>
                 <p className="text-gray-400">
                    Our expertise extends to Vehicle Wrapping, Dechroming, Window Tinting, and Vehicle Graphics. We are Accredited PPF Installers and certified fitters of Ghost Immobilisers and Tracking Systems.
                 </p>
                 <div className="flex flex-col gap-4 text-sm font-bold uppercase tracking-widest text-white mt-8">
                    <span className="flex items-center gap-3 group hover:text-[var(--accent-orange)] transition-colors cursor-pointer">
                        <MapPin size={20} className="text-[var(--accent-orange)]"/> Unit C3, 511 Bradford Rd, Batley WF17 8LL
                    </span>
                    <span className="flex items-center gap-3 group hover:text-[var(--accent-orange)] transition-colors cursor-pointer">
                        <Phone size={20} className="text-[var(--accent-orange)]"/> 07869 022673
                    </span>
                    <span className="flex items-center gap-3">
                        <Clock size={20} className="text-[var(--accent-orange)]"/> Open Thu-Sat 10am - Close
                    </span>
                 </div>
               </div>
            </div>
         </div>
      </div>

      {/* Image Strip */}
      <div className="w-full aspect-video md:aspect-[21/9] overflow-hidden mb-32 relative group animate-in fade-in duration-1000 delay-300">
         <img src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=2000" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 transform group-hover:scale-105" alt="Workshop" />
         <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Philosophy Grid */}
      <div className="max-w-[1920px] mx-auto grid md:grid-cols-2 gap-24 mb-32">
         <div>
            <h3 className="text-[var(--accent-orange)] font-bold uppercase tracking-widest text-xs mb-6 flex items-center"><Target size={16} className="mr-2"/> Our Philosophy</h3>
            <h2 className="font-display text-4xl text-white font-bold uppercase mb-8">No Compromise. <br/>Ever.</h2>
            <p className="text-gray-400 leading-relaxed mb-8">
               In a world of mass production, true luxury is rarity. Our workshop in Batley is dedicated to the art of individualisation. From hand-laid carbon fibre to precision ECU calibration, every bolt turned and every stitch sewn is done with an obsession for detail that borders on the fanatical.
            </p>
            <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-8">
               <div>
                  <span className="block text-3xl font-display font-bold text-white mb-1">100%</span>
                  <span className="text-xs uppercase tracking-widest text-gray-500">In-House Design</span>
               </div>
               <div>
                  <span className="block text-3xl font-display font-bold text-white mb-1">OEM+</span>
                  <span className="text-xs uppercase tracking-widest text-gray-500">Fitment Standard</span>
               </div>
            </div>
         </div>
         <div className="relative">
             <div className="grid grid-cols-2 gap-4">
                <img src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800" className="w-full aspect-[3/4] object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Process 1" />
                <img src="https://images.unsplash.com/photo-1487754180451-c456f719a1fc?q=80&w=1000&auto=format&fit=crop" className="w-full aspect-[3/4] object-cover grayscale hover:grayscale-0 transition-all duration-700 mt-12" alt="Process 2" />
             </div>
         </div>
      </div>

      {/* The Process */}
      <div className="max-w-[1920px] mx-auto border-t border-white/10 pt-24">
         <div className="flex justify-between items-end mb-16">
            <h2 className="font-display text-4xl text-white font-bold uppercase">The <span className="text-[var(--accent-orange)]">Standard</span></h2>
         </div>
         <div className="grid md:grid-cols-3 gap-0 border border-white/10">
            {[
               { num: "01", title: "Consultation", text: "We define your vision through personal consultation.", icon: PenTool },
               { num: "02", title: "Acquisition", text: "Sourcing the finest materials globally.", icon: Briefcase },
               { num: "03", title: "Execution", text: "Precision installation by master technicians.", icon: Settings }
            ].map((step, i) => (
               <div key={i} className="p-12 border-r border-white/10 last:border-r-0 hover:bg-[#0a0a0a] transition-colors group">
                  <div className="flex justify-between items-start mb-6">
                     <span className="text-[var(--accent-orange)] font-mono text-sm">/{step.num}</span>
                     <step.icon className="text-gray-600 group-hover:text-white transition-colors" size={24}/>
                  </div>
                  <h3 className="font-display text-2xl text-white font-bold uppercase mb-4">{step.title}</h3>
                  <p className="text-gray-500 group-hover:text-gray-300 transition-colors">{step.text}</p>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};

// --- Customisation Sub-Pages Components ---

// 1. Bodykits
const BodykitsPage = () => (
  <div className="min-h-screen bg-[var(--bg-dark)] pt-32 pb-24 px-6 md:px-16 animate-in fade-in duration-700">
    <div className="max-w-[1920px] mx-auto grid lg:grid-cols-2 gap-12 lg:gap-24">
       <div className="lg:sticky lg:top-32 h-fit order-2 lg:order-1">
          <span className="text-[var(--accent-orange)] text-xs font-bold uppercase tracking-widest mb-6 block flex items-center"><Layers size={16} className="mr-2"/> Engineering</span>
          <h1 className="font-display text-5xl md:text-7xl font-bold uppercase text-white leading-[0.9] mb-8">
             Precision <br/> <span className="text-outline">Fitment</span>
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed font-light mb-12 border-l-2 border-white/10 pl-6">
             "At FDL, we believe the fit is every bit as important as the finish. Every panel is aligned with precision, every contour flows seamlessly."
          </p>
          
          <div className="space-y-12">
             <div>
                <h3 className="font-display text-2xl text-white font-bold uppercase mb-4">In-House Fitting & Paintwork</h3>
                <p className="text-gray-500 leading-relaxed">
                   All bodykits are expertly installed and painted in-house by our skilled technicians. From preparation through to paint, each vehicle undergoes a rigorous quality control process to deliver a flawless, factory-level finish.
                </p>
             </div>
             <div>
                <h3 className="font-display text-2xl text-white font-bold uppercase mb-4">Material Excellence</h3>
                <p className="text-gray-500 leading-relaxed">
                   We offer solutions tailored to different budgets. Kits are available in PU plastic, PP, GRP (fibreglass), and carbon fibre, depending on your vehicle and specification.
                </p>
             </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-white/10">
             <button className="flex items-center gap-4 text-white hover:text-[var(--accent-orange)] transition-colors group">
                <span className="font-display font-bold uppercase text-xl">Start Your Build</span>
                <ArrowRight className="group-hover:translate-x-2 transition-transform" />
             </button>
          </div>
       </div>

       <div className="order-1 lg:order-2 space-y-4">
          <div className="aspect-[4/5] w-full overflow-hidden">
             <img src="https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="aspect-square w-full bg-[#111] border border-white/5 flex flex-col justify-center items-center p-6 text-center group hover:border-[var(--accent-orange)] transition-colors">
                <span className="font-display text-4xl text-white font-bold mb-2 group-hover:scale-110 transition-transform">100%</span>
                <span className="text-[10px] uppercase tracking-widest text-gray-500">Fitment Guarantee</span>
             </div>
             <div className="aspect-square w-full bg-[#111] border border-white/5 flex flex-col justify-center items-center p-6 text-center group hover:border-[var(--accent-orange)] transition-colors">
                <span className="font-display text-4xl text-white font-bold mb-2 group-hover:scale-110 transition-transform">OEM+</span>
                <span className="text-[10px] uppercase tracking-widest text-gray-500">Finish Standard</span>
             </div>
          </div>
       </div>
    </div>
  </div>
);

// 2. Alloys: Reimagined "Collection & Service" Layout
const AlloysPage = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-dark)] pt-32 pb-24 px-6 md:px-16 animate-in fade-in duration-700">
       {/* Hero / Statement */}
       <div className="max-w-[1920px] mx-auto mb-24 border-b border-white/10 pb-12">
          <span className="text-[var(--accent-orange)] text-xs font-bold uppercase tracking-widest mb-4 block">Rolling Stock</span>
          <h1 className="font-display text-6xl md:text-8xl font-bold uppercase text-white leading-none mb-8">
             Statement <br/> <span className="text-outline">Performance</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
             "Wheels should be more than functional — they should make a statement. We meticulously manage offset, stance, and clearance to guarantee a flawless result."
          </p>
       </div>

       {/* Exclusive Brand Section */}
       <div className="grid lg:grid-cols-2 gap-16 mb-32 items-center">
          <div className="relative group overflow-hidden">
             <div className="absolute top-4 left-4 z-10 bg-white text-black text-xs font-bold uppercase px-3 py-1 tracking-widest">Exclusive Partner</div>
             <img src="https://images.unsplash.com/photo-1611016186353-9af29c77880e?q=80&w=1200&auto=format&fit=crop" className="w-full aspect-square object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" />
          </div>
          <div className="flex flex-col justify-center">
             <h2 className="font-display text-4xl md:text-5xl text-white font-bold uppercase mb-6">Barugzai <br/>Collection</h2>
             <p className="text-gray-400 leading-relaxed mb-8">
                We proudly offer Barugzai wheels exclusively, available in 22″, 23″, and 24″ sizes. Choose from premium finishes including gloss black, diamond-cut, and matte bronze. For those seeking something truly unique, bespoke custom finishes can be arranged on request.
             </p>
             <div className="flex gap-4">
                <div className="px-6 py-4 border border-white/10 text-center">
                   <span className="block text-2xl font-bold text-white">22-24"</span>
                   <span className="text-[10px] uppercase text-gray-500 tracking-widest">Fitment</span>
                </div>
                <div className="px-6 py-4 border border-white/10 text-center">
                   <span className="block text-2xl font-bold text-white">Forged</span>
                   <span className="text-[10px] uppercase text-gray-500 tracking-widest">Construction</span>
                </div>
             </div>
          </div>
       </div>

       {/* Technical Section */}
       <div className="grid lg:grid-cols-12 gap-8 mb-32 border-y border-white/10 py-16">
          <div className="lg:col-span-4">
             <h3 className="font-display text-3xl text-white font-bold uppercase mb-6">Precision <span className="text-[var(--accent-orange)]">Fitting</span></h3>
             <p className="text-gray-400 text-sm leading-relaxed mb-6">
                At FDL, every wheel is fitted in-house by our expert technicians using advanced balancing, torque-setting, and alignment equipment. We don't just bolt them on; we engineer the stance.
             </p>
             <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-center"><Settings size={14} className="text-[var(--accent-orange)] mr-3"/> Advanced Balancing</li>
                <li className="flex items-center"><Settings size={14} className="text-[var(--accent-orange)] mr-3"/> Torque-Setting Protocol</li>
                <li className="flex items-center"><Settings size={14} className="text-[var(--accent-orange)] mr-3"/> Geometry Alignment</li>
             </ul>
          </div>
          <div className="lg:col-span-8 grid grid-cols-2 gap-4">
             <img src="https://images.unsplash.com/photo-1487754180451-c456f719a1fc?q=80&w=800&auto=format&fit=crop" className="w-full h-64 object-cover grayscale hover:grayscale-0 transition-all duration-700" />
             <img src="https://images.unsplash.com/photo-1580273916550-e323be2ebcc6?q=80&w=800&auto=format&fit=crop" className="w-full h-64 object-cover grayscale hover:grayscale-0 transition-all duration-700" />
          </div>
       </div>

       {/* Trade-In / Pre-Owned Block */}
       <div className="bg-[#111] p-12 md:p-20 relative overflow-hidden group">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[var(--accent-orange)]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
             <div className="max-w-xl">
                <h3 className="font-display text-4xl text-white font-bold uppercase mb-4">Trade-In & <br/>Pre-Owned</h3>
                <p className="text-gray-400 mb-8">
                   Ready for an upgrade? Trade in your current alloys when purchasing a new set. We also carry a regularly updated selection of certified pre-owned wheels, approved by our specialists.
                </p>
                <button className="flex items-center gap-3 text-white border-b border-[var(--accent-orange)] pb-1 hover:text-[var(--accent-orange)] transition-colors">
                   Browse eBay Store <ArrowRight size={16}/>
                </button>
             </div>
             <div className="hidden md:block">
                <ShoppingBag size={64} className="text-white/10 group-hover:text-white/30 transition-colors" />
             </div>
          </div>
       </div>
    </div>
  );
};

// 3. Styling
const StylingPage = () => {
  const [activeColor, setActiveColor] = useState('Standard');
  const [filter, setFilter] = useState('none');

  const handleColor = (name, filterVal) => {
     setActiveColor(name);
     setFilter(filterVal);
  }

  return (
    <div className="min-h-screen bg-[var(--bg-dark)] pt-32 pb-12 px-6 md:px-16 animate-in fade-in duration-700 flex flex-col">
       <div className="grid lg:grid-cols-12 gap-12 h-full flex-grow">
          <div className="lg:col-span-4 flex flex-col justify-center z-10 pointer-events-none">
             <span className="text-[var(--accent-orange)] text-xs font-bold uppercase tracking-widest mb-4">Paint & Finish</span>
             <h1 className="font-display text-6xl md:text-8xl font-bold uppercase text-white mb-8 leading-none">Bespoke<br/>Finish</h1>
             <p className="text-gray-400 leading-relaxed mb-12 max-w-md pointer-events-auto">
                Our paint department uses only premium systems like Spies Hecker to deliver finishes with unmatched depth. Whether it’s a dramatic colour flip or a subtle OEM respray, we bring your vision to life.
             </p>
             
             <div className="space-y-6 pointer-events-auto">
                <div className="flex gap-4">
                   <button onClick={() => handleColor('OEM Gloss', 'none')} className={`w-8 h-8 rounded-full bg-gray-500 border-2 ${activeColor === 'OEM Gloss' ? 'border-white scale-125' : 'border-transparent opacity-50'} transition-all`}></button>
                   <button onClick={() => handleColor('Midnight', 'hue-rotate(220deg) brightness(0.8)')} className={`w-8 h-8 rounded-full bg-blue-900 border-2 ${activeColor === 'Midnight' ? 'border-white scale-125' : 'border-transparent opacity-50'} transition-all`}></button>
                   <button onClick={() => handleColor('Stealth', 'grayscale(100%) contrast(120%)')} className={`w-8 h-8 rounded-full bg-black border-2 ${activeColor === 'Stealth' ? 'border-white scale-125' : 'border-transparent opacity-50'} transition-all`}></button>
                   <button onClick={() => handleColor('Liquid Red', 'sepia(100%) saturate(300%) hue-rotate(-50deg)')} className={`w-8 h-8 rounded-full bg-red-600 border-2 ${activeColor === 'Liquid Red' ? 'border-white scale-125' : 'border-transparent opacity-50'} transition-all`}></button>
                </div>
                <p className="text-white font-mono text-xs uppercase tracking-widest">{activeColor} Configuration</p>
             </div>
          </div>

          <div className="lg:col-span-8 relative bg-[#111] border border-white/5 rounded-sm overflow-hidden h-[60vh] lg:h-auto self-center">
             <img 
               src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=2000&auto=format&fit=crop" 
               className="w-full h-full object-cover transition-all duration-700 ease-in-out"
               style={{ filter: filter }}
             />
             <div className="absolute top-6 right-6 flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                <Palette size={14} className="text-[var(--accent-orange)]" />
                <span className="text-[10px] font-bold uppercase text-white">Interactive Visualiser</span>
             </div>
          </div>
       </div>
    </div>
  );
};

// 4. Tints
const TintsPage = () => {
  const [tintLevel, setTintLevel] = useState(50);

  return (
    <div className="min-h-screen bg-[var(--bg-dark)] pt-32 pb-12 px-6 md:px-16 animate-in fade-in duration-700 flex flex-col">
       <div className="flex justify-between items-end mb-12">
          <h1 className="font-display text-6xl md:text-8xl font-bold uppercase text-white leading-none">Privacy<br/>Control</h1>
          <div className="text-right hidden md:block">
             <div className="flex items-center justify-end gap-2 text-[var(--accent-orange)] mb-2">
                <Shield size={16} /> <span className="font-bold text-sm">Ceramic</span>
             </div>
             <p className="text-gray-500 uppercase tracking-widest text-xs">99% UV Rejection</p>
          </div>
       </div>

       <div className="flex-grow relative w-full h-[60vh] bg-[#111] border border-white/5 rounded-sm overflow-hidden group">
          <img src="https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover" />
          
          <div 
             className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-100"
             style={{ opacity: tintLevel / 100 }}
          ></div>

          <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 bg-gradient-to-t from-black to-transparent">
             <div className="max-w-xl mx-auto bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-xl">
                <div className="flex justify-between text-white mb-6 text-xs font-bold uppercase tracking-widest">
                   <span>Light (0%)</span>
                   <span>Limo Black ({tintLevel}%)</span>
                </div>
                <input 
                   type="range" 
                   min="0" 
                   max="95" 
                   value={tintLevel} 
                   onChange={(e) => setTintLevel(Number(e.target.value))}
                   className="w-full"
                />
             </div>
          </div>
       </div>
    </div>
  );
};

// 5. Interiors: Reimagined "Atelier Split" Layout
const InteriorsPage = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-dark)] animate-in fade-in duration-700">
       <div className="flex flex-col lg:flex-row min-h-screen">
          
          {/* Left: Sticky Narrative Content */}
          <div className="lg:w-1/2 lg:h-screen lg:sticky lg:top-0 bg-[var(--bg-dark)] p-6 md:p-16 flex flex-col justify-center border-r border-white/5 z-10">
             <div className="mb-12">
                <span className="text-[var(--accent-orange)] text-xs font-bold uppercase tracking-widest mb-4 block">The Atelier</span>
                <h1 className="font-display text-5xl md:text-7xl font-bold uppercase text-white leading-none mb-8">
                   Cabin <br/> <span className="text-outline">Refinement</span>
                </h1>
                <p className="text-xl text-gray-400 font-light leading-relaxed mb-8">
                   "From the smallest stitch to the most complex contour, every aspect is meticulously crafted to deliver a truly bespoke, cohesive design."
                </p>
             </div>

             <div className="space-y-12">
                <div>
                   <h3 className="font-display text-2xl text-white font-bold uppercase mb-4 flex items-center"><Armchair size={20} className="mr-3 text-[var(--accent-orange)]"/> Quality Tailoring</h3>
                   <p className="text-gray-500 text-sm leading-relaxed">
                      Our in-house design centre showcases one of the UK’s most extensive collections of luxury automotive materials—ranging from fine leather and Alcantara to suede, exotic hides, and OEM-grade fabrics. With hundreds of colours, grains, and textures to choose from, our master upholsterers tailor each element to perfection.
                   </p>
                </div>
                
                <div>
                   <h3 className="font-display text-2xl text-white font-bold uppercase mb-4 flex items-center"><Maximize size={20} className="mr-3 text-[var(--accent-orange)]"/> Total Customisation</h3>
                   <p className="text-gray-500 text-sm leading-relaxed">
                      No detail is beyond transformation. Our interior conversion services cover every element of your cabin—from the floor to the headliner. We ensure a seamless, factory-level fit that elevates your vehicle’s character without compromising functionality.
                   </p>
                </div>
             </div>

             <div className="mt-16">
                <button className="px-8 py-4 border border-white text-white font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors w-full md:w-auto">
                   Book Design Consultation
                </button>
             </div>
          </div>

          {/* Right: Scrollable Visuals */}
          <div className="lg:w-1/2 bg-[#050505]">
             <div className="grid grid-cols-1 gap-1">
                <div className="aspect-[4/3] relative group overflow-hidden">
                   <img src="https://images.unsplash.com/photo-1563720225523-2882194cc23a?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                   <div className="absolute bottom-6 left-6">
                      <span className="bg-black/50 backdrop-blur px-3 py-1 text-white text-xs font-bold uppercase tracking-widest">Alcantara & Stitch</span>
                   </div>
                </div>
                <div className="aspect-[4/3] relative group overflow-hidden">
                   <img src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                   <div className="absolute bottom-6 left-6">
                      <span className="bg-black/50 backdrop-blur px-3 py-1 text-white text-xs font-bold uppercase tracking-widest">Nappa Leather</span>
                   </div>
                </div>
                <div className="aspect-[4/3] relative group overflow-hidden">
                   <img src="https://images.unsplash.com/photo-1560067644-84d72863925c?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                   <div className="absolute bottom-6 left-6">
                      <span className="bg-black/50 backdrop-blur px-3 py-1 text-white text-xs font-bold uppercase tracking-widest">Diamond Quilting</span>
                   </div>
                </div>
                <div className="aspect-[4/3] relative group overflow-hidden">
                   <img src="https://images.unsplash.com/photo-1616422285623-13ff0162193c?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                   <div className="absolute bottom-6 left-6">
                      <span className="bg-black/50 backdrop-blur px-3 py-1 text-white text-xs font-bold uppercase tracking-widest">Carbon Accents</span>
                   </div>
                </div>
             </div>
          </div>

       </div>
    </div>
  );
};

// 5. Main App Component (Homepage)
export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);

  // Auth & Data
  useEffect(() => {
    // 🚫 No Firebase = no auth calls
    if (!auth) {
      setUser({ uid: 'local-dev' } as any);
      return;
    }

    const init = async () => {
      const token = globalThis.__initial_auth_token;

      if (token) {
        await signInWithCustomToken(auth, token);
      } else {
        await signInAnonymously(auth);
      }
    };

    init();
    return onAuthStateChanged(auth, setUser);
  }, []);

  useEffect(() => {
    if (!user) return;
    if (!db) return;

    const ref = collection(db, 'artifacts', appId, 'public', 'data', 'products');
    const unsub = onSnapshot(query(ref, orderBy('createdAt', 'desc')), (snap) => {
      const items = snap.docs.map(d => ({id: d.id, ...d.data()}));
      setProducts(items.length ? items : []);
    });
    return () => unsub();
  }, [user]);


  return (
    <>
      <GlobalStyles />
      <CustomCursor />
      <div className="noise"></div>
      
      <HeroCarousel />
      <Marquee />
      <ServicesGrid />
      <ProductCarousel products={products} />
      <ReviewsSection />
      <BookingSection />
      
      <Footer />
    </>
  );
}