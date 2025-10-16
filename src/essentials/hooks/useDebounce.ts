import { useCallback, useRef } from 'react';
import { Scheduler } from '../utils';

export type UseDebounceProps = {
  delayInMilliSecs: number;
  onTrigger: () => void | Promise<void>;
  onPreTrigger?: () => void | Promise<void>;
  onPostTrigger?: () => void | Promise<void>;
  onDebounceInvocation?: () => void | Promise<void>;
};

export function useDebounce(props: UseDebounceProps) {
  const debounceTimerRef = useRef<Scheduler.Timer>(
    new Scheduler.Timer(async () => {
      await props.onPreTrigger?.();
      await props.onTrigger();
      await props.onPostTrigger?.();
    }, props.delayInMilliSecs || 5000)
  );

  const debounce = useCallback(
    (prop?: Partial<Omit<UseDebounceProps, 'onDebounceInvocation'>>) => {
      debounceTimerRef.current.stop();
      props.onDebounceInvocation?.();
      if (prop) {
        debounceTimerRef.current = new Scheduler.Timer(
          async () => {
            prop.onPreTrigger
              ? await prop.onPreTrigger()
              : await props.onPreTrigger?.();
            prop.onTrigger ? await prop.onTrigger() : await props.onTrigger?.();
            prop.onPostTrigger
              ? await prop.onPostTrigger()
              : await props.onPostTrigger?.();
          },
          prop.delayInMilliSecs || props.delayInMilliSecs || 5000
        );
        debounceTimerRef.current.start();
      } else debounceTimerRef.current.start();
    },
    [props.onDebounceInvocation]
  );

  const cancelDebounce = useCallback(() => {
    debounceTimerRef.current.stop();
  }, []);

  return { debounce, cancelDebounce };
}
