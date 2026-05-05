import {
  areIntervalsOverlapping,
  format,
  parseISO,
} from "date-fns";
import { ptBR } from "date-fns/locale";

import { DroppableTimeBlock } from "../dnd";
import {
  getEventBlockStyle,
  getVisibleHours,
  groupEvents,
  isWorkingHour,
} from "../scheduler-helpers";
import { useCalendar } from "../scheduler-context";
import { useCalendarSlots } from "../scheduler-slots";
import { CalendarTimeline } from "./calendar-timeline";
import { DayViewMultiDayEventsRow } from "./day-view-multi-day-events-row";
import { EventBlock } from "./event-block";

import type { IEvent } from "../scheduler-interfaces";

export interface CalendarDayViewProps {
  singleDayEvents: IEvent[];
  multiDayEvents: IEvent[];
}

export function CalendarDayView({
  singleDayEvents,
  multiDayEvents,
}: CalendarDayViewProps) {
  const { selectedDate, visibleHours, workingHours, events } = useCalendar();
  const { renderAddEvent, renderDaySidebar } = useCalendarSlots();

  const { hours, earliestEventHour, latestEventHour } = getVisibleHours(
    visibleHours,
    singleDayEvents,
  );

  const dayEvents = singleDayEvents.filter((event) => {
    const eventDate = parseISO(event.startDate);
    return (
      eventDate.getDate() === selectedDate.getDate() &&
      eventDate.getMonth() === selectedDate.getMonth() &&
      eventDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  const groupedEvents = groupEvents(dayEvents);

  const renderAddEventTarget = (
    hour: number,
    minute: number,
    className: string,
  ) =>
    renderAddEvent(
      { startDate: selectedDate, startTime: { hour, minute } },
      <div className={className} />,
    );

  return (
    <div className="flex">
      <div className="flex flex-1 flex-col">
        <div>
          <DayViewMultiDayEventsRow
            selectedDate={selectedDate}
            multiDayEvents={multiDayEvents}
          />

          <div className="relative z-20 flex border-b">
            <div className="w-16"></div>
            <span className="flex-1 border-l py-2 text-center text-xs font-medium capitalize text-muted-foreground">
              {format(selectedDate, "EEE", { locale: ptBR }).slice(0, 3)}{" "}
              <span className="font-semibold text-foreground">
                {format(selectedDate, "d")}
              </span>
            </span>
          </div>
        </div>

        <div className="h-[800px] overflow-y-auto">
          <div className="flex">
            <div className="relative w-16">
              {hours.map((hour, index) => (
                <div key={hour} className="relative" style={{ height: "96px" }}>
                  <div className="absolute -top-3 right-2 flex h-6 items-center">
                    {index !== 0 && (
                      <span className="text-xs text-muted-foreground">
                        {format(new Date().setHours(hour, 0, 0, 0), "HH:mm", {
                          locale: ptBR,
                        })}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="relative flex-1 border-l">
              <div className="relative">
                {hours.map((hour, index) => {
                  const disabled = !isWorkingHour(
                    selectedDate,
                    hour,
                    workingHours,
                  );

                  return (
                    <div
                      key={hour}
                      className={[
                        "relative",
                        disabled && "bg-calendar-disabled-hour",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      style={{ height: "96px" }}
                    >
                      {index !== 0 && (
                        <div className="pointer-events-none absolute inset-x-0 top-0 border-b"></div>
                      )}

                      <DroppableTimeBlock date={selectedDate} hour={hour} minute={0}>
                        {renderAddEventTarget(
                          hour,
                          0,
                          "absolute inset-x-0 top-0 h-[24px] cursor-pointer transition-colors hover:bg-accent",
                        )}
                      </DroppableTimeBlock>

                      <DroppableTimeBlock date={selectedDate} hour={hour} minute={15}>
                        {renderAddEventTarget(
                          hour,
                          15,
                          "absolute inset-x-0 top-[24px] h-[24px] cursor-pointer transition-colors hover:bg-accent",
                        )}
                      </DroppableTimeBlock>

                      <div className="pointer-events-none absolute inset-x-0 top-1/2 border-b border-dashed"></div>

                      <DroppableTimeBlock date={selectedDate} hour={hour} minute={30}>
                        {renderAddEventTarget(
                          hour,
                          30,
                          "absolute inset-x-0 top-[48px] h-[24px] cursor-pointer transition-colors hover:bg-accent",
                        )}
                      </DroppableTimeBlock>

                      <DroppableTimeBlock date={selectedDate} hour={hour} minute={45}>
                        {renderAddEventTarget(
                          hour,
                          45,
                          "absolute inset-x-0 top-[72px] h-[24px] cursor-pointer transition-colors hover:bg-accent",
                        )}
                      </DroppableTimeBlock>
                    </div>
                  );
                })}

                {groupedEvents.map((group, groupIndex) =>
                  group.map((event) => {
                    let style = getEventBlockStyle(
                      event,
                      selectedDate,
                      groupIndex,
                      groupedEvents.length,
                      { from: earliestEventHour, to: latestEventHour },
                    );
                    const hasOverlap = groupedEvents.some(
                      (otherGroup, otherIndex) =>
                        otherIndex !== groupIndex &&
                        otherGroup.some((otherEvent) =>
                          areIntervalsOverlapping(
                            {
                              start: parseISO(event.startDate),
                              end: parseISO(event.endDate),
                            },
                            {
                              start: parseISO(otherEvent.startDate),
                              end: parseISO(otherEvent.endDate),
                            },
                          ),
                        ),
                    );

                    if (!hasOverlap) {
                      style = { ...style, width: "100%", left: "0%" };
                    }

                    return (
                      <div
                        key={event.id}
                        className="absolute p-1"
                        style={style}
                      >
                        <EventBlock event={event} />
                      </div>
                    );
                  }),
                )}
              </div>

              <CalendarTimeline
                firstVisibleHour={earliestEventHour}
                lastVisibleHour={latestEventHour}
              />
            </div>
          </div>
        </div>
      </div>

      {renderDaySidebar({ selectedDate, events })}
    </div>
  );
}
