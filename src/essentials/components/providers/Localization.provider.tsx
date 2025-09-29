import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';
import { createStorageAccessors } from '../../utils';
import {
  mergeLanguagesRecords,
  type LanguagesRecord,
} from '../../utils/mergeLanguagesRecords';
import type { LanguageCode } from '../../utils/LanguageCodes';
import { sha256 } from '../../utils/hashes/sha256';

export type LocalizationContextValue = {
  translate: (text: string) => Promise<string>;
  clearLocalCache: () => void;
};

//prettier-ignore
export const LocalizationContext = createContext<LocalizationContextValue | undefined>(undefined);

export type LocalizationProviderProps = {
  children: ReactNode;
  sourceLanguage: LanguageCode;
  targetLanguage: LanguageCode;
  translation: (props: {
    sourceLanguage: LanguageCode;
    targetLanguage: LanguageCode;
    text: string;
  }) => Promise<string>;
  initialLanguagesRecord?: LanguagesRecord;
  initialLanguagesRecordRetriever?: (props: {
    sourceLanguage: LanguageCode;
    targetLanguage: LanguageCode;
  }) => Promise<{ original: string; translated: string }[]>;
};

export function LocalizationProvider(props: LocalizationProviderProps) {
  const languagesRef = useRef<LanguagesRecord>({});
  const translatingRef = useRef<Record<string, Promise<string>>>({});

  const localizationStorage = useMemo(
    () =>
      createStorageAccessors<LanguagesRecord>(
        `essentials-localization-${props.sourceLanguage}`
      ),
    [props.sourceLanguage]
  );

  useEffect(() => {
    if (props.initialLanguagesRecord)
      languagesRef.current = props.initialLanguagesRecord;
    const storedRecords = localizationStorage.retrieve();
    if (!storedRecords) localizationStorage.store(languagesRef.current);
    else
      languagesRef.current = mergeLanguagesRecords({
        obj1: languagesRef.current,
        obj2: storedRecords,
      });
    if (!storedRecords?.[props.targetLanguage]) {
      props
        .initialLanguagesRecordRetriever?.({
          sourceLanguage: props.sourceLanguage,
          targetLanguage: props.targetLanguage,
        })
        .then((res) => {
          if (Array.isArray(res)) {
            languagesRef.current = mergeLanguagesRecords({
              obj1: languagesRef.current,
              obj2: res.reduce((prev, curr) => {
                if (prev[props.targetLanguage])
                  prev[props.targetLanguage]![sha256(curr.original, 'base64')] =
                    curr.translated;
                else {
                  prev[props.targetLanguage] = {
                    [sha256(curr.original, 'base64')]: curr.translated,
                  };
                }
                return prev;
              }, {} as LanguagesRecord),
            });
          }
        })
        .catch((e) => console.error($lf(88), e))
        .finally(() => {
          if (languagesRef.current[props.targetLanguage])
            localizationStorage.store(languagesRef.current);
          else
            localizationStorage.store({
              ...languagesRef.current,
              [props.targetLanguage]: {},
            });
        });
    }
  }, [props.sourceLanguage, props.targetLanguage]);

  const translate = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      const hashed = sha256(trimmed, 'base64');
      if (!languagesRef.current[props.targetLanguage])
        languagesRef.current[props.targetLanguage] = {};
      let translated = languagesRef.current[props.targetLanguage]![hashed];
      if (translated) {
        if (typeof translated !== 'string') {
          delete languagesRef.current[props.targetLanguage]![hashed];
          localizationStorage.store(languagesRef.current);
          return trimmed;
        }
        return translated;
      }
      try {
        if (translatingRef.current[hashed])
          return await translatingRef.current[hashed];
        translatingRef.current[hashed] = props.translation({
          sourceLanguage: props.sourceLanguage,
          targetLanguage: props.targetLanguage,
          text: trimmed,
        });
        const result = await translatingRef.current[hashed];
        if (typeof result !== 'string')
          throw new Error('Invalid translation, not a string');
        languagesRef.current[props.targetLanguage]![hashed] = result;
        localizationStorage.store(languagesRef.current);
        return result;
      } catch (error) {
        console.error($lf(131), error);
        return trimmed;
      }
    },
    [props.translation, props.sourceLanguage, props.targetLanguage]
  );

  const clearLocalCache = useCallback(() => {
    languagesRef.current = {};
    localizationStorage.remove();
  }, [props.sourceLanguage]);

  const value = useMemo(
    () => ({ translate, clearLocalCache }),
    [props.translation, props.sourceLanguage, props.targetLanguage]
  );

  return (
    <LocalizationContext.Provider value={value}>
      {props.children}
    </LocalizationContext.Provider>
  );
}

export function useLocalization() {
  const context = useContext(LocalizationContext);
  if (!context) {
    return null;
  }
  return context;
}

function $lf(n: number) {
  return '$lf|components/providers/Localization.provider.tsx:' + n + ' >';
  // Automatically injected by Log Location Injector vscode extension
}
