import {
  addDays,
  areIntervalsOverlapping,
  format,
  isSameDay,
  parseISO,
  startOfWeek,
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
import { EventBlock } from "./event-block";
import { WeekViewMultiDayEventsRow } from "./week-view-multi-day-events-row";

import type { IEvent } from "../scheduler-interfaces";

export interface CalendarWeekViewProps {
  singleDayEvents: IEvent[];
  multiDayEvents: IEvent[];
}

export function CalendarWeekView({
  singleDayEvents,
  multiDayEvents,
}: CalendarWeekViewProps) {
  const { selectedDate, workingHours, visibleHours } = useCalendar();
  const { renderAddEvent } = useCalendarSlots();
  const { hours, earliestEventHour, latestEventHour } = getVisibleHours(
    visibleHours,
    singleDayEvents,
  );

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, index) =>
    addDays(weekStart, index),
  );

  const renderAddEventTarget = (
    day: Date,
    hour: number,
    minute: number,
    className: string,
  ) =>
    renderAddEvent(
      { startDate: day, startTime: { hour, minute } },
      <div className={className} />,
    );

  return (
    <>
      <div className="flex flex-col items-center justify-center border-b py-4 text-sm text-muted-foreground sm:hidden">
        <p>Visualizacao semanal nao disponivel em dispositivos pequenos.</p>
        <p>Altere para a visualizacao diaria ou mensal.</p>
      </div>

      <div className="hidden flex-col sm:flex">
        <div>
          <WeekViewMultiDayEventsRow
            selectedDate={selectedDate}
            multiDayEvents={multiDayEvents}
          />

          <div className="relative z-20 flex border-b">
            <div className="w-16"></div>
            <div className="grid flex-1 grid-cols-7 divide-x border-l">
              {weekDays.map((day, index) => (
                <span
                  key={index}
                  className="py-2 text-center text-xs font-medium capitalize text-muted-foreground"
                >
                  {format(day, "EEE", { locale: ptBR }).slice(0, 3)}{" "}
                  <span className="ml-1 font-semibold text-foreground">
                    {format(day, "d")}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="h-[736px] overflow-y-auto">
          <div className="flex overflow-hidden">
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
              <div className="grid grid-cols-7 divide-x">
                {weekDays.map((day, dayIndex) => {
                  const dayEvents = singleDayEvents.filter(
                    (event) =>
                      isSameDay(parseISO(event.startDate), day) ||
                      isSameDay(parseISO(event.endDate), day),
                  );
                  const groupedEvents = groupEvents(dayEvents);

                  return (
                    <div key={dayIndex} className="relative">
                      {hours.map((hour, index) => {
                        const isDisabled = !isWorkingHour(
                          day,
                          hour,
                          workingHours,
                        );

                        return (
                          <div
                            key={hour}
                            className={[
                              "relative",
                              isDisabled && "bg-calendar-disabled-hour",
                            ]
                              .filter(Boolean)
                              .join(" ")}
                            style={{ height: "96px" }}
                          >
                            {index !== 0 && (
                              <div className="pointer-events-none absolute inset-x-0 top-0 border-b"></div>
                            )}

                            <DroppableTimeBlock date={day} hour={hour} minute={0}>
                              {renderAddEventTarget(
                                day,
                                hour,
                                0,
                                "absolute inset-x-0 top-0 h-[24px] cursor-pointer transition-colors hover:bg-accent",
                              )}
                            </DroppableTimeBlock>

                            <DroppableTimeBlock date={day} hour={hour} minute={15}>
                              {renderAddEventTarget(
                                day,
                                hour,
                                15,
                                "absolute inset-x-0 top-[24px] h-[24px] cursor-pointer transition-colors hover:bg-accent",
                              )}
                            </DroppableTimeBlock>

                            <div className="pointer-events-none absolute inset-x-0 top-1/2 border-b border-dashed"></div>

                            <DroppableTimeBlock date={day} hour={hour} minute={30}>
                              {renderAddEventTarget(
                                day,
                                hour,
                                30,
                                "absolute inset-x-0 top-[48px] h-[24px] cursor-pointer transition-colors hover:bg-accent",
                              )}
                            </DroppableTimeBlock>

                            <DroppableTimeBlock date={day} hour={hour} minute={45}>
                              {renderAddEventTarget(
                                day,
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
                            day,
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
                  );
                })}
              </div>

              <CalendarTimeline
                firstVisibleHour={earliestEventHour}
                lastVisibleHour={latestEventHour}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
