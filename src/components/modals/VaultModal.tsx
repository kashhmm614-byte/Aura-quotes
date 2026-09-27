import { useState, useEffect } from 'react';
import type { Quote } from '../../types';
import { getFavoriteQuotes, removeFavorite } from '../../lib/db';
import { X, Heart, Volume2, Trash2, BookHeart } from 'lucide-react';
import { speak } from '../../lib/lithos';

interface VaultModalProps {
  onClose: () => void;
  onSelectQuote: (quote: Quote) => void;
}

export default function VaultModal({ onClose, onSelectQuote }: VaultModalProps) {
  const [favorites, setFavorites] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFavoriteQuotes().then(q => {
      setFavorites(q);
      setLoading(false);
    });
  }, []);

  const handleRemove = async (id: string) => {
    await removeFavorite(id);
    setFavorites(prev => prev.filter(q => q.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative glass-strong rounded-3xl p-6 md:p-8 max-w-lg w-full max-h-[80vh] flex flex-col animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-400 flex items-center justify-center">
              <BookHeart size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Your Vault</h2>
              <p className="text-white/50 text-xs">{favorites.length} saved quotes</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors cursor-pointer" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="glass rounded-2xl p-4 animate-pulse">
                  <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-white/10 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : favorites.length === 0 ? (
            <div className="text-center py-12">
              <Heart size={40} className="mx-auto text-white/20 mb-4" />
              <p className="text-white/40 text-sm">No saved quotes yet.</p>
              <p className="text-white/30 text-xs mt-1">Tap the heart icon on any quote to save it.</p>
            </div>
          ) : (
            favorites.map((q, i) => (
              <div
                key={q.id}
                className="glass rounded-2xl p-4 hover:bg-white/10 transition-colors cursor-pointer group animate-slide-up"
                style={{ animationDelay: `${i * 80}ms` }}
                onClick={() => { onSelectQuote(q); onClose(); }}
              >
                <p className="text-white/90 text-sm leading-relaxed mb-2 line-clamp-2">"{q.text}"</p>
                <div className="flex items-center justify-between">
                  <span className="text-white/50 text-xs">— {q.author}</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={e => { e.stopPropagation(); speak(q.text); }}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                      aria-label="Listen"
                    >
                      <Volume2 size={14} className="text-white/60" />
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); handleRemove(q.id); }}
                      className="p-2 hover:bg-red-500/20 rounded-full transition-colors cursor-pointer"
                      aria-label="Remove from vault"
                    >
                      <Trash2 size={14} className="text-red-400/60" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
