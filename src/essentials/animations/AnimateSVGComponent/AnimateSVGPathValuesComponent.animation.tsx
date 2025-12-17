import { useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { Animated, useAnimatedValue } from 'react-native';
import type { PathProps } from 'react-native-svg';
import { AnimatedPath } from './animatedSVGComponents';
import type {
  AnimateSVGComponentAnimationConfig,
  AnimateSVGPathComponentValuesProps,
} from './animateSVGPathComponent.types';
import useAnimatedValues from '../../hooks/useAnimatedValues';

export function AnimateSVGPathValuesComponent(
  props: AnimateSVGPathComponentValuesProps
) {
  const compositionRef = useRef<Animated.CompositeAnimation | null>(null);
  const defaultValue = useAnimatedValue(0);
  const animatedValues = useAnimatedValues(
    Array.from({ length: props.animatedPathProps.length }, () => 0)
  );

  const inputRange = useMemo(() => {
    const length = props.animatedPathProps.reduce((acc, config) => {
      return Math.max(acc, config.to.length);
    }, 0);
    const step = 1 / length;
    let current = 0;
    const range = Array.from({ length: length - 1 }, () => (current += step));
    range.unshift(0);
    range.push(1);
    return range;
  }, []);

  const animatedPathProps = useMemo(() => {
    return props.animatedPathProps.reduce((acc, prop, index) => {
      return {
        ...acc,
        [prop.name]: (prop.config
          ? animatedValues[index]!
          : defaultValue
        ).interpolate({
          inputRange,
          outputRange: inputRange.map((_, index) => {
            if (index === 0) return prop.from;
            if (prop.to[index - 1]) return prop.to[index - 1];
            return prop.to[prop.to.length - 1];
          }) as number[] | string[],
        }),
      };
    }, {} as PathProps);
  }, [props.pathProps, defaultValue, animatedValues, inputRange]);

  useEffect(() => {
    const length = props.animatedPathProps.length;
    if (length) {
      let composition: Animated.CompositeAnimation | null = null;
      const compose = (toValue: number, reverse?: boolean) => {
        const pathProps = reverse
          ? [...props.animatedPathProps].reverse()
          : props.animatedPathProps;
        const values = reverse ? [...animatedValues].reverse() : animatedValues;
        return pathProps.map(
          (prop, index) =>
            animationSwitcher(prop.config ? values[index]! : defaultValue, {
              ...(prop.config ? prop.config : props.config),
              useNativeDriver: true,
              toValue,
            })!
        );
      };
      const key = props.isSequence ? 'sequence' : 'parallel';
      composition = Animated[key](compose(1));
      if (props.returnToStart)
        composition = Animated.sequence([
          composition,
          Animated[key](compose(0, true)),
        ]);
      if (props.loop)
        composition = Animated.loop(composition, {
          iterations: props.loop,
        });
      compositionRef.current = composition;
      if (props.autoStart) composition.start();
    }
  }, [props]);

  useImperativeHandle(props.ref, () => ({
    stop: () => compositionRef.current?.stop(),
    start: () => compositionRef.current?.start(),
    reset: () => compositionRef.current?.reset(),
    reverse: () => {
      compositionRef.current?.stop();
      const key = props.isSequence ? 'sequence' : 'parallel';
      Animated[key](
        [...props.animatedPathProps].reverse().map(
          (prop, index) =>
            animationSwitcher(
              prop.config
                ? [...animatedValues].reverse()[index]!
                : defaultValue,
              {
                ...(prop.config ? prop.config : props.config),
                useNativeDriver: true,
                toValue: 1,
              }
            )!
        )
      ).start();
    },
    values: animatedValues,
  }));

  return <AnimatedPath {...props.pathProps} {...animatedPathProps} />;
}

function animationSwitcher(
  value: Animated.Value,
  config: AnimateSVGComponentAnimationConfig & { toValue: number }
) {
  if (config.type === 'spring') return Animated.spring(value, config);
  return Animated.timing(value, config);
}
