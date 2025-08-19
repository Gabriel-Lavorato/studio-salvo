// src/components/PricingCalculator/components/PriceSection/PriceSection.tsx

import React, { memo } from 'react';
import { useCalculator } from '../../../../contexts/CalculatorContext';
import { RushOrder } from '../../../../core/constants';
import { ValidationService } from '../../../../services/ValidationService';
import './PriceSection.css';

export const PriceSection: React.FC = memo(() => {
  const {
    state,
    pricing,
    validation,
    setQuantity,
    setRushOrder,
    formattedDelivery
  } = useCalculator();

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    setQuantity(Math.max(1, value));
  };

  const incrementQuantity = () => {
    setQuantity(state.quantity + 1);
  };

  const decrementQuantity = () => {
    setQuantity(Math.max(1, state.quantity - 1));
  };

  const isValid = validation.isValid;
  const hasErrors = validation.errors.length > 0;
  const hasWarnings = validation.warnings.length > 0;

  return (
    <div className="price-section">
      {/* Validation Messages */}
      {hasErrors && (
        <div className="validation-messages errors">
          <div className="validation-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10" strokeWidth="2"/>
              <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2"/>
              <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2"/>
            </svg>
            <span>Atenção</span>
          </div>
          {validation.errors.map((error, index) => (
            <div key={index} className="validation-message">
              {error.message}
            </div>
          ))}
        </div>
      )}

      {!hasErrors && hasWarnings && (
        <div className="validation-messages warnings">
          <div className="validation-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" strokeWidth="2"/>
              <line x1="12" y1="9" x2="12" y2="13" strokeWidth="2"/>
              <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2"/>
            </svg>
            <span>Avisos</span>
          </div>
          {validation.warnings.map((warning, index) => (
            <div key={index} className="validation-message">
              {warning.message}
            </div>
          ))}
        </div>
      )}

      {/* Pricing Display */}
      <div className="pricing-display">
        {/* Unit Price */}
        <div className="price-row">
          <span className="price-label">Preço Unitário</span>
          <span className="price-value">
            {isValid ? pricing.formattedPrices.unitPrice : '—'}
          </span>
        </div>

        {/* Quantity Selector */}
        <div className="quantity-section">
          <span className="price-label">Quantidade</span>
          <div className="quantity-controls">
            <button 
              className="quantity-btn"
              onClick={decrementQuantity}
              aria-label="Diminuir quantidade"
            >
              −
            </button>
            <input 
              type="number" 
              className="quantity-input" 
              value={state.quantity}
              onChange={handleQuantityChange}
              min="1"
              aria-label="Quantidade"
            />
            <button 
              className="quantity-btn"
              onClick={incrementQuantity}
              aria-label="Aumentar quantidade"
            >
              +
            </button>
          </div>
        </div>

        {/* Subtotal */}
        {state.quantity > 1 && (
          <div className="price-row subtotal">
            <span className="price-label">Subtotal</span>
            <span className="price-value">
              {isValid ? pricing.formattedPrices.subtotal : '—'}
            </span>
          </div>
        )}

        {/* Volume Discount */}
        {pricing.volumeDiscount > 0 && (
          <div className="price-row discount">
            <span className="price-label">
              Desconto por Volume ({state.quantity} un.)
            </span>
            <span className="price-value discount-value">
              {pricing.formattedPrices.volumeDiscount}
            </span>
          </div>
        )}

        {/* Rush Order Selection */}
        <div className="rush-order-section">
          <span className="price-label">Prazo de Entrega</span>
          <div className="rush-options">
            <button
              className={`rush-option ${state.rushOrder === RushOrder.STANDARD ? 'active' : ''}`}
              onClick={() => setRushOrder(RushOrder.STANDARD)}
            >
              <span className="rush-name">Padrão</span>
              <span className="rush-time">7-10 dias</span>
            </button>
            <button
              className={`rush-option ${state.rushOrder === RushOrder.RUSH_72H ? 'active' : ''}`}
              onClick={() => setRushOrder(RushOrder.RUSH_72H)}
            >
              <span className="rush-name">Rápido</span>
              <span className="rush-time">72h (+15%)</span>
            </button>
            <button
              className={`rush-option ${state.rushOrder === RushOrder.RUSH_48H ? 'active' : ''}`}
              onClick={() => setRushOrder(RushOrder.RUSH_48H)}
            >
              <span className="rush-name">Expresso</span>
              <span className="rush-time">48h (+30%)</span>
            </button>
            <button
              className={`rush-option ${state.rushOrder === RushOrder.RUSH_24H ? 'active' : ''}`}
              onClick={() => setRushOrder(RushOrder.RUSH_24H)}
            >
              <span className="rush-name">Urgente</span>
              <span className="rush-time">24h (+50%)</span>
            </button>
          </div>
        </div>

        {/* Rush Charge */}
        {pricing.rushCharge > 0 && (
          <div className="price-row rush-charge">
            <span className="price-label">Taxa de Urgência</span>
            <span className="price-value">
              {pricing.formattedPrices.rushCharge}
            </span>
          </div>
        )}

        {/* Divider */}
        <div className="price-divider" />

        {/* Total Price */}
        <div className="price-row total">
          <span className="price-label">Total</span>
          <span className="price-value total-value">
            {isValid ? pricing.formattedPrices.total : '—'}
          </span>
        </div>

        {/* Savings Display */}
        {pricing.savings > 0 && (
          <div className="savings-badge">
            Você economiza {pricing.formattedPrices.savings}
          </div>
        )}
      </div>

      {/* Price Details */}
      <div className="price-details">
        {isValid ? (
          <>
            <div>Inclui impostos • Frete calculado no checkout</div>
            <div className="delivery-estimate">
              Entrega estimada: <strong>{formattedDelivery}</strong>
            </div>
          </>
        ) : (
          <div>Ajuste as configurações para calcular o preço</div>
        )}
      </div>

      {/* Add to Cart Button */}
      <button 
        className="add-to-cart" 
        disabled={!isValid}
        aria-label="Adicionar ao carrinho"
      >
        {!isValid ? 'Configuração Inválida' : 'Adicionar ao Carrinho'}
      </button>

      {/* Additional Info */}
      <div className="additional-info">
        <button className="info-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="2"/>
            <path d="M12 16v-4" strokeWidth="2"/>
            <path d="M12 8h.01" strokeWidth="2"/>
          </svg>
          Como calculamos o preço?
        </button>
        <button className="info-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M9 11l3 3L22 4" strokeWidth="2"/>
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" strokeWidth="2"/>
          </svg>
          Garantia de qualidade
        </button>
      </div>
    </div>
  );
});

PriceSection.displayName = 'PriceSection';