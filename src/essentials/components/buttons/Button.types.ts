import { type AnimatedStyle } from 'react-native-reanimated';
import type { BaseTextProps } from '../typography';
import type {
  FlexAlignType,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import type { LoadingIndicatorProps } from '../indicators';

export type BorderSize = 'razor' | 'thin' | 'medium' | 'large';
export type RadiusSize =
  | 'edgy'
  | 'sharp'
  | 'medium'
  | 'soft'
  | 'curvy'
  | 'round';
export type ButtonSize = 'small' | 'large' | 'medium' | 'auto' | 'wide';

export interface ButtonProps extends Omit<BaseTextProps, 'style'> {
  loading?: LoadingIndicatorProps | boolean;
  borderColor?: string;
  borderRadius?: RadiusSize;
  borderWidth?: BorderSize;
  backgroundColor?: string;
  activeOpacity?: number;
  customFontColor?: string;
  buttonSize?: ButtonSize;
  textStyle?: StyleProp<AnimatedStyle<StyleProp<TextStyle>>>;
  alignSelf?: FlexAlignType;
  style?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
  rightComponent?: JSX.Element;
  leftComponent?: JSX.Element;
}
