type FilterMapFunc<T, E> = (arr: T, index: number) => E;

export function filterMap<T, E>(arr: T[], func: FilterMapFunc<T, E>) {
  const mapped: ReturnType<FilterMapFunc<T, E>>[] = [];
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (!item) continue;
    const mappedValue = func(item, i);
    if (mappedValue !== null && mappedValue !== undefined)
      mapped.push(mappedValue);
  }
  return mapped as NonNullable<E>[];
}
