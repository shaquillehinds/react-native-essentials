import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

export const createStorageAccessors = <T>(key: string) => {
  const store = (item: T) => {
    if (typeof item !== 'string') return storage.set(key, JSON.stringify(item));
    else return storage.set(key, item);
  };
  const retrieve = () => {
    try {
      const string = storage.getString(key);
      if (string) {
        try {
          return JSON.parse(string) as T;
        } catch (error) {
          return string as T;
        }
      }
      return undefined;
    } catch (error) {
      console.error($lf(22), error);
      return undefined;
    }
  };
  const remove = () => {
    const user = retrieve();
    storage.delete(key);
    return user;
  };
  return {
    store,
    retrieve,
    remove,
  };
};

export default storage;

function $lf(n: number) {
  return '$lf|essentials/utils/createMMKVStorageAccessors.ts:' + n + ' >';
  // Automatically injected by Log Location Injector vscode extension
}
