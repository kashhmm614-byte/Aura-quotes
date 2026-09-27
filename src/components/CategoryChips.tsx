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
    <section className="max-w-4xl mx-auto px-4 mt-12 flex flex-col items-center gap-8 pb-20">
      <button
        onClick={onGenerateNext}
        className="btn-primary"
      >
        <RefreshCw size={18} />
        <span>Generate New Quote</span>
      </button>

      <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer border ${
                isActive
                  ? 'bg-primary text-white border-primary shadow-md'
                  : 'bg-white hover:bg-gray-50 text-muted-foreground hover:text-foreground border-border'
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
