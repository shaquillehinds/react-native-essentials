/* eslint-disable no-extend-native */

export {};
export type NonFalsy<T> = Exclude<T, 0 | '' | false | null>;
export type GlobalIs = <T>(value: T) => NonFalsy<T> | undefined;

export type FilterMapFunc<T, E> = (arr: T, index: number) => E;
export type AdvancedMapFunc<T, E> = (arr: T, index: number) => E;
//prettier-ignore
export type OmitTypes = "array" | "string" | "number" | "undefined" | "null" | "object" | "nullable" | 'function' |'bigint' | 'boolean' | 'symbol'
export type AdvancedMapOptions<T, E> = {
  omit?: Record<OmitTypes, boolean>;
  insertNotFound?: { insertion: E; find: (arr: T, index: number) => boolean };
};

declare global {
  var is: GlobalIs;
  var isDef: (value: unknown) => boolean;
  var errMsg: (error: unknown) => string;

  interface Array<T> {
    filterMap<E>(func: FilterMapFunc<T, E>): NonNullable<E>[];
  }
  interface Array<T> {
    advancedMap<E>(
      func: AdvancedMapFunc<T, E>,
      opts?: AdvancedMapOptions<T, E>
    ): E[];
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
  if (!Array.prototype.filterMap) {
    Array.prototype.advancedMap = function <T, E>(
      func: AdvancedMapFunc<T, E>,
      opts?: AdvancedMapOptions<T, E>
    ) {
      const mapped: ReturnType<AdvancedMapFunc<T, E>>[] = [];
      let shouldNotInsert: boolean | undefined;
      for (let i = 0; i < this.length; i++) {
        const item = this[i];
        if (opts?.insertNotFound)
          if (shouldNotInsert === false)
            shouldNotInsert = !opts?.insertNotFound?.find(item, i);
        if (opts?.omit) {
          if (Array.isArray(item)) {
            if (opts.omit.array) continue;
          } else if (opts.omit[typeof item]) continue;
          else {
            if (!item && opts.omit.nullable) continue;
          }
        }
        const mappedValue = func(item, i);
        mapped.push(mappedValue);
      }
      if (
        opts?.insertNotFound &&
        (shouldNotInsert || shouldNotInsert === undefined)
      )
        mapped.push(opts?.insertNotFound?.insertion);
      return mapped as E[];
    };
  }
}
