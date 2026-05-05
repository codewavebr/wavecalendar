import { addMonths, startOfYear } from "date-fns";
import { useMemo } from "react";

import { useCalendar } from "../scheduler-context";
import { YearViewMonth } from "./year-view-month";

import type { IEvent } from "../scheduler-interfaces";

export interface CalendarYearViewProps {
  allEvents: IEvent[];
}

export function CalendarYearView({ allEvents }: CalendarYearViewProps) {
  const { selectedDate } = useCalendar();

  const months = useMemo(() => {
    const yearStart = startOfYear(selectedDate);
    return Array.from({ length: 12 }, (_, index) => addMonths(yearStart, index));
  }, [selectedDate]);

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {months.map((month) => (
          <YearViewMonth
            key={month.toString()}
            month={month}
            events={allEvents}
          />
        ))}
      </div>
    </div>
  );
}
