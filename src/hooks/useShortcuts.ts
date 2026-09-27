import { useEffect } from 'react';

interface ShortcutActions {
  onNext?: () => void;
  onFavorite?: () => void;
  onSpeak?: () => void;
  onShare?: () => void;
  onEscape?: () => void;
}

export function useShortcuts(actions: ShortcutActions) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input or textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          actions.onNext?.();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          actions.onFavorite?.();
          break;
        case 's':
        case 'S':
          e.preventDefault();
          actions.onShare?.();
          break;
        case ' ': // Spacebar
          // Only prevent default if we're not on a button, so buttons can still be clicked with space
          if (!(e.target instanceof HTMLButtonElement)) {
            e.preventDefault();
            actions.onSpeak?.();
          }
          break;
        case 'Escape':
          actions.onEscape?.();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [actions]);
}
