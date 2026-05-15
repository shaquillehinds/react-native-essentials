import { View, type ViewStyle } from 'react-native';
import { RowLayout } from './Row.layout';
import type { PropsWithChildren } from 'react';
import type { LayoutProps } from './Layout';

export type SeparatorLayoutProps = Partial<{
  lineColor: string;
  lineWidth: number;
  lineOpacity: number;
}> &
  LayoutProps;
export function SeparatorLayout({
  children,
  lineColor,
  lineWidth,
  lineOpacity,
  ...layoutProps
}: PropsWithChildren<SeparatorLayoutProps>) {
  const style: ViewStyle = {
    flex: 1,
    borderWidth: lineWidth || 0.5,
    borderColor: lineColor || '#222222',
    opacity: lineOpacity || 0.8,
  };
  return (
    <RowLayout center margin={[2, 0]} {...layoutProps}>
      <View style={style} />
      {children}
      <View style={style} />
    </RowLayout>
  );
}
