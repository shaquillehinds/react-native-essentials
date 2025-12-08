export { filterMap, type FilterMapFunc } from './filterMap';
export * from './advancedMap';
export { measureAsync, type MeasureInputAsyncResponse } from './measureAsync';
export { getSequantialRandomId } from './randomSequentialId';
export * as Scheduler from './Scheduler';
export { wait } from './wait';
export * from './layout';
export * from './sizeCalculations';
export * from './snapshots/snapShotGestureResponderEvent';
// export * from './createMMKVStorageAccessors';
export * from './LanguageCodes';
export * from './mergeStringRecords';
export * from './mergeLanguagesRecords';
export * from './checkDependencies';

let mmkvExports: any;
try {
  require('react-native-mmkv');
  mmkvExports = require('./createMMKVStorageAccessors');
} catch {
  // MMKV not available, create stub
  mmkvExports = {
    createStorageAccessors: () => {
      throw new Error(
        'react-native-mmkv is required. Install: npx expo install react-native-mmkv'
      );
    },
    createStorageAccessorsDynamic: () => {
      throw new Error(
        'react-native-mmkv is required. Install: npx expo install react-native-mmkv'
      );
    },
  };
}

export const storageAccessorsInstance = mmkvExports.storageAccessorsInstance;
export const createStorageAccessors = mmkvExports.createStorageAccessors;
export const createStorageAccessorsDynamic =
  mmkvExports.createStorageAccessorsDynamic;
export const storageAccessorsInstanceID =
  mmkvExports.storageAccessorsInstanceID;
