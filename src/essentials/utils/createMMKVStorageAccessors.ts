import { useCallback, useEffect, useMemo, useState } from 'react';
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
type SetAction<T> = T | undefined | ((curr: T | undefined) => T | undefined);

export const createStorageAccessors = <T>(key: string) => {
  let itemType: 'string' | 'number' | 'boolean' | 'object' | undefined;
  const store = (item: T) => {
    if (item === undefined) return storageAccessorsInstance.delete(key);
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
      console.error($lf(64), error);
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
    const [bump, setBump] = useState(0);
    //prettier-ignore
    const value = useMemo(() =>retrieve(), [storageAccessorsInstance, key, bump]);
    const set = useCallback(
      (v: T | SetAction<T>) => {
        if (v === undefined) return storageAccessorsInstance.delete(key);
        if (typeof v === 'function')
          store((v as (curr: T | undefined) => T | undefined)(retrieve()) as T);
        else store(v as T);
      },
      [key, storageAccessorsInstance]
    );
    useEffect(() => {
      const listener = storageAccessorsInstance.addOnValueChangedListener(
        (changedKey) => changedKey === key && setBump((b) => b + 1)
      );
      return () => listener.remove();
    }, [key, storageAccessorsInstance]);
    return [value, set] as const;
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
  const hasKey = (key: string) => retrieveKeys().includes(key);
  const retrieveKeys = () =>
    storageAccessorsInstance.getString(storedKeysKey) || '';
  const storeKey = (key: string) => {
    if (!hasKey(key))
      storageAccessorsInstance.set(
        storedKeysKey,
        retrieveKeys() + keysDelimiter + key
      );
  };
  const removeKey = (key: string) =>
    storageAccessorsInstance.set(
      storedKeysKey,
      retrieveKeys().replace(keysDelimiter + key, '')
    );

  const store = (keySuffix: string, item: T) => {
    const key = KEY + keySuffix;
    if (item === undefined) {
      removeKey(key);
      return storageAccessorsInstance.delete(key);
    }
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
      console.error($lf(182), error);
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
    const key = KEY + keySuffix;
    const [bump, setBump] = useState(0);
    //prettier-ignore
    const value = useMemo(() =>retrieve(keySuffix), [storageAccessorsInstance, keySuffix, bump]);
    const set = useCallback(
      (v: T | SetAction<T>) => {
        if (v === undefined) return storageAccessorsInstance.delete(key);
        //prettier-ignore
        if (typeof v === 'function')store(keySuffix, (v as (curr: T | undefined) => T | undefined)(retrieve(keySuffix)) as T);
        else store(keySuffix, v as T);
      },
      [keySuffix, storageAccessorsInstance]
    );
    useEffect(() => {
      const listener = storageAccessorsInstance.addOnValueChangedListener(
        (changedKey) => changedKey === key && setBump((b) => b + 1)
      );
      return () => listener.remove();
    }, [key, storageAccessorsInstance]);
    return [value, set] as const;
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
