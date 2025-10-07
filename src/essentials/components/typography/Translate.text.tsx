import { useEffect, useState } from 'react';
import { useLocalization } from '../providers/Localization.provider';
import type {
  LocalizationComponentProps,
  TranslateTextProps,
  TranslationComponentProps,
} from './Text.types';

export function TranslateText(props: TranslateTextProps) {
  if (typeof props.children !== 'string') return props.children;
  return <LocalizationComponent text={props.children} />;
}

export function LocalizationComponent(props: LocalizationComponentProps) {
  const localization = useLocalization();
  if (!localization) return props.text;
  return <TranslationComponent localization={localization} text={props.text} />;
}

export function TranslationComponent(props: TranslationComponentProps) {
  const [translated, setTranslated] = useState(props.text);
  useEffect(() => {
    props.localization
      .translate(props.text)
      .then((t) => setTranslated(t))
      .catch((e) => console.error($lf(27), e));
  }, [props.text, props.localization]);
  return translated;
}

function $lf(n: number) {
  return '$lf|components/typography/Translate.text.tsx:' + n + ' >';
  // Automatically injected by Log Location Injector vscode extension
}
