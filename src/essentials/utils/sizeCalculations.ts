import { type DimensionValue } from 'react-native';
import type {
  BorderSize,
  ButtonSize,
  RadiusSize,
} from '../components/buttons/Button.types';
import type { FontSize } from '../components/typography/Text.types';
import {
  normalize,
  normalizeShort,
  relativeLong,
  relativeShort,
} from './layout';

const fontScale = 1;

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
export const borderSizes: { [key in BorderSize]: number } = {
  razor: relativeShort(0.1),
  thin: relativeShort(0.25),
  medium: relativeShort(0.5),
  large: relativeShort(0.75),
};

export const radiusSizes: { [key in RadiusSize]: number } = {
  edgy: normalize(5),
  sharp: normalize(10),
  medium: normalize(15),
  soft: normalize(20),
  curvy: normalize(25),
  round: normalize(30),
  full: relativeLong(100),
};

export const buttonSizes: {
  [key in ButtonSize]: {
    paddingHorizontal: number;
    paddingVertical: number;
    fontSize: FontSize;
    borderRadius: RadiusSize;
    width?: DimensionValue;
  };
} = {
  small: {
    paddingHorizontal: normalizeShort(30),
    paddingVertical: normalizeShort(15),
    fontSize: 'bodyS',
    borderRadius: 'edgy',
  },
  medium: {
    paddingHorizontal: normalizeShort(60),
    paddingVertical: normalizeShort(20),
    fontSize: 'bodyL',
    borderRadius: 'sharp',
  },
  large: {
    paddingHorizontal: normalizeShort(120),
    paddingVertical: normalizeShort(25),
    fontSize: 'titleS',
    borderRadius: 'sharp',
  },
  wide: {
    paddingHorizontal: normalizeShort(120),
    paddingVertical: normalizeShort(25),
    fontSize: 'titleM',
    borderRadius: 'sharp',
    width: relativeShort(88),
  },
  auto: {
    paddingHorizontal: normalizeShort(60),
    paddingVertical: normalizeShort(25),
    fontSize: 'titleM',
    borderRadius: 'sharp',
    width: '100%',
  },
};
