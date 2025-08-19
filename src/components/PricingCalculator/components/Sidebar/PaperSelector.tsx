import React from 'react';
import { Paper } from '../../../types';

interface PaperSelectorProps {
  papers: Paper[];
  selectedPaperId: string;
  onPaperSelect: (id: string) => void;
}

const PaperSelector: React.FC<PaperSelectorProps> = ({
  papers,
  selectedPaperId,
  onPaperSelect
}) => {
  return (
    <div>
      {papers.map((paper) => {
        const isSelected = selectedPaperId === paper.id;
        
        return (
          <div
            key={paper.id}
            className={`paper-item ${isSelected ? 'selected' : ''}`}
            onClick={() => onPaperSelect(paper.id)}
          >
            <div className="paper-header">
              <div>
                <div className="paper-name">{paper.name}</div>
                <div className="paper-weight">{paper.weight}</div>
              </div>
              <div 
                className="paper-swatch" 
                style={{ background: paper.color }}
              />
            </div>
            <span className="paper-finish">{paper.finish}</span>
          </div>
        );
      })}
    </div>
  );
};

export default PaperSelector;