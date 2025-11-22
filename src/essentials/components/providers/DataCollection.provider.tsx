//$lf-ignore
//prettier-ignore
import {useContext,useMemo,useRef,useState,type PropsWithChildren} from 'react';

export type CollectedDataType = Record<string, any>;
export type CollectDataArgs = { key: string; value: any };
//prettier-ignore
export type CollectDataProps = ((data: CollectedDataType)=>CollectDataArgs) | CollectDataArgs

export type CollectedDataContextValue = { collected: CollectedDataType };
//prettier-ignore
export type DataCollectionContextValue = {collectData: (props:CollectDataProps)=>void, collectedDataRef: React.MutableRefObject<CollectedDataType>}

export type DataCollectionProviderProps = PropsWithChildren<{
  CollectedDataContext: React.Context<CollectedDataContextValue>;
  DataCollectionContext: React.Context<DataCollectionContextValue>;
}>;

export const DataCollectionProvider = ({
  children,
  DataCollectionContext,
  CollectedDataContext,
}: DataCollectionProviderProps) => {
  const [data, setData] = useState<CollectedDataType>({});
  const collectedDataRef = useRef<CollectedDataType>(data);
  collectedDataRef.current = data;

  const value = useMemo(
    () => ({
      collectedDataRef,
      collectData: (props: CollectDataProps) => {
        if ('key' in props) {
          setData((prev) => ({ ...prev, [props.key]: props.value }));
        } else {
          const newData = props(collectedDataRef.current);
          setData((prev) => ({ ...prev, [newData.key]: newData.value }));
        }
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
export const useDataCollection = (DataCollectionContext:  React.Context<DataCollectionContextValue>) => {
  const context = useContext(DataCollectionContext);
  if (!context) return null;
  return context;
};
//prettier-ignore
export const useCollectedData = (CollectedDataContext: React.Context<CollectedDataContextValue>) => {
  const context = useContext(CollectedDataContext);
  if (!context) return null;
  return context;
};
