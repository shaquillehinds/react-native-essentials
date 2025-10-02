import { useDeviceOrientation } from './useDeviceOrientation';

export function useFontSizes(fontScale = 1) {
  const { normalize } = useDeviceOrientation();
  return {
    headingL: normalize(26 * fontScale),
    headingM: normalize(24 * fontScale),
    headingS: normalize(22 * fontScale),
    titleL: normalize(20 * fontScale),
    titleM: normalize(18 * fontScale),
    titleS: normalize(16 * fontScale),
    bodyL: normalize(14 * fontScale),
    bodyM: normalize(12 * fontScale),
    bodyS: normalize(10 * fontScale),
  };
}
