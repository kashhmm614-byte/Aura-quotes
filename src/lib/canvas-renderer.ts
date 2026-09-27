import type { Quote } from '../types';

/* ═══════════════════════════════════════════════════════════
   Canvas Quote Card Renderer
   Generates high-resolution images for social sharing
   ═══════════════════════════════════════════════════════════ */

export type TemplateId = 'midnight' | 'sunset' | 'aurora' | 'minimal' | 'ocean' | 'rosegold';
export type AspectRatio = 'story' | 'square' | 'wide';

interface TemplateConfig {
  id: TemplateId;
  name: string;
  colors: string[];
  textColor: string;
  accentColor: string;
}

export const TEMPLATES: TemplateConfig[] = [
  { id: 'midnight',  name: 'Midnight',   colors: ['#0F0C29', '#302B63', '#24243E'], textColor: '#FFFFFF', accentColor: '#8B5CF6' },
  { id: 'sunset',    name: 'Sunset',     colors: ['#F97316', '#EC4899', '#8B5CF6'], textColor: '#FFFFFF', accentColor: '#FCD34D' },
  { id: 'aurora',    name: 'Aurora',      colors: ['#064E3B', '#065F46', '#6D28D9'], textColor: '#D1FAE5', accentColor: '#34D399' },
  { id: 'minimal',   name: 'Noir',       colors: ['#000000', '#0A0A0A', '#111111'], textColor: '#FFFFFF', accentColor: '#A3A3A3' },
  { id: 'ocean',     name: 'Ocean',      colors: ['#0C4A6E', '#155E75', '#164E63'], textColor: '#E0F2FE', accentColor: '#22D3EE' },
  { id: 'rosegold',  name: 'Rose Gold',  colors: ['#4C1D95', '#831843', '#92400E'], textColor: '#FFF1F2', accentColor: '#FB923C' },
];

const ASPECT_SIZES: Record<AspectRatio, { w: number; h: number; label: string }> = {
  story:  { w: 1080, h: 1920, label: 'Story (9:16)' },
  square: { w: 1080, h: 1080, label: 'Post (1:1)' },
  wide:   { w: 1920, h: 1080, label: 'Wide (16:9)' },
};

export function getAspectSizes() { return ASPECT_SIZES; }

function createGradient(ctx: CanvasRenderingContext2D, w: number, h: number, colors: string[]) {
  const grd = ctx.createLinearGradient(0, 0, w * 0.5, h);
  colors.forEach((c, i) => grd.addColorStop(i / (colors.length - 1), c));
  return grd;
}

function drawOrbs(ctx: CanvasRenderingContext2D, w: number, h: number, accentColor: string) {
  // Top-right orb
  const grd1 = ctx.createRadialGradient(w * 0.8, h * 0.15, 0, w * 0.8, h * 0.15, w * 0.35);
  grd1.addColorStop(0, accentColor + '25');
  grd1.addColorStop(1, 'transparent');
  ctx.fillStyle = grd1;
  ctx.fillRect(0, 0, w, h);

  // Bottom-left orb
  const grd2 = ctx.createRadialGradient(w * 0.15, h * 0.85, 0, w * 0.15, h * 0.85, w * 0.3);
  grd2.addColorStop(0, accentColor + '18');
  grd2.addColorStop(1, 'transparent');
  ctx.fillStyle = grd2;
  ctx.fillRect(0, 0, w, h);
}

function drawGrid(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.strokeStyle = 'rgba(255,255,255,0.02)';
  ctx.lineWidth = 1;
  const step = 60;
  for (let x = 0; x < w; x += step) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }
  for (let y = 0; y < h; y += step) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

export function renderQuoteCard(
  quote: Quote,
  templateId: TemplateId,
  aspect: AspectRatio
): HTMLCanvasElement {
  const template = TEMPLATES.find(t => t.id === templateId) || TEMPLATES[0];
  const size = ASPECT_SIZES[aspect];
  const { w, h } = size;
  const scale = 2; // 2x for Retina/high-res

  const canvas = document.createElement('canvas');
  canvas.width = w * scale;
  canvas.height = h * scale;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(scale, scale);

  // ─── Background ───
  ctx.fillStyle = createGradient(ctx, w, h, template.colors);
  ctx.fillRect(0, 0, w, h);

  // ─── Decorative Elements ───
  drawOrbs(ctx, w, h, template.accentColor);
  drawGrid(ctx, w, h);

  // ─── Decorative quotation mark ───
  const qMarkSize = Math.min(w, h) * 0.35;
  ctx.font = `900 ${qMarkSize}px serif`;
  ctx.fillStyle = template.accentColor + '08';
  ctx.textAlign = 'center';
  ctx.fillText('"', w * 0.5, h * 0.38);

  // ─── Layout calculations ───
  const padding = w * 0.1;
  const maxTextWidth = w - padding * 2;
  const isStory = aspect === 'story';
  const isWide = aspect === 'wide';

  // ─── Category pill ───
  if (quote.category) {
    const pillY = isStory ? h * 0.28 : h * 0.25;
    ctx.font = `700 ${w * 0.018}px 'Work Sans', sans-serif`;
    ctx.fillStyle = template.accentColor + '80';
    ctx.textAlign = 'center';
    const catText = quote.category.toUpperCase();
    const catWidth = ctx.measureText(catText).width;

    // Pill background
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    const pillPad = 16;
    const pillH = 28;
    ctx.beginPath();
    ctx.roundRect(w / 2 - catWidth / 2 - pillPad, pillY - pillH / 2, catWidth + pillPad * 2, pillH, 14);
    ctx.fill();

    // Pill text
    ctx.fillStyle = template.accentColor + 'AA';
    ctx.fillText(catText, w / 2, pillY + 5);
  }

  // ─── Quote Text ───
  const quoteFontSize = isWide
    ? Math.min(w * 0.035, 54)
    : Math.min(w * 0.055, 56);
  ctx.font = `700 ${quoteFontSize}px 'Outfit', 'Segoe UI', sans-serif`;
  ctx.fillStyle = template.textColor;
  ctx.textAlign = 'center';
  const lineHeight = quoteFontSize * 1.35;
  const lines = wrapText(ctx, `"${quote.text}"`, maxTextWidth);
  const totalTextH = lines.length * lineHeight;
  const startY = isStory
    ? (h * 0.5 - totalTextH * 0.4)
    : (h * 0.5 - totalTextH * 0.35);

  lines.forEach((line, i) => {
    ctx.fillText(line, w / 2, startY + i * lineHeight);
  });

  // ─── Author ───
  const authorY = startY + totalTextH + (isStory ? 60 : 40);
  ctx.font = `500 ${w * 0.028}px 'Work Sans', 'Segoe UI', sans-serif`;
  ctx.fillStyle = template.textColor + '80';
  ctx.fillText(`— ${quote.author}`, w / 2, authorY);

  // ─── Decorative line ───
  const lineY = authorY + 30;
  ctx.strokeStyle = template.accentColor + '30';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(w * 0.4, lineY);
  ctx.lineTo(w * 0.6, lineY);
  ctx.stroke();

  // ─── Branding watermark ───
  const brandY = isStory ? h * 0.92 : h * 0.9;
  ctx.font = `800 ${w * 0.022}px 'Outfit', sans-serif`;
  ctx.fillStyle = template.textColor + '20';
  ctx.fillText('✦  AURAQUOTE', w / 2, brandY);

  return canvas;
}

export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => blob ? resolve(blob) : reject(new Error('Canvas to blob failed')),
      'image/png',
      1.0
    );
  });
}

export async function downloadQuoteImage(quote: Quote, templateId: TemplateId, aspect: AspectRatio) {
  const canvas = renderQuoteCard(quote, templateId, aspect);
  const blob = await canvasToBlob(canvas);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `auraquote-${quote.author.toLowerCase().replace(/\s+/g, '-')}-${aspect}.png`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function shareQuoteImage(quote: Quote, templateId: TemplateId, aspect: AspectRatio) {
  const canvas = renderQuoteCard(quote, templateId, aspect);
  const blob = await canvasToBlob(canvas);
  const file = new File([blob], 'auraquote.png', { type: 'image/png' });

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    await navigator.share({
      text: `"${quote.text}" — ${quote.author}\n\nvia AuraQuote ✨`,
      files: [file],
    });
    return true;
  }
  return false;
}

export function shareToWhatsApp(quote: Quote) {
  const text = encodeURIComponent(`"${quote.text}"\n— ${quote.author}\n\nvia AuraQuote ✨`);
  window.open(`https://wa.me/?text=${text}`, '_blank');
}

export function shareToX(quote: Quote) {
  const text = encodeURIComponent(`"${quote.text}" — ${quote.author}`);
  window.open(`https://x.com/intent/tweet?text=${text}&hashtags=AuraQuote`, '_blank');
}
