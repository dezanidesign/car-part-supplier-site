'use client';

import { Armchair, Maximize } from 'lucide-react';

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
                      Our in-house design centre showcases one of the UK's most extensive collections of luxury automotive materials—ranging from fine leather and Alcantara to suede, exotic hides, and OEM-grade fabrics. With hundreds of colours, grains, and textures to choose from, our master upholsterers tailor each element to perfection.
                   </p>
                </div>
                
                <div>
                   <h3 className="font-display text-2xl text-white font-bold uppercase mb-4 flex items-center"><Maximize size={20} className="mr-3 text-[var(--accent-orange)]"/> Total Customisation</h3>
                   <p className="text-gray-500 text-sm leading-relaxed">
                      No detail is beyond transformation. Our interior conversion services cover every element of your cabin—from the floor to the headliner. We ensure a seamless, factory-level fit that elevates your vehicle's character without compromising functionality.
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

export default InteriorsPage;
