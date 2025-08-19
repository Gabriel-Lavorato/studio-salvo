import React from 'react';
import { Check } from 'lucide-react';
import { Product } from '../../../types';

interface ProductSelectorProps {
  products: Product[];
  selectedProductId: string;
  paperType: string;
  onProductSelect: (id: string) => void;
}

const ProductSelector: React.FC<ProductSelectorProps> = ({
  products,
  selectedProductId,
  paperType,
  onProductSelect
}) => {
  // Check if a product should be disabled
  const isProductDisabled = (productId: string) => {
    // Product with glass (id: '3') is not available for Canvas (paperType: '3')
    return productId === '3' && paperType === '3';
  };

  return (
    <div className="option-list">
      {products.map((product) => {
        const isDisabled = isProductDisabled(product.id);
        const isSelected = selectedProductId === product.id;
        
        return (
          <div
            key={product.id}
            className={`option-item ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
            onClick={() => {
              if (!isDisabled) {
                onProductSelect(product.id);
              }
            }}
          >
            <div className="option-info">
              <div className="option-name">{product.name}</div>
              {product.note && (
                <div className="option-note">{product.note}</div>
              )}
            </div>
            <div className="option-check">
              {isSelected && <Check size={14} color="white" />}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductSelector;