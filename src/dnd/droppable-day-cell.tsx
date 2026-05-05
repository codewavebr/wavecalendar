"use client";

import { differenceInMilliseconds, parseISO } from "date-fns";
import { useDrop } from "react-dnd";

import { useCalendarActions } from "../scheduler-actions";
import { ItemTypes } from "./draggable-event";

import type { ReactNode } from "react";
import type { ICalendarCell, IEvent } from "../scheduler-interfaces";

export interface DroppableDayCellProps {
  cell: ICalendarCell;
  children: ReactNode;
}

export function DroppableDayCell({ cell, children }: DroppableDayCellProps) {
  const { updateEvent } = useCalendarActions();

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: ItemTypes.EVENT,
      drop: (item: { event: IEvent }) => {
        const eventStartDate = parseISO(item.event.startDate);
        const eventEndDate = parseISO(item.event.endDate);
        const eventDurationMs = differenceInMilliseconds(
          eventEndDate,
          eventStartDate,
        );

        const newStartDate = new Date(cell.date);
        newStartDate.setHours(
          eventStartDate.getHours(),
          eventStartDate.getMinutes(),
          eventStartDate.getSeconds(),
          eventStartDate.getMilliseconds(),
        );

        updateEvent({
          ...item.event,
          startDate: newStartDate.toISOString(),
          endDate: new Date(newStartDate.getTime() + eventDurationMs).toISOString(),
        });

        return { moved: true };
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [cell.date, updateEvent],
  );

  return (
    <div
      ref={drop as unknown as React.RefObject<HTMLDivElement>}
      className={isOver && canDrop ? "bg-accent/50" : undefined}
    >
      {children}
    </div>
  );
}
