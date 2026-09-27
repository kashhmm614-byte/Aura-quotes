import { useState, useEffect } from 'react';
import type { Quote, AuraUser } from '../types';
import { Heart, Volume2, VolumeX, Download } from 'lucide-react';
import QuoteCard from './QuoteCard';
import { isFavorite, addFavorite, removeFavorite } from '../lib/db';
import { playSound } from '../lib/sounds';
import { speak, stopSpeaking } from '../lib/lithos';

interface Props {
  quote: Quote;
  user: AuraUser | null;
  onOpenAuth: () => void;
  onOpenShare: (quote: Quote) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  isQotd?: boolean;
}

export default function QuoteFeedItem({ quote, user, onOpenAuth, onOpenShare, onShowToast, isQotd }: Props) {
  const [isFav, setIsFav] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    (async () => {
      setIsFav(await isFavorite(quote.id));
    })();
  }, [quote.id]);

  const handleFavorite = async () => {
    if (!user) {
      onOpenAuth();
      return;
    }
    playSound('click');
    if (isFav) {
      await removeFavorite(quote.id);
      setIsFav(false);
    } else {
      await addFavorite(quote.id);
      setIsFav(true);
      playSound('success');
      onShowToast('Saved to vault!');
    }
  };

  const handleTTS = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      playSound('pop');
      speak(`${quote.text} — by ${quote.author}`);
      setIsSpeaking(true);
      // Wait for it to finish (rough approximation or just let them toggle off)
    }
  };

  return (
    <div className="w-full mb-12 flex flex-col items-center">
      {isQotd && (
        <div className="mb-4 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full theme-bg text-white text-xs font-bold uppercase tracking-widest shadow-lg theme-shadow">
            Quote of the Day
          </span>
        </div>
      )}
      
      <QuoteCard quote={quote} isLoading={false} animKey={0} />

      {/* Action Bar */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 mt-6">
        {/* TTS */}
        <button
          onClick={handleTTS}
          className={`w-12 h-12 flex items-center justify-center transition-all duration-300 cursor-pointer rounded-2xl ${
            isSpeaking
              ? 'bg-purple-500/20 border border-purple-400/25 shadow-lg shadow-purple-500/10 liquid-btn-active'
              : 'glass-btn hover:scale-105'
          }`}
          aria-label={isSpeaking ? 'Stop speaking' : 'Listen'}
        >
          {isSpeaking
            ? <VolumeX size={19} className="text-purple-300" />
            : <Volume2 size={19} className="text-white/50 hover:text-white transition-colors" />
          }
        </button>

        {/* Favorite */}
        <button
          onClick={handleFavorite}
          className={`w-12 h-12 flex items-center justify-center transition-all duration-300 cursor-pointer rounded-2xl ${
            isFav
              ? 'bg-pink-500/20 border border-pink-400/25 shadow-lg shadow-pink-500/10 liquid-btn-active'
              : 'glass-btn hover:scale-105'
          }`}
          aria-label={isFav ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Heart
            size={19}
            fill={isFav ? 'currentColor' : 'none'}
            className={`transition-all duration-300 ${
              isFav ? 'text-pink-400 scale-110' : 'text-white/50 hover:text-white'
            }`}
          />
        </button>

        {/* Share */}
        <button
          onClick={() => onOpenShare(quote)}
          className="w-12 h-12 flex items-center justify-center transition-all cursor-pointer rounded-2xl glass-btn hover:scale-105 hover:bg-white/5"
          aria-label="Download & share"
        >
          <Download size={19} className="text-white/50 hover:text-white transition-colors" />
        </button>
      </div>
    </div>
  );
}
