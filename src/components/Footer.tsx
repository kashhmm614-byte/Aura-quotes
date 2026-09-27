import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-12 px-4 md:px-16 border-t border-white/20 text-center md:text-left">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs uppercase tracking-widest font-sans text-white/50">
        <div>
          &copy; {new Date().getFullYear()} AURAQUOTE
        </div>
        <div className="flex items-center gap-8">
          <a href="#" className="hover:text-white transition-colors">TERMS</a>
          <a href="#" className="hover:text-white transition-colors">PRIVACY</a>
          <a href="#" className="hover:text-white transition-colors">ABOUT</a>
        </div>
      </div>
    </footer>
  );
};
