'use client';

import { useState } from 'react';
import { Shield } from 'lucide-react';

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

export default TintsPage;
