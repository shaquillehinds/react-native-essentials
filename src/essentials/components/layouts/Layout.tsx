import type { PropsWithChildren } from 'react';
import {
  View,
  ScrollView,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
  type FlexAlignType,
  type FlexStyle,
  type ScrollViewProps,
} from 'react-native';
import type { Spacing } from '../../styles/Spacer/Spacer.types';
import { transformSpacing } from '../../styles/Spacer/Spacer.style';
import { relativeX, relativeY } from '../../utils/layout';
export type LayoutProps<Scrollable extends boolean | undefined = undefined> = {
  scrollable?: Scrollable;
  wrap?: boolean;
  /**
   * This number will be used as a percentage of the screen width, where 100 is 100% screen width
   */
  width?: number;
  /**
   * This number will be used as a percentage of the screen height, where 100 is 100% screen height
   */
  height?: number;
  style?: StyleProp<ViewStyle>;
  center?: boolean;
  centerX?: boolean;
  alignSelf?: FlexAlignType;
  spaceEven?: boolean;
  spaceBetween?: boolean;
  flexDirection?: FlexStyle['flexDirection'];
  backgroundColor?: string;
} & Spacing &
  (Scrollable extends true ? ScrollViewProps : ViewProps);

export function Layout<Scrollable extends boolean | undefined = undefined>({
  center,
  centerX,
  wrap,
  height,
  width,
  scrollable,
  margin,
  alignSelf,
  padding,
  flexDirection,
  backgroundColor,
  spaceBetween,
  spaceEven,
  children,
  style,
  ...props
}: PropsWithChildren<LayoutProps<Scrollable>>) {
  const viewStyle: ViewStyle = {
    ...transformSpacing({ margin: margin }),
    width: width ? relativeX(width) : undefined,
    height: height ? relativeY(height) : undefined,
    alignSelf: alignSelf,
  };
  const contentStyle: ViewStyle = {
    ...transformSpacing({ padding: padding }),
    alignItems: center ? 'center' : undefined,
    flexDirection: flexDirection,
    backgroundColor: backgroundColor,
    flexWrap: wrap ? 'wrap' : 'nowrap',
    justifyContent: spaceEven
      ? 'space-evenly'
      : spaceBetween
        ? 'space-between'
        : centerX
          ? 'center'
          : undefined,
  };
  if (scrollable) {
    viewStyle.overflow = 'visible';
    let contentContainerStyle: undefined | ViewStyle;
    if ('contentContainerStyle' in props) {
      contentContainerStyle = props.contentContainerStyle as ViewStyle;
    }
    return (
      <ScrollView
        {...props}
        style={[viewStyle, style]}
        contentContainerStyle={[contentStyle, contentContainerStyle]}
      >
        {children}
      </ScrollView>
    );
  }
  return (
    <View {...props} style={[contentStyle, viewStyle, style]}>
      {children}
    </View>
  );
}
