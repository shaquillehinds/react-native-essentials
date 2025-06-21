import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';
import {
  type DeviceOrientation as Orientation,
  type ScaledSizeDimensions,
} from '../constants/device.const';

type DeviceOrientation = {
  screenWidth: number;
  screenHeight: number;
  orientation: Orientation;
};
export const useDeviceOrientation = () => {
  const SCREEN_WIDTH = Dimensions.get('screen').width;
  const SCREEN_HEIGHT = Dimensions.get('screen').height;
  const [orientation, setOrientation] = useState<DeviceOrientation>({
    orientation: SCREEN_WIDTH > SCREEN_HEIGHT ? 'landscape' : 'portrait',
    screenHeight: SCREEN_HEIGHT,
    screenWidth: SCREEN_WIDTH,
  });
  useEffect(() => {
    const updateDimensions = (dimensions: ScaledSizeDimensions) => {
      //prettier-ignore
      const { screen: { width, height }} = dimensions;
      setOrientation({
        orientation: width > height ? 'landscape' : 'portrait',
        screenHeight: height,
        screenWidth: width,
      });
    };
    const subscription = Dimensions.addEventListener(
      'change',
      updateDimensions
    );

    return () => subscription.remove();
  }, []);

  return {
    ...orientation,
    relativeX: (num: number) => orientation.screenWidth * (num / 100),
    relativeXWorklet: (num: number) => {
      'worklet';
      return orientation.screenWidth * (num / 100);
    },
    relativeY: (num: number) => orientation.screenHeight * (num / 100),
    relativeYWorklet: (num: number) => {
      'worklet';
      return orientation.screenHeight * (num / 100);
    },
    relativeShort: (num: number) =>
      Math.min(orientation.screenWidth, orientation.screenHeight) * (num / 100),
    relativeShortWorklet: (num: number) => {
      'worklet';
      return (
        Math.min(orientation.screenWidth, orientation.screenHeight) *
        (num / 100)
      );
    },
    relativeLong: (num: number) =>
      Math.max(orientation.screenWidth, orientation.screenHeight) * (num / 100),
    relativeLongWorklet: (num: number) => {
      'worklet';
      return (
        Math.max(orientation.screenWidth, orientation.screenHeight) *
        (num / 100)
      );
    },
  };
};
