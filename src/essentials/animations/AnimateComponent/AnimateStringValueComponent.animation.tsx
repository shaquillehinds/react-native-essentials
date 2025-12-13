import { useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { Animated } from 'react-native';
import type {
  AnimateComponentAnimationConfig,
  AnimateComponentProps,
} from './AnimateComponent.types';
import { useAnimatedStringValue } from '../../hooks/useAnimatedStringValue';
import { stringArrayToNormalizedNumberArray } from '../../algorithms';

export function AnimateStringValueComponent(
  props: AnimateComponentProps<string, true, true>
) {
  const compositionRef = useRef<Animated.CompositeAnimation | null>(null);
  const toPosition = props.toPosition;
  const initialInputRange = Array.isArray(toPosition)
    ? stringArrayToNormalizedNumberArray([
        props.initialPosition,
        ...toPosition.map((config) => config.toValue as unknown as string),
      ])
    : [0, 1];
  const initialOutputRange = Array.isArray(toPosition)
    ? [
        props.initialPosition,
        ...toPosition.map((config) => config.toValue as unknown as string),
      ]
    : [props.initialPosition, toPosition.toValue as unknown as string];
  const { value: animatedValue, interpolatedValue } = useAnimatedStringValue(
    initialInputRange,
    initialOutputRange,
    {
      useNativeDriver: true,
    }
  );
  useEffect(() => {
    if (!Array.isArray(props.toPosition)) {
      let composition: Animated.CompositeAnimation | null = null;
      const config = props.toPosition;
      composition = animationSwitcher(
        animatedValue,
        config as AnimateComponentAnimationConfig<false, false>
      )!;
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
      const length = props.toPosition.length;
      if (props.toPosition.length) {
        let composition: Animated.CompositeAnimation | null = null;
        if (length === 1 && props.toPosition[0]) {
          const firstConfig = props.toPosition[0];
          composition = animationSwitcher(
            animatedValue,
            firstConfig as AnimateComponentAnimationConfig<false, false>
          )!;
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
            ...props.toPosition.filterMap((config) =>
              animationSwitcher(
                animatedValue,
                config as AnimateComponentAnimationConfig<false, false>
              )
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
      if (!Array.isArray(props.toPosition)) {
        const config = props.toPosition;
        animationSwitcher(animatedValue, {
          ...config,
          toValue: 0,
        }).start();
      } else {
        const length = props.toPosition.length;
        if (props.toPosition.length) {
          if (length === 1 && props.toPosition[0]) {
            const firstConfig = props.toPosition[0];
            animationSwitcher(animatedValue, {
              ...firstConfig,
              toValue: 0,
            }).start();
          } else {
            Animated.sequence([
              ...props.toPosition.filterMap((config) => {
                return animationSwitcher(animatedValue, {
                  ...config,
                  toValue: 0,
                });
              }),
            ]);
          }
        }
      }
    },
    value: interpolatedValue,
    setValue: undefined,
  }));

  const style = useMemo(
    () => props.style(interpolatedValue, { inputRange: initialInputRange }),
    []
  );
  return <Animated.View style={style}>{props.children}</Animated.View>;
}

function animationSwitcher(
  value: Animated.Value,
  config: AnimateComponentAnimationConfig
) {
  if (config.type === 'spring') return Animated.spring(value, config);
  if (config.type === 'decay') return Animated.decay(value, config);
  return Animated.timing(value, config);
}
