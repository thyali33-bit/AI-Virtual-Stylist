
import React from 'react';
import type { SunglassOption } from '../types';

interface AccessorySelectorProps {
  options: SunglassOption[];
  selectedOption: string | null;
  onSelectOption: (prompt: string) => void;
}

export const AccessorySelector: React.FC<AccessorySelectorProps> = ({ options, selectedOption, onSelectOption }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {options.map((option) => (
        <button
          key={option.name}
          onClick={() => onSelectOption(option.prompt)}
          className={`p-3 rounded-lg flex flex-col items-center justify-center space-y-1 cursor-pointer transition-all duration-200 ${
            selectedOption === option.prompt
              ? 'bg-purple-600 text-white ring-2 ring-offset-2 ring-offset-gray-800 ring-purple-400'
              : 'bg-gray-700 hover:bg-gray-600'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            {option.icon}
          </svg>
          <span className="text-xs font-medium">{option.name}</span>
        </button>
      ))}
    </div>
  );
};
