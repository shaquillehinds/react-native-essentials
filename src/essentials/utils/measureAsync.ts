import type { RefObject } from 'react';
import type {
  TextInput,
  NativeSyntheticEvent,
  View,
  Image,
} from 'react-native';

export type MeasureInputAsyncResponse = {
  transX: number;
  transY: number;
  width: number;
  height: number;
  pageX: number;
  pageY: number;
} | null;

export async function measureAsync(
  prop: NativeSyntheticEvent<unknown> | RefObject<View | TextInput | Image>
) {
  if ('currentTarget' in prop) {
    return await new Promise<MeasureInputAsyncResponse>((res) => {
      prop.currentTarget.measure(
        (transX, transY, width, height, pageX, pageY) => {
          res({ transX, transY, width, height, pageX, pageY });
        }
      );
    });
  }
  return await new Promise<MeasureInputAsyncResponse>((res) => {
    if (!prop.current) return res(null);
    prop.current.measure((transX, transY, width, height, pageX, pageY) => {
      res({ transX, transY, width, height, pageX, pageY });
    });
  });
}
