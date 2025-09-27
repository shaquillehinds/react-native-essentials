export type MergeStringRecordsOptions = {
  obj1: Record<string, string>;
  obj2: Record<string, string>;
  overwrite?: boolean; // default: true
};

export function mergeStringRecords({
  obj1,
  obj2,
  overwrite = true,
}: MergeStringRecordsOptions): Record<string, string> {
  const result: Record<string, string> = { ...obj1 };

  for (const key in obj2) {
    if (Object.prototype.hasOwnProperty.call(obj2, key)) {
      if (overwrite || !(key in result)) {
        result[key] = obj2[key]!;
      }
    }
  }

  return result;
}
