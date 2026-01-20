'use client';

const ContactPage = () => (
  <div className="min-h-screen bg-[var(--bg-dark)] pt-32 pb-24 px-6 md:px-16">
    <section className="py-24 md:py-32 px-6 md:px-16 bg-[#080808]">
       <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="font-display text-4xl md:text-6xl font-bold uppercase text-white mb-6">Quote <span className="text-transparent" style={{ WebkitTextStroke: '1px white'}}>Request</span></h2>
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
          <button className="w-full bg-white text-black py-5 font-bold uppercase tracking-widest text-xs hover:bg-[var(--accent-orange)] hover:text-white transition-all duration-300">
             Submit Inquiry
          </button>
       </div>
    </section>
  </div>
);

export default ContactPage;
