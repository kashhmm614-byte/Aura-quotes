import React, { useState } from 'react';
import { Volume2, VolumeX, Flame, BookOpen, Plus, Compass } from 'lucide-react';
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
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-8 py-3.5 sm:py-4 bg-white/70 backdrop-blur-xl border-b border-border text-foreground shadow-sm">
      {/* Brand */}
      <button
        onClick={() => onNavigateSection('hero')}
        className="flex items-center gap-2.5 cursor-pointer text-left focus:outline-none"
      >
        <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center p-1.5 shadow-md shadow-primary/25 border border-primary/40">
          <Compass size={20} />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-foreground text-xl font-bold leading-none">AuraQuote</span>
          </div>
          <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">Daily Inspiration</span>
        </div>
      </button>

      {/* Center Nav Pills (Desktop) */}
      <div className="hidden md:flex items-center bg-muted/50 border border-border rounded-full px-2 py-1 gap-1 text-sm font-medium">
        <button
          onClick={() => onNavigateSection('hero')}
          className="px-4 py-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-white transition-all cursor-pointer"
        >
          Overview
        </button>
        <button
          onClick={() => onNavigateSection('quoteSection')}
          className="px-4 py-1.5 rounded-full bg-white text-primary border border-border shadow-sm cursor-pointer"
        >
          Daily Quote
        </button>
        <button
          onClick={onOpenVault}
          className="px-4 py-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-white transition-all cursor-pointer flex items-center gap-2"
        >
          <BookOpen size={14} />
          <span>Vault</span>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Streak Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-xs font-semibold text-orange-600">
          <Flame size={14} />
          <span>{streak.currentStreak}d Streak</span>
        </div>

        {/* Audio Toggle */}
        <button
          onClick={onToggleAudio}
          className={`p-2 rounded-full border transition-all cursor-pointer ${
            isAudioOn
              ? 'bg-primary/10 border-primary text-primary shadow-sm'
              : 'bg-transparent hover:bg-muted border-transparent text-muted-foreground'
          }`}
          title={isAudioOn ? 'Mute Audio' : 'Enable Audio'}
        >
          {isAudioOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>

        {/* Create Quote Button */}
        <button
          onClick={onOpenCreate}
          className="hidden sm:inline-flex items-center gap-1.5 btn-primary text-sm px-4 py-2 shadow-md shadow-accent/20"
        >
          <Plus size={16} />
          <span>Create</span>
        </button>

        {/* User Badge */}
        {user ? (
          <div className="flex items-center gap-2 pl-3 border-l border-border">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-white shadow-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-sm font-semibold text-foreground leading-none">{user.givenName || user.name}</span>
            </div>
          </div>
        ) : (
          <div className="text-[11px] font-semibold px-3 py-1.5 rounded-full bg-muted border border-border text-muted-foreground">
            Guest Mode
          </div>
        )}
      </div>
    </nav>
  );
};
