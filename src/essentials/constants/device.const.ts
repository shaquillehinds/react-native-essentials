import { Dimensions, Platform, type ScaledSize } from 'react-native';

export type DeviceOrientation = 'portrait' | 'landscape';
export type ScaledSizeDimensions = {
  window: ScaledSize;
  screen: ScaledSize;
};

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;
const wWidth = Dimensions.get('window').width;
const wHeight = Dimensions.get('window').height;

export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;
export const WINDOW_WIDTH = wWidth;
export const WINDOW_HEIGHT = wHeight;
export const initialOrientation: DeviceOrientation =
  width > height ? 'landscape' : 'portrait';
export const aspectRatio = height > width ? height / width : width / height;
export const isSmallDevice = SCREEN_WIDTH < 375 || SCREEN_HEIGHT < 750;
export const isLargeDevice = width > 1100;
export const isIOS = Platform.OS === 'ios' || undefined;
export const isWeb = Platform.OS === 'web' || undefined;
export const isIpad = isIOS && aspectRatio <= 1.6;
export const isAndroid = Platform.OS === 'android' || undefined;
