import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Copy, Image as ImageIcon, Share2, Heart, Clock, Sparkles } from 'lucide-react';
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
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  if (!quote) {
    return (
      <div className="card max-w-3xl w-full mx-auto p-12 text-center text-muted-foreground font-medium text-lg border-dashed">
        Curating daily inspiration...
      </div>
    );
  }

  return (
    <article id="quoteCard" className="card max-w-3xl w-full mx-auto relative overflow-hidden group">
      <span
        className="absolute top-4 left-6 text-9xl text-blue-50 font-serif select-none pointer-events-none -z-10"
        aria-hidden="true"
      >
        “
      </span>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-10 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-primary text-xs font-semibold uppercase tracking-wider">
          <Sparkles size={14} />
          <span>{isDaily ? 'Quote of the Day' : 'Exploration Mode'}</span>
          {!isDaily && onReturnToDaily && (
            <button
              onClick={onReturnToDaily}
              className="underline ml-1 cursor-pointer hover:text-blue-700"
            >
              (Return)
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border border-border">
          <Clock size={14} className="text-primary" />
          <span>Resets in: <strong className="text-foreground">{countdown}</strong></span>
        </div>
      </div>

      <div className="relative z-10 mb-10 pl-4 border-l-4 border-primary">
        <blockquote className="text-3xl sm:text-4xl lg:text-5xl text-foreground font-bold leading-tight tracking-tight">
          "{quote.text}"
        </blockquote>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-border relative z-10">
        <div className="flex items-center gap-3">
          <span className="text-lg sm:text-xl font-semibold text-secondary">
            — {quote.author || 'Anonymous'}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200 uppercase tracking-wider">
            {quote.category || 'Wisdom'}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {quote.tags && quote.tags.map((t, idx) => (
            <span key={idx} className="text-xs font-medium text-muted-foreground bg-white px-2 py-1 rounded border border-border">
              #{t}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <button
            onClick={handleSpeech}
            className={`p-3 rounded-xl border transition-all cursor-pointer ${
              isSpeaking
                ? 'bg-primary border-primary text-white shadow-md shadow-primary/30 animate-pulse'
                : 'bg-white hover:bg-muted border-border text-muted-foreground hover:text-foreground shadow-sm'
            }`}
            title="Read quote aloud"
          >
            {isSpeaking ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>

          <button
            onClick={onCopy}
            className="p-3 rounded-xl bg-white hover:bg-muted border border-border text-muted-foreground hover:text-foreground shadow-sm transition-all cursor-pointer"
            title="Copy quote text"
          >
            <Copy size={20} />
          </button>

          <button
            onClick={onOpenExport}
            className="p-3 rounded-xl bg-white hover:bg-muted border border-border text-muted-foreground hover:text-foreground shadow-sm transition-all cursor-pointer"
            title="Export poster (PNG)"
          >
            <ImageIcon size={20} />
          </button>

          <button
            onClick={onShare}
            className="p-3 rounded-xl bg-white hover:bg-muted border border-border text-muted-foreground hover:text-foreground shadow-sm transition-all cursor-pointer"
            title="Share quote"
          >
            <Share2 size={20} />
          </button>
        </div>

        <button
          onClick={onToggleFavorite}
          className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-2 font-semibold shadow-sm ${
            isFavorite
              ? 'bg-rose-50 border-rose-200 text-rose-500 hover:bg-rose-100'
              : 'bg-white hover:bg-muted border-border text-muted-foreground hover:text-foreground'
          }`}
          title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
          <span className="hidden sm:inline">{isFavorite ? 'Saved' : 'Save'}</span>
        </button>
      </div>
    </article>
  );
};
