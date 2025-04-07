import type { PropsWithChildren } from 'react';
import { View, type ViewStyle } from 'react-native';
import type { LayoutProps } from './Layout';

export function RowLayout(props: PropsWithChildren<LayoutProps>) {
  const style: ViewStyle = { flexDirection: 'row' };
  return (
    <View {...props} style={[props.style, style]}>
      {props.children}
    </View>
  );
}
