import { useCallback, useEffect, useRef } from 'react';
import { Scheduler } from '../utils';

export type UseIntervalProps = {
  autoStart?: boolean;
  intervalInMilliSecs: number;
  onIntervalInvocation?: () => void | Promise<void>;
  onPreTrigger?: () => void | Promise<void>;
  onTrigger: () => void | Promise<void>;
  onPostTrigger?: () => void | Promise<void>;
};

export function useInterval(props: UseIntervalProps) {
  const intervalScheduleRef = useRef<Scheduler.Schedule>(
    new Scheduler.Schedule(async () => {
      await props.onPreTrigger?.();
      await props.onTrigger?.();
      await props.onPostTrigger?.();
    }, props.intervalInMilliSecs || 5000)
  );

  const startInterval = useCallback(
    (
      prop?: Partial<
        Omit<UseIntervalProps, 'autoStart' | 'onIntervalInvocation'>
      >
    ) => {
      intervalScheduleRef.current?.stop();
      props.onIntervalInvocation?.();
      if (prop) {
        intervalScheduleRef.current = new Scheduler.Schedule(
          async () => {
            prop.onPreTrigger
              ? await prop.onPreTrigger()
              : await props.onPreTrigger?.();
            prop.onTrigger ? await prop.onTrigger() : await props.onTrigger?.();
            prop.onPostTrigger
              ? await prop.onPostTrigger()
              : await props.onPostTrigger?.();
          },
          prop.intervalInMilliSecs || props.intervalInMilliSecs || 5000
        );
      } else intervalScheduleRef.current?.start();
    },
    [props.onIntervalInvocation]
  );

  const stopInterval = useCallback(() => {
    intervalScheduleRef.current?.stop();
  }, []);

  useEffect(() => {
    props.autoStart && startInterval();
    return () => {
      stopInterval();
    };
  }, [props.autoStart]);

  return { startInterval, stopInterval };
}
