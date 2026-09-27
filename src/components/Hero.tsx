import React from 'react';
import type { Quote } from '../types';

interface HeroProps {
  onStart: () => void;
  quote: Quote | null;
}

export const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <section className="py-24 md:py-32 flex flex-col items-center justify-center text-center px-4 max-w-3xl mx-auto">
      <div className="space-y-6">
        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
          Daily Inspiration
        </div>
        
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl text-foreground">
          Discover words that inspire action.
        </h1>
        
        <p className="text-xl text-muted-foreground">
          AuraQuote brings you a curated collection of powerful quotes to fuel your creativity, motivation, and daily focus.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button onClick={onStart} className="btn-primary w-full sm:w-auto h-11 px-8">
            Get Today's Quote
          </button>
          <a href="#features" className="btn-secondary w-full sm:w-auto h-11 px-8">
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
};
