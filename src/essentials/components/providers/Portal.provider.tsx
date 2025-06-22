import React, {
  createContext,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { StyleSheet, View } from 'react-native';

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

export type PortalItemStatus = 'mount' | 'update';
export type PortalItemStatusTime = Partial<Record<PortalItemStatus, number>>;

export const PortalProvider = ({
  children,
  unMountWaitBuffer,
}: {
  children: ReactNode;
  unMountWaitBuffer?: number;
}) => {
  const [portals, setPortals] = useState<PortalItem[]>([]);
  const keys = useRef<Record<string, PortalItemStatusTime>>({});

  const unMountBuffer = unMountWaitBuffer || 500;

  const mount: PortalContextValue['mount'] = (key, element, onMount) => {
    if (keys.current[key]) return key;
    setPortals((prev) => [...prev, { key, element }]);
    keys.current[key] = { mount: Date.now() };
    onMount?.(key);
    return key;
  };

  const update = (key: PortalKey, element: ReactNode) => {
    if (!keys.current[key]) return;
    setPortals((prev) =>
      prev.map((item) => (item.key === key ? { ...item, element } : item))
    );
    keys.current[key].update = Date.now();
  };

  const unmount: PortalContextValue['unmount'] = (key, onUnMount) => {
    if (!keys.current[key]) return;
    setTimeout(() => {
      const updateTime = keys.current[key]?.update || 0;
      if (Date.now() - updateTime <= unMountBuffer) return;
      setPortals((prev) => prev.filter((item) => item.key !== key));
      delete keys.current[key];
      onUnMount?.(key);
    }, unMountBuffer);
  };

  return (
    <PortalContext.Provider value={{ mount, update, unmount }}>
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
