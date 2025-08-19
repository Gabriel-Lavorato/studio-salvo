// src/core/constants.ts

// Product Type Enums
export enum ProductType {
  PRINT_ONLY = 'print_only',
  PRINT_FRAME = 'print_frame',
  PRINT_FRAME_GLASS = 'print_frame_glass'
}

// Paper Type Enums
export enum PaperType {
  CANSON_PHOTO = 'canson_photo',
  CANSON_RAG = 'canson_rag',
  CANVAS = 'canvas'
}

// Border Size Options
export enum BorderSize {
  NONE = 0,
  SMALL = 2,
  MEDIUM = 3,
  LARGE = 5
}

// Passe-partout Size Options
export enum PassepartoutSize {
  NONE = 0,
  SMALL = 5,
  MEDIUM = 7,
  LARGE = 10
}

// Rush Order Options
export enum RushOrder {
  STANDARD = 'standard',
  RUSH_72H = '72h',
  RUSH_48H = '48h',
  RUSH_24H = '24h'
}

// Validation Constants
export const DIMENSIONS = {
  MIN_IMAGE_SIZE: 20, // minimum 20x20cm for image
  MAX_CANVAS_SIZE: 100, // maximum 100cm for canvas min side
  MAX_REGULAR_SIZE: 110, // maximum 110cm for regular paper min side
  MAX_GLASS_LENGTH: 180, // maximum 180cm for glass max side
  MAX_GLASS_WIDTH: 110, // maximum 110cm for glass min side
  FRAME_THICKNESS: 2, // 2cm on each side
  MIN_TOTAL_SIZE: 1,
  MAX_FILE_SIZE: 2 * 1024 * 1024 * 1024, // 2GB
  MIN_DPI: 300
} as const;

// Pricing Constants
export const PRICING = {
  MINIMUM_ORDER_VALUE: 150,
  BASE_PRICES_PER_M2: {
    [PaperType.CANSON_PHOTO]: 800,
    [PaperType.CANSON_RAG]: 1200,
    [PaperType.CANVAS]: 1000
  },
  PRODUCT_MULTIPLIERS: {
    [ProductType.PRINT_ONLY]: 1.0,
    [ProductType.PRINT_FRAME]: 1.5,
    [ProductType.PRINT_FRAME_GLASS]: 1.8
  },
  BORDER_COSTS: {
    [BorderSize.NONE]: 0,
    [BorderSize.SMALL]: 50,
    [BorderSize.MEDIUM]: 75,
    [BorderSize.LARGE]: 125
  },
  PASSEPARTOUT_COSTS: {
    [PassepartoutSize.NONE]: 0,
    [PassepartoutSize.SMALL]: 150,
    [PassepartoutSize.MEDIUM]: 200,
    [PassepartoutSize.LARGE]: 250
  },
  RUSH_MULTIPLIERS: {
    [RushOrder.STANDARD]: 0,
    [RushOrder.RUSH_72H]: 0.15,
    [RushOrder.RUSH_48H]: 0.30,
    [RushOrder.RUSH_24H]: 0.50
  },
  VOLUME_DISCOUNTS: [
    { min: 1, max: 4, discount: 0 },
    { min: 5, max: 9, discount: 0.10 },
    { min: 10, max: 19, discount: 0.15 },
    { min: 20, max: 49, discount: 0.20 },
    { min: 50, max: Infinity, discount: 0.25 }
  ]
} as const;

// Supported File Formats
export const SUPPORTED_FORMATS = ['jpeg', 'jpg', 'tiff', 'tif', 'pdf', 'psd'] as const;
export type SupportedFormat = typeof SUPPORTED_FORMATS[number];

// Color Spaces
export const COLOR_SPACES = ['sRGB', 'Adobe RGB', 'ProPhoto RGB'] as const;
export type ColorSpace = typeof COLOR_SPACES[number];