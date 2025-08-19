// Calculation utilities for the pricing calculator

export interface CalculateImageDimensionsParams {
  width: string;
  height: string;
  hasFrame: boolean;
  canHaveBorder: boolean;
  canHavePassepartout: boolean;
  borderSize: string;
  passepartoutSize: string;
}

export const calculateImageDimensions = (params: CalculateImageDimensionsParams) => {
  const {
    width,
    height,
    hasFrame,
    canHaveBorder,
    canHavePassepartout,
    borderSize,
    passepartoutSize
  } = params;

  let imageWidth = parseFloat(width) || 0;
  let imageHeight = parseFloat(height) || 0;
  
  if (hasFrame) {
    // Frame takes 2cm on each side
    imageWidth -= 4;
    imageHeight -= 4;
    
    if (canHavePassepartout && parseInt(passepartoutSize) > 0) {
      // Passe-partout takes additional space
      imageWidth -= parseInt(passepartoutSize) * 2;
      imageHeight -= parseInt(passepartoutSize) * 2;
    }
  } else if (canHaveBorder && parseInt(borderSize) > 0) {
    // White border takes space from the total
    imageWidth -= parseInt(borderSize) * 2;
    imageHeight -= parseInt(borderSize) * 2;
  }
  
  return {
    width: Math.max(0, imageWidth),
    height: Math.max(0, imageHeight)
  };
};

export interface ValidateDimensionsParams {
  width: string;
  height: string;
  paperType: string;
  productType: string;
  actualImageDimensions: { width: number; height: number };
}

export const validateDimensions = (params: ValidateDimensionsParams) => {
  const { width, height, paperType, productType, actualImageDimensions } = params;
  
  const w = parseFloat(width);
  const h = parseFloat(height);

  if (!width || !height) return false;
  if (isNaN(w) || isNaN(h)) return false;

  // Check if actual image dimensions meet minimum requirements
  const minImageSide = Math.min(actualImageDimensions.width, actualImageDimensions.height);
  const maxImageSide = Math.max(actualImageDimensions.width, actualImageDimensions.height);

  // Minimum image size must be 20x20cm
  if (minImageSide < 20) {
    return false;
  }

  // Canvas specific rules (based on image size, not total)
  if (paperType === '3') {
    if (minImageSide > 100) return false;
    if (productType === '3') return false;
  } else {
    if (minImageSide > 110) return false;
  }

  // For framed with glass, maximum image size check
  if (productType === '3') {
    if (maxImageSide > 180 || minImageSide > 110) return false;
  }

  return true;
};

export const calculatePreviewDimensions = (width: string, height: string) => {
  const maxPreviewWidth = 500;
  const maxPreviewHeight = 500;
  const aspectRatio = parseFloat(width) / parseFloat(height);
  
  let previewWidth, previewHeight;
  if (aspectRatio > 1) {
    previewWidth = Math.min(maxPreviewWidth, maxPreviewWidth);
    previewHeight = previewWidth / aspectRatio;
  } else {
    previewHeight = Math.min(maxPreviewHeight, maxPreviewHeight);
    previewWidth = previewHeight * aspectRatio;
  }

  return { previewWidth, previewHeight };
};