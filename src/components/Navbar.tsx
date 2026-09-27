import type { AuraUser, ModalType } from '../types';
import { UserAvatar } from './modals/AuthGate';
import { Sparkles, BookHeart, Plus, User, Menu, X, Palette, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

interface NavbarProps {
  user: AuraUser | null;
  streak: number;
  onOpenModal: (modal: ModalType) => void;
  onLogout: () => void;
}

const THEMES = [
  { id: 'default', name: 'Aura' },
  { id: 'neon', name: 'Neon' },
  { id: 'dark', name: 'Midnight' },
  { id: 'sunset', name: 'Sunset' },
];

export default function Navbar({ user, streak, onOpenModal, onLogout }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('default');
  const [opacity, setOpacity] = useState(8); // Default 0.08 is 8%

  useEffect(() => {
    const saved = localStorage.getItem('aura-theme') || 'default';
    setCurrentTheme(saved);
    document.documentElement.dataset.theme = saved;
  }, []);

  const changeTheme = (themeId: string) => {
    setCurrentTheme(themeId);
    document.documentElement.dataset.theme = themeId;
    localStorage.setItem('aura-theme', themeId);
    setThemeOpen(false);
  };

  const navAction = (modal: ModalType) => {
    onOpenModal(modal);
    setMobileOpen(false);
  };

  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setOpacity(val);
    const alpha1 = (val / 100).toFixed(3);
    const alpha2 = (val / 400).toFixed(3); // 0.02 is 1/4th of 0.08
    document.documentElement.style.setProperty('--pill-bg-1', `rgba(255, 255, 255, ${alpha1})`);
    document.documentElement.style.setProperty('--pill-bg-2', `rgba(255, 255, 255, ${alpha2})`);
  };

  return (
    <nav className="relative z-30 w-full px-4 sm:px-6 md:px-10 py-4 md:py-5">
      <div className="max-w-7xl mx-auto">
        <div className="glass-card px-4 sm:px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 group" aria-label="AuraQuote home">
            <div className="w-9 h-9 rounded-xl theme-bg flex items-center justify-center shadow-lg theme-shadow group-hover:scale-105 transition-transform">
              <Sparkles size={17} className="text-white" />
            </div>
            <span className="text-lg font-black tracking-tight text-white">
              Aura<span className="gradient-text">Quote</span>
            </span>
          </a>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2 relative">
            
            {/* Theme Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setThemeOpen(!themeOpen)}
                className="glass-btn px-4 py-2.5 flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium cursor-pointer rounded-full mr-2"
                aria-label="Change Theme"
              >
                <Palette size={15} />
              </button>
              
              {themeOpen && (
                <div className="absolute top-full mt-2 left-0 glass-strong p-3 min-w-[200px] z-50 animate-slide-down rounded-2xl flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5 mb-2">
                    {THEMES.map(t => (
                      <button
                        key={t.id}
                        onClick={() => changeTheme(t.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors cursor-pointer ${
                          currentTheme === t.id ? 'bg-white/10 text-white font-bold' : 'text-white/60 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {t.name}
                        {currentTheme === t.id && <Check size={14} className="text-white" />}
                      </button>
                    ))}
                  </div>
                  
                  {/* Transparency Slider */}
                  <div className="px-2 pt-3 border-t border-white/10 flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-white/50 flex justify-between">
                      Glass Opacity <span>{opacity}%</span>
                    </label>
                    <input 
                      type="range" 
                      min="0" 
                      max="30" 
                      value={opacity} 
                      onChange={handleOpacityChange}
                      className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer outline-none slider-thumb"
                    />
                  </div>
                </div>
              )}
            </div>

            {user && (
              <div className="glass-subtle rounded-xl px-3 py-2 flex items-center gap-1.5 mr-1" title={`${streak} day streak!`}>
                <span className="text-orange-400">🔥</span>
                <span className="text-white font-bold text-sm">{streak}</span>
              </div>
            )}
            <button
              onClick={() => navAction('vault')}
              className="glass-btn px-4 py-2.5 flex items-center gap-2 text-white/50 hover:text-white text-sm font-medium cursor-pointer"
            >
              <BookHeart size={15} />
              Vault
            </button>
            <button
              onClick={() => navAction('create')}
              className="glass-btn px-4 py-2.5 flex items-center gap-2 text-white/50 hover:text-white text-sm font-medium cursor-pointer"
            >
              <Plus size={15} />
              Create
            </button>
            <div className="w-px h-6 bg-white/[0.06] mx-1" />
            {user ? (
              <UserAvatar user={user} onLogout={onLogout} />
            ) : (
              <button
                onClick={() => navAction('auth')}
                className="rounded-xl px-5 py-2.5 theme-bg text-white text-sm font-bold hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-2 theme-shadow"
              >
                <User size={15} />
                Sign In
              </button>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-white/60 hover:text-white transition-colors cursor-pointer"
            aria-label="Menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="md:hidden mt-2 glass-strong p-4 animate-slide-down space-y-2">
            <button
              onClick={() => navAction('vault')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/[0.05] transition-all cursor-pointer text-sm font-medium"
            >
              <BookHeart size={18} />
              My Vault
            </button>
            <button
              onClick={() => navAction('create')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/[0.05] transition-all cursor-pointer text-sm font-medium"
            >
              <Plus size={18} />
              Create Quote
            </button>
            <div className="h-px bg-white/[0.06] my-1" />
            {user ? (
              <div className="flex items-center gap-3 px-4 py-3">
                <img src={user.picture} alt="" className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-white text-sm font-medium truncate">{user.name}</p>
                    <span className="text-xs font-bold text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded-md">🔥 {streak}</span>
                  </div>
                  <p className="text-white/40 text-xs truncate">{user.email}</p>
                </div>
                <button onClick={() => { onLogout(); setMobileOpen(false); }} className="text-red-400 text-xs font-medium cursor-pointer">Sign out</button>
              </div>
            ) : (
              <button
                onClick={() => navAction('auth')}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-400 text-white text-sm font-bold cursor-pointer"
              >
                Sign In with Google
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
