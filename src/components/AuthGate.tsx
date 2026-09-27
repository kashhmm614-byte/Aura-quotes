import React, { useEffect, useRef } from 'react';
import type { AuraUser } from '../types';
import { initGoogleGIS } from '../lib/auth';

interface AuthGateProps {
  isOpen: boolean;
  user: AuraUser | null;
  onAuth: (u: AuraUser) => void;
  onDemoLogin: () => void;
  onClose: () => void;
}

export const AuthGate: React.FC<AuthGateProps> = ({
  isOpen,
  user,
  onAuth,
  onDemoLogin,
  onClose
}) => {
  const gisRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen || user) return;
    if (gisRef.current) {
      initGoogleGIS(gisRef.current, (u) => {
        onAuth(u);
        onClose();
      });
    }
  }, [isOpen, user, onAuth, onClose]);

  if (!isOpen || user) return null;

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
            Authentication
            <br />
            <span className="italic text-white/50">Required</span>
          </h2>
          <p className="text-sm font-sans tracking-wide text-white/70 max-w-sm">
            Sign in to unlock your personal vault, save quotes, and track your daily streak.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => {
              onDemoLogin();
              onClose();
            }}
            className="btn-primary w-full"
          >
            Enter Demo Mode
          </button>
          
          <div className="flex items-center gap-4 py-4">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-xs tracking-widest uppercase text-white/50">OR</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>
          
          <div className="flex justify-center min-h-[48px]" ref={gisRef}></div>
        </div>
      </div>
    </div>
  );
};
