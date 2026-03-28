import EventEmitter from 'eventemitter3';
import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

export type IsolateObservables = Record<string, unknown>;
export type ChangedIsolateObservables = Record<string, boolean>;
export type UpdatedIsolateObservables<
  T extends IsolateObservables = IsolateObservables,
  U extends ChangedIsolateObservables = ChangedIsolateObservables,
> = {
  observables: T;
  changed: U;
};
export type IsolateObserve<T extends IsolateObservables = IsolateObservables> =
  (subscribeTo?: (keyof T)[]) => {
    observables: T;
    stopObservation: () => void;
  };
export type IsolateRefData<T extends IsolateObservables = IsolateObservables> =
  {
    useObservation: IsolateObserve<T>;
    get: <K extends keyof T>(key: K) => T[K];
  };
export type IsolateRefObject<
  T extends IsolateObservables = IsolateObservables,
> = React.RefObject<IsolateRefData<T> | null>;
export type IsolateRef<T extends IsolateObservables = IsolateObservables> =
  React.Ref<IsolateRefData<T>>;

export function useIsolateRef<
  T extends IsolateObservables = IsolateObservables,
>() {
  return useRef<IsolateRefData<T>>(null);
}

export function useIsolateObservables<
  T extends IsolateObservables = IsolateObservables,
>(ref: React.Ref<IsolateRefData<T>>, observables: T, isObserving = true) {
  const [observing, setObserving] = useState(isObserving);

  const emitter = useRef(new EventEmitter());
  const snapshotRef = useRef<T>(observables);

  const stopObserving = useCallback(() => setObserving(false), []);
  const startObserving = useCallback(() => setObserving(true), []);

  useEffect(() => {
    if (!observing) return;

    const changed = (Object.keys(observables) as (keyof T)[]).reduce(
      (acc, key) => {
        if (snapshotRef.current[key] !== observables[key]) {
          (acc as Record<keyof T, boolean>)[key] = true;
        }
        return acc;
      },
      {} as ChangedIsolateObservables
    );

    emitter.current.emit('update', { observables, changed });
    snapshotRef.current = observables;
  }, [observing, observables]);

  useEffect(() => {
    const instance = emitter.current;
    return () => {
      instance.removeAllListeners();
    };
  }, []);

  const useObservation: IsolateObserve<T> = useCallback(
    (subscribeTo?: (keyof T)[]) => {
      const [isolateState, setIsolateState] = useState<T>(
        () => snapshotRef.current
      );

      const handleUpdate = useCallback((data: UpdatedIsolateObservables<T>) => {
        const shouldUpdate = subscribeTo
          ? subscribeTo.some((key) => data.changed[key as string])
          : true;

        if (shouldUpdate) setIsolateState(data.observables);
      }, []);

      useEffect(() => {
        emitter.current.on('update', handleUpdate);
        return () => {
          emitter.current.removeListener('update', handleUpdate);
        };
      }, [handleUpdate]);

      const stopObservation = useCallback(() => {
        emitter.current.removeListener('update', handleUpdate);
      }, [handleUpdate]);

      return { observables: isolateState, stopObservation };
    },
    []
  );

  useImperativeHandle(
    ref,
    () => ({
      useObservation,
      get: <K extends keyof T>(key: K) => snapshotRef.current[key],
    }),
    [useObservation]
  );

  return { startObserving, stopObserving };
}
