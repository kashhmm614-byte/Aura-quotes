import React from 'react';
import { Compass, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-12 px-4 sm:px-8 bg-white border-t border-border text-muted-foreground text-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center shadow-md">
            <Compass size={18} />
          </div>
          <span className="font-semibold text-foreground text-base">AuraQuote</span>
          <span className="text-border mx-2">|</span>
          <span>Daily inspiration for modern minds.</span>
        </div>

        <div className="flex items-center gap-6 font-medium">
          <a href="#hero" className="hover:text-primary transition-colors">Overview</a>
          <a href="#quoteSection" className="hover:text-primary transition-colors">Quotes</a>
          <a href="#features" className="hover:text-primary transition-colors">Features</a>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium">
          <Globe size={14} className="text-primary" />
          <span>Syncing Globally</span>
        </div>
      </div>
    </footer>
  );
};
