"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";

import type { IEvent } from "../scheduler-interfaces";

export const ItemTypes = {
  EVENT: "event",
};

export interface DraggableEventProps {
  event: IEvent;
  children: ReactNode;
}

export function DraggableEvent({ event, children }: DraggableEventProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: ItemTypes.EVENT,
    item: () => {
      const width = ref.current?.offsetWidth || 0;
      const height = ref.current?.offsetHeight || 0;
      return { event, children, width, height };
    },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }));

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  drag(ref);

  return (
    <div ref={ref} className={isDragging ? "opacity-40" : undefined}>
      {children}
    </div>
  );
}
