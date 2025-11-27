//$lf-ignore
//prettier-ignore
import {useContext,useMemo,useRef,useState,type PropsWithChildren} from 'react';

export type DataKey = string;

export type CollectedDataType = Record<DataKey, any>;
//prettier-ignore
export type CollectDataArgs<T extends CollectedDataType> ={ [K in keyof T]: { key: K; value: T[K] } }[keyof T];

//prettier-ignore
export type CollectDataProps<T extends CollectedDataType> = ((data: Partial<T>)=>Partial<T>) | CollectDataArgs<Partial<T>>

//prettier-ignore
export type CollectedDataContextValue<T extends CollectedDataType = CollectedDataType> = { collected:  Partial<T> } | undefined;
//prettier-ignore
export type DataCollectionContextValue<T extends CollectedDataType = CollectedDataType> = {collectData: (props:CollectDataProps<Partial<T>>)=>void, collectedDataRef: React.MutableRefObject<Partial<T>>} | undefined

export type DataCollectionProviderProps<
  T extends CollectedDataType = CollectedDataType,
> = PropsWithChildren<{
  CollectedDataContext: React.Context<CollectedDataContextValue<Partial<T>>>;
  DataCollectionContext: React.Context<DataCollectionContextValue<Partial<T>>>;
}>;

export const DataCollectionProvider = <T extends CollectedDataType>({
  children,
  DataCollectionContext,
  CollectedDataContext,
}: DataCollectionProviderProps<T>) => {
  const [data, setData] = useState<Partial<T>>({});
  const collectedDataRef = useRef<Partial<T>>(data);
  collectedDataRef.current = data;

  const value = useMemo(
    () => ({
      collectedDataRef,
      collectData: (props: CollectDataProps<Partial<T>>) => {
        if (!props) return;
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
  DataCollectionContext,
  CollectedDataContext,
}: DataCollectionProviderProps<T>) {
  return {
    Provider: (
      <DataCollectionProvider
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
