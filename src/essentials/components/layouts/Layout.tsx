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
  type DimensionValue,
} from 'react-native';
import type { Spacing } from '../../styles/Spacer/Spacer.types';
import { transformSpacing } from '../../styles/Spacer/Spacer.style';
import {
  LoadingIndicator,
  SkeletonViewIndicator,
  type LoadingIndicatorProps,
  type SkeletonLoadingIndicatorProps,
} from '../indicators';
import { useDeviceOrientation } from '../../hooks';
import { borderSizes, radiusSizes } from '../../utils/sizeCalculations';
import type { BorderSize, RadiusSize } from '../buttons/Button.types';

export type LayoutProps<Scrollable extends boolean | undefined = undefined> = {
  skeleton?: { colors?: SkeletonLoadingIndicatorProps['colors'] } | boolean;
  loading?: LoadingIndicatorProps | boolean;
  scrollable?: Scrollable;
  wrap?: boolean;
  /**
   * This number will be used as a percentage of the screen width, where 100 is 100% screen width or can be a string of percantage width of it's container
   */
  width?: DimensionValue;
  /**
   * This number will be used as a percentage of the screen height, where 100 is 100% screen height or can be a string of percantage height of it's container
   */
  height?: DimensionValue;
  /**
   * Sets both width and height to the same value as a percentage of the screen height. Where 100 is 100% screen height
   */
  square?: number;
  flex?: [number] | [number, number] | [number, number, DimensionValue];
  style?: StyleProp<ViewStyle>;
  center?: boolean;
  centerX?: boolean;
  absolute?: boolean;
  alignSelf?: FlexAlignType;
  spaceEnd?: boolean;
  spaceStart?: boolean;
  spaceEven?: boolean;
  spaceCenter?: boolean;
  spaceBetween?: boolean;
  flexDirection?: FlexStyle['flexDirection'];
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: BorderSize;
  borderRadius?: RadiusSize;
  top?: DimensionValue;
  bottom?: DimensionValue;
  left?: DimensionValue;
  right?: DimensionValue;
} & Spacing &
  (Scrollable extends true ? ScrollViewProps : ViewProps);

export function Layout<Scrollable extends boolean | undefined = undefined>({
  top,
  bottom,
  left,
  right,
  spaceCenter,
  spaceEnd,
  spaceStart,
  center,
  centerX,
  wrap,
  height,
  width,
  flex,
  loading,
  skeleton,
  absolute,
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
  square,
  borderColor,
  borderWidth,
  borderRadius,
  ...props
}: PropsWithChildren<LayoutProps<Scrollable>>) {
  const orientation = useDeviceOrientation();
  const viewStyle: ViewStyle = {
    ...transformSpacing({ margin, orientation }),
    width:
      typeof width === 'number'
        ? orientation.relativeX(width)
        : square
          ? orientation.relativeLong(square)
          : width,
    height:
      typeof height === 'number'
        ? orientation.relativeY(height)
        : square
          ? orientation.relativeLong(square)
          : height,
    borderColor: borderColor,
    borderWidth: borderWidth ? borderSizes[borderWidth] : undefined,
    borderRadius: borderRadius ? radiusSizes[borderRadius] : undefined,
    alignSelf,
    position: absolute ? 'absolute' : undefined,
    flex: flex?.[0],
    flexShrink: flex?.[1],
    flexBasis: flex?.[2],
    top,
    bottom,
    left,
    right,
  };
  const contentStyle: ViewStyle = {
    ...transformSpacing({ padding, orientation }),
    alignItems: center ? 'center' : undefined,
    flexDirection: flexDirection,
    backgroundColor: backgroundColor,
    flexWrap: wrap ? 'wrap' : 'nowrap',
    justifyContent: spaceEven
      ? 'space-evenly'
      : spaceBetween
        ? 'space-between'
        : centerX || spaceCenter
          ? 'center'
          : spaceStart
            ? 'flex-start'
            : spaceEnd
              ? 'flex-end'
              : undefined,
  };
  if (loading)
    return (
      <LoadingIndicator
        {...(typeof loading === 'boolean'
          ? { backgroundColor }
          : { backgroundColor, ...loading })}
      />
    );
  if (skeleton)
    return (
      <SkeletonViewIndicator
        {...props}
        style={[contentStyle, viewStyle, style]}
        colors={typeof skeleton !== 'boolean' ? skeleton.colors : undefined}
      />
    );
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
