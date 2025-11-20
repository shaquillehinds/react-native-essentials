import { useRef, useState } from 'react';
import { wait } from '../utils';

export type ItemsFetchingFunctionProps = {
  limit: number;
  skip: number;
};

export type ItemsFetchingFunction<ListItem> = (
  props: ItemsFetchingFunctionProps
) => Promise<ListItem[]>;

export type UseScrollableItemsProps<ListItem, FetchingFunctionArgs> = {
  limit?: number;
  minFetchDuration?: number;
  fetchCooldown?: number;
  itemsFetchingFunction: ItemsFetchingFunction<ListItem>;
  itemsFetchingFunctionArgs?: FetchingFunctionArgs;
};

export function useScrollableItems<ListItem, FetchingFunctionArgs extends {}>(
  props: UseScrollableItemsProps<ListItem, FetchingFunctionArgs>
) {
  const limit = props.limit || 20;

  const [items, setItems] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [allItemsFetched, setAllItemsFetched] = useState(false);
  const [refreshingItems, setRefreshingItems] = useState(false);
  const isFetching = useRef(false);
  const isInitialized = useRef(false);

  const fetchItems = async (prop?: { refresh: boolean }) => {
    if (isFetching.current) return;
    isFetching.current = true;
    if (prop?.refresh) setAllItemsFetched(false);
    const skip = prop?.refresh ? 0 : items.length;
    const [response] = await Promise.all([
      await props.itemsFetchingFunction({
        ...(props.itemsFetchingFunctionArgs || {}),
        limit,
        skip,
      }),
      await wait(props.minFetchDuration || 0),
    ]);
    let list: ListItem[] = response;
    if (list.length < limit) setAllItemsFetched(true);
    if (prop?.refresh) setItems(list);
    else setItems((prev) => [...prev, ...list]);
    setLoading(false);
    if (props.fetchCooldown) {
      setTimeout(() => {
        isFetching.current = false;
      }, props.fetchCooldown);
    } else isFetching.current = false;
  };
  const onRefreshItems = async () => {
    setLoading(true);
    await fetchItems({ refresh: true });
    setRefreshingItems(false);
  };

  const onLayout = () => {
    if (!isInitialized.current) {
      fetchItems();
      isInitialized.current = true;
    }
  };
  const onItemsEndReached = () => {
    if (allItemsFetched) return;
    fetchItems();
  };

  const updateListItem = (
    id: string,
    key: keyof ListItem,
    updatedItem: ListItem
  ) => {
    const updatedItems = items.map((item) => {
      return item[key] === id ? updatedItem : item;
    });
    setItems(updatedItems);
  };
  const removeListItem = (id: string, key: keyof ListItem) => {
    setItems((prev) => prev.filter((i) => i[key] !== id));
  };
  return {
    items,
    setItems,
    onLayout,
    onItemsEndReached,
    onRefreshItems,
    refreshingItems,
    loading,
    updateListItem,
    removeListItem,
    fetchItems,
    setLoading,
  };
}
