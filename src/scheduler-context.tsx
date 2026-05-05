"use client";

import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

import type { IEvent, IUser } from "./scheduler-interfaces";
import type {
  TBadgeVariant,
  TCalendarView,
  TVisibleHours,
  TWorkingHours,
} from "./scheduler-types";

export interface ICalendarContext {
  selectedDate: Date;
  setSelectedDate: (date: Date | undefined) => void;
  selectedUserId: IUser["id"] | "all";
  setSelectedUserId: (userId: IUser["id"] | "all") => void;
  badgeVariant: TBadgeVariant;
  setBadgeVariant: (variant: TBadgeVariant) => void;
  users: IUser[];
  workingHours: TWorkingHours;
  setWorkingHours: Dispatch<SetStateAction<TWorkingHours>>;
  visibleHours: TVisibleHours;
  setVisibleHours: Dispatch<SetStateAction<TVisibleHours>>;
  events: IEvent[];
  setLocalEvents: Dispatch<SetStateAction<IEvent[]>>;
  view: TCalendarView;
  setView: (view: TCalendarView) => void;
}

const CalendarContext = createContext({} as ICalendarContext);

export const DEFAULT_WORKING_HOURS: TWorkingHours = {
  0: { from: 0, to: 0 },
  1: { from: 8, to: 17 },
  2: { from: 8, to: 17 },
  3: { from: 8, to: 17 },
  4: { from: 8, to: 17 },
  5: { from: 8, to: 17 },
  6: { from: 8, to: 12 },
};

export const DEFAULT_VISIBLE_HOURS: TVisibleHours = { from: 7, to: 22 };

export function CalendarProvider({
  children,
  users,
  events,
  initialView = "day",
  initialSelectedDate = new Date(),
  initialBadgeVariant = "mixed",
  initialWorkingHours = DEFAULT_WORKING_HOURS,
  initialVisibleHours = DEFAULT_VISIBLE_HOURS,
}: {
  children: ReactNode;
  users: IUser[];
  events: IEvent[];
  initialView?: TCalendarView;
  initialSelectedDate?: Date;
  initialBadgeVariant?: TBadgeVariant;
  initialWorkingHours?: TWorkingHours;
  initialVisibleHours?: TVisibleHours;
}) {
  const [badgeVariant, setBadgeVariant] =
    useState<TBadgeVariant>(initialBadgeVariant);
  const [visibleHours, setVisibleHours] =
    useState<TVisibleHours>(initialVisibleHours);
  const [workingHours, setWorkingHours] =
    useState<TWorkingHours>(initialWorkingHours);
  const [selectedDate, setSelectedDate] = useState(initialSelectedDate);
  const [selectedUserId, setSelectedUserId] = useState<IUser["id"] | "all">(
    "all",
  );
  const [view, setView] = useState<TCalendarView>(initialView);
  const [localEvents, setLocalEvents] = useState<IEvent[]>(events);

  const handleSelectDate = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
  };

  return (
    <CalendarContext.Provider
      value={{
        selectedDate,
        setSelectedDate: handleSelectDate,
        selectedUserId,
        setSelectedUserId,
        badgeVariant,
        setBadgeVariant,
        users,
        visibleHours,
        setVisibleHours,
        workingHours,
        setWorkingHours,
        events: localEvents,
        setLocalEvents,
        view,
        setView,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar(): ICalendarContext {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error("useCalendar must be used within a CalendarProvider.");
  }
  return context;
}
