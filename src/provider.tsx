"use client";

import { CalendarActionsProvider, type WaveCalendarActions } from "./actions";
import { CalendarProvider } from "./scheduler-context";
import { CalendarSlotsProvider, type WaveCalendarSlots } from "./slots";

import type { ReactNode } from "react";
import type { IEvent, IUser } from "./scheduler-interfaces";
import type {
  TBadgeVariant,
  TCalendarView,
  TVisibleHours,
  TWorkingHours,
} from "./scheduler-types";

export interface WaveCalendarProviderProps {
  children: ReactNode;
  users: IUser[];
  events: IEvent[];
  actions?: WaveCalendarActions;
  slots?: WaveCalendarSlots;
  initialView?: TCalendarView;
  initialSelectedDate?: Date;
  initialBadgeVariant?: TBadgeVariant;
  initialWorkingHours?: TWorkingHours;
  initialVisibleHours?: TVisibleHours;
}

export function WaveCalendarProvider({
  children,
  actions,
  slots,
  users,
  events,
  initialView,
  initialSelectedDate,
  initialBadgeVariant,
  initialWorkingHours,
  initialVisibleHours,
}: WaveCalendarProviderProps) {
  return (
    <CalendarProvider
      users={users}
      events={events}
      initialView={initialView}
      initialSelectedDate={initialSelectedDate}
      initialBadgeVariant={initialBadgeVariant}
      initialWorkingHours={initialWorkingHours}
      initialVisibleHours={initialVisibleHours}
    >
      <CalendarActionsProvider actions={actions}>
        <CalendarSlotsProvider slots={slots}>{children}</CalendarSlotsProvider>
      </CalendarActionsProvider>
    </CalendarProvider>
  );
}
