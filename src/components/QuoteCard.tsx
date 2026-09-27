import React, { useState, useEffect } from 'react';
import type { Quote } from '../types';
import { Clock } from 'lucide-react';

interface QuoteCardProps {
  quote: Quote | null;
  isLoading: boolean;
  animKey: number;
}

const QuoteCard = React.memo(function QuoteCard({ quote, isLoading, animKey }: QuoteCardProps) {
  // Split quote into words for staggered word reveal
  const words = quote?.text.split(' ') || [];

  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setHours(24, 0, 0, 0); // Next midnight
      const diff = tomorrow.getTime() - now.getTime();
      
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      
      setTimeLeft(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      key={animKey}
      className="glass-pill glass-shine py-8 px-12 sm:py-10 sm:px-16 md:py-12 md:px-24 lg:px-32 relative overflow-hidden group animate-border-shimmer min-h-[250px] flex items-center justify-center"
    >
      {/* Inner glow effects */}
      <div className="absolute -top-32 -right-32 w-72 h-72 bg-purple-500/[0.06] rounded-full blur-[120px] pointer-events-none animate-glow-pulse" aria-hidden="true" />
      <div className="absolute -bottom-28 -left-28 w-56 h-56 bg-cyan-400/[0.04] rounded-full blur-[100px] pointer-events-none" aria-hidden="true" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/[0.015] rounded-full blur-[150px] pointer-events-none" aria-hidden="true" />

      {/* Content wrapper to center perfectly */}
      <div className="relative z-10 w-full text-center">

      {isLoading ? (
        <div className="space-y-5 py-10">
          <div className="h-9 shimmer rounded-xl w-[90%]" />
          <div className="h-9 shimmer rounded-xl w-[70%]" />
          <div className="h-9 shimmer rounded-xl w-[50%]" />
          <div className="h-5 shimmer rounded-lg w-[30%] mt-12" />
        </div>
      ) : (
        <div className="relative z-10">
          {/* Category pill */}
          {quote?.category && (
            <div className="mb-8 md:mb-10 animate-fade-in">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-purple-300/50">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400/50 animate-breathe" />
                {quote.category}
              </span>
            </div>
          )}

          {/* Decorative large quotation mark */}
          <div className="absolute top-6 left-6 md:top-10 md:left-10 text-[120px] md:text-[180px] font-serif leading-none text-white/[0.02] select-none pointer-events-none" aria-hidden="true">
            "
          </div>

          {/* Quote text — word-by-word reveal */}
          <blockquote className="text-[1.4rem] sm:text-[1.7rem] md:text-[2.2rem] lg:text-[2.7rem] xl:text-[3.1rem] font-bold font-heading text-white/[0.93] leading-[1.18] tracking-tight mb-10 md:mb-14 text-balance word-reveal">
            <span className="text-purple-300/25 mr-0.5">"</span>
            {words.map((word, i) => (
              <span key={`${animKey}-${i}`}>
                {word}{i < words.length - 1 ? '\u00A0' : ''}
              </span>
            ))}
            <span className="text-purple-300/25 ml-0.5">"</span>
          </blockquote>

          {/* Author row & Live Tracker */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 w-full animate-slide-up" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center gap-3">
              {/* Decorative dash */}
              <div className="w-8 h-[2px] bg-gradient-to-r from-purple-500/50 to-cyan-400/50 rounded-full" />
              <cite className="text-sm sm:text-base md:text-lg text-white/35 font-medium not-italic tracking-tight">
                {quote?.author}
              </cite>
            </div>
            
            {/* Live Tracker */}
            <div className="flex items-center gap-2 bg-white/[0.03] px-3.5 py-1.5 rounded-full border border-white/[0.05] shadow-inner">
              <Clock size={12} className="text-cyan-400/70" />
              <div className="flex flex-col items-start">
                <span className="text-[9px] uppercase tracking-[0.2em] text-white/30 font-bold leading-none mb-0.5">Refreshes in</span>
                <span className="text-xs font-bold text-white/70 tracking-wider tabular-nums leading-none">
                  {timeLeft}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      </div>
    </div>
  );
});

export default QuoteCard;
