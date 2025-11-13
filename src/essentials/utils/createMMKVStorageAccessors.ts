import { MMKV } from 'react-native-mmkv';

export const storageAccessorsInstance = new MMKV({ id: 'rne-csa' });

export const createStorageAccessors = <T>(key: string) => {
  const store = (item: T) => {
    if (typeof item !== 'string')
      return storageAccessorsInstance.set(key, JSON.stringify(item));
    else return storageAccessorsInstance.set(key, item);
  };
  const retrieve = () => {
    try {
      const string = storageAccessorsInstance.getString(key);
      if (string) {
        try {
          return JSON.parse(string) as T;
        } catch (error) {
          return string as T;
        }
      }
      return undefined;
    } catch (error) {
      console.error($lf(23), error);
      return undefined;
    }
  };
  const remove = () => {
    const item = retrieve();
    storageAccessorsInstance.delete(key);
    return item;
  };
  return {
    store,
    retrieve,
    remove,
  };
};

export const createStorageAccessorsDynamic = <T>(baseKey: string) => {
  const store = (keySuffix: string, item: T) => {
    const key = baseKey + '-' + keySuffix;
    if (typeof item !== 'string')
      return storageAccessorsInstance.set(key, JSON.stringify(item));
    else return storageAccessorsInstance.set(key, item);
  };
  const retrieve = (keySuffix: string) => {
    const key = baseKey + '-' + keySuffix;
    try {
      const string = storageAccessorsInstance.getString(key);
      if (string) {
        try {
          return JSON.parse(string) as T;
        } catch (error) {
          return string as T;
        }
      }
      return undefined;
    } catch (error) {
      console.error($lf(59), error);
      return undefined;
    }
  };
  const remove = (keySuffix: string) => {
    const key = baseKey + '-' + keySuffix;
    const item = retrieve(keySuffix);
    storageAccessorsInstance.delete(key);
    return item;
  };
  return {
    store,
    retrieve,
    remove,
  };
};

function $lf(n: number) {
  return '$lf|essentials/utils/createMMKVStorageAccessors.ts:' + n + ' >';
  // Automatically injected by Log Location Injector vscode extension
}
