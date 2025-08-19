// src/App.tsx

import React from 'react';
import { CalculatorProvider } from './src/contexts/CalculatorContext';
import { ErrorBoundary } from './src/components/ErrorBoundary/ErrorBoundary';
import PricingCalculator from './src/components/PricingCalculator';
import './src/styles/globals.css';

function App() {
  return (
    <ErrorBoundary>
      <CalculatorProvider>
        <PricingCalculator />
      </CalculatorProvider>
    </ErrorBoundary>
  );
}

export default App;