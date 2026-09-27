import React, { useState, useEffect, useCallback } from 'react';
import type { Quote } from '../../types';
import { auraDB } from '../../lib/db';

interface VaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectQuote: (q: Quote) => void;
}

export const VaultModal: React.FC<VaultModalProps> = ({
  isOpen,
  onClose,
  onSelectQuote,
}) => {
  const [favorites, setFavorites] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const favs = await auraDB.getAllFavorites();
      setFavorites(favs);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      void loadFavorites();
    }
  }, [isOpen, loadFavorites]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md">
      <div className="w-full h-full md:h-auto md:max-w-5xl md:max-h-[85vh] bg-black border border-white/20 flex flex-col relative">
        <div className="flex items-center justify-between p-8 border-b border-white/20">
          <h2 className="text-3xl font-serif uppercase tracking-widest text-white">The Vault</h2>
          <button 
            onClick={onClose}
            className="text-xs uppercase tracking-widest text-white/50 hover:text-white transition-colors"
          >
            [ CLOSE ]
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {loading ? (
            <div className="text-center py-12 text-xs uppercase tracking-widest text-white/50">
              Accessing Archives...
            </div>
          ) : favorites.length === 0 ? (
            <div className="text-center py-24 flex flex-col items-center gap-4">
              <div className="text-3xl font-serif italic text-white/30">Empty</div>
              <p className="text-sm font-sans tracking-widest text-white/50 uppercase">
                You haven't saved any quotes yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {favorites.map(q => (
                <div 
                  key={q.id}
                  onClick={() => onSelectQuote(q)}
                  className="group cursor-pointer border border-white/10 p-8 hover:border-white/40 transition-colors flex flex-col justify-between min-h-[200px]"
                >
                  <p className="font-serif text-xl line-clamp-4 leading-relaxed group-hover:text-white transition-colors text-white/80">
                    "{q.text}"
                  </p>
                  <div className="mt-8 pt-4 border-t border-white/10 flex justify-between items-center text-xs uppercase tracking-widest text-white/50">
                    <span>{q.author || 'Anonymous'}</span>
                    <span>{q.category}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
