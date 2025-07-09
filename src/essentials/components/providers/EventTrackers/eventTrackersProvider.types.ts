import type { ReactNode } from 'react';

export type EvenStatus = 'in_progress' | 'done' | 'failed' | 'cancelled';
export type StatusCheckFn = (props: EventTracker) => Promise<EventTracker>;
export type EventData = {
  id: string;
  name: string;
  status: EvenStatus;
  description: string;
  createdAt: number;
  updatedAt: number;
  extraData?: any;
  image?: string;
  extra?: any;
  type?: string;
  url?: string;
  expires?: number;
  statusCheckInterval?: number;
  maxTimeInProgress?: number;
};
export type EventTracker = {
  statusCheckFnId: string;
} & EventData;
export type EventTrackersRecord = Record<string, EventTracker>;
export interface TrackerEventsContextValue {
  events: EventTracker[];
  markEventsAsSeen: () => void;
  seen: SeenEventsRecord;
}
export interface EventTrackersContextValue {
  addEventTracker: (
    event: Omit<EventTracker, 'updatedAt' | 'createdAt'>
  ) => void;
  removeEventTracker: (eventId: string) => void;
}
export type EventTrackersProviderProps = {
  children: ReactNode;
  statusCheckFnRegistry: Record<string, StatusCheckFn>;
  maxStoredEventTrackers?: number;
  defaultMaxInProgressTime?: number;
  defaultStatusCheckInterval?: number;
};

export type SeenEventsRecord = Record<string, boolean>;
export type UnSeenEventsRecord = Record<string, boolean>;
