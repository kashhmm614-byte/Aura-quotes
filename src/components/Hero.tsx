import React from 'react';
import type { Quote } from '../types';

interface HeroProps {
  onStart: () => void;
  quote: Quote | null;
}

export const Hero: React.FC<HeroProps> = ({ onStart, quote }) => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden flex flex-col items-center justify-center text-center px-4">
      {/* Glassmorphism Background Decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-100 rounded-full blur-3xl opacity-50 -z-10" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-50 rounded-full blur-3xl opacity-60 -z-10" />

      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel text-sm font-medium text-primary">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Daily Inspiration Delivered
        </div>

        <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-foreground">
          Discover words that <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">inspire action.</span>
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          AuraQuote brings you a curated collection of powerful quotes to fuel your creativity, motivation, and daily focus.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <button onClick={onStart} className="btn-primary w-full sm:w-auto text-lg px-8 py-4">
            Get Today's Quote
          </button>
          <a href="#features" className="btn-secondary w-full sm:w-auto text-lg px-8 py-4">
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
};
