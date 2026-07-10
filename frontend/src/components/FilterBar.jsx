import React from 'react';
import { clsx } from 'clsx';

const FilterBar = ({ currentFilter, onFilterChange }) => {
  const filters = [
    { id: 'all', label: 'Tất cả' },
    { id: 'active', label: 'Đang làm' },
    { id: 'completed', label: 'Đã xong' }
  ];

  return (
    <div className="flex bg-gray-100 p-1 rounded-lg mb-6 w-max">
      {filters.map(filter => (
        <button
          key={filter.id}
          data-testid={`filter-${filter.id}-btn`}
          onClick={() => onFilterChange(filter.id)}
          className={clsx(
            "px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
            currentFilter === filter.id 
              ? "bg-white text-indigo-600 shadow-sm" 
              : "text-gray-600 hover:text-gray-900"
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;
