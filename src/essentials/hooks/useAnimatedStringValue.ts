import { useRef } from 'react';
import { Animated } from 'react-native';

export function useAnimatedStringValue(
  inputRange: number[],
  outputRange: string[],
  config?: Animated.AnimatedConfig
) {
  const ref = useRef<null | Animated.Value>(null);
  if (ref.current == null) {
    ref.current = new Animated.Value(inputRange[0] ?? 0, config);
  }
  return {
    value: ref.current,
    interpolatedValue: ref.current.interpolate({
      inputRange,
      outputRange,
    }),
  };
}
