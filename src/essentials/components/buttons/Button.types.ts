import { type AnimatedStyle } from 'react-native-reanimated';
import type { FontSize, FontStyle } from '../typography';
import type { Spaces } from '../../styles';
import type {
  FlexAlignType,
  GestureResponderEvent,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';

export type BorderSize = 'razor' | 'thin' | 'medium' | 'large';
export type RadiusSize =
  | 'edgy'
  | 'sharp'
  | 'medium'
  | 'soft'
  | 'curvy'
  | 'round';
export type ButtonSize = 'small' | 'large' | 'medium' | 'auto' | 'wide';

export interface ButtonProps {
  borderColor?: string;
  borderRadius?: RadiusSize;
  borderWidth?: BorderSize;
  backgroundColor?: string;
  onPress?: (event: GestureResponderEvent) => void;
  onLongPress?: (event: GestureResponderEvent) => void;
  activeOpacity?: number;
  fontStyle?: FontStyle;
  fontSize?: FontSize;
  customFontColor?: string;
  buttonSize?: ButtonSize;
  textStyle?: StyleProp<AnimatedStyle<StyleProp<TextStyle>>>;
  animateText?: boolean;
  animate?: boolean;
  padding?: Spaces;
  margin?: Spaces;
  alignSelf?: FlexAlignType;
  style?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
  rightComponent?: JSX.Element;
  leftComponent?: JSX.Element;
}
