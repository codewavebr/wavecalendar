"use client";

import { createContext, useContext, type ReactNode } from "react";

import type { IEvent } from "./scheduler-interfaces";

export interface WaveCalendarAddEventSlotProps {
  startDate?: Date;
  startTime?: { hour: number; minute: number };
}

export interface WaveCalendarDaySidebarSlotProps {
  selectedDate: Date;
  events: IEvent[];
}

export interface WaveCalendarSlots {
  renderAddEvent?: (
    props: WaveCalendarAddEventSlotProps,
    trigger: ReactNode,
  ) => ReactNode;
  renderDaySidebar?: (props: WaveCalendarDaySidebarSlotProps) => ReactNode;
  renderEventDetails?: (event: IEvent, trigger: ReactNode) => ReactNode;
}

const CalendarSlotsContext = createContext<WaveCalendarSlots>({});

export function CalendarSlotsProvider({
  slots,
  children,
}: {
  slots?: WaveCalendarSlots;
  children: ReactNode;
}) {
  return (
    <CalendarSlotsContext.Provider value={slots ?? {}}>
      {children}
    </CalendarSlotsContext.Provider>
  );
}

export function useCalendarSlots() {
  const slots = useContext(CalendarSlotsContext);

  return {
    renderAddEvent:
      slots.renderAddEvent ??
      ((_props: WaveCalendarAddEventSlotProps, trigger: ReactNode) => trigger),
    renderDaySidebar:
      slots.renderDaySidebar ??
      ((_props: WaveCalendarDaySidebarSlotProps) => null),
    renderEventDetails:
      slots.renderEventDetails ??
      ((_event: IEvent, trigger: ReactNode) => trigger),
  };
}
