import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { QuoteCard } from './components/QuoteCard';
import { CategoryChips } from './components/CategoryChips';
import { Features } from './components/Features';
import { Footer } from './components/Footer';
import { AuthGate } from './components/AuthGate';
import { Toast } from './components/Toast';
import { UserMenu } from './components/UserMenu';
import { CreateModal } from './components/modals/CreateModal';
import { VaultModal } from './components/modals/VaultModal';
import { ExportModal } from './components/modals/ExportModal';
import { NeonModal } from './components/modals/NeonModal';
import { ShortcutsModal } from './components/modals/ShortcutsModal';
import type { Quote, AuraUser, StreakData, ToastMessage, ModalId, ThemeName } from './types';
import { auraDB } from './lib/db';
import { loadSession, saveSession, loginWithDemo, signOut } from './lib/auth';
import { auraNeon } from './lib/neon-client';
import { lithosAudio } from './lib/lithos';

function vibrate(ms = 8) {
  try {
    navigator.vibrate?.(ms);
  } catch {
    /* ignore */
  }
}

export const App: React.FC = () => {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [isDaily, setIsDaily] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isFav, setIsFav] = useState(false);
  const [user, setUser] = useState<AuraUser | null>(null);
  const [streak, setStreak] = useState<StreakData>({
    currentStreak: 1,
    longestStreak: 1,
    lastVisitDate: null,
  });
  const [activeModal, setActiveModal] = useState<ModalId>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [showAuthGate, setShowAuthGate] = useState(false);
  const [neonConfigured, setNeonConfigured] = useState(false);

  const toastTimer = useRef<number | null>(null);

  const showToast = useCallback((message: string, type: ToastMessage['type'] = 'info') => {
    const id = String(Date.now()) + Math.random();
    setToast({ id, message, type });
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 3400);
  }, []);

  const playChime = useCallback((freq = 520) => {
    try {
      lithosAudio.playChime(freq);
    } catch {
      /* audio optional */
    }
  }, []);

  const updateStreak = useCallback(async () => {
    try {
      const next = await auraDB.getStreak();
      setStreak(next);
    } catch {
      /* ignore */
    }
  }, []);

  const loadDaily = useCallback(async () => {
    try {
      const daily = await auraDB.getDailyQuote();
      setCurrentQuote(daily);
      setIsDaily(true);
      if (daily) setIsFav(await auraDB.isFavorite(daily.id));
      await updateStreak();
    } catch (e) {
      console.warn('loadDaily failed', e);
    }
  }, [updateStreak]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await auraDB.init();
      } catch (e) {
        console.error('DB init error', e);
      }
      const session = loadSession();
      if (session) setUser(session);

      await auraNeon.init();
      if (!cancelled) setNeonConfigured(auraNeon.isConfigured);

      if (auraNeon.isConfigured) {
        try {
          const cloud = await auraNeon.getQuotes();
        } catch { }
      }
      if (!cancelled) await loadDaily();
    })();
    return () => { cancelled = true; };
  }, [loadDaily]);

  const handleAuth = useCallback(
    (u: AuraUser) => {
      setUser(u);
      setShowAuthGate(false);
      showToast(`Welcome, ${u.givenName || u.name}!`, 'success');
      playChime(660);
      void auraNeon.syncUser(u);
    },
    [showToast, playChime]
  );

  const handleDemoLogin = useCallback(() => {
    const u = loginWithDemo();
    handleAuth(u);
  }, [handleAuth]);

  const handleSignOut = useCallback(() => {
    signOut();
    setUser(null);
    showToast('You have signed out.', 'info');
  }, [showToast]);

  const requireAuth = useCallback((): boolean => {
    if (!user) {
      setShowAuthGate(true);
      return false;
    }
    return true;
  }, [user]);

  const handleGenerateNext = useCallback(
    async (category = activeCategory) => {
      if (!requireAuth()) return;
      playChime(560);
      const next = await auraDB.getRandomQuote(category, currentQuote?.id);
      setCurrentQuote(next);
      setIsDaily(false);
      if (next) setIsFav(await auraDB.isFavorite(next.id));
    },
    [activeCategory, currentQuote, playChime, requireAuth]
  );

  const handleSelectCategory = useCallback(
    (cat: string) => {
      setActiveCategory(cat);
      void handleGenerateNext(cat);
    },
    [handleGenerateNext]
  );

  const handleToggleFavorite = useCallback(async () => {
    if (!currentQuote || !requireAuth()) return;
    vibrate(15);
    const next = await auraDB.toggleFavorite(currentQuote.id);
    setIsFav(next);
    playChime(next ? 700 : 400);
    showToast(next ? 'Saved to your Favorites!' : 'Removed from Favorites', 'info');
    if (user) void auraNeon.syncFavorite(user.uid, currentQuote.id, next ? 'add' : 'remove');
  }, [currentQuote, requireAuth, playChime, showToast, user]);

  const handleCopy = useCallback(async () => {
    if (!currentQuote) return;
    vibrate(10);
    try {
      await navigator.clipboard.writeText(`"${currentQuote.text}" — ${currentQuote.author}`);
      playChime(520);
      showToast('Quote copied to clipboard!', 'success');
    } catch {
      showToast('Could not access clipboard.', 'error');
    }
  }, [currentQuote, playChime, showToast]);

  const handleShare = useCallback(() => {
    if (!currentQuote) return;
    vibrate(10);
    const text = `"${currentQuote.text}" — ${currentQuote.author}`;
    if (navigator.share) {
      navigator.share({ title: 'AuraQuote', text, url: window.location.href }).catch(() => void handleCopy());
    } else {
      void handleCopy();
    }
  }, [currentQuote, handleCopy]);

  const handleQuoteCreated = useCallback(
    async (newQuoteData: Partial<Quote>) => {
      if (!requireAuth()) return;
      const created = await auraDB.addQuote(newQuoteData);
      setCurrentQuote(created);
      setIsDaily(false);
      setIsFav(false);
      playChime(800);
      showToast('Quote saved to your vault!', 'success');
      if (user) void auraNeon.insertQuote(created);
      document.getElementById('quoteSection')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    },
    [playChime, requireAuth, showToast, user]
  );

  const handleNavigateSection = useCallback((sectionId: string) => {
    playChime(480);
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [playChime]);

  const handleToggleAudio = useCallback(() => {
    vibrate(8);
    const nowOn = lithosAudio.toggle();
    setIsAudioOn(nowOn);
  }, []);

  const returnToDaily = useCallback(async () => {
    await loadDaily();
    playChime(540);
  }, [loadDaily, playChime]);

  const openModal = useCallback((id: ModalId) => {
    vibrate(8);
    setActiveModal(id);
  }, []);

  const closeModals = useCallback(() => setActiveModal(null), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (document.activeElement as HTMLElement | null)?.tagName ?? '';
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) {
        if (e.key === 'Escape') closeModals();
        return;
      }
      if (e.key === 'Escape') return closeModals();
      if (!user) return;

      if (e.code === 'Space') {
        e.preventDefault();
        void handleGenerateNext();
      } else if (e.key === 'c' || e.key === 'C') {
        void handleCopy();
      } else if (e.key === 'p' || e.key === 'P') {
        openModal('export');
      } else if (e.key === 'f' || e.key === 'F') {
        void handleToggleFavorite();
      } else if (e.key === 'n' || e.key === 'N') {
        openModal('create');
      } else if (e.key === 'v' || e.key === 'V') {
        openModal('vault');
      } else if (e.key === '?') {
        openModal('shortcuts');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeModals, handleCopy, handleGenerateNext, handleToggleFavorite, openModal, user]);

  return (
    <div className="min-h-screen relative flex flex-col">
      <Navbar
        user={user}
        streak={streak}
        isAudioOn={isAudioOn}
        onToggleAudio={handleToggleAudio}
        onOpenCreate={() => { if (requireAuth()) openModal('create'); }}
        onOpenVault={() => openModal('vault')}
        onNavigateSection={handleNavigateSection}
      />

      <div className="fixed top-20 right-4 z-[60] hidden md:block">
        <UserMenu
          user={user}
          theme={'lithos' as ThemeName} // Hardcoded or removed
          onSetTheme={() => {}}
          onSignOut={handleSignOut}
          onOpenNeon={() => openModal('neon')}
          onOpenShortcuts={() => openModal('shortcuts')}
          onReplayReveal={() => {}}
          onShowToast={showToast}
        />
      </div>

      <Hero 
        onStart={() => {
          document.getElementById('quoteSection')?.scrollIntoView({ behavior: 'smooth' });
        }}
        quote={currentQuote} 
      />

      <main id="quoteSection" className="relative z-10 flex-1 w-full pt-12 pb-8 px-4 sm:px-8 max-w-7xl mx-auto flex flex-col">
        <QuoteCard
          quote={currentQuote}
          isDaily={isDaily}
          isFavorite={isFav}
          onToggleFavorite={handleToggleFavorite}
          onCopy={handleCopy}
          onOpenExport={() => openModal('export')}
          onShare={handleShare}
          onReturnToDaily={returnToDaily}
        />
        
        <CategoryChips
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
          onGenerateNext={() => handleGenerateNext(activeCategory)}
        />
      </main>

      <Features />
      <Footer />

      <AuthGate
        isOpen={showAuthGate}
        user={user}
        onAuth={handleAuth}
        onDemoLogin={handleDemoLogin}
        onClose={() => setShowAuthGate(false)}
      />

      <CreateModal
        isOpen={activeModal === 'create'}
        onClose={closeModals}
        onQuoteCreated={handleQuoteCreated}
        onShowToast={showToast}
      />

      <VaultModal
        isOpen={activeModal === 'vault'}
        onClose={closeModals}
        onSelectQuote={(q) => {
          setCurrentQuote(q);
          setIsDaily(false);
          void auraDB.isFavorite(q.id).then(setIsFav);
          document.getElementById('quoteSection')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <ExportModal
        isOpen={activeModal === 'export'}
        quote={currentQuote}
        onClose={closeModals}
        onShowToast={showToast}
      />

      <NeonModal
        isOpen={activeModal === 'neon'}
        onClose={closeModals}
        onShowToast={(msg, type) => {
          showToast(msg, type);
          setNeonConfigured(auraNeon.isConfigured);
        }}
      />

      <ShortcutsModal isOpen={activeModal === 'shortcuts'} onClose={closeModals} />
      <Toast toast={toast} />
    </div>
  );
};

export default App;
