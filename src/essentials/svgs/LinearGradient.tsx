import type { PropsWithChildren } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import {
  AbsoluteLinearGradient,
  type AbsoluteLinearGradientProps,
} from './AbsoluteLinearGradient';

export type LinearGradientProps = {
  style?: StyleProp<ViewStyle>;
} & AbsoluteLinearGradientProps;

export function LinearGradient({
  style,
  children,
  ...rest
}: PropsWithChildren<LinearGradientProps>) {
  return (
    <View style={[{ position: 'relative' }, style]}>
      <AbsoluteLinearGradient {...rest} />
      {children}
    </View>
  );
}
