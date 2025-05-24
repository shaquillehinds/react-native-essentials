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

export const relativeShort = (num: number) =>
  Math.min(SCREEN_WIDTH, SCREEN_HEIGHT) * (num / 100);

export const relativeLong = (num: number) =>
  Math.max(SCREEN_WIDTH, SCREEN_HEIGHT) * (num / 100);

export function normalize(size: number) {
  const newSize = relativeY(size * scale);
  if (Platform.OS === 'ios') {
    return PixelRatio.roundToNearestPixel(newSize);
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
}

export const relativeYWorklet = (num: number) => {
  'worklet';
  return (SCREEN_HEIGHT - diff / 2) * (num / 100);
};
export const relativeXWorklet = (num: number) => {
  'worklet';
  return SCREEN_WIDTH * (num / 100);
};
export const relativeShortWorklet = (num: number) => {
  'worklet';
  Math.min(SCREEN_WIDTH, SCREEN_HEIGHT) * (num / 100);
};

export const relativeLongWorklet = (num: number) => {
  'worklet';
  Math.max(SCREEN_WIDTH, SCREEN_HEIGHT) * (num / 100);
};
