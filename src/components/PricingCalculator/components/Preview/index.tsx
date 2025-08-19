import React from 'react';
import { RotateCw, Image, HelpCircle } from 'lucide-react';
import { PreviewProps } from '../../types';
import { calculateImageDimensions, calculatePreviewDimensions } from '../../../../utils/calculations';

const Preview: React.FC<PreviewProps> = ({
  productType,
  paperType,
  width,
  height,
  borderSize,
  passepartoutSize,
  papers,
  onRotate
}) => {
  // Determine configuration
  const hasGlass = productType === '3';
  const hasFrame = productType !== '1';
  const canHaveBorder = productType === '1';
  const canHavePassepartout = productType !== '1' && paperType !== '3';

  // Calculate actual image dimensions
  const actualImageDimensions = calculateImageDimensions({
    width,
    height,
    hasFrame,
    canHaveBorder,
    canHavePassepartout,
    borderSize,
    passepartoutSize
  });

  // Calculate preview dimensions
  const { previewWidth, previewHeight } = calculatePreviewDimensions(width, height);
  
  // Calculate proportional sizes for preview
  const scale = previewWidth / parseFloat(width);
  const previewImageWidth = actualImageDimensions.width * scale;
  const previewImageHeight = actualImageDimensions.height * scale;
  const previewBorderSize = parseInt(borderSize) * scale;
  const previewPassepartoutSize = parseInt(passepartoutSize) * scale;
  const previewFrameSize = hasFrame ? 2 * scale : 0;

  const selectedPaper = papers.find(p => p.id === paperType);

  return (
    <div className="preview-area">
      <div className="preview-header">
        <span className="preview-title">Visualização ao Vivo</span>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className="view-controls">
            <button className="view-btn active">Frontal</button>
            <button className="view-btn">Ambiente</button>
            <button className="view-btn">Detalhe</button>
          </div>
          <button className="rotate-btn" onClick={onRotate}>
            <RotateCw size={16} />
            Girar
          </button>
        </div>
      </div>

      <div className="preview-content">
        <div className="preview-wrapper">
          <div style={{ position: 'relative' }}>
            {/* Frame (outermost layer) */}
            {hasFrame && (
              <div 
                style={{
                  width: `${previewWidth}px`,
                  height: `${previewHeight}px`,
                  background: '#1a1a1a',
                  position: 'relative',
                  boxShadow: '0 30px 80px rgba(0, 0, 0, 0.5)',
                  padding: `${previewFrameSize}px`
                }}
              >
                {/* Passe-partout or direct image mount */}
                <div 
                  style={{
                    width: '100%',
                    height: '100%',
                    background: canHavePassepartout && parseInt(passepartoutSize) > 0 
                      ? '#fafafa' 
                      : selectedPaper?.color || 'white',
                    position: 'relative',
                    padding: canHavePassepartout && parseInt(passepartoutSize) > 0 
                      ? `${previewPassepartoutSize}px` 
                      : '0',
                    boxShadow: canHavePassepartout && parseInt(passepartoutSize) > 0 
                      ? 'inset 0 2px 5px rgba(0, 0, 0, 0.1)' 
                      : 'none'
                  }}
                >
                  {/* Image */}
                  <div 
                    style={{
                      width: '100%',
                      height: '100%',
                      background: selectedPaper?.color || 'white',
                      position: 'relative'
                    }}
                  >
                    <div style={{
                      width: '100%',
                      height: '100%',
                      background: `linear-gradient(135deg, #1a7a8c 0%, #0a5a6c 50%, #1a7a8c 100%)`,
                      position: 'relative'
                    }}>
                      {/* Placeholder for actual image */}
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: 'white',
                        textAlign: 'center',
                        opacity: 0.3
                      }}>
                        <Image size={64} />
                        <div style={{ 
                          marginTop: '1.5rem', 
                          fontSize: '0.875rem', 
                          fontWeight: 300, 
                          letterSpacing: '0.05em' 
                        }}>
                          Sua imagem aqui
                        </div>
                      </div>
                      {hasGlass && <div className="glass-effect" />}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Unframed print with optional white border */}
            {!hasFrame && (
              <div 
                style={{
                  width: `${previewWidth}px`,
                  height: `${previewHeight}px`,
                  background: selectedPaper?.color || 'white',
                  position: 'relative',
                  boxShadow: '0 30px 80px rgba(0, 0, 0, 0.5)',
                  padding: canHaveBorder && parseInt(borderSize) > 0 
                    ? `${previewBorderSize}px` 
                    : '0'
                }}
              >
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: `linear-gradient(135deg, #1a7a8c 0%, #0a5a6c 50%, #1a7a8c 100%)`,
                  position: 'relative'
                }}>
                  {/* Placeholder for actual image */}
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: 'white',
                    textAlign: 'center',
                    opacity: 0.3
                  }}>
                    <Image size={64} />
                    <div style={{ 
                      marginTop: '1.5rem', 
                      fontSize: '0.875rem', 
                      fontWeight: 300, 
                      letterSpacing: '0.05em' 
                    }}>
                      Sua imagem aqui
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Dimension display */}
          <div className="preview-dimensions">
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>Tamanho total:</strong> {width} × {height} cm
            </div>
            {(actualImageDimensions.width !== parseFloat(width) || 
              actualImageDimensions.height !== parseFloat(height)) && (
              <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>
                <strong>Tamanho da imagem:</strong> {actualImageDimensions.width.toFixed(1)} × {actualImageDimensions.height.toFixed(1)} cm
              </div>
            )}
            {(actualImageDimensions.width < 20 || actualImageDimensions.height < 20) && 
              actualImageDimensions.width > 0 && (
              <div style={{ fontSize: '0.7rem', color: '#ff6b6b', marginTop: '0.5rem' }}>
                ⚠ Mínimo da imagem: 20×20cm
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Help Button */}
      <div className="help-button">
        <HelpCircle size={24} color="rgba(255, 255, 255, 0.4)" />
      </div>
    </div>
  );
};

export default Preview;