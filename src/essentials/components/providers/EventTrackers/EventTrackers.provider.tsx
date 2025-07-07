import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createStorageAccessors } from '../../../utils/createMMKVStorageAccessors';
//prettier-ignore
import type { EventTracker, EventTrackersContextValue, EventTrackersProviderProps, EventTrackersRecord, TrackerEventsContextValue } from './eventTrackersProvider.types';
import { Scheduler } from '../../../utils';

//prettier-ignore
export const EventTrackersContext = createContext<EventTrackersContextValue | undefined>(undefined);
export const TrackerEventsContext = createContext<
  TrackerEventsContextValue | undefined
>(undefined);
export const eventsStorage =
  createStorageAccessors<EventTrackersRecord>('events-trackers');

export const EventTrackerProvider = (props: EventTrackersProviderProps) => {
  const storedEvents = useRef<EventTrackersRecord>(
    eventsStorage.retrieve() || {}
  );
  const inProgressTrackers = useRef<Record<string, Scheduler.Schedule>>({});

  const [events, setEvents] = useState<EventTracker[]>(
    Object.values(storedEvents.current)
  );

  const initalizeTracker = useCallback((eventTracker: EventTracker) => {
    if (eventTracker.status === 'in_progress') {
      inProgressTrackers.current[eventTracker.id] = new Scheduler.Schedule(
        async () => {
          const currentEvent = storedEvents.current[eventTracker.id];
          if (!currentEvent)
            return inProgressTrackers.current[eventTracker.id]?.stop();

          const stopAndDelete = () => {
            inProgressTrackers.current[eventTracker.id]?.stop();
            delete storedEvents.current[currentEvent.id];
            eventsStorage.store(storedEvents.current);
          };

          try {
            const checkStatusFn =
              props.statusCheckFnRegistry[currentEvent.statusCheckFnId];
            if (!checkStatusFn) {
              stopAndDelete();
              throw Error(
                'Check status function not found, please make sure the id of the event matches an id in theregistry.'
              );
            }
            const update = await checkStatusFn({
              ...currentEvent,
            });
            const previousEvent = storedEvents.current[update.id];
            if (previousEvent?.status !== update.status) {
              if (update.status !== 'in_progress')
                inProgressTrackers.current[update.id]?.stop();
              update.updatedAt = Date.now();
              setEvents((prev) =>
                prev.map((p) => (p.id === update.id ? update : p))
              );
              storedEvents.current[update.id] = update;
              eventsStorage.store(storedEvents.current);
            }
          } catch (error) {
            console.error($lf(71), error);
          }
          if (
            storedEvents.current[currentEvent.id]?.status === 'in_progress' &&
            currentEvent.maxTimeInProgress &&
            Date.now() - currentEvent.createdAt > currentEvent.maxTimeInProgress
          ) {
            inProgressTrackers.current[currentEvent.id]?.stop();
            currentEvent.status = 'failed';
            storedEvents.current[currentEvent.id] = currentEvent;
            eventsStorage.store(storedEvents.current);
            return;
          }
          if (currentEvent.expires && Date.now() > currentEvent.expires) {
            return stopAndDelete();
          }
        },
        eventTracker.statusCheckInterval || 30000
      );
      inProgressTrackers.current[eventTracker.id]?.start();
    }
  }, []);

  useEffect(() => {
    for (const eventTracker of Object.values(storedEvents.current)) {
      if (eventTracker.expires && Date.now() > eventTracker.expires) {
        delete storedEvents.current[eventTracker.id];
        eventsStorage.store(storedEvents.current);
      } else initalizeTracker(eventTracker);
    }
  }, []);

  const addEventTracker: EventTrackersContextValue['addEventTracker'] =
    useCallback((eventTracker) => {
      const newEventTracker: EventTracker = {
        ...eventTracker,
        updatedAt: Date.now(),
        createdAt: Date.now(),
      };
      storedEvents.current[eventTracker.id] = newEventTracker;
      eventsStorage.store(storedEvents.current);
      setEvents((prev) => [newEventTracker, ...prev]);
      initalizeTracker(newEventTracker);
    }, []);

  const removeEventTracker: EventTrackersContextValue['removeEventTracker'] =
    useCallback((id) => {
      inProgressTrackers.current[id]?.stop();
      if (storedEvents.current[id]) {
        delete storedEvents.current[id];
        eventsStorage.store(storedEvents.current);
        setEvents((prev) => prev.filter((e) => e.id !== id));
      }
    }, []);

  const value = useMemo(() => ({ addEventTracker, removeEventTracker }), []);

  return (
    <TrackerEventsContext.Provider value={{ events }}>
      <EventTrackersContext.Provider value={value}>
        {props.children}
      </EventTrackersContext.Provider>
    </TrackerEventsContext.Provider>
  );
};

export const useEventTracker = () => {
  const context = useContext(EventTrackersContext);
  if (!context) {
    return null;
  }
  return context;
};

export const useTrackerEvents = () => {
  const context = useContext(TrackerEventsContext);
  if (!context) {
    return null;
  }
  return context;
};

function $lf(n: number) {
  return '$lf|providers/EventTrackers/EventTrackers.provider.tsx:' + n + ' >';
  // Automatically injected by Log Location Injector vscode extension
}
