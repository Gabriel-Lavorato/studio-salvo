// src/data/products.ts

import { Product } from '../core/types';
import { ProductType, PaperType } from '../core/constants';

export const products: Product[] = [
  { 
    id: ProductType.PRINT_ONLY,
    name: 'Somente Impressão',
    description: 'Impressão fine art sem moldura',
    available: true
  },
  { 
    id: ProductType.PRINT_FRAME,
    name: 'Moldura + Impressão',
    description: 'Impressão com moldura profissional',
    available: true,
    restrictions: {
      // Note: Frame without glass is not recommended except for Canvas
    }
  },
  { 
    id: ProductType.PRINT_FRAME_GLASS,
    name: 'Moldura + Vidro + Impressão',
    description: 'Impressão com moldura e vidro museológico',
    available: true,
    restrictions: {
      incompatiblePapers: [PaperType.CANVAS],
      maxDimensions: { width: 180, height: 110 }
    }
  }
];