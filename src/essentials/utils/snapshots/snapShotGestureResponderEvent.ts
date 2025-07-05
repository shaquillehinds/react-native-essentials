import type { GestureResponderEvent } from 'react-native';

export type SafeResponderSnapshot = {
  pageX: number;
  pageY: number;
  locationX: number;
  locationY: number;
  timestamp: number;
  identifier?: string;
  target?: string;
};

export function snapShotGestureResponderEvent(
  event: GestureResponderEvent
): SafeResponderSnapshot {
  const { pageX, pageY, locationX, locationY, timestamp, identifier, target } =
    event.nativeEvent;

  return {
    pageX,
    pageY,
    locationX,
    locationY,
    timestamp,
    identifier,
    target,
  };
}
