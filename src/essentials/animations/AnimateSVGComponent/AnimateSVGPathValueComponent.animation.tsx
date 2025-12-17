import { useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { Animated, useAnimatedValue } from 'react-native';
import type { PathProps } from 'react-native-svg';
import { AnimatedPath } from './animatedSVGComponents';
import type {
  AnimateSVGComponentAnimationConfig,
  AnimateSVGPathComponentValueProps,
} from './animateSVGPathComponent.types';

export function AnimateSVGPathValueComponent(
  props: AnimateSVGPathComponentValueProps
) {
  const compositionRef = useRef<Animated.CompositeAnimation | null>(null);
  const animatedValue = useAnimatedValue(0);

  const inputRange = useMemo(() => {
    if (Array.isArray(props.animationConfig)) {
      const length = props.animationConfig.length;
      const step = 1 / length;
      let current = 0;
      const range = props.animationConfig.map((_config, index) => {
        if (index === length - 1) return 1;
        current += step;
        return Number(current.toFixed(2));
      });
      range.unshift(0);
      return range;
    } else {
      return [0, 1];
    }
  }, []);
  useEffect(() => {
    if (!Array.isArray(props.animationConfig)) {
      let composition: Animated.CompositeAnimation | null = null;
      const config = props.animationConfig;
      composition = animationSwitcher(animatedValue, {
        ...config,
        toValue: 1,
      })!;
      if (props.returnToStart)
        composition = Animated.sequence([
          composition,
          animationSwitcher(animatedValue, {
            ...config,
            toValue: 0,
          })!,
        ]);
      if (props.loop)
        composition = Animated.loop(composition, { iterations: props.loop });
      compositionRef.current = composition;
      if (props.autoStart) composition.start();
    } else {
      const length = props.animationConfig.length;
      if (props.animationConfig.length) {
        let composition: Animated.CompositeAnimation | null = null;
        if (length === 1 && props.animationConfig[0]) {
          const firstConfig = props.animationConfig[0];
          composition = animationSwitcher(animatedValue, {
            ...firstConfig,
            toValue: 1,
          })!;
          if (props.returnToStart)
            composition = Animated.sequence([
              composition,
              animationSwitcher(animatedValue, {
                ...firstConfig,
                toValue: 0,
              })!,
            ]);
          if (props.loop)
            composition = Animated.loop(composition, {
              iterations: props.loop,
            });
        } else {
          composition = Animated.sequence([
            ...props.animationConfig.filterMap(
              (config, index) =>
                animationSwitcher(animatedValue, {
                  ...config,
                  toValue: inputRange[index + 1]!,
                })!
            ),
          ]);
          if (props.loop)
            composition = Animated.loop(composition, {
              iterations: props.loop,
            });
        }
        compositionRef.current = composition;
        if (props.autoStart) composition.start();
      }
    }
  }, [props]);

  useImperativeHandle(props.ref, () => ({
    stop: () => compositionRef.current?.stop(),
    start: () => compositionRef.current?.start(),
    reset: () => compositionRef.current?.reset(),
    reverse: () => {
      compositionRef.current?.stop();
      if (!Array.isArray(props.animationConfig)) {
        const config = props.animationConfig;
        animationSwitcher(animatedValue, {
          ...config,
          toValue: 0,
        }).start();
      } else {
        const length = props.animationConfig.length;
        if (props.animationConfig.length) {
          if (length === 1 && props.animationConfig[0]) {
            const firstConfig = props.animationConfig[0];
            animationSwitcher(animatedValue, {
              ...firstConfig,
              toValue: 0,
            }).start();
          } else {
            Animated.sequence([
              ...[...props.animationConfig].reverse().map((config, index) => {
                return animationSwitcher(animatedValue, {
                  ...config,
                  toValue: inputRange[inputRange.length - index - 1]!,
                });
              }),
            ]);
          }
        }
      }
    },
    setValue: (value: number) => animatedValue.setValue(value),
    value: animatedValue,
  }));

  const pathProps = useMemo(
    () => props.pathProps(animatedValue, { inputRange }),
    []
  );
  return <AnimatedPath {...(pathProps as PathProps)} />;
}

function animationSwitcher(
  value: Animated.Value,
  config: AnimateSVGComponentAnimationConfig & { toValue: number }
) {
  if (config.type === 'spring') return Animated.spring(value, config);
  return Animated.timing(value, config);
}
