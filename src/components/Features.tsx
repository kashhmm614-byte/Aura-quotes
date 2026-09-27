import React from 'react';

export const Features: React.FC = () => {
  return (
    <section id="features" className="py-32 px-4 md:px-16 border-t border-white/20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
        
        <div className="flex flex-col space-y-4">
          <div className="text-xs uppercase tracking-widest text-white/50 font-sans">01</div>
          <h3 className="text-3xl font-serif text-white uppercase">Curated</h3>
          <p className="text-sm font-sans tracking-wide text-white/70">
            Access thousands of hand-picked quotes from visionaries, thinkers, and creators.
          </p>
        </div>

        <div className="flex flex-col space-y-4">
          <div className="text-xs uppercase tracking-widest text-white/50 font-sans">02</div>
          <h3 className="text-3xl font-serif text-white uppercase">Daily</h3>
          <p className="text-sm font-sans tracking-wide text-white/70">
            A new quote every day to help you stay focused, motivated, and inspired.
          </p>
        </div>

        <div className="flex flex-col space-y-4">
          <div className="text-xs uppercase tracking-widest text-white/50 font-sans">03</div>
          <h3 className="text-3xl font-serif text-white uppercase">Archive</h3>
          <p className="text-sm font-sans tracking-wide text-white/70">
            Save your favorites to your personal vault and access them securely across devices.
          </p>
        </div>

      </div>
    </section>
  );
};
