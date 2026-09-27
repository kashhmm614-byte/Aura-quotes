import React from 'react';
import { RefreshCw } from 'lucide-react';

interface CategoryChipsProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  onGenerateNext: () => void;
}

const CATEGORIES = [
  { id: 'all', label: 'All Topics' },
  { id: 'Romance', label: 'Romance' },
  { id: 'Stoicism', label: 'Stoicism' },
  { id: 'Mindfulness', label: 'Mindfulness' },
  { id: 'Motivation', label: 'Motivation' },
  { id: 'Wisdom', label: 'Wisdom' },
  { id: 'Philosophy', label: 'Philosophy' },
  { id: 'Innovation', label: 'Innovation' },
  { id: 'Courage', label: 'Courage' },
];

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  activeCategory,
  onSelectCategory,
  onGenerateNext,
}) => {
  return (
    <section className="max-w-3xl mx-auto px-4 mt-8 flex flex-col items-center gap-8 pb-16">
      <button
        onClick={onGenerateNext}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        <span>Generate New Quote</span>
      </button>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`inline-flex items-center rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                isActive
                  ? 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80'
                  : 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </section>
  );
};
