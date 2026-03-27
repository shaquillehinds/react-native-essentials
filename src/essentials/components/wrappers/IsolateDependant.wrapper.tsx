import { useCallback, useEffect, useRef, useState } from 'react';

export function IsolateRefDependant(
  props: React.PropsWithChildren<{ ref: React.Ref<any> }>
) {
  const [loaded, setLoaded] = useState(false);
  const retries = useRef(1);
  const validateRef = useCallback(() => {
    if (retries.current > 5) return;
    if (props.ref) setLoaded(true);
    else
      setTimeout(() => {
        validateRef;
      }, 100 * retries.current);
    retries.current += 1;
  }, [props.ref]);
  useEffect(() => {
    validateRef();
  }, [props.ref]);
  if (!loaded) return null;
  return props.children;
}
