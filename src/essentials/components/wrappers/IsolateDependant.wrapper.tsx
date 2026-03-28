import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  IsolateObservables,
  IsolateRef,
  IsolateRefObject,
} from '../../hooks';

export function IsolateRefDependant<T extends IsolateObservables>(
  props: React.PropsWithChildren<{ ref: IsolateRef<T> }>
) {
  const [loaded, setLoaded] = useState(false);
  const retries = useRef(1);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const validateRef = useCallback(() => {
    if (retries.current > 5) return;

    const refObject = props.ref as IsolateRefObject;
    if (refObject?.current) {
      setLoaded(true);
    } else {
      timeoutRef.current = setTimeout(() => {
        retries.current += 1;
        validateRef();
      }, 50 * retries.current);
    }
  }, [props.ref]);

  useEffect(() => {
    validateRef();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [validateRef]);

  if (!loaded) return null;
  return props.children;
}
