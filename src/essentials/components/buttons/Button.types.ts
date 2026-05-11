import type {
  FlexAlignType,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { type AnimatedStyle } from 'react-native-reanimated';
import type { ShadowStylesProps } from '../../styles';
import type { LoadingIndicatorProps } from '../indicators';
import type { BaseTextProps } from '../typography';

export type BorderSize = 'razor' | 'thin' | 'medium' | 'large';
export type RadiusSize =
  | 'edgy'
  | 'sharp'
  | 'medium'
  | 'soft'
  | 'curvy'
  | 'round'
  | 'full';
export type ButtonSize = 'small' | 'large' | 'medium' | 'auto' | 'wide';

export interface ButtonProps extends Omit<BaseTextProps, 'style'> {
  enableRapidPress?: boolean;
  loading?: LoadingIndicatorProps | boolean;
  borderColor?: string;
  borderRadius?: RadiusSize | number;
  borderWidth?: BorderSize;
  backgroundColor?: string | string[];
  activeOpacity?: number;
  customFontColor?: string;
  buttonSize?: ButtonSize;
  textStyle?: StyleProp<AnimatedStyle<StyleProp<TextStyle>>>;
  alignSelf?: FlexAlignType;
  style?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
  shadow?: ShadowStylesProps;
  rightComponent?: JSX.Element;
  leftComponent?: JSX.Element;
  rightComponentGap?: number;
  leftComponentGap?: number;
  gradientOpacities?: number[];
  gradientStart?: { x: number | string; y: number | string };
  gradientEnd?: { x: number | string; y: number | string };
}
