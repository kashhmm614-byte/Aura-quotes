import React from 'react';
import type { AuraUser, ThemeName } from '../types';

interface UserMenuProps {
  user: AuraUser | null;
  theme: ThemeName;
  onSetTheme: (t: ThemeName) => void;
  onSignOut: () => void;
  onOpenNeon: () => void;
  onOpenShortcuts: () => void;
  onReplayReveal: () => void;
  onShowToast: (msg: string, type: 'info' | 'success' | 'error') => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({
  user,
  onSignOut,
  onOpenNeon,
  onOpenShortcuts,
}) => {
  return (
    <div className="border border-white/20 bg-black p-4 flex flex-col gap-4 min-w-[200px]">
      <div className="text-xs uppercase tracking-widest text-white/50 pb-2 border-b border-white/20">
        System Menu
      </div>
      
      <div className="flex flex-col gap-2">
        <button onClick={onOpenNeon} className="text-left text-xs uppercase tracking-widest hover:text-white/50 transition-colors">
          Database Status
        </button>
        <button onClick={onOpenShortcuts} className="text-left text-xs uppercase tracking-widest hover:text-white/50 transition-colors">
          Keyboard Controls
        </button>
      </div>

      {user && (
        <div className="pt-2 border-t border-white/20">
          <button onClick={onSignOut} className="text-left text-xs uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors">
            End Session
          </button>
        </div>
      )}
    </div>
  );
};
