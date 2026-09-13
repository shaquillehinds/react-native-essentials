import { useEffect } from 'react';
import {
  StyleSheet,
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export type SkeletonLoadingIndicatorProps = {
  colors?: [string, string];
  disableAnimation?: boolean;
} & ViewProps;

export function SkeletonViewIndicator({
  style,
  colors,
  disableAnimation,
  children,
  ...props
}: SkeletonLoadingIndicatorProps) {
  const offset = useSharedValue(0);
  useEffect(() => {
    if (!disableAnimation)
      offset.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
    else cancelAnimation(offset);
    return () => {
      cancelAnimation(offset);
    };
  }, [disableAnimation]);

  const animatedProps = useAnimatedProps(() => {
    const start = -offset.value * 100;
    const end = start + 200;
    return {
      x1: `${start}%`,
      x2: `${end}%`,
    };
  });

  const baseStyle: StyleProp<ViewStyle> = { overflow: 'hidden' };

  const colorA = colors?.[0] || '#ECECEC';
  const colorB = colors?.[1] || '#FBFAFE';

  return (
    <View {...props} style={[baseStyle, style]}>
      <View style={{ opacity: 0 }}>{children}</View>
      <Svg style={StyleSheet.absoluteFill}>
        <Defs>
          <AnimatedLinearGradient
            id="grad"
            y1="0%"
            y2="0%"
            animatedProps={animatedProps}
          >
            <Stop offset="0%" stopColor={colorA} stopOpacity="1" />
            <Stop offset="100%" stopColor={colorB} stopOpacity="1" />
          </AnimatedLinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
      </Svg>
    </View>
  );
}
