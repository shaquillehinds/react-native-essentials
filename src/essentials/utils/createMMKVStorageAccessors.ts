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
type BasicType = string | number | boolean;
//prettier-ignore
type HookType<T> = [T | undefined, (v: T | undefined | ((curr: T | undefined) => T | undefined)) => void];

export const createStorageAccessors = <T>(key: string) => {
  let itemType: 'string' | 'number' | 'boolean' | 'object' | undefined;
  const store = (item: T) => {
    const type = typeof item;
    switch (type) {
      case 'number': {
        itemType = type;
        return storageAccessorsInstance.set(key, item as number);
      }
      case 'boolean': {
        itemType = type;
        return storageAccessorsInstance.set(key, item as boolean);
      }
      case 'string': {
        itemType = type;
        return storageAccessorsInstance.set(key, item as string);
      }
      default: {
        itemType = 'object';
        return storageAccessorsInstance.set(key, JSON.stringify(item));
      }
    }
  };
  const retrieve = () => {
    try {
      switch (itemType) {
        case 'number':
          return storageAccessorsInstance.getNumber(key) as T | undefined;
        case 'boolean':
          return storageAccessorsInstance.getBoolean(key) as T | undefined;
        case 'string':
          return storageAccessorsInstance.getString(key) as T | undefined;
        default: {
          const item = storageAccessorsInstance.getString(key);
          if (item) {
            try {
              return JSON.parse(item) as T;
            } catch (error) {
              return item as T;
            }
          }
        }
      }
      return undefined;
    } catch (error) {
      console.error($lf(63), error);
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
  const use = () => {
    switch (itemType) {
      case 'number':
        return useMMKVNumber(key, storageAccessorsInstance) as HookType<T>;
      case 'boolean':
        return useMMKVBoolean(key, storageAccessorsInstance) as HookType<T>;
      case 'string':
        return useMMKVString(key, storageAccessorsInstance) as HookType<T>;
      case 'object':
        return useMMKVObject<T>(key, storageAccessorsInstance) as HookType<T>;
      default:
        return null;
    }
  };
  return {
    store,
    retrieve,
    remove,
    use,
    useString,
    useNumber,
    useBoolean,
    useObject,
    useBuffer,
  };
};

export const createStorageAccessorsDynamic = <T>(baseKey: string) => {
  let itemType: 'string' | 'number' | 'boolean' | 'object' | undefined;
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
    const type = typeof item;
    switch (type) {
      case 'number': {
        itemType = type;
        return storageAccessorsInstance.set(key, item as number);
      }
      case 'boolean': {
        itemType = type;
        return storageAccessorsInstance.set(key, item as boolean);
      }
      case 'string': {
        itemType = type;
        return storageAccessorsInstance.set(key, item as string);
      }
      default: {
        itemType = 'object';
        return storageAccessorsInstance.set(key, JSON.stringify(item));
      }
    }
  };
  const retrieve = (keySuffix: string) => {
    const key = KEY + keySuffix;
    try {
      switch (itemType) {
        case 'number':
          return storageAccessorsInstance.getNumber(key) as T | undefined;
        case 'boolean':
          return storageAccessorsInstance.getBoolean(key) as T | undefined;
        case 'string':
          return storageAccessorsInstance.getString(key) as T | undefined;
        default: {
          const item = storageAccessorsInstance.getString(key);
          if (item) {
            try {
              return JSON.parse(item) as T;
            } catch (error) {
              return item as T;
            }
          }
        }
      }
      return undefined;
    } catch (error) {
      console.error($lf(168), error);
      return undefined;
    }
  };
  const retrieveAll = () => {
    const delimiter = keysDelimiter + KEY;
    const keys = retrieveKeys().split(delimiter);
    const items: (BasicType | T)[] = [];
    for (const keySuffix of keys) {
      const item = retrieve(keySuffix);
      if (item !== undefined) items.push(item);
    }
    return items as T[];
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
  const use = (keySuffix: string) => {
    switch (itemType) {
      //prettier-ignore
      case 'number': return useMMKVNumber(KEY + keySuffix, storageAccessorsInstance) as HookType<T>;
      //prettier-ignore
      case 'boolean': return useMMKVBoolean(KEY + keySuffix, storageAccessorsInstance) as HookType<T>;
      //prettier-ignore
      case 'string': return useMMKVString(KEY + keySuffix, storageAccessorsInstance) as HookType<T>;
      //prettier-ignore
      case 'object': return useMMKVObject<T>(KEY + keySuffix, storageAccessorsInstance) as HookType<T>;
      default:
        return null;
    }
  };
  return {
    store,
    retrieve,
    retrieveAll,
    use,
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
