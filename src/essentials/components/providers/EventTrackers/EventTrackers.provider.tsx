//$lf-ignore
//prettier-ignore
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';
import { createStorageAccessors } from '../../../utils/createMMKVStorageAccessors';
//prettier-ignore
import type { EventTracker, EventTrackersContextValue, EventTrackersProviderProps, EventTrackersRecord, SeenEventsRecord, UnSeenEventsRecord, TrackerEventsContextValue } from './eventTrackersProvider.types';
import { Scheduler } from '../../../utils';

//prettier-ignore
export const EventTrackersContext = createContext<EventTrackersContextValue | undefined>(undefined);
export const TrackerEventsContext = createContext<
  TrackerEventsContextValue | undefined
>(undefined);
export const eventsStorage =
  createStorageAccessors<EventTrackersRecord>('events-trackers');

export const seenEventsStorage =
  createStorageAccessors<SeenEventsRecord>('seen-events');

export const unSeenEventsStorage =
  createStorageAccessors<UnSeenEventsRecord>('un-seen-events');

export const EventTrackerProvider = (props: EventTrackersProviderProps) => {
  const storedEvents = useRef<EventTrackersRecord>(
    eventsStorage.retrieve() || {}
  );
  const inProgressTrackers = useRef<Record<string, Scheduler.Schedule>>({});

  const [events, setEvents] = useState<EventTracker[]>(
    Object.values(storedEvents.current)
  );

  const seenEvents = useRef<SeenEventsRecord>(
    seenEventsStorage.retrieve() || {}
  );
  const unSeenEvents = useRef<SeenEventsRecord>(
    unSeenEventsStorage.retrieve() || {}
  );

  const addUnSeenEvent = useCallback((eventId: string) => {
    unSeenEvents.current[eventId] = true;
    seenEvents.current[eventId] = false;
    seenEventsStorage.store(seenEvents.current);
    unSeenEventsStorage.store(unSeenEvents.current);
  }, []);

  const markUnSeenAsSeen = useCallback(() => {
    for (const unseen in unSeenEvents.current) {
      unSeenEvents.current[unseen] = false;
      seenEvents.current[unseen] = true;
    }
    seenEventsStorage.store(seenEvents.current);
    unSeenEventsStorage.store(unSeenEvents.current);
  }, []);
  const deleteUnSeenAndSeen = useCallback((eventid: string) => {
    delete unSeenEvents.current[eventid];
    delete seenEvents.current[eventid];
    seenEventsStorage.store(seenEvents.current);
    unSeenEventsStorage.store(unSeenEvents.current);
  }, []);

  const storeEvent = useCallback((e: EventTracker, update?: Boolean) => {
    if (!update) e.createdAt = Date.now();
    if (storedEvents.current[e.id]) update = true;
    e.updatedAt = Date.now();
    storedEvents.current[e.id] = e;
    eventsStorage.store(storedEvents.current);
    update
      ? setEvents((prev) => prev.map((ev) => (ev.id === e.id ? e : ev)))
      : setEvents((prev) => [...prev, e]);
    addUnSeenEvent(e.id);
  }, []);

  const deleteEvent = useCallback((e: EventTracker) => {
    delete storedEvents.current[e.id];
    eventsStorage.store(storedEvents.current);
    setEvents((prev) => prev.filter((ev) => ev.id !== e.id));
    inProgressTrackers.current[e.id]?.stop();
    deleteUnSeenAndSeen(e.id);
  }, []);

  const clearEvents = useCallback(() => {
    storedEvents.current = {};
    seenEvents.current = {};
    unSeenEvents.current = {};
    eventsStorage.remove();
    seenEventsStorage.remove();
    unSeenEventsStorage.remove();
    setEvents([]);
    for (const tracker in inProgressTrackers.current) {
      inProgressTrackers.current[tracker]?.stop();
    }
    inProgressTrackers.current = {};
  }, []);

  const initalizeTracker = useCallback((eventTracker: EventTracker) => {
    if (eventTracker.status === 'in_progress') {
      inProgressTrackers.current[eventTracker.id] = new Scheduler.Schedule(
        async () => {
          const currentEvent = storedEvents.current[eventTracker.id];
          if (!currentEvent)
            return inProgressTrackers.current[eventTracker.id]?.stop();

          try {
            const checkStatusFn =
              props.statusCheckFnRegistry[currentEvent.statusCheckFnId];
            if (!checkStatusFn) {
              deleteEvent(eventTracker);
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
              storeEvent(update, true);
            }
          } catch (error) {
            console.error(error);
          }
          if (
            storedEvents.current[currentEvent.id]?.status === 'in_progress' &&
            currentEvent.maxTimeInProgress &&
            Date.now() - currentEvent.createdAt > currentEvent.maxTimeInProgress
          ) {
            inProgressTrackers.current[currentEvent.id]?.stop();
            currentEvent.status = 'failed';
            storeEvent(currentEvent, true);
            try {
              eventTracker.onMaxTimeInProgress?.(eventTracker);
            } catch (error) {
              console.error(error);
            }
            return;
          }
          if (currentEvent.expires && Date.now() > currentEvent.expires) {
            try {
              eventTracker.onExpire?.(eventTracker);
            } catch (error) {
              console.error(error);
            }
            return deleteEvent(eventTracker);
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
        deleteEvent(eventTracker);
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
      storeEvent(newEventTracker);
      initalizeTracker(newEventTracker);
    }, []);

  const removeEventTracker: EventTrackersContextValue['removeEventTracker'] =
    useCallback((id) => {
      if (storedEvents.current[id]) {
        deleteEvent(storedEvents.current[id]);
      }
    }, []);

  //prettier-ignore
  const value = useMemo(() => ({
    addEventTracker, removeEventTracker, clearEvents, deleteEvent, markEventsAsSeen: markUnSeenAsSeen 
  }), []);

  return (
    <TrackerEventsContext.Provider value={{ events, seen: seenEvents.current }}>
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
