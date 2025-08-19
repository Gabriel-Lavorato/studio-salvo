// src/contexts/CalculatorContext.tsx

import React, { createContext, useContext, useReducer, useCallback, useMemo, useEffect } from 'react';
import {
  ProductType,
  PaperType,
  BorderSize,
  PassepartoutSize,
  RushOrder
} from '../core/constants';
import { 
  CalculatorState, 
  PricingResult, 
  ValidationResult,
  ImageDimensions
} from '../core/types';
import { PricingService } from '../services/PricingService';
import { ValidationService } from '../services/ValidationService';

// Action Types
enum ActionType {
  SET_PRODUCT_TYPE = 'SET_PRODUCT_TYPE',
  SET_PAPER_TYPE = 'SET_PAPER_TYPE',
  SET_DIMENSIONS = 'SET_DIMENSIONS',
  SET_BORDER_SIZE = 'SET_BORDER_SIZE',
  SET_PASSEPARTOUT_SIZE = 'SET_PASSEPARTOUT_SIZE',
  SET_QUANTITY = 'SET_QUANTITY',
  SET_RUSH_ORDER = 'SET_RUSH_ORDER',
  SET_EXPANDED_SECTION = 'SET_EXPANDED_SECTION',
  ROTATE_DIMENSIONS = 'ROTATE_DIMENSIONS',
  RESET_CONFIGURATION = 'RESET_CONFIGURATION',
  LOAD_CONFIGURATION = 'LOAD_CONFIGURATION'
}

// Action Definitions
type Action =
  | { type: ActionType.SET_PRODUCT_TYPE; payload: ProductType }
  | { type: ActionType.SET_PAPER_TYPE; payload: PaperType }
  | { type: ActionType.SET_DIMENSIONS; payload: { width: number; height: number } }
  | { type: ActionType.SET_BORDER_SIZE; payload: BorderSize }
  | { type: ActionType.SET_PASSEPARTOUT_SIZE; payload: PassepartoutSize }
  | { type: ActionType.SET_QUANTITY; payload: number }
  | { type: ActionType.SET_RUSH_ORDER; payload: RushOrder }
  | { type: ActionType.SET_EXPANDED_SECTION; payload: string | null }
  | { type: ActionType.ROTATE_DIMENSIONS }
  | { type: ActionType.RESET_CONFIGURATION }
  | { type: ActionType.LOAD_CONFIGURATION; payload: CalculatorState };

// Initial State
const initialState: CalculatorState = {
  productType: ProductType.PRINT_ONLY,
  paperType: PaperType.CANSON_PHOTO,
  dimensions: {
    width: 60,
    height: 40
  },
  borderSize: BorderSize.NONE,
  passepartoutSize: PassepartoutSize.NONE,
  quantity: 1,
  rushOrder: RushOrder.STANDARD,
  expandedSection: 'product'
};

// Reducer
function calculatorReducer(state: CalculatorState, action: Action): CalculatorState {
  switch (action.type) {
    case ActionType.SET_PRODUCT_TYPE:
      // Reset incompatible options when changing product type
      const newState = { ...state, productType: action.payload };
      
      // If switching to print only, remove passepartout
      if (action.payload === ProductType.PRINT_ONLY) {
        newState.passepartoutSize = PassepartoutSize.NONE;
      }
      
      // If switching from print only, remove border
      if (state.productType === ProductType.PRINT_ONLY && action.payload !== ProductType.PRINT_ONLY) {
        newState.borderSize = BorderSize.NONE;
      }
      
      // Canvas cannot have glass
      if (state.paperType === PaperType.CANVAS && action.payload === ProductType.PRINT_FRAME_GLASS) {
        newState.productType = ProductType.PRINT_FRAME;
      }
      
      return newState;

    case ActionType.SET_PAPER_TYPE:
      // Canvas cannot have glass or passepartout
      if (action.payload === PaperType.CANVAS) {
        return {
          ...state,
          paperType: action.payload,
          productType: state.productType === ProductType.PRINT_FRAME_GLASS 
            ? ProductType.PRINT_FRAME 
            : state.productType,
          passepartoutSize: PassepartoutSize.NONE
        };
      }
      return { ...state, paperType: action.payload };

    case ActionType.SET_DIMENSIONS:
      return {
        ...state,
        dimensions: {
          width: Math.max(1, action.payload.width),
          height: Math.max(1, action.payload.height)
        }
      };

    case ActionType.SET_BORDER_SIZE:
      return { ...state, borderSize: action.payload };

    case ActionType.SET_PASSEPARTOUT_SIZE:
      return { ...state, passepartoutSize: action.payload };

    case ActionType.SET_QUANTITY:
      return { ...state, quantity: Math.max(1, action.payload) };

    case ActionType.SET_RUSH_ORDER:
      return { ...state, rushOrder: action.payload };

    case ActionType.SET_EXPANDED_SECTION:
      return { ...state, expandedSection: action.payload };

    case ActionType.ROTATE_DIMENSIONS:
      return {
        ...state,
        dimensions: {
          width: state.dimensions.height,
          height: state.dimensions.width
        }
      };

    case ActionType.RESET_CONFIGURATION:
      return initialState;

    case ActionType.LOAD_CONFIGURATION:
      return action.payload;

    default:
      return state;
  }
}

// Context Interface
interface CalculatorContextValue {
  // State
  state: CalculatorState;
  pricing: PricingResult;
  validation: ValidationResult;
  imageDimensions: ImageDimensions;
  
  // Actions
  setProductType: (type: ProductType) => void;
  setPaperType: (type: PaperType) => void;
  setDimensions: (width: number, height: number) => void;
  setBorderSize: (size: BorderSize) => void;
  setPassepartoutSize: (size: PassepartoutSize) => void;
  setQuantity: (quantity: number) => void;
  setRushOrder: (order: RushOrder) => void;
  setExpandedSection: (section: string | null) => void;
  rotateDimensions: () => void;
  resetConfiguration: () => void;
  loadConfiguration: (config: CalculatorState) => void;
  
  // Computed values
  canHaveBorder: boolean;
  canHavePassepartout: boolean;
  hasFrame: boolean;
  estimatedDelivery: Date;
  formattedDelivery: string;
}

// Create Context
const CalculatorContext = createContext<CalculatorContextValue | undefined>(undefined);

// Provider Component
export const CalculatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);

  // Memoized computed values
  const hasFrame = useMemo(() => 
    state.productType !== ProductType.PRINT_ONLY, 
    [state.productType]
  );

  const canHaveBorder = useMemo(() => 
    state.productType === ProductType.PRINT_ONLY, 
    [state.productType]
  );

  const canHavePassepartout = useMemo(() => 
    hasFrame && state.paperType !== PaperType.CANVAS,
    [hasFrame, state.paperType]
  );

  // Calculate pricing (memoized)
  const pricing = useMemo(() => 
    PricingService.calculatePricing(state),
    [state]
  );

  // Calculate image dimensions (memoized)
  const imageDimensions = useMemo(() => 
    PricingService.calculateImageDimensions(state),
    [state]
  );

  // Validate configuration (memoized)
  const validation = useMemo(() => 
    ValidationService.validateConfiguration(state),
    [state]
  );

  // Calculate delivery date (memoized)
  const estimatedDelivery = useMemo(() => 
    PricingService.getEstimatedDelivery(state.rushOrder),
    [state.rushOrder]
  );

  const formattedDelivery = useMemo(() => 
    PricingService.formatDeliveryDate(estimatedDelivery),
    [estimatedDelivery]
  );

  // Action creators
  const setProductType = useCallback((type: ProductType) => {
    dispatch({ type: ActionType.SET_PRODUCT_TYPE, payload: type });
  }, []);

  const setPaperType = useCallback((type: PaperType) => {
    dispatch({ type: ActionType.SET_PAPER_TYPE, payload: type });
  }, []);

  const setDimensions = useCallback((width: number, height: number) => {
    dispatch({ type: ActionType.SET_DIMENSIONS, payload: { width, height } });
  }, []);

  const setBorderSize = useCallback((size: BorderSize) => {
    dispatch({ type: ActionType.SET_BORDER_SIZE, payload: size });
  }, []);

  const setPassepartoutSize = useCallback((size: PassepartoutSize) => {
    dispatch({ type: ActionType.SET_PASSEPARTOUT_SIZE, payload: size });
  }, []);

  const setQuantity = useCallback((quantity: number) => {
    dispatch({ type: ActionType.SET_QUANTITY, payload: quantity });
  }, []);

  const setRushOrder = useCallback((order: RushOrder) => {
    dispatch({ type: ActionType.SET_RUSH_ORDER, payload: order });
  }, []);

  const setExpandedSection = useCallback((section: string | null) => {
    dispatch({ type: ActionType.SET_EXPANDED_SECTION, payload: section });
  }, []);

  const rotateDimensions = useCallback(() => {
    dispatch({ type: ActionType.ROTATE_DIMENSIONS });
  }, []);

  const resetConfiguration = useCallback(() => {
    dispatch({ type: ActionType.RESET_CONFIGURATION });
  }, []);

  const loadConfiguration = useCallback((config: CalculatorState) => {
    dispatch({ type: ActionType.LOAD_CONFIGURATION, payload: config });
  }, []);

  // Save to localStorage on state change (optional)
  useEffect(() => {
    const saveState = () => {
      try {
        localStorage.setItem('calculator-state', JSON.stringify(state));
      } catch (error) {
        console.error('Failed to save state:', error);
      }
    };
    
    const debounce = setTimeout(saveState, 500);
    return () => clearTimeout(debounce);
  }, [state]);

  // Load from localStorage on mount (optional)
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('calculator-state');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        loadConfiguration(parsedState);
      }
    } catch (error) {
      console.error('Failed to load saved state:', error);
    }
  }, []);

  const value: CalculatorContextValue = {
    // State
    state,
    pricing,
    validation,
    imageDimensions,
    
    // Actions
    setProductType,
    setPaperType,
    setDimensions,
    setBorderSize,
    setPassepartoutSize,
    setQuantity,
    setRushOrder,
    setExpandedSection,
    rotateDimensions,
    resetConfiguration,
    loadConfiguration,
    
    // Computed values
    canHaveBorder,
    canHavePassepartout,
    hasFrame,
    estimatedDelivery,
    formattedDelivery
  };

  return (
    <CalculatorContext.Provider value={value}>
      {children}
    </CalculatorContext.Provider>
  );
};

// Custom hook to use the context
export const useCalculator = () => {
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error('useCalculator must be used within a CalculatorProvider');
  }
  return context;
};