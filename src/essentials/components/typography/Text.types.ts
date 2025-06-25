import type {
  GestureResponderEvent,
  StyleProp,
  TextProps,
  TextStyle,
} from 'react-native';
import { type AnimatedStyle } from 'react-native-reanimated';
import type { Spacing } from '../../styles';

export interface BaseTextProps extends Spacing, TextProps {
  fontSize?: FontSize;
  customColor?: string;
  fontStyle?: FontStyle;
  animatedStyle?: StyleProp<AnimatedStyle<StyleProp<TextStyle>>>;
  lineHeight?: LineHeight;
  letterSpacing?: LetterSpacing;
  numberOfLines?: number;
  animate?: boolean;
  center?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  className?: string | undefined;
}

export type FontStyle =
  | 'Thin'
  | 'Extra Light'
  | 'Light'
  | 'Regular'
  | 'Medium'
  | 'SemiBold'
  | 'Bold'
  | 'ExtraBold'
  | 'Black';

export type FontSize =
  | 'headingL'
  | 'headingM'
  | 'headingS'
  | 'titleL'
  | 'titleM'
  | 'titleS'
  | 'bodyL'
  | 'bodyM'
  | 'bodyS';

export type LineHeight = 'short' | 'tall';

export type LetterSpacing = 'wide' | 'extraWide';
