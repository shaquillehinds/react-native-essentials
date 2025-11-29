import type { PropsWithChildren } from 'react';
import { Layout, type LayoutProps } from './Layout';
import type { StyleProp } from 'react-native';
import type { AnimatedStyle } from 'react-native-reanimated';
import type { ViewStyle } from 'react-native';

export type AnimatedLayoutProps = Omit<LayoutProps, 'animated'> & {
  animatedStyle?: StyleProp<AnimatedStyle<ViewStyle>>;
};
export function AnimatedLayout({
  children,
  animatedStyle,
  ...props
}: PropsWithChildren<AnimatedLayoutProps>) {
  return (
    <Layout animated animatedStyle={animatedStyle} {...props}>
      {children}
    </Layout>
  );
}
