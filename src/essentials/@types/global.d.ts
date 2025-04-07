type NonFalsy<T> = Exclude<T, 0 | '' | false | null>;
type GlobalIs = <T>(value: T) => NonFalsy<T> | undefined;

type FilterMapFunc<T, E> = (arr: T, index: number) => E;

declare namespace globalThis {
  var is: GlobalIs;
  var isDef: (value: unknown) => boolean;
  var errMsg: (error: unknown) => string;
  interface Array<T> {
    filterMap<E>(func: FilterMapFunc<T, E>): NonNullable<E>[];
  }
}
