//$lf-ignore
//prettier-ignore
import {useContext,useMemo,useRef,useState,type PropsWithChildren} from 'react';

export type DataKey = string | number | symbol;

export type CollectedDataType = Record<DataKey, any>;
//prettier-ignore
export type CollectDataArgs<T extends CollectedDataType> ={ [K in keyof T]: { key: K; value: T[K] } }[keyof T];

//prettier-ignore
export type CollectDataProps<T extends CollectedDataType> = ((data: T)=>T) | CollectDataArgs<T>

//prettier-ignore
export type CollectedDataContextValue<T extends CollectedDataType> = { collected:  T } | undefined;
//prettier-ignore
export type DataCollectionContextValue<T extends CollectedDataType> = {collectData: (props:CollectDataProps<T>)=>void, collectedDataRef: React.MutableRefObject<T>} | undefined

export type DataCollectionProviderProps<T extends CollectedDataType> =
  PropsWithChildren<{
    CollectedDataContext: React.Context<CollectedDataContextValue<T>>;
    DataCollectionContext: React.Context<DataCollectionContextValue<T>>;
  }>;

export const DataCollectionProvider = <T extends CollectedDataType>({
  children,
  DataCollectionContext,
  CollectedDataContext,
}: DataCollectionProviderProps<T>) => {
  const [data, setData] = useState<T>({} as T);
  const collectedDataRef = useRef<T>(data);
  collectedDataRef.current = data;

  const value = useMemo(
    () => ({
      collectedDataRef,
      collectData: (props: CollectDataProps<T>) => {
        if ('key' in props)
          setData((prev) => ({ ...prev, [props.key]: props.value }));
        else setData((prev) => props(prev));
      },
    }),
    []
  );
  return (
    <CollectedDataContext.Provider value={{ collected: data }}>
      <DataCollectionContext.Provider value={value}>
        {children}
      </DataCollectionContext.Provider>
    </CollectedDataContext.Provider>
  );
};

//prettier-ignore
export const useDataCollection = <T extends CollectedDataType = CollectedDataType> (DataCollectionContext:  React.Context<DataCollectionContextValue<T>>) => {
  const context = useContext(DataCollectionContext);
  if (!context) return null;
  return context;
};
//prettier-ignore
export const useCollectedData = <T extends CollectedDataType = CollectedDataType> (CollectedDataContext: React.Context<CollectedDataContextValue<T>>) => {
  const context = useContext(CollectedDataContext);
  if (!context) return null;
  return context;
};

export function createDataCollector<T extends CollectedDataType>({
  children,
  DataCollectionContext,
  CollectedDataContext,
}: DataCollectionProviderProps<T>) {
  return {
    Provider: (
      <DataCollectionProvider
        children={children}
        DataCollectionContext={DataCollectionContext}
        CollectedDataContext={CollectedDataContext}
      />
    ),
    useDataCollection: () => {
      const context = useContext(DataCollectionContext);
      if (!context) return null;
      return context;
    },
    useCollectedData: () => {
      const context = useContext(CollectedDataContext);
      if (!context) return null;
      return context;
    },
  };
}
