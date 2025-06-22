import { useRef } from 'react';
import type { GestureResponderEvent, ViewProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';

interface PressProps extends ViewProps {
  onPress?: (e: GestureResponderEvent) => void;
  onLongPress?: (e: GestureResponderEvent) => void;
  disabled?: boolean;
  activeOpacity?: number;
  stopPropagation?: boolean;
  preventDefault?: boolean;
  persist?: boolean;
}

export function Press({
  style,
  disabled,
  activeOpacity,
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
      style={[style, animatedStyle]}
      onTouchStart={(e) => {
        props.stopPropagation && e.stopPropagation();
        props.preventDefault && e.preventDefault();
        props.persist && e.persist();
        if (disabled) return;
        activateRef.current = true;
        scale.value = withSpring(0.95);
        opacity.value = withSpring(activeOpacity || 0.9);
        touchStartPosition.current = {
          x: e.nativeEvent.pageX,
          y: e.nativeEvent.pageY,
        };
        setTimeout(() => {
          if (!activateRef.current) return;
          scale.value = withSpring(1);
          opacity.value = withSpring(1);
          activateRef.current = false;
          props.onLongPress?.(e);
        }, 1000);
      }}
      onTouchEnd={(e) => {
        props.stopPropagation && e.stopPropagation();
        props.preventDefault && e.preventDefault();
        props.persist && e.persist();
        if (disabled) return;
        if (!activateRef.current) return;
        setTimeout(() => props.onPress?.(e), 100);
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
