// Type definitions for the Pricing Calculator

export interface Product {
  id: string;
  name: string;
  icon: string;
  price: string;
  note?: string;
}

export interface Paper {
  id: string;
  name: string;
  weight: string;
  finish: string;
  color: string;
}

export interface BorderOption {
  id: string;
  name: string;
  value: number;
}

export interface PassepartoutOption {
  id: string;
  name: string;
  value: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface CalculatorState {
  productType: string;
  paperType: string;
  width: string;
  height: string;
  borderSize: string;
  passepartoutSize: string;
  quantity: number;
  expandedSection: string | null;
}

export type SectionType = 'product' | 'paper' | 'dimensions' | 'border' | 'passepartout' | null;

export interface PreviewProps {
  productType: string;
  paperType: string;
  width: string;
  height: string;
  borderSize: string;
  passepartoutSize: string;
  papers: Paper[];
  onRotate: () => void;
}

export interface SidebarProps {
  state: CalculatorState;
  products: Product[];
  papers: Paper[];
  borderOptions: BorderOption[];
  passepartoutOptions: PassepartoutOption[];
  onProductChange: (id: string) => void;
  onPaperChange: (id: string) => void;
  onDimensionChange: (dimension: 'width' | 'height', value: string) => void;
  onBorderChange: (size: string) => void;
  onPassepartoutChange: (size: string) => void;
  onQuantityChange: (quantity: number) => void;
  onSectionToggle: (section: string) => void;
  validateDimensions: () => boolean;
  actualImageDimensions: ImageDimensions;
}