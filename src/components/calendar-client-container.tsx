"use client";

import { useMemo } from "react";

import { DndProviderWrapper } from "../dnd";
import {
  filterCalendarEvents,
  splitSingleAndMultiDayEvents,
} from "../scheduler-helpers";
import { useCalendar } from "../scheduler-context";
import { CalendarAgendaView } from "./calendar-agenda-view";
import { CalendarDayView } from "./calendar-day-view";
import { CalendarHeader } from "./calendar-header";
import { CalendarMonthView } from "./calendar-month-view";
import { CalendarWeekView } from "./calendar-week-view";
import { CalendarYearView } from "./calendar-year-view";

export function CalendarClientContainer() {
  const { selectedDate, selectedUserId, events, view } = useCalendar();

  const filteredEvents = useMemo(
    () =>
      filterCalendarEvents({
        events,
        selectedDate,
        selectedUserId,
        view,
      }),
    [events, selectedDate, selectedUserId, view],
  );

  const { singleDayEvents, multiDayEvents } =
    splitSingleAndMultiDayEvents(filteredEvents);

  const eventStartDates = useMemo(
    () =>
      filteredEvents.map((event) => ({
        ...event,
        endDate: event.startDate,
      })),
    [filteredEvents],
  );

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <CalendarHeader events={filteredEvents} />

      <DndProviderWrapper>
        {view === "day" && (
          <CalendarDayView
            singleDayEvents={singleDayEvents}
            multiDayEvents={multiDayEvents}
          />
        )}
        {view === "month" && (
          <CalendarMonthView
            singleDayEvents={singleDayEvents}
            multiDayEvents={multiDayEvents}
          />
        )}
        {view === "week" && (
          <CalendarWeekView
            singleDayEvents={singleDayEvents}
            multiDayEvents={multiDayEvents}
          />
        )}
        {view === "year" && <CalendarYearView allEvents={eventStartDates} />}
        {view === "agenda" && (
          <CalendarAgendaView
            singleDayEvents={singleDayEvents}
            multiDayEvents={multiDayEvents}
          />
        )}
      </DndProviderWrapper>
    </div>
  );
}
