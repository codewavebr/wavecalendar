import { format, isSameDay, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";

import { useCalendar } from "../scheduler-context";

import type { IEvent } from "../scheduler-interfaces";
import type { TCalendarView } from "../scheduler-types";

const eventColorClasses = {
  blue: "bg-blue-400",
  green: "bg-green-400",
  red: "bg-red-400",
  yellow: "bg-yellow-400",
  purple: "bg-purple-400",
  orange: "bg-orange-400",
  gray: "bg-neutral-400",
};

export interface YearViewDayCellProps {
  day: number;
  date: Date;
  events: IEvent[];
  isCurrentMonth?: boolean;
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  onViewChange?: (view: TCalendarView) => void;
  isWidget?: boolean;
}

export function YearViewDayCell({
  day,
  date,
  events,
  isCurrentMonth = true,
  selectedDate: propSelectedDate,
  onDateSelect,
  onViewChange,
  isWidget = false,
}: YearViewDayCellProps) {
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
  const maxIndicators = 3;
  const eventCount = events.length;
  const selected = isSameDay(date, selectedDate);

  const handleClick = () => {
    setSelectedDate?.(date);
    if (setView && !isWidget) setView("day");
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      className={[
        "flex cursor-pointer flex-col items-center p-1",
        !isCurrentMonth && "text-gray-400",
      ]
        .filter(Boolean)
        .join(" ")}
      title={format(date, "EEEE, dd 'de' MMMM yyyy", { locale: ptBR })}
    >
      <div
        className={[
          "relative flex h-8 w-8 items-center justify-center rounded-xl text-[9px] font-medium",
          selected && "bg-primary text-white",
          isToday(date) && !selected && "border-2 border-primary",
          !selected && !isToday(date) && "text-foreground",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {day}
      </div>

      {eventCount > 0 && (
        <div className="z-10 mt-[-4px] flex gap-0.5">
          {eventCount <= maxIndicators ? (
            events.map((event) => (
              <div
                key={event.id}
                className={[
                  "size-1.5 rounded-full ring-2 ring-card",
                  eventColorClasses[event.color],
                ].join(" ")}
              />
            ))
          ) : (
            <>
              <div
                className={[
                  "size-1.5 rounded-full ring-2 ring-card",
                  eventColorClasses[events[0].color],
                ].join(" ")}
              />
              <span className="mt-[-2px] rounded-full bg-card p-0.5 text-[6px]">
                +{eventCount - 1}
              </span>
            </>
          )}
        </div>
      )}
    </button>
  );
}
