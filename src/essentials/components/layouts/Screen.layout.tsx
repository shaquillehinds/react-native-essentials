import { type PropsWithChildren } from 'react';
import { SafeAreaView, type ViewStyle } from 'react-native';
import { Layout, type LayoutProps } from './Layout';

export type ScreenLayoutProps = {
  safe?: boolean;
} & LayoutProps;

export function ScreenLayout(props: PropsWithChildren<ScreenLayoutProps>) {
  const style: ViewStyle = {
    display: 'flex',
    flex: 1,
  };
  return (
    <Layout {...props} style={[style, props.style]}>
      {props?.safe && <SafeAreaView />}
      {props.children}
    </Layout>
  );
}
