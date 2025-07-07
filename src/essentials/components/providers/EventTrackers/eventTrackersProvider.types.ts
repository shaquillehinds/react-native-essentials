import type { ReactNode } from 'react';

export type EvenStatus = 'in_progress' | 'done' | 'failed' | 'cancelled';
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
  statusCheckFn: (props: EventTracker) => Promise<EventTracker>;
} & EventData;
export type EventTrackersRecord = Record<string, EventTracker>;
export interface TrackerEventsContextValue {
  events: EventTracker[];
}
export interface EventTrackersContextValue {
  addEventTracker: (
    event: Omit<EventTracker, 'updatedAt' | 'createdAt'>
  ) => void;
  removeEventTracker: (eventId: string) => void;
}
export type EventTrackersProviderProps = {
  children: ReactNode;
  maxStoredEventTrackers?: number;
  defaultMaxInProgressTime?: number;
  defaultStatusCheckInterval?: number;
};
