// src/core/types.ts

import { ProductType, PaperType, BorderSize, PassepartoutSize, RushOrder } from './constants';

// Product Definition
export interface Product {
  id: ProductType;
  name: string;
  description?: string;
  available: boolean;
  restrictions?: {
    incompatiblePapers?: PaperType[];
    maxDimensions?: { width: number; height: number };
  };
}

// Paper Definition
export interface Paper {
  id: PaperType;
  name: string;
  weight: string;
  finish: string;
  color: string;
  texture?: string;
  pricePerM2: number;
}

// Calculator State
export interface CalculatorState {
  // Product Configuration
  productType: ProductType;
  paperType: PaperType;
  
  // Dimensions (in cm)
  dimensions: {
    width: number;
    height: number;
  };
  
  // Options
  borderSize: BorderSize;
  passepartoutSize: PassepartoutSize;
  
  // Order Details
  quantity: number;
  rushOrder: RushOrder;
  
  // UI State
  expandedSection: string | null;
  
  // File Upload (for future use)
  uploadedFile?: UploadedFile;
}

// Uploaded File
export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  dimensions?: {
    width: number;
    height: number;
    dpi: number;
  };
  colorSpace?: string;
  uploadedAt: Date;
}

// Image Dimensions Calculation Result
export interface ImageDimensions {
  totalWidth: number;
  totalHeight: number;
  imageWidth: number;
  imageHeight: number;
  frameWidth: number;
  passepartoutWidth: number;
  borderWidth: number;
}

// Validation Result
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  code: string;
  message: string;
}

export interface ValidationWarning {
  field: string;
  code: string;
  message: string;
}

// Pricing Calculation Result
export interface PricingResult {
  basePrice: number;
  productMultiplier: number;
  borderCost: number;
  passepartoutCost: number;
  unitPrice: number;
  subtotal: number;
  volumeDiscount: number;
  rushCharge: number;
  total: number;
  savings: number;
  formattedPrices: {
    unitPrice: string;
    subtotal: string;
    volumeDiscount: string;
    rushCharge: string;
    total: string;
    savings: string;
  };
}

// Order Summary
export interface OrderSummary {
  id: string;
  configuration: CalculatorState;
  pricing: PricingResult;
  validation: ValidationResult;
  estimatedDelivery: Date;
  createdAt: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Cart Item
export interface CartItem {
  id: string;
  configuration: CalculatorState;
  pricing: PricingResult;
  quantity: number;
  addedAt: Date;
}

// Customer Information
export interface Customer {
  id: string;
  email: string;
  name: string;
  company?: string;
  taxId?: string;
  phone?: string;
  isB2B: boolean;
  discountTier?: 'standard' | 'professional' | 'premium';
}