"use client";

import { createContext, useCallback, useContext, type ReactNode } from "react";

import { useCalendar } from "./scheduler-context";
import type { IEvent } from "./scheduler-interfaces";
import type { WaveCalendarEventFormValues } from "./scheduler-form";

export type WaveCalendarCreateEvent = (
  values: WaveCalendarEventFormValues,
) => unknown | Promise<unknown>;
export type WaveCalendarUpdateEvent = (event: IEvent) => void | Promise<void>;
export type WaveCalendarDeleteEvent = (
  event: IEvent,
) => boolean | void | Promise<boolean | void>;

export interface WaveCalendarActions {
  createEvent?: WaveCalendarCreateEvent;
  updateEvent?: WaveCalendarUpdateEvent;
  deleteEvent?: WaveCalendarDeleteEvent;
}

const CalendarActionsContext = createContext<WaveCalendarActions | null>(null);

export function CalendarActionsProvider({
  actions,
  children,
}: {
  actions?: WaveCalendarActions;
  children: ReactNode;
}) {
  return (
    <CalendarActionsContext.Provider value={actions ?? {}}>
      {children}
    </CalendarActionsContext.Provider>
  );
}

export function useCalendarActions(): Required<WaveCalendarActions> {
  const injectedActions = useContext(CalendarActionsContext);
  const { setLocalEvents } = useCalendar();

  const updateLocalEvent = useCallback<WaveCalendarUpdateEvent>(
    (event) => {
      const nextEvent = {
        ...event,
        startDate: new Date(event.startDate).toISOString(),
        endDate: new Date(event.endDate).toISOString(),
      };

      setLocalEvents((previousEvents) => {
        const eventIndex = previousEvents.findIndex((item) => item.id === event.id);
        if (eventIndex === -1) return previousEvents;
        return [
          ...previousEvents.slice(0, eventIndex),
          nextEvent,
          ...previousEvents.slice(eventIndex + 1),
        ];
      });
    },
    [setLocalEvents],
  );

  const deleteLocalEvent = useCallback<WaveCalendarDeleteEvent>(
    (event) => {
      setLocalEvents((previousEvents) =>
        previousEvents.filter((item) => item.id !== event.id),
      );
      return true;
    },
    [setLocalEvents],
  );

  const createLocalEvent = useCallback<WaveCalendarCreateEvent>(() => {
    throw new Error(
      "createEvent was not provided. Pass actions.createEvent to WaveCalendarProvider.",
    );
  }, []);

  return {
    createEvent: injectedActions?.createEvent ?? createLocalEvent,
    updateEvent: injectedActions?.updateEvent ?? updateLocalEvent,
    deleteEvent: injectedActions?.deleteEvent ?? deleteLocalEvent,
  };
}
