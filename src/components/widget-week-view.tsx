"use client";

import {
  addDays,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfWeek,
} from "date-fns";

import { YearViewDayCell } from "./year-view-day-cell";

import type { IEvent } from "../scheduler-interfaces";
import type { TCalendarView } from "../scheduler-types";

export interface WidgetWeekViewProps {
  currentDate: Date;
  events: IEvent[];
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  onViewChange?: (view: TCalendarView) => void;
}

export function WidgetWeekView({
  currentDate,
  events,
  selectedDate,
  onDateSelect,
  onViewChange,
}: WidgetWeekViewProps) {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
  const days = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));

  return (
    <div className="flex flex-col">
      <div className="mb-2 grid grid-cols-7">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-xs font-medium">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((date, index) => {
          const dayEvents = events.filter(
            (event) =>
              isSameDay(parseISO(event.startDate), date) ||
              isSameDay(parseISO(event.endDate), date),
          );

          return (
            <YearViewDayCell
              key={`day-${index}`}
              day={date.getDate()}
              date={date}
              events={dayEvents}
              isCurrentMonth={isSameMonth(date, currentDate)}
              selectedDate={selectedDate}
              onDateSelect={onDateSelect}
              onViewChange={onViewChange}
              isWidget={true}
            />
          );
        })}
      </div>
    </div>
  );
}
