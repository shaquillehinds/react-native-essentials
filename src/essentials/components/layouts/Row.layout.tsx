import type { PropsWithChildren } from 'react';
import { type ViewStyle } from 'react-native';
import { Layout, type LayoutProps } from './Layout';

export function RowLayout<
  ScrollEnabled extends boolean | undefined = undefined,
>({ scrollable, ...props }: PropsWithChildren<LayoutProps<ScrollEnabled>>) {
  const style: ViewStyle = { flexDirection: 'row' };
  return (
    <Layout {...props} style={[props.style, style]} scrollable={scrollable}>
      {props.children}
    </Layout>
  );
}
