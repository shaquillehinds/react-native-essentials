import { useRef } from "react";
import { Animated } from "react-native";

export default function useAnimatedValues(
  initialValues: number[],
  config?: Animated.AnimatedConfig
): Animated.Value[] {
  const ref = useRef<null | Animated.Value[]>(null);
  if (ref.current == null) {
    ref.current = initialValues.map(
      (initialValue) => new Animated.Value(initialValue, config)
    );
  }
  return ref.current;
}
