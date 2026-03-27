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
export type IsolateObserve<T extends IsolateObservables> = () => {
  observables: T;
  stopObserving: () => void;
};
export type IsolateRefData<T extends IsolateObservables> = {
  useObservation: IsolateObserve<T>;
  get: <K extends keyof T>(key: K) => T[K];
};
export type IsolateRefObject<T extends IsolateObservables> =
  React.RefObject<IsolateRefData<T> | null>;
export type IsolateRef<T extends IsolateObservables> = React.Ref<
  IsolateRefData<T>
>;

export function useIsolateRef<
  T extends IsolateObservables = IsolateObservables,
>() {
  const ref = useRef<IsolateRefData<T>>(null);
  return ref;
}
export function useIsolateObservables<
  T extends IsolateObservables = IsolateObservables,
>(ref: React.Ref<IsolateRefData<T>>, observables: T) {
  const emitter = useRef(new EventEmitter());
  const previousRef = useRef(observables);
  const keys = Object.keys(observables);
  const deps = Object.values(observables);
  const useObservation = useCallback((subscribeTo?: (keyof T)[]) => {
    const [isolateState, setIsolateState] = useState(observables);
    const updateFunction = (data: UpdatedIsolateObservables<T>) => {
      if (subscribeTo) {
        if (subscribeTo.find((v) => data.observables[v]))
          setIsolateState(data.observables);
      } else setIsolateState(data.observables);
    };
    emitter.current.removeListener('update', updateFunction);
    emitter.current.on('update', updateFunction);
    return {
      observables: isolateState,
      stopObserving: () =>
        emitter.current.removeListener('update', updateFunction),
    };
  }, []);
  useEffect(() => {
    const changed = keys.reduce((prev, curr) => {
      if (previousRef.current[curr] !== observables[curr]) {
        prev[curr] = true;
      }
      return prev;
    }, {} as ChangedIsolateObservables);
    emitter.current.emit('update', { observables, changed });
    previousRef.current = observables;
  }, deps);
  useImperativeHandle(
    ref,
    () => ({ useObservation, get: (key) => observables[key] }),
    [observables]
  );
  return useObservation;
}
