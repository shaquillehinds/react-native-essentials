import { useEffect } from 'react';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import ArCircle from '../svgs/ArcCircle';

export type ArcSpinnerAnimationProps = {
  size?: number;
  color?: string;
};

export function ArcSpinnerAnimation({
  size = 24,
  color = '#999',
}: ArcSpinnerAnimationProps) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1000,
        easing: Easing.linear,
      }),
      -1
    );
    return () => {
      cancelAnimation(rotation);
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View style={[{ width: size, height: size }, animatedStyle]}>
      <ArCircle color={color} size={size} />
    </Animated.View>
  );
}
