
import React from 'react';

interface ColorPaletteProps {
  colors: string[];
  selectedColor: string | null;
  onSelectColor: (color: string) => void;
}

export const ColorPalette: React.FC<ColorPaletteProps> = ({ colors, selectedColor, onSelectColor }) => {
  return (
    <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
      {colors.map((color) => (
        <button
          key={color}
          onClick={() => onSelectColor(color)}
          className={`w-full aspect-square rounded-full cursor-pointer transform hover:scale-110 transition-transform duration-200 ${
            selectedColor === color ? 'ring-2 ring-offset-2 ring-offset-gray-800 ring-purple-400' : ''
          }`}
          style={{ backgroundColor: color }}
          aria-label={`Select color ${color}`}
        />
      ))}
    </div>
  );
};
