import { useState, useRef, useCallback } from 'react';
import type { AuraUser, ModalType } from '../../types';
import { initGoogleAuth, clearStoredUser } from '../../lib/auth';
import { X, LogOut, Sparkles } from 'lucide-react';

interface AuthGateProps {
  onClose: () => void;
  onLogin: (user: AuraUser) => void;
  onOpenModal: (modal: ModalType) => void;
}

export default function AuthGate({ onClose, onLogin }: AuthGateProps) {
  const [loading, setLoading] = useState(true);
  const btnRef = useRef<HTMLDivElement>(null);

  const mountGoogle = useCallback((el: HTMLDivElement | null) => {
    if (!el) return;
    btnRef.current = el;
    // Slight delay to let GIS script load
    const timer = setTimeout(() => {
      initGoogleAuth(el, (user) => {
        onLogin(user);
        onClose();
      });
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [onLogin, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative glass-strong rounded-3xl p-8 md:p-10 max-w-md w-full animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors cursor-pointer" aria-label="Close">
          <X size={20} />
        </button>

        <div className="text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center">
            <Sparkles size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Welcome to AuraQuote</h2>
            <p className="text-white/60 text-sm leading-relaxed">Sign in with Google to save favorites, create custom quotes, and sync across devices.</p>
          </div>

          {/* Google Sign-In Button */}
          <div className="flex justify-center min-h-[48px]">
            {loading && <div className="text-white/40 text-sm animate-pulse">Loading Google Sign-In...</div>}
            <div ref={mountGoogle} className={loading ? 'opacity-0 absolute' : ''} />
          </div>

          <p className="text-white/30 text-xs">Your data stays private • No spam, ever</p>
        </div>
      </div>
    </div>
  );
}

// User avatar button for logged-in state
export function UserAvatar({ user, onLogout }: { user: AuraUser; onLogout: () => void }) {
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    clearStoredUser();
    onLogout();
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 hover:border-purple-400 transition-colors cursor-pointer"
        aria-label="User menu"
      >
        <img src={user.picture} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
      </button>

      {open && (
        <div className="absolute right-0 top-12 glass-strong rounded-2xl p-4 min-w-[220px] animate-scale-in z-50">
          <div className="flex items-center gap-3 mb-3 pb-3 border-b border-white/10">
            <img src={user.picture} alt="" className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">{user.name}</p>
              <p className="text-white/50 text-xs truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-red-400 hover:text-red-300 text-sm py-2 transition-colors cursor-pointer"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
