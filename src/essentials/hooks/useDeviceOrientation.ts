import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';
import {
  initialOrientation,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  type DeviceOrientation as Orientation,
  type ScaledSizeDimensions,
} from '../constants/device.const';
import { relativeLong, relativeShort, relativeX, relativeY } from '../utils';

export type DeviceOrientation = {
  relativeY: (n: number) => number;
  relativeX: (n: number) => number;
  relativeLong: (n: number) => number;
  relativeShort: (n: number) => number;
  screenWidth: number;
  screenHeight: number;
  orientation: Orientation;
};
export const useDeviceOrientation = () => {
  const [orientation, setOrientation] = useState<DeviceOrientation>({
    orientation: initialOrientation,
    screenHeight: SCREEN_HEIGHT,
    screenWidth: SCREEN_WIDTH,
    relativeLong: relativeLong,
    relativeShort: relativeShort,
    relativeX: relativeX,
    relativeY: relativeY,
  });

  useEffect(() => {
    const updateDimensions = (dimensions: ScaledSizeDimensions) => {
      const {
        screen: { width, height },
        window,
      } = dimensions;
      const diff = window.height - height;
      setOrientation({
        orientation: width > height ? 'landscape' : 'portrait',
        screenHeight: height,
        screenWidth: width,
        relativeLong: (num: number) => Math.max(width, height) * (num / 100),
        relativeShort: (num: number) => Math.min(width, height) * (num / 100),
        relativeX: (num: number) => width * (num / 100),
        relativeY: (num: number) => (height - diff / 2) * (num / 100),
      });
    };
    const subscription = Dimensions.addEventListener(
      'change',
      updateDimensions
    );

    return () => subscription.remove();
  }, []);

  return orientation;
};
