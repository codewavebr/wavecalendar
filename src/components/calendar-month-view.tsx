import { useMemo } from "react";

import { useCalendar } from "../scheduler-context";
import {
  calculateMonthEventPositions,
  getCalendarCells,
} from "../scheduler-helpers";
import { DayCell } from "./day-cell";

import type { IEvent } from "../scheduler-interfaces";

export interface CalendarMonthViewProps {
  singleDayEvents: IEvent[];
  multiDayEvents: IEvent[];
}

const WEEK_DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

export function CalendarMonthView({
  singleDayEvents,
  multiDayEvents,
}: CalendarMonthViewProps) {
  const { selectedDate } = useCalendar();
  const allEvents = [...multiDayEvents, ...singleDayEvents];
  const cells = useMemo(() => getCalendarCells(selectedDate), [selectedDate]);

  const eventPositions = useMemo(
    () =>
      calculateMonthEventPositions(
        multiDayEvents,
        singleDayEvents,
        selectedDate,
      ),
    [multiDayEvents, singleDayEvents, selectedDate],
  );

  return (
    <div>
      <div className="grid grid-cols-7 divide-x">
        {WEEK_DAYS.map((day) => (
          <div key={day} className="flex items-center justify-center py-2">
            <span className="text-xs font-medium text-muted-foreground">
              {day}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 overflow-hidden">
        {cells.map((cell) => (
          <DayCell
            key={cell.date.toISOString()}
            cell={cell}
            events={allEvents}
            eventPositions={eventPositions}
          />
        ))}
      </div>
    </div>
  );
}
