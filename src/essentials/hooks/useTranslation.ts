import { useEffect, useState } from 'react';
import { useLocalization } from '../components';

export type UseTranslationProps = { text: string };

export function useTranslation(props: UseTranslationProps) {
  const [translated, setTranslated] = useState(props.text);
  const localization = useLocalization();
  useEffect(() => {
    if (localization)
      localization
        .translate(props.text)
        .then((t) => setTranslated(t))
        .catch((e) => console.error($lf(14), e));
    else
      console.error(
        $lf(16),
        'Localization provider is missing so this useTranslation will not translate the provided text.'
      );
  }, [props.text, localization]);
  return translated;
}

function $lf(n: number) {
  return '$lf|essentials/hooks/useTranslation.ts:' + n + ' >';
  // Automatically injected by Log Location Injector vscode extension
}
