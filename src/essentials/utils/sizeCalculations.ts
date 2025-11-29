import { type DimensionValue } from 'react-native';
import { normalize, relativeLong, relativeShort } from './layout';
import type { FontSize } from '../components/typography/Text.types';
import type {
  BorderSize,
  ButtonSize,
  RadiusSize,
} from '../components/buttons/Button.types';

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
  edgy: relativeShort(0.5),
  sharp: relativeShort(1.5),
  medium: relativeShort(2.5),
  soft: relativeShort(4),
  curvy: relativeShort(6),
  round: relativeShort(8),
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
    paddingHorizontal: relativeShort(5),
    paddingVertical: relativeLong(0.6),
    fontSize: 'bodyS',
    borderRadius: 'soft',
  },
  medium: {
    paddingHorizontal: relativeShort(10),
    paddingVertical: relativeLong(1.2),
    fontSize: 'bodyL',
    borderRadius: 'curvy',
  },
  large: {
    paddingHorizontal: relativeShort(18),
    paddingVertical: relativeLong(1.5),
    fontSize: 'titleS',
    borderRadius: 'curvy',
  },
  wide: {
    paddingHorizontal: relativeShort(18),
    paddingVertical: relativeLong(1.5),
    fontSize: 'titleS',
    borderRadius: 'soft',
    width: relativeShort(88),
  },
  auto: {
    paddingHorizontal: relativeShort(18),
    paddingVertical: relativeLong(1.5),
    fontSize: 'titleS',
    borderRadius: 'soft',
    width: '100%',
  },
};
