/* eslint-disable no-extend-native */

export {};
export type NonFalsy<T> = Exclude<T, 0 | '' | false | null>;
export type GlobalIs = <T>(value: T) => NonFalsy<T> | undefined;

export type FilterMapFunc<T, E> = (arr: T, index: number) => E;

declare global {
  var is: GlobalIs;
  var isDef: (value: unknown) => boolean;
  var errMsg: (error: unknown) => string;

  interface Array<T> {
    filterMap<E>(func: FilterMapFunc<T, E>): NonNullable<E>[];
  }
}

globalThis.is = function <T>(value: T) {
  return value ? value : undefined;
} as GlobalIs;
globalThis.isDef = function (value: unknown) {
  return value !== undefined;
};

globalThis.errMsg = function (error: unknown) {
  if (error instanceof Error) {
    return error.message;
  } else if (typeof error === 'string') {
    return error;
  } else {
    return JSON.stringify(error);
  }
};

if (!Array.prototype.filterMap) {
  Array.prototype.filterMap = function <T, E>(func: FilterMapFunc<T, E>) {
    const mapped: ReturnType<FilterMapFunc<T, E>>[] = [];
    for (let i = 0; i < this.length; i++) {
      const item = this[i];
      if (!item) continue;
      const mappedValue = func(item, i);
      if (mappedValue !== null && mappedValue !== undefined)
        mapped.push(mappedValue);
    }
    return mapped as NonNullable<E>[];
  };
}
