"use client";

import { differenceInMilliseconds, parseISO } from "date-fns";
import { useDrop } from "react-dnd";

import { useCalendarActions } from "../scheduler-actions";
import { ItemTypes } from "./draggable-event";

import type { ReactNode } from "react";
import type { IEvent } from "../scheduler-interfaces";

export interface DroppableTimeBlockProps {
  date: Date;
  hour: number;
  minute: number;
  children: ReactNode;
}

export function DroppableTimeBlock({
  date,
  hour,
  minute,
  children,
}: DroppableTimeBlockProps) {
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

        const newStartDate = new Date(date);
        newStartDate.setHours(hour, minute, 0, 0);

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
    [date, hour, minute, updateEvent],
  );

  return (
    <div
      ref={drop as unknown as React.RefObject<HTMLDivElement>}
      className={`h-[24px]${isOver && canDrop ? " bg-accent/50" : ""}`}
    >
      {children}
    </div>
  );
}
