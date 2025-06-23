import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { StyleSheet, View } from 'react-native';
import { getSequantialRandomId } from '../../utils';

export type PortalKey = number | string;
export type PortalItem = { key: PortalKey; element: ReactNode };
export type OnPortalMount = (key: PortalKey) => void;
export type OnPortalUnMount = OnPortalMount;
export interface PortalContextValue {
  mount: (
    key: PortalKey,
    element: ReactNode,
    onMount?: OnPortalMount
  ) => PortalKey;
  update: (key: PortalKey, element: ReactNode) => void;
  unmount: (key: PortalKey, OnPortalUnMount?: OnPortalUnMount) => void;
}

export const PortalContext = createContext<PortalContextValue | undefined>(
  undefined
);

export type PortalItemStatus = 'mount' | 'update' | 'unmount';
export type PortalItemStatusTime = Partial<Record<PortalItemStatus, number>>;

export const PortalProvider = ({
  children,
  unMountBufferTimeMS,
  updateBufferTimeMS,
}: {
  children: ReactNode;
  /**
   * Determines how much time in millieseconds to wait before removing portal item.
   * Useful for stopping premature portal item ejection due to content changes
   * @default 100 milliseconds
   */
  unMountBufferTimeMS?: number;
  /**
   * How much time to wait until portal update can be called again. Usually won't be necessary since update shouldn't cause rerenders but useful for stopping infinite portal update feedback loops if they do occur.
   */
  updateBufferTimeMS?: number;
}) => {
  const portalItemsAmount = useRef(0);
  const keys = useRef<Record<string, PortalItemStatusTime>>({});

  const [portals, setPortals] = useState<PortalItem[]>([]);

  if (portals.length) portalItemsAmount.current = portals.length;

  const mount: PortalContextValue['mount'] = useCallback(
    (key, element, onMount) => {
      if (keys.current[key]) return key;
      setPortals((prev) => [...prev, { key, element }]);
      keys.current[key] = { mount: Date.now() };
      onMount?.(key);
      return key;
    },
    []
  );

  const update: PortalContextValue['update'] = useCallback((key, element) => {
    if (!keys.current[key]) return;
    if (
      updateBufferTimeMS &&
      keys.current[key].update &&
      portalItemsAmount.current
    )
      if (
        Date.now() - keys.current[key].update <=
        updateBufferTimeMS * portalItemsAmount.current
      )
        return;
    setPortals((prev) =>
      prev.map((item) => (item.key === key ? { ...item, element } : item))
    );
    keys.current[key].update = Date.now();
  }, []);

  const unmount: PortalContextValue['unmount'] = useCallback(
    (key, onUnMount) => {
      if (!keys.current[key]) return;
      keys.current[key].unmount = Date.now();
      setTimeout(() => {
        const updateTime = keys.current[key]?.update || 0;
        const unmountTime = keys.current[key]?.unmount || 0;
        if (updateTime > unmountTime) return;
        setPortals((prev) => prev.filter((item) => item.key !== key));
        delete keys.current[key];
        onUnMount?.(key);
      }, unMountBufferTimeMS || 100);
    },
    []
  );

  const value = useMemo(() => ({ mount, update, unmount }), []);

  return (
    <PortalContext.Provider value={value}>
      {children}
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        {portals.map(({ key, element }) => (
          <React.Fragment key={key}>{element}</React.Fragment>
        ))}
      </View>
    </PortalContext.Provider>
  );
};

export const usePortal = () => {
  const context = useContext(PortalContext);
  if (!context) {
    return null;
  }
  return context;
};

export type UsePortalComponentProps = {
  name: string;
  Component: ReactNode;
};
export const usePortalComponent = (props: UsePortalComponentProps) => {
  const portalId = useRef('');
  const portal = usePortal();
  useEffect(() => {
    if (portalId.current) {
      portal?.update(portalId.current, props.Component);
    } else {
      portalId.current = getSequantialRandomId(props.name);
      portal?.mount(portalId.current, props.Component);
    }
  }, [props.Component]);
  useEffect(() => {
    return () => {
      portal?.unmount(portalId.current);
    };
  }, []);
  return portal;
};
