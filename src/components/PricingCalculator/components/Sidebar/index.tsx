// src/components/PricingCalculator/components/Sidebar/index.tsx

import React from 'react';
import { ChevronRight, Package, Image, Ruler, Square } from 'lucide-react';
import ProductSelector from './ProductSelector';
import PaperSelector from './PaperSelector';
import DimensionsInput from './DimensionsInput';
import BorderOptions from './BorderOptions';
import { PriceSection } from '../PriceSection/PriceSection';

interface SidebarProps {
  state: any;
  products: any[];
  papers: any[];
  borderOptions: any[];
  passepartoutOptions: any[];
  onProductChange: (id: string) => void;
  onPaperChange: (id: string) => void;
  onDimensionChange: (dimension: 'width' | 'height', value: string) => void;
  onBorderChange: (size: string) => void;
  onPassepartoutChange: (size: string) => void;
  onQuantityChange: (quantity: number) => void;
  onSectionToggle: (section: string) => void;
  validateDimensions: () => boolean;
  actualImageDimensions: any;
  pricing?: any;
  validation?: any;
}

const Sidebar: React.FC<SidebarProps> = ({
  state,
  products,
  papers,
  borderOptions,
  passepartoutOptions,
  onProductChange,
  onPaperChange,
  onDimensionChange,
  onBorderChange,
  onPassepartoutChange,
  onQuantityChange,
  onSectionToggle,
  validateDimensions,
  actualImageDimensions,
  pricing,
  validation
}) => {
  const {
    productType,
    paperType,
    width,
    height,
    borderSize,
    passepartoutSize,
    quantity,
    expandedSection
  } = state;

  // Determine what options are available
  const hasFrame = productType !== 'print_only';
  const canHaveBorder = productType === 'print_only';
  const canHavePassepartout = productType !== 'print_only' && paperType !== 'canvas';

  const toggleSection = (section: string) => {
    onSectionToggle(section);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="brand-badge">Fine Art Premium</div>
        <h1 className="brand-title">Studio Salvo</h1>
        <p className="brand-subtitle">Configurador de Impressão Museológica</p>
      </div>

      {/* Product Type Section */}
      <div className="config-section">
        <div className="section-header" onClick={() => toggleSection('product')}>
          <div className="section-title">
            <Package className="section-icon" size={20} />
            <span>Tipo de Produto</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span className="section-value">
              {products.find(p => p.id === productType)?.name}
            </span>
            <ChevronRight 
              className={`section-arrow ${expandedSection === 'product' ? 'expanded' : ''}`} 
              size={18} 
            />
          </div>
        </div>
        <div className={`section-content ${expandedSection === 'product' ? 'expanded' : ''}`}>
          <ProductSelector
            products={products}
            selectedProductId={productType}
            paperType={paperType}
            onProductSelect={onProductChange}
          />
        </div>
      </div>

      {/* Paper Type Section */}
      <div className="config-section">
        <div className="section-header" onClick={() => toggleSection('paper')}>
          <div className="section-title">
            <Image className="section-icon" size={20} />
            <span>Tipo de Papel</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span className="section-value">
              {papers.find(p => p.id === paperType)?.name}
            </span>
            <ChevronRight 
              className={`section-arrow ${expandedSection === 'paper' ? 'expanded' : ''}`} 
              size={18} 
            />
          </div>
        </div>
        <div className={`section-content ${expandedSection === 'paper' ? 'expanded' : ''}`}>
          <PaperSelector
            papers={papers}
            selectedPaperId={paperType}
            onPaperSelect={onPaperChange}
          />
        </div>
      </div>

      {/* Dimensions Section */}
      <div className="config-section">
        <div className="section-header" onClick={() => toggleSection('dimensions')}>
          <div className="section-title">
            <Ruler className="section-icon" size={20} />
            <span>Dimensões</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span className="section-value">
              {width && height ? `${width} × ${height} cm` : 'Definir tamanho'}
            </span>
            <ChevronRight 
              className={`section-arrow ${expandedSection === 'dimensions' ? 'expanded' : ''}`} 
              size={18} 
            />
          </div>
        </div>
        <div className={`section-content ${expandedSection === 'dimensions' ? 'expanded' : ''}`}>
          <DimensionsInput
            width={width}
            height={height}
            onDimensionChange={onDimensionChange}
            actualImageDimensions={actualImageDimensions}
            hasFrame={hasFrame}
            canHaveBorder={canHaveBorder}
            canHavePassepartout={canHavePassepartout}
            borderSize={borderSize}
            passepartoutSize={passepartoutSize}
          />
        </div>
      </div>

      {/* White Border Section (only for unframed) */}
      {canHaveBorder && (
        <div className="config-section">
          <div className="section-header" onClick={() => toggleSection('border')}>
            <div className="section-title">
              <Square className="section-icon" size={20} />
              <span>Borda Branca</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span className="section-value">
                {borderOptions.find(b => b.id.toString() === borderSize)?.name}
              </span>
              <ChevronRight 
                className={`section-arrow ${expandedSection === 'border' ? 'expanded' : ''}`} 
                size={18} 
              />
            </div>
          </div>
          <div className={`section-content ${expandedSection === 'border' ? 'expanded' : ''}`}>
            <BorderOptions
              options={borderOptions}
              selectedBorderId={borderSize}
              onBorderSelect={onBorderChange}
            />
          </div>
        </div>
      )}

      {/* Passe-Partout Section (only for framed, not canvas) */}
      {canHavePassepartout && (
        <div className="config-section">
          <div className="section-header" onClick={() => toggleSection('passepartout')}>
            <div className="section-title">
              <Square className="section-icon" size={20} />
              <span>Passe-Partout</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span className="section-value">
                {passepartoutOptions.find(p => p.id.toString() === passepartoutSize)?.name}
              </span>
              <ChevronRight 
                className={`section-arrow ${expandedSection === 'passepartout' ? 'expanded' : ''}`} 
                size={18} 
              />
            </div>
          </div>
          <div className={`section-content ${expandedSection === 'passepartout' ? 'expanded' : ''}`}>
            <BorderOptions
              options={passepartoutOptions}
              selectedBorderId={passepartoutSize}
              onBorderSelect={onPassepartoutChange}
              isPassepartout={true}
            />
          </div>
        </div>
      )}

      {/* Price Section - Now using the new component with real calculations */}
      <PriceSection />
    </div>
  );
};

export default Sidebar;