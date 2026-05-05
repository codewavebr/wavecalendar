import { isToday, startOfDay } from "date-fns";
import { useMemo } from "react";

import { DroppableDayCell } from "../dnd";
import { getMonthCellEvents } from "../scheduler-helpers";
import { EventBullet } from "./event-bullet";
import { MonthEventBadge } from "./month-event-badge";

import type { ICalendarCell, IEvent } from "../scheduler-interfaces";

export interface DayCellProps {
  cell: ICalendarCell;
  events: IEvent[];
  eventPositions: Record<string, number>;
}

const MAX_VISIBLE_EVENTS = 3;

export function DayCell({ cell, events, eventPositions }: DayCellProps) {
  const { day, currentMonth, date } = cell;
  const cellEvents = useMemo(
    () => getMonthCellEvents(date, events, eventPositions),
    [date, events, eventPositions],
  );
  const isSunday = date.getDay() === 0;

  return (
    <DroppableDayCell cell={cell}>
      <div
        className={[
          "flex h-full flex-col gap-1 border-l border-t py-1.5 lg:py-2",
          isSunday && "border-l-0",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <span
          className={[
            "h-6 px-1 text-xs font-semibold lg:px-2",
            !currentMonth && "opacity-20",
            isToday(date) &&
              "flex w-6 translate-x-1 items-center justify-center rounded-full bg-primary px-0 font-bold text-primary-foreground",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {day}
        </span>

        <div
          className={[
            "flex h-6 gap-1 px-2 lg:h-[94px] lg:flex-col lg:gap-2 lg:px-0",
            !currentMonth && "opacity-50",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {[0, 1, 2].map((position) => {
            const event = cellEvents.find((item) => item.position === position);
            const eventKey = event
              ? `event-${event.id}-${position}`
              : `empty-${position}`;

            return (
              <div key={eventKey} className="lg:flex-1">
                {event && (
                  <>
                    <EventBullet className="lg:hidden" color={event.color} />
                    <MonthEventBadge
                      className="hidden lg:flex"
                      event={event}
                      cellDate={startOfDay(date)}
                    />
                  </>
                )}
              </div>
            );
          })}
        </div>

        {cellEvents.length > MAX_VISIBLE_EVENTS && (
          <p
            className={[
              "h-4.5 px-1.5 text-xs font-semibold text-muted-foreground",
              !currentMonth && "opacity-50",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <span className="sm:hidden">
              +{cellEvents.length - MAX_VISIBLE_EVENTS}
            </span>
            <span className="hidden sm:inline">
              {" "}
              {cellEvents.length - MAX_VISIBLE_EVENTS} mais...
            </span>
          </p>
        )}
      </div>
    </DroppableDayCell>
  );
}
