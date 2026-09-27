import React from 'react';
import type { Quote } from '../types';

interface HeroProps {
  onStart: () => void;
  quote: Quote | null;
}

export const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <section className="min-h-screen flex flex-col justify-center px-4 md:px-16 pt-16">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end border-b border-white/20 pb-12">
          <div className="md:col-span-8">
            <h1 className="text-5xl md:text-8xl lg:text-9xl font-serif font-light tracking-tight leading-none text-white uppercase">
              Words
              <br />
              <span className="italic text-white/70">In Motion</span>
            </h1>
          </div>
          <div className="md:col-span-4 flex flex-col items-start md:items-end justify-end space-y-8">
            <p className="text-sm uppercase tracking-widest text-white/50 max-w-xs text-left md:text-right font-sans">
              A carefully curated collection of powerful quotes to fuel your creativity and daily focus.
            </p>
            <button onClick={onStart} className="btn-primary w-full md:w-auto">
              Read Today's Quote
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
