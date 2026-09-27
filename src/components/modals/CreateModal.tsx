import React, { useState } from 'react';
import type { Quote } from '../../types';

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuoteCreated: (q: Partial<Quote>) => Promise<void>;
  onShowToast: (msg: string, type: 'info' | 'success' | 'error') => void;
}

export const CreateModal: React.FC<CreateModalProps> = ({
  isOpen,
  onClose,
  onQuoteCreated,
  onShowToast
}) => {
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('Wisdom');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      onShowToast('Quote text is required.', 'error');
      return;
    }
    try {
      setIsSubmitting(true);
      await onQuoteCreated({
        text: text.trim(),
        author: author.trim() || 'Anonymous',
        category,
      });
      setText('');
      setAuthor('');
      setCategory('Wisdom');
      onClose();
    } catch (err) {
      onShowToast('Failed to create quote.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md">
      <div className="max-w-3xl w-full p-8 md:p-16 border border-white/20 bg-black relative flex flex-col gap-12">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-xs uppercase tracking-widest text-white/50 hover:text-white transition-colors"
        >
          [ CLOSE ]
        </button>

        <div>
          <h2 className="text-4xl md:text-5xl font-serif text-white uppercase tracking-wide">
            Draft
            <br />
            <span className="italic text-white/50">New Entry</span>
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest text-white/50">The Quote</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="bg-transparent border border-white/20 p-4 text-xl font-serif text-white placeholder-white/20 focus:outline-none focus:border-white min-h-[150px] resize-none"
              placeholder="Enter the words that moved you..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest text-white/50">Author</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="bg-transparent border-b border-white/20 py-2 text-white placeholder-white/20 focus:outline-none focus:border-white font-sans text-sm uppercase tracking-widest"
                placeholder="Anonymous"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest text-white/50">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-transparent border-b border-white/20 py-2 text-white focus:outline-none focus:border-white font-sans text-sm uppercase tracking-widest appearance-none"
              >
                {['Wisdom', 'Motivation', 'Philosophy', 'Stoicism', 'Romance'].map(c => (
                  <option key={c} value={c} className="bg-black text-white">{c}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full mt-4"
          >
            {isSubmitting ? 'SAVING...' : 'PUBLISH TO VAULT'}
          </button>
        </form>
      </div>
    </div>
  );
};
