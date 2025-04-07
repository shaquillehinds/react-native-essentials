import { PixelRatio, Platform } from 'react-native';
import {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  WINDOW_HEIGHT,
} from '../constants/device.const';

const diff = SCREEN_HEIGHT - WINDOW_HEIGHT;

const scale = 0.11519078473722104;

export const relativeY = (num: number) =>
  (SCREEN_HEIGHT - diff / 2) * (num / 100);
export const relativeX = (num: number) => SCREEN_WIDTH * (num / 100);

export function normalize(size: number) {
  const newSize = relativeY(size * scale);
  if (Platform.OS === 'ios') {
    return PixelRatio.roundToNearestPixel(newSize);
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
}
