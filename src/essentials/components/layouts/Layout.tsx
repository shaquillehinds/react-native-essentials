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
export type LayoutProps<Scrollable extends boolean = false> = {
  scrollable?: Scrollable extends undefined ? false : true;
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

export function Layout<Scrollable extends boolean = false>(
  props: PropsWithChildren<LayoutProps<Scrollable>>
) {
  const style: ViewStyle = {
    ...transformSpacing({ margin: props.margin }),
    width: props.width ? relativeX(props.width) : undefined,
    height: props.height ? relativeY(props.height) : undefined,
    alignSelf: props.alignSelf,
  };
  const contentStyle: ViewStyle = {
    ...transformSpacing({ padding: props.padding }),
    alignItems: props.center ? 'center' : undefined,
    flexDirection: props.flexDirection,
    backgroundColor: props.backgroundColor,
    flexWrap: props.wrap ? 'wrap' : 'nowrap',
    justifyContent: props.spaceEven
      ? 'space-evenly'
      : props.spaceBetween
        ? 'space-between'
        : props.centerX
          ? 'center'
          : undefined,
  };
  if (props.scrollable)
    return (
      <ScrollView
        {...props}
        style={[style, props.style]}
        contentContainerStyle={contentStyle}
      >
        {props.children}
      </ScrollView>
    );
  return (
    <View {...props} style={[style, contentStyle, props.style]}>
      {props.children}
    </View>
  );
}
