import { useMemo } from 'react';
import { calculateImageDimensions } from '../utils/calculations';

interface UseImageDimensionsParams {
  width: string;
  height: string;
  productType: string;
  paperType: string;
  borderSize: string;
  passepartoutSize: string;
}

export const useImageDimensions = (params: UseImageDimensionsParams) => {
  const { width, height, productType, paperType, borderSize, passepartoutSize } = params;

  const dimensions = useMemo(() => {
    const hasFrame = productType !== '1';
    const canHaveBorder = productType === '1';
    const canHavePassepartout = productType !== '1' && paperType !== '3';

    const imageDimensions = calculateImageDimensions({
      width,
      height,
      hasFrame,
      canHaveBorder,
      canHavePassepartout,
      borderSize,
      passepartoutSize
    });

    // Calculate the minimum total size needed
    let minTotalSize = 20; // Base minimum for image
    if (hasFrame) {
      minTotalSize += 4; // Add frame thickness
      if (canHavePassepartout && parseInt(passepartoutSize) > 0) {
        minTotalSize += parseInt(passepartoutSize) * 2;
      }
    } else if (canHaveBorder && parseInt(borderSize) > 0) {
      minTotalSize += parseInt(borderSize) * 2;
    }

    return {
      imageWidth: imageDimensions.width,
      imageHeight: imageDimensions.height,
      totalWidth: parseFloat(width) || 0,
      totalHeight: parseFloat(height) || 0,
      minTotalSize,
      isValid: imageDimensions.width >= 20 && imageDimensions.height >= 20,
      hasFrame,
      canHaveBorder,
      canHavePassepartout
    };
  }, [width, height, productType, paperType, borderSize, passepartoutSize]);

  return dimensions;
};

export default useImageDimensions;