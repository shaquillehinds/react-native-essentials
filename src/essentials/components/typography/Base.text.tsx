import { Text, type TextStyle } from 'react-native';
import { transformSpacing } from '../../styles';
import type { BaseTextProps, LetterSpacing, LineHeight } from './Text.types';
import type { PropsWithChildren } from 'react';
import { fontSizes } from '../../utils/sizeCalculations';
import Animated from 'react-native-reanimated';

const spacings: { [key in LetterSpacing]: number } = {
  wide: 0.7,
  extraWide: 1.2,
};
const heights: { [key in LineHeight]: number } = {
  short: 1.05,
  tall: 1.35,
};

export function BaseText({
  children,
  fontSize = 'bodyM',
  fontStyle = 'Regular',
  style,
  animatedStyle,
  customColor,
  letterSpacing,
  lineHeight,
  numberOfLines,
  padding,
  margin,
  animate,
  center,
  onPress,
  ...rest
}: PropsWithChildren<BaseTextProps>) {
  const TextComponent = animate
    ? Animated.Text
    : (Text as typeof Animated.Text);
  const styles: TextStyle = {
    fontFamily: fontStyle,
    fontSize: fontSizes[fontSize],
    color: customColor,
    textAlign: center ? 'center' : 'left',
    letterSpacing: letterSpacing ? spacings[letterSpacing] : undefined,
    lineHeight:
      lineHeight && fontSize
        ? heights[lineHeight] * fontSizes[fontSize]
        : undefined,
    ...transformSpacing({ margin, padding }),
  };
  return (
    <TextComponent
      onPress={onPress}
      numberOfLines={numberOfLines}
      style={[styles, animatedStyle, style]}
      {...rest}
    >
      {children}
    </TextComponent>
  );
}
