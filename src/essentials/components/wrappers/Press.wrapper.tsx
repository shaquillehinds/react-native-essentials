import { useRef } from 'react';
import type { GestureResponderEvent, ViewProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import {
  snapShotGestureResponderEvent,
  type GestureResponderNativeEventSnapshot,
} from '../../utils';

export interface PressProps extends ViewProps {
  disableAnimation?: boolean;
  onPress?: (e: GestureResponderEvent) => void;
  onLongPress?: (
    nativeEventSnapshot: GestureResponderNativeEventSnapshot
  ) => void;
  longPressDuration?: number;
  disabled?: boolean;
  activationDelay?: number;
  activeOpacity?: number;
  stopPropagation?: boolean;
  preventDefault?: boolean;
  persist?: boolean;
}

export function Press({
  style,
  disabled,
  onPress,
  onLongPress,
  activeOpacity,
  disableAnimation,
  longPressDuration,
  activationDelay,
  stopPropagation,
  preventDefault,
  persist,
  ...props
}: PressProps) {
  const activateRef = useRef(false);

  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const touchStartPosition = useRef({ x: 0, y: 0 });
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: disabled ? 0.5 : opacity.value,
  }));

  return (
    <Animated.View
      {...props}
      style={[style, disableAnimation ? {} : animatedStyle]}
      onTouchStart={(e) => {
        stopPropagation && e.stopPropagation();
        preventDefault && e.preventDefault();
        persist && e.persist();
        if (disabled) return;
        activateRef.current = true;
        scale.value = withSpring(0.95);
        opacity.value = withSpring(activeOpacity || 0.9);
        touchStartPosition.current = {
          x: e.nativeEvent.pageX,
          y: e.nativeEvent.pageY,
        };
        const snapshot = snapShotGestureResponderEvent(e);
        setTimeout(() => {
          if (!activateRef.current) return;
          scale.value = withSpring(1);
          opacity.value = withSpring(1);
          activateRef.current = false;
          onLongPress?.(snapshot);
        }, longPressDuration || 800);
      }}
      onTouchEnd={(e) => {
        stopPropagation && e.stopPropagation();
        preventDefault && e.preventDefault();
        persist && e.persist();
        if (disabled) return;
        if (!activateRef.current) {
          return;
        }
        activationDelay
          ? setTimeout(() => onPress?.(e), activationDelay)
          : onPress?.(e);
      }}
      onTouchEndCapture={() => {
        setTimeout(() => {
          scale.value = withSpring(1);
          opacity.value = withSpring(1);
          activateRef.current = false;
        }, 50);
      }}
      onTouchMove={(e) => {
        if (disabled) return;
        if (!activateRef.current) return;
        const maxDistance = 10;
        const isDisabled =
          Math.abs(e.nativeEvent.pageX - touchStartPosition.current.x) >
            maxDistance ||
          Math.abs(e.nativeEvent.pageY - touchStartPosition.current.y) >
            maxDistance;
        if (isDisabled) {
          scale.value = withSpring(1);
          opacity.value = withSpring(1);
          activateRef.current = false;
        }
      }}
    />
  );
}
