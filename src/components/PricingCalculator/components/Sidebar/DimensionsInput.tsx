import React from 'react';
import { ImageDimensions } from '../../../types';

interface DimensionsInputProps {
  width: string;
  height: string;
  onDimensionChange: (dimension: 'width' | 'height', value: string) => void;
  actualImageDimensions: ImageDimensions;
  hasFrame: boolean;
  canHaveBorder: boolean;
  canHavePassepartout: boolean;
  borderSize: string;
  passepartoutSize: string;
}

const DimensionsInput: React.FC<DimensionsInputProps> = ({
  width,
  height,
  onDimensionChange,
  actualImageDimensions,
  hasFrame,
  canHaveBorder,
  canHavePassepartout,
  borderSize,
  passepartoutSize
}) => {
  const handlePresetClick = (w: string, h: string) => {
    onDimensionChange('width', w);
    onDimensionChange('height', h);
  };

  // Calculate minimum total size needed
  const getMinTotalSize = () => {
    let min = 20; // Base minimum for image
    if (hasFrame) {
      min += 4; // Add frame thickness
      if (canHavePassepartout && parseInt(passepartoutSize) > 0) {
        min += parseInt(passepartoutSize) * 2;
      }
    } else if (canHaveBorder && parseInt(borderSize) > 0) {
      min += parseInt(borderSize) * 2;
    }
    return min;
  };

  const minTotalSize = getMinTotalSize();

  return (
    <>
      <div className="dimensions-grid">
        <div className="dimension-group">
          <label className="dimension-label">Largura</label>
          <div className="dimension-input-wrapper">
            <input
              type="number"
              value={width}
              onChange={(e) => onDimensionChange('width', e.target.value)}
              className="dimension-input"
              min="1"
            />
            <span className="dimension-unit">cm</span>
          </div>
        </div>
        <div className="dimension-group">
          <label className="dimension-label">Altura</label>
          <div className="dimension-input-wrapper">
            <input
              type="number"
              value={height}
              onChange={(e) => onDimensionChange('height', e.target.value)}
              className="dimension-input"
              min="1"
            />
            <span className="dimension-unit">cm</span>
          </div>
        </div>
      </div>
      
      {/* Minimum size helper */}
      {minTotalSize > 20 && (
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem',
          background: 'rgba(26, 122, 140, 0.1)',
          border: '1px solid rgba(26, 122, 140, 0.3)',
          borderRadius: '4px',
          fontSize: '0.75rem',
          color: '#1a7a8c',
          lineHeight: '1.4'
        }}>
          ℹ️ Tamanho mínimo da imagem: 20×20cm<br/>
          Com as opções selecionadas, o tamanho total mínimo é <strong>{minTotalSize}×{minTotalSize}cm</strong>
        </div>
      )}
      
      <div className="dimension-presets">
        <button className="preset-btn" onClick={() => handlePresetClick('30', '40')}>
          30×40
        </button>
        <button className="preset-btn" onClick={() => handlePresetClick('50', '70')}>
          50×70
        </button>
        <button className="preset-btn" onClick={() => handlePresetClick('60', '90')}>
          60×90
        </button>
        <button className="preset-btn" onClick={() => handlePresetClick('90', '60')}>
          90×60
        </button>
      </div>
    </>
  );
};

export default DimensionsInput;