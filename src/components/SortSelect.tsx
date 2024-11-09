import React from 'react';
import { SortOption } from '../types';

interface SortSelectProps {
  options: SortOption[];
  selectedSort: SortOption;
  onSortChange: (option: SortOption) => void;
}

export function SortSelect({ options, selectedSort, onSortChange }: SortSelectProps) {
  return (
    <select
      value={`${selectedSort.value}-${selectedSort.direction}`}
      onChange={(e) => {
        const option = options.find(
          opt => `${opt.value}-${opt.direction}` === e.target.value
        );
        if (option) onSortChange(option);
      }}
      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      {options.map((option) => (
        <option 
          key={`${option.value}-${option.direction}`}
          value={`${option.value}-${option.direction}`}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
}