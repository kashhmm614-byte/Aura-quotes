import React from 'react';
import type { AuraUser, StreakData } from '../types';

interface NavbarProps {
  user: AuraUser | null;
  streak: StreakData;
  isAudioOn: boolean;
  onToggleAudio: () => void;
  onOpenCreate: () => void;
  onOpenVault: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  streak,
  isAudioOn,
  onToggleAudio,
  onOpenCreate,
  onOpenVault,
  onNavigateSection
}) => {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/90 backdrop-blur-sm">
      <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <button
          onClick={() => onNavigateSection('hero')}
          className="font-serif text-2xl font-bold tracking-widest text-white focus:outline-none uppercase"
        >
          AuraQuote
        </button>

        {/* Center Nav */}
        <nav className="hidden md:flex items-center gap-12">
          <button onClick={() => onNavigateSection('hero')} className="nav-link">
            Overview
          </button>
          <button onClick={() => onNavigateSection('quoteSection')} className="nav-link">
            Daily
          </button>
          <button onClick={onOpenVault} className="nav-link">
            Vault
          </button>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-2 nav-link opacity-70">
            <span>STREAK: {streak.currentStreak}D</span>
          </div>

          <button onClick={onToggleAudio} className="nav-link">
            {isAudioOn ? 'SOUND ON' : 'SOUND OFF'}
          </button>

          <button onClick={onOpenCreate} className="nav-link">
            CREATE
          </button>

          {user ? (
            <div className="w-6 h-6 rounded-none bg-white flex items-center justify-center text-xs font-bold text-black font-sans uppercase">
              {user.name.charAt(0)}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};
