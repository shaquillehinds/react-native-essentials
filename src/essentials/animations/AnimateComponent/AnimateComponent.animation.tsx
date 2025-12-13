import type {
  AnimateComponentAnimationConfig,
  AnimateComponentProps,
  AnimateComponentRef,
  InitialValue,
  XYNumber,
} from './AnimateComponent.types';
import {
  Animated,
  type AnimatableStringValue,
  type ViewStyle,
} from 'react-native';
import { AnimateXYValueComponent } from './AnimateXYValueComponent.animation';
import { AnimateValueComponent } from './AnimateValueComponent.animation';
import { AnimateStringValueComponent } from './AnimateStringValueComponent.animation';

export function AnimateComponent<T extends InitialValue>(
  props: AnimateComponentProps<
    T,
    T extends string ? true : false,
    T extends string ? true : false
  >
) {
  if (
    typeof props.initialPosition === 'number' ||
    props.initialPosition instanceof Animated.Value
  )
    return (
      <AnimateValueComponent
        {...props}
        initialPosition={props.initialPosition as number}
        toPosition={
          props.toPosition as AnimateComponentAnimationConfig<false, false>
        }
        style={props.style as (value: Animated.Value) => ViewStyle}
        ref={
          props.ref as React.RefObject<AnimateComponentRef<number>> | undefined
        }
      />
    );
  if (typeof props.initialPosition === 'string')
    return (
      <AnimateStringValueComponent
        {...props}
        toPosition={
          props.toPosition as AnimateComponentAnimationConfig<true, true>
        }
        initialPosition={props.initialPosition as string}
        style={props.style as (value: AnimatableStringValue) => ViewStyle}
        ref={
          props.ref as
            | React.RefObject<AnimateComponentRef<string, true>>
            | undefined
        }
      />
    );
  return (
    <AnimateXYValueComponent
      {...props}
      initialPosition={props.initialPosition as XYNumber}
      toPosition={
        props.toPosition as AnimateComponentAnimationConfig<false, false>
      }
      style={props.style as (value: Animated.ValueXY) => ViewStyle}
      ref={
        props.ref as React.RefObject<AnimateComponentRef<XYNumber>> | undefined
      }
    />
  );
}
