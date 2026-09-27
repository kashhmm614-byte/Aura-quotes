import React from 'react';

export const ShortcutsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Space', desc: 'Generate Next Quote' },
    { key: 'C', desc: 'Copy to Clipboard' },
    { key: 'F', desc: 'Save to Vault' },
    { key: 'N', desc: 'Draft New Quote' },
    { key: 'V', desc: 'Open Vault' },
    { key: 'P', desc: 'Export Artwork' },
    { key: 'Esc', desc: 'Close Modal' },
  ];

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
            System
            <br />
            <span className="italic text-white/50">Shortcuts</span>
          </h2>
          <p className="text-sm font-sans tracking-wide text-white/70 max-w-sm">
            Navigate the experience efficiently.
          </p>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/20 pt-8">
          {shortcuts.map((s, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-sm font-sans tracking-widest uppercase text-white/50">{s.desc}</span>
              <kbd className="border border-white/20 px-3 py-1 text-xs font-mono uppercase text-white">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
