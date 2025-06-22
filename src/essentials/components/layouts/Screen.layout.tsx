import { type PropsWithChildren } from 'react';
import { SafeAreaView, type ColorValue, type ViewStyle } from 'react-native';
import { Layout, type LayoutProps } from './Layout';

export type ScreenLayoutProps<
  Scrollable extends boolean | undefined = undefined,
> = {
  safe?: boolean;
} & LayoutProps<Scrollable>;

export function ScreenLayout<
  Scrollable extends boolean | undefined = undefined,
>({ scrollable, ...props }: PropsWithChildren<ScreenLayoutProps<Scrollable>>) {
  const style: ViewStyle = {
    display: 'flex',
    flex: 1,
  };

  if (props?.safe) {
    let backgroundColor: ColorValue | undefined = props.backgroundColor;
    if (
      props.style &&
      typeof props.style === 'object' &&
      'backgroundColor' in props.style
    ) {
      backgroundColor = props.style.backgroundColor;
    }
    const safeStyle: ViewStyle = {
      flex: 1,
      overflow: 'visible',
      backgroundColor,
    };
    return (
      <SafeAreaView style={safeStyle}>
        <Layout {...props} style={[style, props.style]} scrollable={scrollable}>
          {props.children}
        </Layout>
      </SafeAreaView>
    );
  }
  return (
    <Layout {...props} style={[style, props.style]} scrollable={scrollable}>
      {props.children}
    </Layout>
  );
}
