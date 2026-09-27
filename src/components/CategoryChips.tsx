import React from 'react';
import type { CategoryName } from '../types';

interface CategoryChipsProps {
  categories: CategoryName[];
  active: CategoryName;
  onChange: (cat: CategoryName) => void;
}

const CategoryChips = React.memo(function CategoryChips({ categories, active, onChange }: CategoryChipsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-1">
      {categories.map(cat => {
        const isActive = active === cat;
        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={`
              flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold
              transition-all duration-300 cursor-pointer whitespace-nowrap
              ${isActive
                ? 'bg-gradient-to-r from-purple-500 to-cyan-400 text-white shadow-lg shadow-purple-500/20 scale-105'
                : 'glass-btn text-white/40 hover:text-white/80'
              }
            `}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
});

export default CategoryChips;
