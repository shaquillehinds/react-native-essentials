import type { GestureResponderEvent } from 'react-native';

export type GestureResponderNativeEventSnapshot = Pick<
  GestureResponderEvent['nativeEvent'],
  | 'pageX'
  | 'pageY'
  | 'locationX'
  | 'locationY'
  | 'timestamp'
  | 'identifier'
  | 'target'
  | 'force'
>;

export function snapShotGestureResponderEvent(
  event: GestureResponderEvent
): GestureResponderNativeEventSnapshot {
  const {
    pageX,
    pageY,
    locationX,
    locationY,
    timestamp,
    identifier,
    target,
    force,
  } = event.nativeEvent;

  return {
    pageX,
    pageY,
    locationX,
    locationY,
    timestamp,
    identifier,
    target,
    force,
  };
}
