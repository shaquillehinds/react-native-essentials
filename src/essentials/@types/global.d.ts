type NonFalsy<T> = Exclude<T, 0 | '' | false | null>;
type GlobalIs = <T>(value: T) => NonFalsy<T> | undefined;

type FilterMapFunc<T, E> = (arr: T, index: number) => E;

declare namespace globalThis {
  export var is: GlobalIs;
  export var isDef: (value: unknown) => boolean;
  export var errMsg: (error: unknown) => string;
  export interface Array<T> {
    filterMap<E>(func: FilterMapFunc<T, E>): NonNullable<E>[];
  }
}
