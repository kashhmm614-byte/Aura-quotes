import { useState } from 'react';
import type { Quote } from '../../types';
import { addQuote } from '../../lib/db';
import { containsBadWords } from '../../lib/bad-words';
import { X, PenLine, Sparkles, AlertTriangle } from 'lucide-react';

interface CreateModalProps {
  onClose: () => void;
  onCreated: (quote: Quote) => void;
}

const CATEGORIES = ['Life', 'Motivation', 'Love', 'Wisdom', 'Philosophy', 'Success', 'Mindfulness', 'Humor', 'Science', 'Nature'];

export default function CreateModal({ onClose, onCreated }: CreateModalProps) {
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('Life');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!text.trim() || !author.trim()) return;

    if (containsBadWords(text) || containsBadWords(author)) {
      setError("Please keep it clean! Profanity is not allowed.");
      return;
    }

    setSaving(true);
    const quote: Quote = {
      id: `custom-${Date.now()}`,
      text: text.trim(),
      author: author.trim(),
      category,
      is_custom: true,
    };
    await addQuote(quote);
    onCreated(quote);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative glass-strong rounded-3xl p-6 md:p-8 max-w-lg w-full animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <PenLine size={20} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Create Quote</h2>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors cursor-pointer" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="quote-text" className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">Quote</label>
            <textarea
              id="quote-text"
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Write something meaningful..."
              rows={4}
              className="w-full glass rounded-2xl p-4 text-white placeholder-white/30 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-shadow"
              required
            />
          </div>

          <div>
            <label htmlFor="quote-author" className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">Author</label>
            <input
              id="quote-author"
              type="text"
              value={author}
              onChange={e => setAuthor(e.target.value)}
              placeholder="Who said this?"
              className="w-full glass rounded-xl p-3 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-shadow"
              required
            />
          </div>

          <div>
            <label className="block text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    category === cat
                      ? 'bg-gradient-to-r from-purple-500 to-cyan-400 text-white'
                      : 'glass text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-fade-in">
              <AlertTriangle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={saving || !text.trim() || !author.trim()}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-400 text-white font-bold text-sm uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles size={16} />
            {saving ? 'Saving...' : 'Create Quote'}
          </button>
        </form>
      </div>
    </div>
  );
}
