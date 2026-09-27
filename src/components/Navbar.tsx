import React from 'react';
import { Volume2, VolumeX, Flame, BookOpen, Plus, Box } from 'lucide-react';
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-8 h-14 flex items-center justify-between">
        
        {/* Brand */}
        <button
          onClick={() => onNavigateSection('hero')}
          className="flex items-center gap-2 cursor-pointer focus:outline-none"
        >
          <Box className="w-5 h-5 text-foreground" />
          <span className="font-bold tracking-tight text-foreground">AuraQuote</span>
        </button>

        {/* Center Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => onNavigateSection('hero')}
            className="transition-colors hover:text-foreground/80 text-foreground/60 cursor-pointer"
          >
            Overview
          </button>
          <button
            onClick={() => onNavigateSection('quoteSection')}
            className="transition-colors text-foreground cursor-pointer"
          >
            Daily Quote
          </button>
          <button
            onClick={onOpenVault}
            className="transition-colors hover:text-foreground/80 text-foreground/60 cursor-pointer flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>Vault</span>
          </button>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1 text-sm font-medium text-muted-foreground">
            <Flame className="w-4 h-4 text-orange-500" />
            <span>{streak.currentStreak}d</span>
          </div>

          <button
            onClick={onToggleAudio}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9"
          >
            {isAudioOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenCreate}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Create</span>
          </button>

          {user ? (
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-bold text-secondary-foreground border">
              {user.name.charAt(0).toUpperCase()}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};
