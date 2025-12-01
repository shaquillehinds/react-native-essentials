import { useRef } from 'react';
import type { GestureResponderEvent, ViewProps } from 'react-native';
import { Animated } from 'react-native';
import {
  snapShotGestureResponderEvent,
  wait,
  type GestureResponderNativeEventSnapshot,
} from '../../utils';

export interface RNPressProps extends ViewProps {
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
  disableDoubleTapProtection?: boolean;
  minDoubleTapProtectionDuration?: number;
}

export function RNPress({
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
  disableDoubleTapProtection,
  minDoubleTapProtectionDuration,
  ...props
}: RNPressProps) {
  const activateRef = useRef(false);
  const moveCancelledRef = useRef(false);

  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const touchStartPosition = useRef({ x: 0, y: 0 });
  const prevActivatedTime = useRef(0);
  const longPressTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const minDurationToActivateAgain = minDoubleTapProtectionDuration || 750;

  const animatedStyle = {
    transform: [{ scale: scale }],
    opacity: disabled ? 0.5 : opacity,
  };
  const duration = 200;

  const pressIn = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: activeOpacity || 0.9,
        duration,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.95,
        duration,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const pressOut = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const resetPress = () => {
    setTimeout(() => {
      pressOut();
      activateRef.current = false;
    }, 50);
  };

  return (
    <Animated.View
      {...props}
      style={[style, disableAnimation ? {} : animatedStyle]}
      onTouchStart={(e) => {
        stopPropagation && e.stopPropagation();
        preventDefault && e.preventDefault();
        persist && e.persist();
        if (
          disabled ||
          (!disableDoubleTapProtection &&
            Date.now() - prevActivatedTime.current < minDurationToActivateAgain)
        ) {
          activateRef.current = false;
          return;
        }
        if (longPressTimeoutRef.current)
          clearTimeout(longPressTimeoutRef.current);
        activateRef.current = true;
        pressIn();
        touchStartPosition.current = {
          x: e.nativeEvent.pageX,
          y: e.nativeEvent.pageY,
        };
        const snapshot = snapShotGestureResponderEvent(e);
        longPressTimeoutRef.current = setTimeout(() => {
          if (!activateRef.current) return;
          pressOut();
          activateRef.current = false;
          onLongPress?.(snapshot);
        }, longPressDuration || 800);
      }}
      onTouchEnd={async (e) => {
        stopPropagation && e.stopPropagation();
        preventDefault && e.preventDefault();
        e.persist();
        if (!activateRef.current) {
          moveCancelledRef.current = false;
          return;
        }
        await wait(activationDelay || 50);
        if (moveCancelledRef.current) {
          moveCancelledRef.current = false;
          return;
        }
        onPress?.(e);
        prevActivatedTime.current = Date.now();
      }}
      onTouchEndCapture={resetPress}
      onTouchCancel={resetPress}
      onTouchMove={(e) => {
        if (!activateRef.current) {
          moveCancelledRef.current = false;
          return;
        }
        const maxDistance = 10;
        const isDisabled =
          Math.abs(e.nativeEvent.pageX - touchStartPosition.current.x) >
            maxDistance ||
          Math.abs(e.nativeEvent.pageY - touchStartPosition.current.y) >
            maxDistance;
        if (isDisabled && !moveCancelledRef.current) {
          moveCancelledRef.current = true;
          resetPress();
        }
      }}
    />
  );
}
