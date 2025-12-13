import type { AnimatableStringValue, Animated, ViewStyle } from 'react-native';

export type XYValue = { x: Animated.Value; y: Animated.Value };
export type XYNumber = { x: number; y: number };
export type XY = XYValue | XYNumber;

export type InitialValue =
  | number
  | AnimatedValue
  | XYNumber
  | AnimatableStringValue;

export type AnimatedValue =
  | Animated.AnimatedValue
  | Animated.AnimatedValueXY
  | AnimatableStringValue;

export interface TimingAnimationConfig<
  CanValueBeString extends boolean = false,
> extends Omit<Animated.TimingAnimationConfig, 'toValue'> {
  toValue: CanValueBeString extends true
    ? Animated.TimingAnimationConfig['toValue'] | string
    : Animated.TimingAnimationConfig['toValue'];
}
export interface SpringAnimationConfig<
  CanValueBeString extends boolean = false,
> extends Omit<Animated.SpringAnimationConfig, 'toValue'> {
  toValue: CanValueBeString extends true
    ? Animated.TimingAnimationConfig['toValue'] | string
    : Animated.SpringAnimationConfig['toValue'];
}

export type AnimateComponentAnimationConfig<
  ShouldOmitDecay extends boolean = false,
  CanValueBeString extends boolean = false,
> = ShouldOmitDecay extends false
  ?
      | (TimingAnimationConfig<CanValueBeString> & { type: 'timing' })
      | (SpringAnimationConfig<CanValueBeString> & { type: 'spring' })
      | (Animated.DecayAnimationConfig & { type: 'decay' })
  :
      | (TimingAnimationConfig<CanValueBeString> & { type: 'timing' })
      | (SpringAnimationConfig<CanValueBeString> & { type: 'spring' });

export type AnimateComponentRef<
  T extends InitialValue,
  CanSetValue extends boolean = false,
> = {
  stop: () => void;
  start: () => void;
  reset: () => void;
  reverse: () => void;
  setValue: CanSetValue extends true ? undefined : (value: T) => void;
  value: T extends XY
    ? Animated.AnimatedValueXY
    : Animated.Value | AnimatableStringValue;
};
export type AnimateComponentProps<
  T extends InitialValue,
  ShouldOmitDecay extends boolean,
  CanValueBeString extends boolean,
> = React.PropsWithChildren<{
  ref?: React.RefObject<AnimateComponentRef<T, ShouldOmitDecay> | null>;
  initialPosition: T;
  toPosition:
    | AnimateComponentAnimationConfig<ShouldOmitDecay, CanValueBeString>[]
    | AnimateComponentAnimationConfig<ShouldOmitDecay, CanValueBeString>;
  style: (
    value: T extends XY
      ? Animated.AnimatedValueXY
      : CanValueBeString extends true
        ? AnimatableStringValue
        : Animated.Value,
    options: {
      inputRange: T extends XY ? XYNumber[] : number[];
    }
  ) => ViewStyle;
  autoStart?: boolean;
  returnToStart?: boolean;
  loop?: number;
}>;
