import type { PropsWithChildren } from 'react';
import { type ViewStyle } from 'react-native';
import { Layout, type LayoutProps } from './Layout';

export function RowLayout(props: PropsWithChildren<LayoutProps>) {
  const style: ViewStyle = { flexDirection: 'row' };
  return (
    <Layout {...props} style={[props.style, style]}>
      {props.children}
    </Layout>
  );
}
