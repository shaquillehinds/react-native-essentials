export * from './essentials/components/layouts';
export * from './essentials/constants/device.const';
export * from './essentials/algorithms';
export * from './essentials/hooks';
export * from './essentials/styles';
export * from './essentials/utils';
import './essentials/utils/global';
export const globalEssentials = require('./essentials/utils/global');

export declare namespace globalThis {
  export var is: GlobalIs;
  export var isDef: (value: unknown) => boolean;
  export var errMsg: (error: unknown) => string;
  export interface Array<T> {
    filterMap<E>(func: FilterMapFunc<T, E>): NonNullable<E>[];
  }
}
