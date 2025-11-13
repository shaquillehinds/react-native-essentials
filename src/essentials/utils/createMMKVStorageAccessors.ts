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
      console.error($lf(33), error);
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
  const useObject = () => useMMKVObject<T>(key, storageAccessorsInstance);
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
  const storedKeysKey = `#${baseKey}#`;
  const KEY = baseKey + '-';
  const keysDelimiter = '||';
  const retrieveKeys = () =>
    storageAccessorsInstance.getString(storedKeysKey) || '';
  const storeKey = (key: string) =>
    storageAccessorsInstance.set(
      storedKeysKey,
      retrieveKeys() + keysDelimiter + key
    );
  const removeKey = (key: string) =>
    storageAccessorsInstance.set(
      storedKeysKey,
      retrieveKeys().replace(keysDelimiter + key, '')
    );

  const store = (keySuffix: string, item: T) => {
    const key = KEY + keySuffix;
    storeKey(key);
    if (typeof item !== 'string')
      return storageAccessorsInstance.set(key, JSON.stringify(item));
    else return storageAccessorsInstance.set(key, item);
  };
  const retrieve = (keySuffix: string) => {
    const key = KEY + keySuffix;
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
      console.error($lf(96), error);
      return undefined;
    }
  };
  const retrieveAll = () => {
    const delimiter = keysDelimiter + KEY;
    const keys = retrieveKeys().split(delimiter);
    const items: T[] = [];
    for (const keySuffix of keys) {
      const item = retrieve(keySuffix);
      if (item) items.push(item);
    }
    return items;
  };
  const remove = (keySuffix: string) => {
    const key = KEY + keySuffix;
    removeKey(key);
    const item = retrieve(keySuffix);
    storageAccessorsInstance.delete(key);
    return item;
  };
  const removeAll = () => {
    const delimiter = keysDelimiter + KEY;
    const keys = retrieveKeys().split(delimiter);
    for (const keySuffix of keys) {
      keySuffix && storageAccessorsInstance.delete(KEY + keySuffix);
    }
  };
  const useString = (keySuffix: string) =>
    useMMKVString(KEY + keySuffix, storageAccessorsInstance);
  const useNumber = (keySuffix: string) =>
    useMMKVNumber(KEY + keySuffix, storageAccessorsInstance);
  const useBoolean = (keySuffix: string) =>
    useMMKVBoolean(KEY + keySuffix, storageAccessorsInstance);
  const useObject = (keySuffix: string) =>
    useMMKVObject<T>(KEY + keySuffix, storageAccessorsInstance);
  const useBuffer = (keySuffix: string) =>
    useMMKVBuffer(KEY + keySuffix, storageAccessorsInstance);
  return {
    store,
    retrieve,
    retrieveAll,
    remove,
    removeAll,
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
