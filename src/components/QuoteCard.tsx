import React, { useState, useEffect } from 'react';
import type { Quote } from '../types';

interface QuoteCardProps {
  quote: Quote | null;
  isDaily: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onCopy: () => void;
  onOpenExport: () => void;
  onShare: () => void;
  onReturnToDaily?: () => void;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({
  quote,
  isDaily,
  isFavorite,
  onToggleFavorite,
  onCopy,
  onOpenExport,
  onShare,
  onReturnToDaily,
}) => {
  const [countdown, setCountdown] = useState('--:--:--');
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diffMs = midnight.getTime() - now.getTime();
      const hours = String(Math.floor((diffMs / (1000 * 60 * 60)) % 24)).padStart(2, '0');
      const minutes = String(Math.floor((diffMs / (1000 * 60)) % 60)).padStart(2, '0');
      const seconds = String(Math.floor((diffMs / 1000) % 60)).padStart(2, '0');
      setCountdown(`${hours}:${minutes}:${seconds}`);
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSpeech = () => {
    if (!('speechSynthesis' in window) || !quote) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(`${quote.text} by ${quote.author}`);
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  if (!quote) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-white/50 text-xs uppercase tracking-widest">
        Loading...
      </div>
    );
  }

  return (
    <article className="max-w-7xl mx-auto px-4 md:px-16 py-24 flex flex-col min-h-screen justify-center relative">
      <div className="absolute top-8 left-4 md:left-16 flex items-center gap-4 text-xs uppercase tracking-widest font-sans text-white/50">
        <span>{isDaily ? 'DAILY FEATURE' : 'EXPLORE'}</span>
        {!isDaily && onReturnToDaily && (
          <button onClick={onReturnToDaily} className="hover:text-white transition-colors">
            [ RESET ]
          </button>
        )}
      </div>

      <div className="absolute top-8 right-4 md:right-16 text-xs uppercase tracking-widest font-sans text-white/50">
        TIME REMAINING: {countdown}
      </div>

      <div className="flex flex-col md:flex-row gap-12 md:gap-24 items-start md:items-center">
        <blockquote className="flex-1 text-4xl md:text-6xl lg:text-7xl font-serif font-light leading-tight text-white tracking-normal">
          {quote.text}
        </blockquote>
        
        <div className="w-full md:w-64 flex-shrink-0 flex flex-col space-y-8 border-l border-white/20 pl-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-white/50 mb-2 font-sans">Author</p>
            <p className="text-xl font-serif text-white uppercase">{quote.author || 'Anonymous'}</p>
          </div>
          
          <div>
            <p className="text-xs uppercase tracking-widest text-white/50 mb-2 font-sans">Category</p>
            <p className="text-sm uppercase tracking-widest font-sans text-white">{quote.category}</p>
          </div>

          <div className="pt-8 border-t border-white/20 flex flex-col gap-4">
            <button onClick={handleSpeech} className="text-left text-xs uppercase tracking-widest font-sans hover:text-white/50 transition-colors">
              {isSpeaking ? 'STOP AUDIO' : 'PLAY AUDIO'}
            </button>
            <button onClick={onCopy} className="text-left text-xs uppercase tracking-widest font-sans hover:text-white/50 transition-colors">
              COPY TEXT
            </button>
            <button onClick={onOpenExport} className="text-left text-xs uppercase tracking-widest font-sans hover:text-white/50 transition-colors">
              EXPORT ART
            </button>
            <button onClick={onShare} className="text-left text-xs uppercase tracking-widest font-sans hover:text-white/50 transition-colors">
              SHARE
            </button>
            <button onClick={onToggleFavorite} className={`text-left text-xs uppercase tracking-widest font-sans transition-colors ${isFavorite ? 'text-white' : 'hover:text-white/50'}`}>
              {isFavorite ? '[ SAVED ]' : 'SAVE TO VAULT'}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
