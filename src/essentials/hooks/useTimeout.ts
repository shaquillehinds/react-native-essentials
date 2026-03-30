import { useEffect, useRef } from 'react';

export type UseTimeoutProps = { cb: () => void; ms: number };

export function useTimeout(props: UseTimeoutProps, deps: any[]) {
  const timeoutRef = useRef<number | undefined | NodeJS.Timeout>();

  useEffect(() => {
    timeoutRef.current = setTimeout(props.cb, props.ms);
    return () => {
      timeoutRef.current && clearTimeout(timeoutRef.current);
    };
  }, deps);
}
