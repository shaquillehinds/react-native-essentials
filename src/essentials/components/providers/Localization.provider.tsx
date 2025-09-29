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
};

const localizationStorage = createStorageAccessors<LanguagesRecord>(
  'essentials-localization'
);

export function LocalizationProvider(props: LocalizationProviderProps) {
  const languagesRef = useRef<LanguagesRecord>({});
  const translatingRef = useRef<Record<string, Promise<string>>>({});
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
  }, []);

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
        console.error($lf(85), error);
        return trimmed;
      }
    },
    [props.translation, props.sourceLanguage, props.targetLanguage]
  );

  const value = useMemo(
    () => ({ translate }),
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
