// src/services/ValidationService.ts

import {
  ProductType,
  PaperType,
  DIMENSIONS
} from '../core/constants';
import { 
  ValidationResult, 
  ValidationError, 
  ValidationWarning,
  CalculatorState,
  UploadedFile
} from '../core/types';
import { PricingService } from './PricingService';

export class ValidationService {
  /**
   * Validate the entire calculator state
   */
  static validateConfiguration(state: CalculatorState): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Validate dimensions
    const dimensionValidation = this.validateDimensions(state);
    errors.push(...dimensionValidation.errors);
    warnings.push(...dimensionValidation.warnings);

    // Validate product compatibility
    const compatibilityValidation = this.validateProductCompatibility(state);
    errors.push(...compatibilityValidation.errors);
    warnings.push(...compatibilityValidation.warnings);

    // Validate file if uploaded
    if (state.uploadedFile) {
      const fileValidation = this.validateFile(state.uploadedFile);
      errors.push(...fileValidation.errors);
      warnings.push(...fileValidation.warnings);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate dimensions based on product and paper type
   */
  static validateDimensions(state: CalculatorState): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    
    const imageDimensions = PricingService.calculateImageDimensions(state);
    const { imageWidth, imageHeight, totalWidth, totalHeight } = imageDimensions;
    const minSide = Math.min(imageWidth, imageHeight);
    const maxSide = Math.max(imageWidth, imageHeight);

    // Check minimum total dimensions
    if (totalWidth < DIMENSIONS.MIN_TOTAL_SIZE || totalHeight < DIMENSIONS.MIN_TOTAL_SIZE) {
      errors.push({
        field: 'dimensions',
        code: 'MIN_TOTAL_SIZE',
        message: `As dimensões totais devem ser pelo menos ${DIMENSIONS.MIN_TOTAL_SIZE}cm`
      });
    }

    // Check minimum image size
    if (imageWidth < DIMENSIONS.MIN_IMAGE_SIZE || imageHeight < DIMENSIONS.MIN_IMAGE_SIZE) {
      errors.push({
        field: 'dimensions',
        code: 'MIN_IMAGE_SIZE',
        message: `A área de impressão deve ter pelo menos ${DIMENSIONS.MIN_IMAGE_SIZE}×${DIMENSIONS.MIN_IMAGE_SIZE}cm`
      });
    }

    // Canvas-specific validations
    if (state.paperType === PaperType.CANVAS) {
      if (minSide > DIMENSIONS.MAX_CANVAS_SIZE) {
        errors.push({
          field: 'dimensions',
          code: 'MAX_CANVAS_SIZE',
          message: `Para canvas, o lado menor não pode exceder ${DIMENSIONS.MAX_CANVAS_SIZE}cm`
        });
      }

      // Canvas cannot have glass
      if (state.productType === ProductType.PRINT_FRAME_GLASS) {
        errors.push({
          field: 'product',
          code: 'CANVAS_NO_GLASS',
          message: 'Canvas não pode ter vidro'
        });
      }
    } else {
      // Regular paper validations
      if (minSide > DIMENSIONS.MAX_REGULAR_SIZE) {
        errors.push({
          field: 'dimensions',
          code: 'MAX_REGULAR_SIZE',
          message: `O lado menor não pode exceder ${DIMENSIONS.MAX_REGULAR_SIZE}cm`
        });
      }
    }

    // Glass-specific validations
    if (state.productType === ProductType.PRINT_FRAME_GLASS) {
      if (maxSide > DIMENSIONS.MAX_GLASS_LENGTH) {
        errors.push({
          field: 'dimensions',
          code: 'MAX_GLASS_LENGTH',
          message: `Com vidro, o lado maior não pode exceder ${DIMENSIONS.MAX_GLASS_LENGTH}cm`
        });
      }
      if (minSide > DIMENSIONS.MAX_GLASS_WIDTH) {
        errors.push({
          field: 'dimensions',
          code: 'MAX_GLASS_WIDTH',
          message: `Com vidro, o lado menor não pode exceder ${DIMENSIONS.MAX_GLASS_WIDTH}cm`
        });
      }
    }

    // Warnings for large prints
    if (maxSide > 150) {
      warnings.push({
        field: 'dimensions',
        code: 'LARGE_PRINT',
        message: 'Impressões muito grandes podem ter tempo de produção estendido'
      });
    }

    // Warning for aspect ratio
    const aspectRatio = totalWidth / totalHeight;
    if (aspectRatio > 3 || aspectRatio < 0.33) {
      warnings.push({
        field: 'dimensions',
        code: 'UNUSUAL_ASPECT_RATIO',
        message: 'Proporção incomum pode afetar a qualidade visual'
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate product and paper compatibility
   */
  static validateProductCompatibility(state: CalculatorState): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Canvas cannot have glass
    if (state.paperType === PaperType.CANVAS && 
        state.productType === ProductType.PRINT_FRAME_GLASS) {
      errors.push({
        field: 'configuration',
        code: 'INCOMPATIBLE_COMBINATION',
        message: 'Canvas não pode ser combinado com vidro'
      });
    }

    // Warning for frame without glass on delicate papers
    if (state.paperType === PaperType.CANSON_RAG && 
        state.productType === ProductType.PRINT_FRAME) {
      warnings.push({
        field: 'configuration',
        code: 'PROTECTION_RECOMMENDED',
        message: 'Papel 100% algodão é recomendado com vidro para proteção'
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate uploaded file
   */
  static validateFile(file: UploadedFile): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Check file size
    if (file.size > DIMENSIONS.MAX_FILE_SIZE) {
      errors.push({
        field: 'file',
        code: 'FILE_TOO_LARGE',
        message: `Arquivo excede o tamanho máximo de 2GB`
      });
    }

    // Check DPI if available
    if (file.dimensions && file.dimensions.dpi < DIMENSIONS.MIN_DPI) {
      errors.push({
        field: 'file',
        code: 'LOW_DPI',
        message: `Resolução mínima de ${DIMENSIONS.MIN_DPI} DPI necessária`
      });
    }

    // Check supported formats
    const extension = file.name.split('.').pop()?.toLowerCase();
    const supportedFormats = ['jpg', 'jpeg', 'tiff', 'tif', 'pdf', 'psd'];
    if (!extension || !supportedFormats.includes(extension)) {
      errors.push({
        field: 'file',
        code: 'UNSUPPORTED_FORMAT',
        message: 'Formato de arquivo não suportado'
      });
    }

    // Warnings for color space
    if (file.colorSpace && file.colorSpace !== 'Adobe RGB') {
      warnings.push({
        field: 'file',
        code: 'COLOR_SPACE',
        message: 'Adobe RGB recomendado para melhor qualidade de cor'
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Check if a specific field has errors
   */
  static hasFieldError(validation: ValidationResult, field: string): boolean {
    return validation.errors.some(error => error.field === field);
  }

  /**
   * Get errors for a specific field
   */
  static getFieldErrors(validation: ValidationResult, field: string): ValidationError[] {
    return validation.errors.filter(error => error.field === field);
  }

  /**
   * Get warnings for a specific field
   */
  static getFieldWarnings(validation: ValidationResult, field: string): ValidationWarning[] {
    return validation.warnings.filter(warning => warning.field === field);
  }
}