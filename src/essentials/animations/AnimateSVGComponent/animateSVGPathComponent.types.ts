import type { Animated } from "react-native";
import type { PathProps } from "react-native-svg";

export type TimingSVGAnimationConfig = Omit<
  Animated.TimingAnimationConfig,
  "toValue"
>;
export type SpringSVGAnimationConfig = Omit<
  Animated.SpringAnimationConfig,
  "toValue"
>;

export type AnimateSVGComponentAnimationConfig =
  | (TimingSVGAnimationConfig & { type: "timing" })
  | (SpringSVGAnimationConfig & { type: "spring" });

export type AnimateSVGComponentBaseRef = {
  stop: () => void;
  start: () => void;
  reset: () => void;
  reverse: () => void;
};
export type AnimateSVGComponentValueRef = AnimateSVGComponentBaseRef & {
  value: Animated.Value;
};
export type AnimateSVGComponentValuesRef = AnimateSVGComponentBaseRef & {
  values: Animated.Value[];
};

export type AnimatedSVGPathProp =
  | {
      name: keyof PathProps;
      config?: AnimateSVGComponentAnimationConfig;
      from: number;
      to: number[];
    }
  | {
      name: keyof PathProps;
      config?: AnimateSVGComponentAnimationConfig;
      from: string;
      to: string[];
    };

export type AnimateSVGPathComponentValueProps = React.PropsWithChildren<{
  ref?: React.RefObject<AnimateSVGComponentValueRef | null>;
  mode: "InterpolatePathProps";
  animationConfig:
    | AnimateSVGComponentAnimationConfig
    | AnimateSVGComponentAnimationConfig[];
  pathProps: (
    value: Animated.Value,
    options: {
      inputRange: number[];
    }
  ) => {
    [key in keyof PathProps]?:
      | PathProps[key]
      | Animated.AnimatedInterpolation<string | number>;
  };
  autoStart?: boolean;
  returnToStart?: boolean;
  loop?: number;
}>;
export type AnimateSVGPathComponentValuesProps = React.PropsWithChildren<{
  ref?: React.RefObject<AnimateSVGComponentValuesRef | null>;
  mode: "AnimatedPathProps";
  config: AnimateSVGComponentAnimationConfig;
  pathProps: PathProps;
  animatedPathProps: AnimatedSVGPathProp[];
  isSequence?: boolean;
  autoStart?: boolean;
  returnToStart?: boolean;
  loop?: number;
}>;
export type AnimateSVGPathComponentProps =
  | Omit<AnimateSVGPathComponentValuesProps, "pathProps">
  | AnimateSVGPathComponentValueProps;
