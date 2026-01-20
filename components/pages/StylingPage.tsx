'use client';

import { useState } from 'react';
import { Palette } from 'lucide-react';

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
                Our paint department uses only premium systems like Spies Hecker to deliver finishes with unmatched depth. Whether it's a dramatic colour flip or a subtle OEM respray, we bring your vision to life.
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
               src="/gallery/range-rover/5B1A4868.jpg"
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

export default StylingPage;
