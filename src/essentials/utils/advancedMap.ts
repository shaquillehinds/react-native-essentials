export type AdvancedMapFunc<T, E> = (arr: T, index: number) => E;
//prettier-ignore
export type OmitTypes = "array" | "string" | "number" | "undefined" | "null" | "object" | "nullable" | 'function' |'bigint' | 'boolean' | 'symbol'
export type AdvancedMapOptions<T, E> = {
  omit?: Record<OmitTypes, boolean>;
  insertNotFound?: {
    insertion: E;
    find: (arr: T | undefined, index: number) => boolean;
  };
};
export function advancedMap<T, E>(
  arr: T[],
  func: AdvancedMapFunc<T | undefined, E>,
  opts?: AdvancedMapOptions<T, E>
) {
  const mapped: ReturnType<AdvancedMapFunc<T, E>>[] = [];
  let shouldNotInsert: boolean | undefined;
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
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
}
