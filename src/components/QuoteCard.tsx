import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Copy, Image as ImageIcon, Share2, Heart, Clock } from 'lucide-react';
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
      <div className="card max-w-3xl w-full mx-auto p-12 text-center text-muted-foreground font-medium text-sm border-dashed">
        Loading inspiration...
      </div>
    );
  }

  return (
    <article className="card max-w-3xl w-full mx-auto relative flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground">
          {isDaily ? 'Quote of the Day' : 'Exploration Mode'}
          {!isDaily && onReturnToDaily && (
            <button onClick={onReturnToDaily} className="ml-2 hover:underline text-muted-foreground">
              (Reset)
            </button>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          <span>{countdown}</span>
        </div>
      </div>

      <div className="py-6">
        <blockquote className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
          "{quote.text}"
        </blockquote>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="font-medium text-foreground">— {quote.author || 'Anonymous'}</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium">{quote.category}</span>
            {quote.tags && quote.tags.length > 0 && (
              <>
                <span className="text-muted-foreground text-xs">•</span>
                <span className="text-xs text-muted-foreground">#{quote.tags[0]}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center gap-1">
          <button onClick={handleSpeech} className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9 ${isSpeaking ? 'bg-accent text-accent-foreground' : ''}`} title="Read quote aloud">
            {isSpeaking ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button onClick={onCopy} className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9" title="Copy text">
            <Copy className="w-4 h-4" />
          </button>
          <button onClick={onOpenExport} className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9" title="Export">
            <ImageIcon className="w-4 h-4" />
          </button>
          <button onClick={onShare} className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9" title="Share">
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        <button onClick={onToggleFavorite} className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-9 px-4 py-2 border gap-2 ${isFavorite ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100' : 'bg-transparent hover:bg-accent hover:text-accent-foreground'}`}>
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          <span className="hidden sm:inline">{isFavorite ? 'Saved' : 'Save'}</span>
        </button>
      </div>
    </article>
  );
};
