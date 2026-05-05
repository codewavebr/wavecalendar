import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { useMemo } from "react";

import { useCalendar } from "../scheduler-context";
import { YearViewDayCell } from "./year-view-day-cell";

import type { IEvent } from "../scheduler-interfaces";
import type { TCalendarView } from "../scheduler-types";

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

export interface YearViewMonthProps {
  month: Date;
  events: IEvent[];
  isWidget?: boolean;
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  onViewChange?: (view: TCalendarView) => void;
}

export function YearViewMonth({
  month,
  events,
  isWidget = false,
  selectedDate: propSelectedDate,
  onDateSelect,
  onViewChange,
}: YearViewMonthProps) {
  let calendarContext: ReturnType<typeof useCalendar> | null = null;

  try {
    calendarContext = useCalendar();
  } catch {
    calendarContext = null;
  }

  const selectedDate =
    propSelectedDate || calendarContext?.selectedDate || new Date();
  const setSelectedDate = onDateSelect || calendarContext?.setSelectedDate;
  const setView = onViewChange || calendarContext?.setView;
  const monthName = format(month, "MMMM", { locale: ptBR });

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(monthStart);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const days: Date[] = [];
    let day = calendarStart;
    while (day <= calendarEnd) {
      days.push(new Date(day));
      day = addDays(day, 1);
    }
    return days;
  }, [month]);

  const handleClick = () => {
    setSelectedDate?.(new Date(month.getFullYear(), month.getMonth(), 1));
    setView?.("month");
  };

  return (
    <div className="flex flex-col">
      {!isWidget && (
        <button
          type="button"
          onClick={handleClick}
          className="w-full rounded-t-2xl border bg-mainColor px-3 py-2 text-sm font-semibold text-white hover:bg-mainColor/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          {capitalize(monthName)}
        </button>
      )}

      <div
        className={[
          "flex-1 space-y-2",
          !isWidget && "flex-1 space-y-2 rounded-b-2xl border border-t-0 p-2",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="mb-2 grid grid-cols-7">
          {weekDays.map((day, index) => (
            <div key={index} className="text-center text-xs font-medium">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-x-5">
          {calendarDays.map((date, index) => {
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
                isCurrentMonth={isSameMonth(date, month)}
                selectedDate={selectedDate}
                onDateSelect={onDateSelect}
                onViewChange={onViewChange}
                isWidget={isWidget}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
