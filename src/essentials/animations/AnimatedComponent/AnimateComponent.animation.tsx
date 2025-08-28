import AnimatedValueComponent from './AnimateValueComponent.animation';
import type {
  AnimateComponentProps,
  AnimateComponentRef,
  InitialValue,
  XYNumber,
} from './AnimateComponent.types';
import { Animated, type ViewStyle } from 'react-native';
import AnimateXYValueComponent from './AnimateXYValueComponent.animation';

export default function AnimateComponent<T extends InitialValue>(
  props: AnimateComponentProps<T>
) {
  if (
    typeof props.initialPosition === 'number' ||
    props.initialPosition instanceof Animated.Value
  )
    return (
      <AnimatedValueComponent
        {...props}
        initialPosition={props.initialPosition as number}
        style={props.style as (value: Animated.Value) => ViewStyle}
        ref={
          props.ref as React.RefObject<AnimateComponentRef<number>> | undefined
        }
      />
    );
  return (
    <AnimateXYValueComponent
      {...props}
      initialPosition={props.initialPosition as XYNumber}
      style={props.style as (value: Animated.ValueXY) => ViewStyle}
      ref={
        props.ref as React.RefObject<AnimateComponentRef<XYNumber>> | undefined
      }
    />
  );
}
