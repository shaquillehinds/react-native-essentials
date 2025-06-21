import { PixelRatio, Platform } from 'react-native';
import { relativeY } from '../../utils';
import type { FontSize } from './Text.types';
const scale = 0.11519078473722104;
const fontScale = 1;
export function normalize(size: number) {
  const newSize = relativeY(size * scale);
  if (Platform.OS === 'ios') {
    return PixelRatio.roundToNearestPixel(newSize);
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
}

export const fontSizes: { [key in FontSize]: number } = {
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
