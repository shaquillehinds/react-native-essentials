import type { Animated, ViewStyle } from 'react-native';

export type XYValue = { x: Animated.Value; y: Animated.Value };
export type XYNumber = { x: number; y: number };
export type XY = XYValue | XYNumber;

export type InitialValue = number | AnimatedValue | XYNumber;

export type AnimatedValue = Animated.AnimatedValue | Animated.AnimatedValueXY;

export type AnimateComponentAnimationConfig =
  | (Animated.TimingAnimationConfig & { type: 'timing' })
  | (Animated.SpringAnimationConfig & { type: 'spring' })
  | (Animated.DecayAnimationConfig & { type: 'decay' });

export type AnimateComponentRef<T extends InitialValue> = {
  stop: () => void;
  start: () => void;
  reset: () => void;
  reverse: () => void;
  setValue: (value: T) => void;
  value: T extends XY ? Animated.AnimatedValueXY : Animated.Value;
};
export type AnimateComponentProps<T extends InitialValue> =
  React.PropsWithChildren<{
    ref?: React.RefObject<AnimateComponentRef<T> | null>;
    initialPosition: T;
    toPosition:
      | AnimateComponentAnimationConfig[]
      | AnimateComponentAnimationConfig;
    style: (
      value: T extends XY ? Animated.AnimatedValueXY : Animated.Value
    ) => ViewStyle;
    autoStart?: boolean;
    returnToStart?: boolean;
    loop?: number;
  }>;
