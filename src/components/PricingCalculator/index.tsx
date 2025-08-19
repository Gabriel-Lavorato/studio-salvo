// src/components/PricingCalculator/index.tsx

import React, { useState, useEffect } from 'react';
import { useCalculator } from '../../contexts/CalculatorContext';
import Sidebar from './components/Sidebar';
import Preview from './components/Preview';
import { products } from '../../data/products';
import { papers, borderOptions, passepartoutOptions } from '../../data/papers';
import { BorderSize, PassepartoutSize } from '../../core/constants';
import './print-pricing-calculator.css';

const PricingCalculator: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const {
    state,
    pricing,
    validation,
    imageDimensions,
    setProductType,
    setPaperType,
    setDimensions,
    setBorderSize,
    setPassepartoutSize,
    setQuantity,
    setExpandedSection,
    rotateDimensions,
    canHaveBorder,
    canHavePassepartout,
    hasFrame
  } = useCalculator();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  // Handler functions wrapped to match old interface
  const handleProductChange = (id: string) => {
    const product = products.find(p => p.id === id);
    if (product) {
      setProductType(product.id);
    }
  };

  const handlePaperChange = (id: string) => {
    const paper = papers.find(p => p.id === id);
    if (paper) {
      setPaperType(paper.id);
    }
  };

  const handleDimensionChange = (dimension: 'width' | 'height', value: string) => {
    const numValue = parseFloat(value) || 0;
    if (dimension === 'width') {
      setDimensions(numValue, state.dimensions.height);
    } else {
      setDimensions(state.dimensions.width, numValue);
    }
  };

  const handleBorderChange = (size: string) => {
    setBorderSize(parseInt(size) as BorderSize);
  };

  const handlePassepartoutChange = (size: string) => {
    setPassepartoutSize(parseInt(size) as PassepartoutSize);
  };

  const handleQuantityChange = (quantity: number) => {
    setQuantity(quantity);
  };

  const handleSectionToggle = (section: string) => {
    setExpandedSection(state.expandedSection === section ? null : section);
  };

  // Convert state to old format for compatibility
  const compatState = {
    productType: state.productType,
    paperType: state.paperType,
    width: state.dimensions.width.toString(),
    height: state.dimensions.height.toString(),
    borderSize: state.borderSize.toString(),
    passepartoutSize: state.passepartoutSize.toString(),
    quantity: state.quantity,
    expandedSection: state.expandedSection
  };

  return (
    <>
      {!isLoaded && <div className="loading-screen" />}
      
      <div className="configurator-container">
        <div className="bg-gradient"></div>
        
        <Sidebar
          state={compatState}
          products={products}
          papers={papers}
          borderOptions={borderOptions}
          passepartoutOptions={passepartoutOptions}
          onProductChange={handleProductChange}
          onPaperChange={handlePaperChange}
          onDimensionChange={handleDimensionChange}
          onBorderChange={handleBorderChange}
          onPassepartoutChange={handlePassepartoutChange}
          onQuantityChange={handleQuantityChange}
          onSectionToggle={handleSectionToggle}
          validateDimensions={() => validation.isValid}
          actualImageDimensions={{
            width: imageDimensions.imageWidth,
            height: imageDimensions.imageHeight
          }}
          pricing={pricing}
          validation={validation}
        />

        <Preview
          productType={state.productType}
          paperType={state.paperType}
          width={state.dimensions.width.toString()}
          height={state.dimensions.height.toString()}
          borderSize={state.borderSize.toString()}
          passepartoutSize={state.passepartoutSize.toString()}
          papers={papers}
          onRotate={rotateDimensions}
        />
      </div>
    </>
  );
};

export default PricingCalculator;