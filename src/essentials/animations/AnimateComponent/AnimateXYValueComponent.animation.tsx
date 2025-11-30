import { useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { Animated } from 'react-native';
import type {
  AnimateComponentAnimationConfig,
  AnimateComponentProps,
  XYNumber,
} from './AnimateComponent.types';

export function AnimateXYValueComponent(
  props: AnimateComponentProps<XYNumber>
) {
  const compositionRef = useRef<Animated.CompositeAnimation | null>(null);
  const animatedValue = useRef(
    new Animated.ValueXY(props.initialPosition)
  ).current;

  useEffect(() => {
    if (!Array.isArray(props.toPosition)) {
      let composition: Animated.CompositeAnimation | null = null;
      const config = props.toPosition;
      composition = animationSwitcher(animatedValue, config)!;
      if (props.returnToStart && config.type !== 'decay')
        composition = Animated.sequence([
          composition,
          animationSwitcher(animatedValue, {
            ...config,
            toValue: props.initialPosition,
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
          composition = animationSwitcher(animatedValue, firstConfig)!;
          if (props.returnToStart && firstConfig.type !== 'decay')
            composition = Animated.sequence([
              composition,
              animationSwitcher(animatedValue, {
                ...firstConfig,
                toValue: props.initialPosition,
              })!,
            ]);
          if (props.loop)
            composition = Animated.loop(composition, {
              iterations: props.loop,
            });
        } else {
          composition = Animated.sequence([
            ...props.toPosition.filterMap((config) =>
              animationSwitcher(animatedValue, config)
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
        if (config.type !== 'decay')
          animationSwitcher(animatedValue, {
            ...config,
            toValue: props.initialPosition,
          }).start();
      } else {
        const length = props.toPosition.length;
        if (props.toPosition.length) {
          if (length === 1 && props.toPosition[0]) {
            const firstConfig = props.toPosition[0];
            if (props.returnToStart && firstConfig.type !== 'decay')
              animationSwitcher(animatedValue, {
                ...firstConfig,
                toValue: props.initialPosition,
              }).start();
          } else {
            Animated.sequence([
              ...props.toPosition.filterMap((config) => {
                if (config.type !== 'decay')
                  return animationSwitcher(animatedValue, {
                    ...config,
                    toValue: props.initialPosition,
                  });
                return undefined;
              }),
            ]);
          }
        }
      }
    },
    setValue: (value: XYNumber) => animatedValue.setValue(value),
    value: animatedValue,
  }));

  const style = useMemo(() => props.style(animatedValue), []);
  return <Animated.View style={style}>{props.children}</Animated.View>;
}

function animationSwitcher(
  value: Animated.ValueXY,
  config: AnimateComponentAnimationConfig
) {
  if (config.type === 'spring') return Animated.spring(value, config);
  if (config.type === 'decay') return Animated.decay(value, config);
  return Animated.timing(value, config);
}
