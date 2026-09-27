import { useState, useEffect, useRef } from 'react';
import type { Quote } from '../../types';
import {
  TEMPLATES, renderQuoteCard, downloadQuoteImage, shareQuoteImage,
  shareToWhatsApp, shareToX, getAspectSizes,
  type TemplateId, type AspectRatio
} from '../../lib/canvas-renderer';
import { X, Download, Share2, MessageCircle, Instagram, Twitter, Check, Image } from 'lucide-react';

interface ShareModalProps {
  quote: Quote;
  onClose: () => void;
}

export default function ShareModal({ quote, onClose }: ShareModalProps) {
  const [template, setTemplate] = useState<TemplateId>('midnight');
  const [aspect, setAspect] = useState<AspectRatio>('story');
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const previewRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Render preview whenever template or aspect changes
  useEffect(() => {
    const canvas = renderQuoteCard(quote, template, aspect);
    const container = containerRef.current;
    if (!container) return;

    // Clear previous preview
    container.innerHTML = '';

    // Scale canvas for preview
    const previewCanvas = document.createElement('canvas');
    const maxW = container.clientWidth;
    const sizes = getAspectSizes();
    const { w, h } = sizes[aspect];
    const ratio = h / w;
    const displayW = maxW;
    const displayH = maxW * ratio;

    previewCanvas.width = displayW * 2;
    previewCanvas.height = displayH * 2;
    previewCanvas.style.width = `${displayW}px`;
    previewCanvas.style.height = `${displayH}px`;
    previewCanvas.style.borderRadius = '16px';
    previewCanvas.className = 'shadow-2xl';

    const pCtx = previewCanvas.getContext('2d')!;
    pCtx.drawImage(canvas, 0, 0, previewCanvas.width, previewCanvas.height);

    container.appendChild(previewCanvas);
    previewRef.current = canvas;
  }, [quote, template, aspect]);

  const handleDownload = async () => {
    setDownloading(true);
    await downloadQuoteImage(quote, template, aspect);
    setTimeout(() => setDownloading(false), 1000);
  };

  const handleNativeShare = async () => {
    const shared = await shareQuoteImage(quote, template, aspect);
    if (!shared) {
      // Fallback: copy text
      await navigator.clipboard.writeText(`"${quote.text}" — ${quote.author}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const aspectSizes = getAspectSizes();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      <div
        className="relative glass-strong rounded-3xl w-full max-w-xl max-h-[92vh] flex flex-col animate-scale-in overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 pb-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center">
              <Image size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Share Quote</h2>
              <p className="text-white/40 text-xs">Download or share as image</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors cursor-pointer p-1" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Preview */}
          <div
            ref={containerRef}
            className="w-full flex items-center justify-center rounded-2xl overflow-hidden bg-black/20 p-3 min-h-[200px]"
          />

          {/* Template Selector */}
          <div>
            <label className="block text-white/50 text-[10px] font-bold uppercase tracking-[0.2em] mb-2.5">Design Template</label>
            <div className="grid grid-cols-6 gap-2">
              {TEMPLATES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className={`group relative aspect-square rounded-xl overflow-hidden cursor-pointer transition-all duration-200 ${
                    template === t.id
                      ? 'ring-2 ring-purple-400 ring-offset-2 ring-offset-black/50 scale-105'
                      : 'hover:scale-105 opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    background: `linear-gradient(135deg, ${t.colors.join(', ')})`,
                  }}
                  aria-label={t.name}
                >
                  {template === t.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Check size={16} className="text-white" />
                    </div>
                  )}
                  <span className="absolute bottom-0 inset-x-0 text-[8px] text-white/70 font-bold text-center py-1 bg-black/40">{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio */}
          <div>
            <label className="block text-white/50 text-[10px] font-bold uppercase tracking-[0.2em] mb-2.5">Size</label>
            <div className="flex gap-2">
              {(Object.entries(aspectSizes) as [AspectRatio, { label: string }][]).map(([key, { label }]) => (
                <button
                  key={key}
                  onClick={() => setAspect(key)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    aspect === key
                      ? 'bg-gradient-to-r from-purple-500 to-cyan-400 text-white shadow-lg shadow-purple-500/20'
                      : 'glass-btn text-white/40 hover:text-white/70'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Primary: Download */}
            <button
              onClick={handleDownload}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-400 text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer shadow-lg shadow-purple-500/20 active:scale-[0.98]"
            >
              <Download size={17} />
              {downloading ? 'Downloading...' : 'Download Image'}
            </button>

            {/* Social sharing row */}
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => shareToWhatsApp(quote)}
                className="glass-btn py-3 rounded-xl flex flex-col items-center gap-1.5 cursor-pointer group"
                aria-label="Share on WhatsApp"
              >
                <MessageCircle size={18} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="text-[9px] text-white/40 font-medium">WhatsApp</span>
              </button>

              <button
                onClick={handleNativeShare}
                className="glass-btn py-3 rounded-xl flex flex-col items-center gap-1.5 cursor-pointer group"
                aria-label="Share on Instagram"
              >
                <Instagram size={18} className="text-pink-400 group-hover:scale-110 transition-transform" />
                <span className="text-[9px] text-white/40 font-medium">Stories</span>
              </button>

              <button
                onClick={() => shareToX(quote)}
                className="glass-btn py-3 rounded-xl flex flex-col items-center gap-1.5 cursor-pointer group"
                aria-label="Share on X"
              >
                <Twitter size={18} className="text-sky-400 group-hover:scale-110 transition-transform" />
                <span className="text-[9px] text-white/40 font-medium">X / Twitter</span>
              </button>

              <button
                onClick={handleNativeShare}
                className="glass-btn py-3 rounded-xl flex flex-col items-center gap-1.5 cursor-pointer group"
                aria-label="More sharing options"
              >
                <Share2 size={18} className="text-purple-400 group-hover:scale-110 transition-transform" />
                <span className="text-[9px] text-white/40 font-medium">{copied ? 'Copied!' : 'More'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
