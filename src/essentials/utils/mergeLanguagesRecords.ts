import type { LanguageCode } from './LanguageCodes';
import { mergeStringRecords } from './mergeStringRecords';

export type LanguagesRecord = Partial<
  Record<LanguageCode, Record<string, string>>
>;

export type MergeLanguagesRecordsOptions = {
  obj1: LanguagesRecord;
  obj2: LanguagesRecord;
  overwrite?: boolean; // default: true
};

export function mergeLanguagesRecords({
  obj1,
  obj2,
  overwrite = true,
}: MergeLanguagesRecordsOptions): LanguagesRecord {
  const result = { ...obj1 };

  for (const k in obj2) {
    const key = k as LanguageCode;
    if (Object.prototype.hasOwnProperty.call(obj2, key)) {
      const value = result[key];
      const value2 = obj2[key];
      if (!value2) continue;
      if (!value) result[key] = value2;
      else
        result[key] = mergeStringRecords({
          obj1: value,
          obj2: value2,
          overwrite,
        });
    }
  }

  return result;
}
