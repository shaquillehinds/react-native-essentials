import { Dimensions, Platform } from 'react-native';

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;
const wWidth = Dimensions.get('window').width;
const wHeight = Dimensions.get('window').height;

export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;
export const WINDOW_WIDTH = wWidth;
export const WINDOW_HEIGHT = wHeight;
export const isSmallDevice = SCREEN_WIDTH < 375 || SCREEN_HEIGHT < 750;
export const isLargeDevice = width > 1100;
export const isIOS = Platform.OS === 'ios';
export const isWeb = Platform.OS === 'web';
export const isAndroid = Platform.OS === 'android';
