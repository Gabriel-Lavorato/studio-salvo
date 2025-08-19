import React from 'react';
import { BorderOption } from '../../../types';

interface BorderOptionsProps {
  options: BorderOption[];
  selectedBorderId: string;
  onBorderSelect: (id: string) => void;
  isPassepartout?: boolean;
}

const BorderOptions: React.FC<BorderOptionsProps> = ({
  options,
  selectedBorderId,
  onBorderSelect,
  isPassepartout = false
}) => {
  return (
    <div className="border-options">
      {options.map((option) => {
        const isSelected = selectedBorderId === option.id;
        
        return (
          <div
            key={option.id}
            className={`border-option ${isSelected ? 'selected' : ''}`}
            onClick={() => onBorderSelect(option.id)}
          >
            {option.name}
          </div>
        );
      })}
    </div>
  );
};

export default BorderOptions;