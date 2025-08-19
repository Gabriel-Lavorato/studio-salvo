// src/data/papers.ts

import { Paper } from '../core/types';
import { PaperType, BorderSize, PassepartoutSize, PRICING } from '../core/constants';

export const papers: Paper[] = [
  { 
    id: PaperType.CANSON_PHOTO,
    name: 'Canson Fotográfico',
    weight: '200gr/m²',
    finish: 'Matte',
    color: '#f5f5f0',
    pricePerM2: PRICING.BASE_PRICES_PER_M2[PaperType.CANSON_PHOTO]
  },
  { 
    id: PaperType.CANSON_RAG,
    name: 'Canson RAG 100% Algodão',
    weight: '310gr/m²',
    finish: 'Museum',
    color: '#fafaf5',
    pricePerM2: PRICING.BASE_PRICES_PER_M2[PaperType.CANSON_RAG]
  },
  { 
    id: PaperType.CANVAS,
    name: 'Canson Canvas Museum Pro',
    weight: '385gr/m²',
    finish: 'Textured',
    color: '#fffef8',
    pricePerM2: PRICING.BASE_PRICES_PER_M2[PaperType.CANVAS]
  }
];

export const borderOptions = [
  { id: BorderSize.NONE, name: 'Sem borda', value: BorderSize.NONE },
  { id: BorderSize.SMALL, name: '2 cm', value: BorderSize.SMALL },
  { id: BorderSize.MEDIUM, name: '3 cm', value: BorderSize.MEDIUM },
  { id: BorderSize.LARGE, name: '5 cm', value: BorderSize.LARGE }
];

export const passepartoutOptions = [
  { id: PassepartoutSize.NONE, name: 'Sem Passe-Partout', value: PassepartoutSize.NONE },
  { id: PassepartoutSize.SMALL, name: '5 cm', value: PassepartoutSize.SMALL },
  { id: PassepartoutSize.MEDIUM, name: '7 cm', value: PassepartoutSize.MEDIUM },
  { id: PassepartoutSize.LARGE, name: '10 cm', value: PassepartoutSize.LARGE }
];