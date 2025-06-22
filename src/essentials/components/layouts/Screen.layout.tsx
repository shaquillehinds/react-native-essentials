import { type PropsWithChildren } from 'react';
import { type ColorValue, type ViewStyle } from 'react-native';
import { Layout, type LayoutProps } from './Layout';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

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
      <SafeAreaProvider>
        <SafeAreaView style={safeStyle} edges={['top', 'bottom']}>
          <Layout
            {...props}
            style={[style, props.style]}
            scrollable={scrollable}
          >
            {props.children}
          </Layout>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }
  return (
    <Layout {...props} style={[style, props.style]} scrollable={scrollable}>
      {props.children}
    </Layout>
  );
}
