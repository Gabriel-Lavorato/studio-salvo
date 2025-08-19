// src/services/PricingService.ts

import {
  ProductType,
  PaperType,
  BorderSize,
  PassepartoutSize,
  RushOrder,
  PRICING,
  DIMENSIONS
} from '../core/constants';
import { PricingResult, CalculatorState, ImageDimensions } from '../core/types';

export class PricingService {
  /**
   * Calculate the actual image dimensions based on frame, border, and passepartout
   */
  static calculateImageDimensions(state: CalculatorState): ImageDimensions {
    const { dimensions, productType, borderSize, passepartoutSize, paperType } = state;
    
    let imageWidth = dimensions.width;
    let imageHeight = dimensions.height;
    let frameWidth = 0;
    let passepartoutWidth = 0;
    let borderWidth = 0;

    const hasFrame = productType !== ProductType.PRINT_ONLY;
    const canHaveBorder = productType === ProductType.PRINT_ONLY;
    const canHavePassepartout = hasFrame && paperType !== PaperType.CANVAS;

    if (hasFrame) {
      // Frame takes 2cm on each side
      frameWidth = DIMENSIONS.FRAME_THICKNESS;
      imageWidth -= frameWidth * 2;
      imageHeight -= frameWidth * 2;

      if (canHavePassepartout && passepartoutSize !== PassepartoutSize.NONE) {
        passepartoutWidth = passepartoutSize;
        imageWidth -= passepartoutWidth * 2;
        imageHeight -= passepartoutWidth * 2;
      }
    } else if (canHaveBorder && borderSize !== BorderSize.NONE) {
      borderWidth = borderSize;
      imageWidth -= borderWidth * 2;
      imageHeight -= borderWidth * 2;
    }

    return {
      totalWidth: dimensions.width,
      totalHeight: dimensions.height,
      imageWidth: Math.max(0, imageWidth),
      imageHeight: Math.max(0, imageHeight),
      frameWidth,
      passepartoutWidth,
      borderWidth
    };
  }

  /**
   * Calculate the complete pricing for a configuration
   */
  static calculatePricing(state: CalculatorState): PricingResult {
    const { dimensions, productType, paperType, borderSize, passepartoutSize, quantity, rushOrder } = state;

    // Convert dimensions to square meters
    const areaInM2 = (dimensions.width / 100) * (dimensions.height / 100);

    // Get base price per m²
    const basePricePerM2 = PRICING.BASE_PRICES_PER_M2[paperType];
    const basePrice = areaInM2 * basePricePerM2;

    // Apply product multiplier
    const productMultiplier = PRICING.PRODUCT_MULTIPLIERS[productType];
    const priceAfterMultiplier = basePrice * productMultiplier;

    // Add border cost
    const borderCost = PRICING.BORDER_COSTS[borderSize as unknown as BorderSize];

    // Add passepartout cost
    const passepartoutCost = PRICING.PASSEPARTOUT_COSTS[passepartoutSize as unknown as PassepartoutSize];

    // Calculate unit price
    let unitPrice = priceAfterMultiplier + borderCost + passepartoutCost;
    
    // Apply minimum order value
    unitPrice = Math.max(unitPrice, PRICING.MINIMUM_ORDER_VALUE);

    // Calculate subtotal
    const subtotal = unitPrice * quantity;

    // Calculate volume discount
    const discountTier = PRICING.VOLUME_DISCOUNTS.find(
      tier => quantity >= tier.min && quantity <= tier.max
    );
    const discountRate = discountTier?.discount || 0;
    const volumeDiscount = subtotal * discountRate;

    // Calculate rush charge
    const rushMultiplier = PRICING.RUSH_MULTIPLIERS[rushOrder];
    const rushCharge = (subtotal - volumeDiscount) * rushMultiplier;

    // Calculate total
    const total = subtotal - volumeDiscount + rushCharge;
    const savings = volumeDiscount;

    return {
      basePrice,
      productMultiplier,
      borderCost,
      passepartoutCost,
      unitPrice,
      subtotal,
      volumeDiscount,
      rushCharge,
      total,
      savings,
      formattedPrices: {
        unitPrice: this.formatCurrency(unitPrice),
        subtotal: this.formatCurrency(subtotal),
        volumeDiscount: volumeDiscount > 0 ? `-${this.formatCurrency(volumeDiscount)}` : this.formatCurrency(0),
        rushCharge: rushCharge > 0 ? `+${this.formatCurrency(rushCharge)}` : this.formatCurrency(0),
        total: this.formatCurrency(total),
        savings: this.formatCurrency(savings)
      }
    };
  }

  /**
   * Format number as Brazilian currency
   */
  static formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }

  /**
   * Get estimated delivery date
   */
  static getEstimatedDelivery(rushOrder: RushOrder): Date {
    const today = new Date();
    const deliveryDate = new Date(today);
    
    switch (rushOrder) {
      case RushOrder.RUSH_24H:
        deliveryDate.setDate(today.getDate() + 1);
        break;
      case RushOrder.RUSH_48H:
        deliveryDate.setDate(today.getDate() + 2);
        break;
      case RushOrder.RUSH_72H:
        deliveryDate.setDate(today.getDate() + 3);
        break;
      case RushOrder.STANDARD:
      default:
        deliveryDate.setDate(today.getDate() + 10); // 7-10 business days
        break;
    }

    // Skip weekends
    if (deliveryDate.getDay() === 0) deliveryDate.setDate(deliveryDate.getDate() + 1);
    if (deliveryDate.getDay() === 6) deliveryDate.setDate(deliveryDate.getDate() + 2);

    return deliveryDate;
  }

  /**
   * Format delivery date for display
   */
  static formatDeliveryDate(date: Date): string {
    return new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }
}