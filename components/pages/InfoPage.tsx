'use client';

import { MapPin, Phone, Clock, Target, PenTool, Briefcase, Settings } from 'lucide-react';

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
         <img src="/gallery/audi/5B1A3705.jpg" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 transform group-hover:scale-105" alt="Workshop" />
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
                <img src="/gallery/bmw/5B1A4995.jpg" className="w-full aspect-[3/4] object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Process 1" />
                <img src="/gallery/land-rover/5B1A1215.jpg" className="w-full aspect-[3/4] object-cover grayscale hover:grayscale-0 transition-all duration-700 mt-12" alt="Process 2" />
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

export default InfoPage;
