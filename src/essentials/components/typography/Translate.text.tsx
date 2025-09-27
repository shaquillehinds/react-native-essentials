import { useEffect, useState, type ReactNode } from 'react';
import {
  useLocalization,
  type LocalizationContextValue,
} from '../providers/Localization.provider';

export type TranslateTextProps = { children: ReactNode };

export function TranslateText(props: TranslateTextProps) {
  if (typeof props.children !== 'string') return props.children;
  return <LocalizationComponent text={props.children} />;
}

export type LocalizationComponentProps = { text: string };

export function LocalizationComponent(props: LocalizationComponentProps) {
  const localization = useLocalization();
  if (!localization) return props.text;
  return <TranslationComponent localization={localization} text={props.text} />;
}

export type TranslationComponentProps = {
  localization: LocalizationContextValue;
  text: string;
};
export function TranslationComponent(props: TranslationComponentProps) {
  const [translated, setTranslated] = useState(props.text);
  useEffect(() => {
    props.localization
      .translate(props.text)
      .then((t) => setTranslated(t))
      .catch((e) => console.error($lf(32), e));
  }, [props.text, props.localization]);
  return translated;
}

function $lf(n: number) {
  return '$lf|components/typography/Translate.text.tsx:' + n + ' >';
  // Automatically injected by Log Location Injector vscode extension
}
