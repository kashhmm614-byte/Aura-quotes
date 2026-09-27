import React from 'react';
import type { Quote } from '../../types';

interface ExportModalProps {
  isOpen: boolean;
  quote: Quote | null;
  onClose: () => void;
  onShowToast: (msg: string, type: 'info' | 'success' | 'error') => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  quote,
  onClose,
  onShowToast
}) => {
  if (!isOpen || !quote) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md">
      <div className="max-w-2xl w-full p-8 md:p-16 border border-white/20 bg-black relative flex flex-col gap-12">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-xs uppercase tracking-widest text-white/50 hover:text-white transition-colors"
        >
          [ CLOSE ]
        </button>

        <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl font-serif text-white uppercase tracking-wide">
            Export
            <br />
            <span className="italic text-white/50">Artwork</span>
          </h2>
          <p className="text-sm font-sans tracking-wide text-white/70 max-w-sm">
            Generate a high-resolution, cinema-style graphic of this quote to share on social media.
          </p>
        </div>

        <div className="border border-white/20 p-8 flex flex-col justify-center text-center space-y-6">
           <blockquote className="text-3xl font-serif text-white leading-tight">
            "{quote.text}"
           </blockquote>
           <p className="text-xs uppercase tracking-widest text-white/50">
            — {quote.author || 'Anonymous'}
           </p>
        </div>

        <button
          onClick={() => {
            onShowToast('Exporting high-resolution image...', 'info');
            setTimeout(() => {
              onShowToast('Export feature under construction.', 'error');
              onClose();
            }, 1500);
          }}
          className="btn-primary w-full"
        >
          DOWNLOAD GRAPHIC
        </button>
      </div>
    </div>
  );
};
