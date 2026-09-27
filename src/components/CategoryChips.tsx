import React from 'react';

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
    <section className="max-w-7xl mx-auto px-4 md:px-16 py-12 border-t border-white/20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <button onClick={onGenerateNext} className="btn-secondary">
          Next Quote
        </button>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`text-xs uppercase tracking-widest font-sans transition-opacity hover:opacity-100 ${
                  isActive ? 'opacity-100 font-bold border-b border-white pb-1' : 'opacity-50'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
