export { filterMap } from './filterMap';
export { measureAsync } from './measureAsync';
export { getSequantialRandomId } from './randomSequentialId';
export * as Scheduler from './Scheduler';
export { wait } from './wait';
export * from './layout';

export declare namespace globalThis {
  export var is: GlobalIs;
  export var isDef: (value: unknown) => boolean;
  export var errMsg: (error: unknown) => string;
  export interface Array<T> {
    filterMap<E>(func: FilterMapFunc<T, E>): NonNullable<E>[];
  }
}
