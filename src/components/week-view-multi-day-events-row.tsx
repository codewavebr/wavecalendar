import {
  addDays,
  differenceInDays,
  endOfWeek,
  isAfter,
  isBefore,
  parseISO,
  startOfDay,
  startOfWeek,
} from "date-fns";
import { useMemo } from "react";

import { MonthEventBadge } from "./month-event-badge";

import type { IEvent } from "../scheduler-interfaces";

export interface WeekViewMultiDayEventsRowProps {
  selectedDate: Date;
  multiDayEvents: IEvent[];
}

export function WeekViewMultiDayEventsRow({
  selectedDate,
  multiDayEvents,
}: WeekViewMultiDayEventsRowProps) {
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, index) =>
    addDays(weekStart, index),
  );

  const processedEvents = useMemo(() => {
    return multiDayEvents
      .map((event) => {
        const start = parseISO(event.startDate);
        const end = parseISO(event.endDate);
        const adjustedStart = isBefore(start, weekStart) ? weekStart : start;
        const adjustedEnd = isAfter(end, weekEnd) ? weekEnd : end;
        const startIndex = differenceInDays(adjustedStart, weekStart);
        const endIndex = differenceInDays(adjustedEnd, weekStart);

        return {
          ...event,
          adjustedStart,
          adjustedEnd,
          startIndex,
          endIndex,
        };
      })
      .sort((a, b) => {
        const startDiff = a.adjustedStart.getTime() - b.adjustedStart.getTime();
        if (startDiff !== 0) return startDiff;
        return b.endIndex - b.startIndex - (a.endIndex - a.startIndex);
      });
  }, [multiDayEvents, weekStart, weekEnd]);

  const eventRows = useMemo(() => {
    const rows: (typeof processedEvents)[] = [];

    processedEvents.forEach((event) => {
      let rowIndex = rows.findIndex((row) =>
        row.every(
          (item) =>
            item.endIndex < event.startIndex ||
            item.startIndex > event.endIndex,
        ),
      );

      if (rowIndex === -1) {
        rowIndex = rows.length;
        rows.push([]);
      }

      rows[rowIndex].push(event);
    });

    return rows;
  }, [processedEvents]);

  const hasEventsInWeek = useMemo(() => {
    return multiDayEvents.some((event) => {
      const start = parseISO(event.startDate);
      const end = parseISO(event.endDate);

      return (
        (start >= weekStart && start <= weekEnd) ||
        (end >= weekStart && end <= weekEnd) ||
        (start <= weekStart && end >= weekEnd)
      );
    });
  }, [multiDayEvents, weekStart, weekEnd]);

  if (!hasEventsInWeek) return null;

  return (
    <div className="hidden overflow-hidden sm:flex">
      <div className="w-16 border-b"></div>
      <div className="grid flex-1 grid-cols-7 divide-x border-b border-l">
        {weekDays.map((day, dayIndex) => (
          <div
            key={day.toISOString()}
            className="flex h-full flex-col gap-1 py-1"
          >
            {eventRows.map((row, rowIndex) => {
              const event = row.find(
                (item) =>
                  item.startIndex <= dayIndex && item.endIndex >= dayIndex,
              );

              if (!event) {
                return (
                  <div key={`${rowIndex}-${dayIndex}`} className="h-6.5" />
                );
              }

              let position: "first" | "middle" | "last" | "none" = "none";

              if (
                dayIndex === event.startIndex &&
                dayIndex === event.endIndex
              ) {
                position = "none";
              } else if (dayIndex === event.startIndex) {
                position = "first";
              } else if (dayIndex === event.endIndex) {
                position = "last";
              } else {
                position = "middle";
              }

              return (
                <MonthEventBadge
                  key={`${event.id}-${dayIndex}`}
                  event={event}
                  cellDate={startOfDay(day)}
                  position={position}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
