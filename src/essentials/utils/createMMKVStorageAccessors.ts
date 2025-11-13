import {
  MMKV,
  useMMKVBoolean,
  useMMKVBuffer,
  useMMKVNumber,
  useMMKVObject,
  useMMKVString,
} from 'react-native-mmkv';

export const storageAccessorsInstanceID = 'rne-csa';
export const storageAccessorsInstance = new MMKV({
  id: storageAccessorsInstanceID,
});

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
      console.error($lf(26), error);
      return undefined;
    }
  };
  const remove = () => {
    const item = retrieve();
    storageAccessorsInstance.delete(key);
    return item;
  };
  const useString = () => useMMKVString(key, storageAccessorsInstance);
  const useNumber = () => useMMKVNumber(key, storageAccessorsInstance);
  const useBoolean = () => useMMKVBoolean(key, storageAccessorsInstance);
  const useObject = () => useMMKVObject(key, storageAccessorsInstance);
  const useBuffer = () => useMMKVBuffer(key, storageAccessorsInstance);
  return {
    store,
    retrieve,
    remove,
    useString,
    useNumber,
    useBoolean,
    useObject,
    useBuffer,
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
      console.error($lf(72), error);
      return undefined;
    }
  };
  const remove = (keySuffix: string) => {
    const key = baseKey + '-' + keySuffix;
    const item = retrieve(keySuffix);
    storageAccessorsInstance.delete(key);
    return item;
  };
  const useString = (keySuffix: string) =>
    useMMKVString(`${baseKey}-${keySuffix}`, storageAccessorsInstance);
  const useNumber = (keySuffix: string) =>
    useMMKVNumber(`${baseKey}-${keySuffix}`, storageAccessorsInstance);
  const useBoolean = (keySuffix: string) =>
    useMMKVBoolean(`${baseKey}-${keySuffix}`, storageAccessorsInstance);
  const useObject = (keySuffix: string) =>
    useMMKVObject(`${baseKey}-${keySuffix}`, storageAccessorsInstance);
  const useBuffer = (keySuffix: string) =>
    useMMKVBuffer(`${baseKey}-${keySuffix}`, storageAccessorsInstance);
  return {
    store,
    retrieve,
    remove,
    useString,
    useNumber,
    useBoolean,
    useObject,
    useBuffer,
  };
};

function $lf(n: number) {
  return '$lf|essentials/utils/createMMKVStorageAccessors.ts:' + n + ' >';
  // Automatically injected by Log Location Injector vscode extension
}
