import {
  useEffect,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Scheduler } from '../../utils';

export type ComponentMounterProps = {
  showComponent?: boolean;
  setShowComponent?:
    | React.Dispatch<React.SetStateAction<boolean>>
    | ((show: boolean) => void);
  onComponentShow?: () => Promise<void> | void;
  onComponentClose?: () => Promise<void> | void;
  mountDelayInMilliSeconds?: number;
  unMountDelayInMilliSeconds?: number;
  mountDefault?: boolean;
  /**
   * What to do when `showComponent` turns `true` while the component is still
   * mounted (for example a reopen inside the unmount delay).
   * `false`: call `setShowComponent(false)` and hard-unmount (legacy stop signal).
   * `true`: cancel the pending unmount and stay mounted.
   * @default false
   */
  keepMountedOnReopen?: boolean;
  component: React.JSX.Element;
};

export type UnMountComponentProps = {
  duration?: number;
  onClose?: () => void;
};
export type MountComponentProps = {
  onOpen?: () => void;
};
export type ComponentMounterController = {
  mountComponent: (props?: MountComponentProps) => void;
  unMountComponent: (props?: UnMountComponentProps) => void;
  hardUnMountComponent: (
    props?: Omit<UnMountComponentProps, 'duration'>
  ) => void;
};
export type ComponentMounterRef = React.Ref<ComponentMounterController>;

export const ComponentMounter = forwardRef(
  (props: ComponentMounterProps, ref: ComponentMounterRef) => {
    const [mounted, setMounted] = useState(props.mountDefault || false);

    // Timers and the imperative handle are created once. They read props and
    // mounted state through refs so callbacks and delays are never stale, and
    // so callbacks run outside of a state updater.
    const propsRef = useRef(props);
    propsRef.current = props;
    const mountedRef = useRef(mounted);

    const justStop = useRef(false);
    const setJustStop = (bool: boolean) => (justStop.current = bool);

    const api = useMemo(() => {
      const mount = (onOpen?: () => void) => {
        if (mountedRef.current) return;
        mountedRef.current = true;
        setMounted(true);
        propsRef.current.onComponentShow?.();
        onOpen?.();
      };
      const unMount = (onClose?: () => void) => {
        if (!mountedRef.current) return;
        mountedRef.current = false;
        setMounted(false);
        propsRef.current.onComponentClose?.();
        onClose?.();
      };
      const mountTimer = new Scheduler.Timer(() => mount(), 0);
      const unMountTimer = new Scheduler.Timer(() => unMount(), 0);
      const startMountTimer = () => {
        mountTimer.stop();
        mountTimer.time = propsRef.current.mountDelayInMilliSeconds || 0;
        mountTimer.start();
      };
      const startUnMountTimer = () => {
        unMountTimer.stop();
        unMountTimer.time = propsRef.current.unMountDelayInMilliSeconds || 0;
        unMountTimer.start();
      };
      return {
        mount,
        unMount,
        mountTimer,
        unMountTimer,
        startMountTimer,
        startUnMountTimer,
      };
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        mountComponent: (prop) => {
          api.mountTimer.stop();
          if (prop?.onOpen) {
            const timer = new Scheduler.Timer(
              () => api.mount(prop.onOpen),
              propsRef.current.mountDelayInMilliSeconds || 0
            );
            return timer.start();
          }
          api.startMountTimer();
        },
        unMountComponent: (prop) => {
          api.unMountTimer.stop();
          if (prop?.duration || prop?.onClose) {
            const timer = new Scheduler.Timer(
              () => api.unMount(prop.onClose),
              prop.duration || 200
            );
            return timer.start();
          }
          api.startUnMountTimer();
        },
        hardUnMountComponent: (prop) => {
          prop?.onClose?.();
          mountedRef.current = false;
          setMounted(false);
        },
      }),
      []
    );

    useEffect(() => {
      if (props.showComponent === undefined) {
      } else if (justStop.current) {
        setJustStop(false);
        mountedRef.current = false;
        setMounted(false);
      } else if (!props.showComponent) {
        api.startUnMountTimer();
      } else if (mountedRef.current) {
        if (!props.keepMountedOnReopen) {
          props.setShowComponent?.(false);
          setJustStop(true);
        }
        // keepMountedOnReopen: the cleanup below already cancelled the pending
        // unmount, so staying mounted needs no further action.
      } else {
        api.startMountTimer();
      }

      return () => {
        api.mountTimer.stop();
        api.unMountTimer.stop();
      };
    }, [props.showComponent]);

    if (!mounted) return null;
    return props.component;
  }
);
