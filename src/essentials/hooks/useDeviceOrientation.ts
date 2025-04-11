import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';
import {
  initialOrientation,
  type DeviceOrientation,
  type ScaledSizeDimensions,
} from '../constants/device.const';

export const useDeviceOrientation = () => {
  const [orientation, setOrientation] =
    useState<DeviceOrientation>(initialOrientation);

  useEffect(() => {
    const updateDimensions = (dimensions: ScaledSizeDimensions) => {
      const {
        screen: { width, height },
      } = dimensions;
      setOrientation(width > height ? 'landscape' : 'portrait');
    };
    const subscription = Dimensions.addEventListener(
      'change',
      updateDimensions
    );

    return () => subscription.remove();
  }, []);

  return { orientation };
};
