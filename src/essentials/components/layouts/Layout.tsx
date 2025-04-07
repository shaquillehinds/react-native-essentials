import type { PropsWithChildren } from 'react';
import {
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
  type FlexAlignType,
  type FlexStyle,
} from 'react-native';
import type { Spacing } from '../../styles/Spacer/Spacer.types';
import { transformSpacing } from '../../styles/Spacer/Spacer.style';
import { relativeX, relativeY } from '../../utils/layout';

export type LayoutProps = {
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
  ViewProps;

export function Layout(props: PropsWithChildren<LayoutProps>) {
  const style: ViewStyle = {
    alignItems: props.center ? 'center' : undefined,
    ...transformSpacing({ margin: props.margin, padding: props.padding }),
    justifyContent: props.spaceEven
      ? 'space-evenly'
      : props.spaceBetween
        ? 'space-between'
        : props.centerX
          ? 'center'
          : undefined,
    width: props.width ? relativeX(props.width) : undefined,
    height: props.height ? relativeY(props.height) : undefined,
    flexDirection: props.flexDirection,
    backgroundColor: props.backgroundColor,
    flexWrap: props.wrap ? 'wrap' : 'nowrap',
    alignSelf: props.alignSelf,
  };
  return (
    <View {...props} style={[style, props.style]}>
      {props.children}
    </View>
  );
}
