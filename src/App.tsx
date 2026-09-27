import { useState, useEffect, useCallback, useRef } from 'react';
import type { Quote, AuraUser, ModalType, CategoryName } from './types';
import { seedIfEmpty, getRandomQuote, getQuoteOfTheDay, addFavorite, removeFavorite, isFavorite } from './lib/db';
import { getStoredUser } from './lib/auth';
import { speak, stopSpeaking } from './lib/lithos';
import { playSound } from './lib/sounds';
import { useShortcuts } from './hooks/useShortcuts';
import { Volume2, VolumeX, Heart, Share2, Database, Download, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

import Navbar from './components/Navbar';
import CategoryChips from './components/CategoryChips';
import QuoteCard from './components/QuoteCard';
import Toast from './components/Toast';
import AuthGate from './components/modals/AuthGate';
import VaultModal from './components/modals/VaultModal';
import CreateModal from './components/modals/CreateModal';
import ShareModal from './components/modals/ShareModal';

const CATEGORIES: CategoryName[] = [
  'All', 'Wisdom', 'Philosophy', 'Motivation', 'Love', 'Life', 'Success'
];

export default function App() {
  const [history, setHistory] = useState<Quote[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDir, setSlideDir] = useState<'left' | 'right'>('right');
  const [refreshKey, setRefreshKey] = useState(0); // Forces re-render for animation

  const [isLoading, setIsLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [activeCategory, setActiveCategory] = useState<CategoryName>('All');
  const [user, setUser] = useState<AuraUser | null>(null);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [showShare, setShowShare] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [streak, setStreak] = useState(0);

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => setToast({ msg, type });

  // Boot sequence
  useEffect(() => {
    (async () => {
      try {
        await seedIfEmpty();
        const u = getStoredUser();
        if (u) setUser(u);
      } catch (err) {
        console.error("Boot error:", err);
      } finally {
        await loadInitialQuote();
      }
    })();
  }, []);

  const loadInitialQuote = async (cat?: CategoryName) => {
    setIsLoading(true);
    const activeCat = cat ?? activeCategory;
    const isAll = activeCat === 'All';
    const dayQuote = await getQuoteOfTheDay();
    
    if (dayQuote && isAll) {
      setHistory([dayQuote]);
      setCurrentIndex(0);
      setIsFav(await isFavorite(dayQuote.id));
    } else {
      const q = await getRandomQuote(isAll ? undefined : activeCat);
      if (q) {
        setHistory([q]);
        setCurrentIndex(0);
        setIsFav(await isFavorite(q.id));
      }
    }
    setRefreshKey(k => k + 1);
    setIsLoading(false);
  };

  const currentQuote = history[currentIndex] || null;

  const handleNext = async () => {
    stopSpeaking();
    setIsSpeaking(false);
    playSound('whoosh');

    if (currentIndex < history.length - 1) {
      setSlideDir('right');
      setCurrentIndex(i => i + 1);
      const nextQuote = history[currentIndex + 1];
      setIsFav(await isFavorite(nextQuote.id));
      setRefreshKey(k => k + 1);
    } else {
      setIsLoading(true);
      const isAll = activeCategory === 'All';
      const q = await getRandomQuote(isAll ? undefined : activeCategory);
      if (q) {
        setHistory(prev => [...prev, q]);
        setSlideDir('right');
        setCurrentIndex(i => i + 1);
        setIsFav(await isFavorite(q.id));
        setRefreshKey(k => k + 1);
      }
      setIsLoading(false);
    }
  };

  const handlePrev = async () => {
    if (currentIndex > 0) {
      stopSpeaking();
      setIsSpeaking(false);
      playSound('whoosh');
      
      setSlideDir('left');
      setCurrentIndex(i => i - 1);
      const prevQuote = history[currentIndex - 1];
      setIsFav(await isFavorite(prevQuote.id));
      setRefreshKey(k => k + 1);
    }
  };

  const handleCategoryChange = (cat: CategoryName) => {
    playSound('click');
    setActiveCategory(cat);
    loadInitialQuote(cat);
  };

  const handleTTS = () => {
    if (!currentQuote) return;
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      playSound('pop');
      speak(`${currentQuote.text} — by ${currentQuote.author}`);
      setIsSpeaking(true);
    }
  };

  const handleFavorite = async () => {
    if (!currentQuote) return;
    if (!user) { setActiveModal('auth'); return; }
    if (isFav) {
      await removeFavorite(currentQuote.id);
      setIsFav(false);
      playSound('pop');
      showToast('Removed from vault');
    } else {
      await addFavorite(currentQuote.id);
      setIsFav(true);
      playSound('success');
      showToast('Saved to vault ✨');
    }
  };

  const requireAuth = (modal: ModalType) => {
    if (!user) { setActiveModal('auth'); return; }
    setActiveModal(modal);
  };

  useShortcuts({
    onNext: handleNext,
    onFavorite: handleFavorite,
    onSpeak: handleTTS,
    onShare: () => setShowShare(true),
    onEscape: () => {
      setActiveModal(null);
      setShowShare(false);
    }
  });

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = e.targetTouches[0].clientX;
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
    
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">

      {/* ═══ Dynamic Color-Shifting Background ═══ */}
      <div className="dynamic-bg" aria-hidden="true" />

      {/* ═══ Animated Orbs ═══ */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]" aria-hidden="true">
        <div className="orb-1 absolute w-[600px] h-[600px] rounded-full bg-purple-600/[0.10] blur-[160px] -top-60 -left-48" />
        <div className="orb-2 absolute w-[500px] h-[500px] rounded-full bg-cyan-500/[0.07] blur-[140px] top-1/3 -right-44" />
        <div className="orb-3 absolute w-[420px] h-[420px] rounded-full bg-fuchsia-500/[0.05] blur-[130px] -bottom-36 left-1/4" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAxNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-50" />
      </div>

      {/* ═══ Navbar ═══ */}
      <div className="relative z-20">
        <Navbar
          user={user}
          streak={streak}
          onOpenModal={(m) => m === 'vault' || m === 'create' ? requireAuth(m) : setActiveModal(m)}
          onLogout={() => { setUser(null); showToast('Signed out', 'info'); }}
        />
      </div>

      {/* ═══ Hero ═══ */}
      <header className="relative z-10 text-center px-4 pt-4 pb-3 md:pt-8 md:pb-4">
        <div className="max-w-2xl mx-auto animate-fade-in">
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.35em] text-purple-300/30 mb-3">
            Daily Inspiration
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white/90 tracking-tight mb-2.5 text-balance">
            Words that move the <span className="gradient-text animate-breathe inline-block">soul</span>
          </h2>
          <p className="text-white/20 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            1000+ curated quotes · Offline-first · Share as stunning images
          </p>
        </div>
      </header>

      {/* ═══ Category Chips ═══ */}
      <div className="relative z-10 px-4 sm:px-6 md:px-10 mb-2 md:mb-4">
        <div className="max-w-4xl mx-auto">
          <CategoryChips categories={CATEGORIES} active={activeCategory} onChange={handleCategoryChange} />
        </div>
      </div>

      {/* ═══ Highlight Button ═══ */}
      <div className={`relative z-10 flex justify-center mb-4 transition-all duration-500 ease-out ${currentIndex > 0 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <button 
          onClick={() => {
            playSound('whoosh');
            setSlideDir('left');
            setCurrentIndex(0);
            const todayQuote = history[0];
            if (todayQuote) {
              isFavorite(todayQuote.id).then(setIsFav);
            }
            setRefreshKey(k => k + 1);
          }}
          className="glass-pill-btn px-5 py-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/80 hover:text-white group"
        >
          <Sparkles size={14} className="text-amber-400 group-hover:scale-110 transition-transform" />
          Today's Highlight
        </button>
      </div>

      {/* ═══ Main Quote Area ═══ */}
      <main 
        className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 md:px-10 pb-6"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="max-w-5xl mx-auto w-full flex items-center justify-between gap-4 md:gap-6">
          
          <button 
            onClick={handlePrev} 
            disabled={currentIndex === 0} 
            className={`hidden md:flex w-14 h-14 flex-shrink-0 items-center justify-center rounded-full transition-all ${currentIndex === 0 ? 'opacity-20 cursor-not-allowed' : 'glass-btn cursor-pointer'}`}
            aria-label="Previous quote"
          >
            <ChevronLeft className="w-6 h-6 text-white/70" />
          </button>

          <div className="flex-1 max-w-3xl overflow-hidden relative w-full">
            <div key={refreshKey} className={`w-full ${slideDir === 'right' ? 'animate-slide-right' : 'animate-slide-left'}`}>
              <QuoteCard quote={currentQuote} isLoading={isLoading} animKey={refreshKey} />
            </div>
            
            {/* Mobile swipe hint */}
            <div className="md:hidden absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-white/30 tracking-widest uppercase flex gap-4">
              <span>← Swipe</span>
              <span>Swipe →</span>
            </div>
          </div>

          <button 
            onClick={handleNext} 
            className="hidden md:flex w-14 h-14 flex-shrink-0 glass-btn items-center justify-center rounded-full cursor-pointer transition-all"
            aria-label="Next quote"
          >
            <ChevronRight className="w-6 h-6 text-white/70" />
          </button>

        </div>

        {/* ═══ Action Bar ═══ */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-7 md:mt-9 stagger">
          {/* TTS */}
          <button
            onClick={handleTTS}
            className={`h-10 sm:h-12 px-5 sm:px-6 flex items-center justify-center gap-2.5 transition-all duration-300 cursor-pointer group animate-slide-up ${
              isSpeaking
                ? 'bg-purple-500/20 border border-purple-400/25 shadow-lg shadow-purple-500/10 rounded-full'
                : 'glass-pill-btn'
            }`}
            aria-label={isSpeaking ? 'Stop speaking' : 'Listen'}
          >
            {isSpeaking
              ? <VolumeX size={17} className="text-purple-300" />
              : <Volume2 size={17} className="text-white/30 group-hover:text-white/70 transition-colors" />
            }
            <span className="text-xs sm:text-sm font-semibold tracking-wide text-white/70 group-hover:text-white transition-colors">
              {isSpeaking ? 'Stop' : 'Listen'}
            </span>
          </button>

          {/* Favorite */}
          <button
            onClick={handleFavorite}
            className={`h-10 sm:h-12 px-5 sm:px-6 flex items-center justify-center gap-2.5 transition-all duration-300 cursor-pointer group animate-slide-up ${
              isFav
                ? 'bg-pink-500/20 border border-pink-400/25 shadow-lg shadow-pink-500/10 rounded-full'
                : 'glass-pill-btn'
            }`}
            aria-label={isFav ? 'Remove from favorites' : 'Save to favorites'}
          >
            <Heart
              size={17}
              fill={isFav ? 'currentColor' : 'none'}
              className={`transition-all duration-300 ${
                isFav ? 'text-pink-400 scale-110' : 'text-white/30 group-hover:text-white/70'
              }`}
            />
            <span className={`text-xs sm:text-sm font-semibold tracking-wide transition-colors ${isFav ? 'text-pink-300' : 'text-white/70 group-hover:text-white'}`}>
              Favorite
            </span>
          </button>

          {/* Download / Share — opens ShareModal */}
          <button
            onClick={() => setShowShare(true)}
            className="h-10 sm:h-12 px-5 sm:px-6 glass-pill-btn flex items-center justify-center gap-2.5 transition-all cursor-pointer group animate-slide-up"
            aria-label="Download & share"
          >
            <Download size={17} className="text-white/30 group-hover:text-white/70 transition-colors" />
            <span className="text-xs sm:text-sm font-semibold tracking-wide text-white/70 group-hover:text-white transition-colors">Save</span>
          </button>

          {/* Quick Share */}
          <button
            onClick={async () => {
              if (!currentQuote) return;
              const text = `"${currentQuote.text}"\n— ${currentQuote.author}\n\nvia AuraQuote ✨`;
              try {
                if (navigator.share) await navigator.share({ text });
                else { await navigator.clipboard.writeText(text); showToast('Copied to clipboard!', 'info'); }
              } catch { /* cancelled */ }
            }}
            className="h-10 sm:h-12 px-5 sm:px-6 glass-pill-btn flex items-center justify-center gap-2.5 transition-all cursor-pointer group animate-slide-up"
            aria-label="Share text"
          >
            <Share2 size={17} className="text-white/30 group-hover:text-white/70 transition-colors" />
            <span className="text-xs sm:text-sm font-semibold tracking-wide text-white/70 group-hover:text-white transition-colors">Share</span>
          </button>
        </div>
      </main>

      {/* ═══ Footer ═══ */}
      <footer className="relative z-10 px-4 py-5 md:py-7 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[10px] sm:text-xs text-white/15 font-medium tracking-wider uppercase">
            <span>© 2026 AuraQuote</span>
            <span className="text-white/10">·</span>
            <span className="flex items-center gap-1">
              <Database size={10} />
              Neon Postgres
            </span>
          </div>
          <div className="flex items-center gap-3 text-[10px] sm:text-xs text-white/10">
            <span>Offline-first</span>
            <span>·</span>
            <span>Cloud sync</span>
            <span>·</span>
            <span>Share anywhere</span>
          </div>
        </div>
      </footer>

      {/* ═══ Modals ═══ */}
      {activeModal === 'auth' && (
        <AuthGate
          onClose={() => setActiveModal(null)}
          onLogin={(u) => {
            setUser(u);
            setActiveModal(null);
            showToast(`Welcome, ${u.name}! ✨`);
          }}
          onOpenModal={setActiveModal}
        />
      )}
      {activeModal === 'vault' && (
        <VaultModal
          onClose={() => setActiveModal(null)}
          onSelectQuote={(q) => {
            setHistory([q]);
            setCurrentIndex(0);
            setActiveModal(null);
          }}
        />
      )}
      {activeModal === 'create' && (
        <CreateModal
          onClose={() => setActiveModal(null)}
          onCreated={(q) => {
            setHistory([q]);
            setCurrentIndex(0);
            setActiveModal(null);
            showToast('Quote created! ✨');
          }}
        />
      )}
      {showShare && currentQuote && (
        <ShareModal
          quote={currentQuote}
          onClose={() => setShowShare(false)}
        />
      )}

      {/* ═══ Toast ═══ */}
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
