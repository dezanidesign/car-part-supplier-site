'use client';

import { Settings, ArrowRight, ShoppingBag } from 'lucide-react';

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

export default AlloysPage;
