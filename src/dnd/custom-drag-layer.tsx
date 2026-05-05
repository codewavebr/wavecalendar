"use client";

import { useDragLayer } from "react-dnd";

import type { ReactNode } from "react";
import type { IEvent } from "../scheduler-interfaces";

interface DragItem {
  event: IEvent;
  children: ReactNode;
  width: number;
  height: number;
}

export function CustomDragLayer() {
  const {
    isDragging,
    item,
    currentOffset,
    initialOffset,
    initialClientOffset,
  } = useDragLayer((monitor) => ({
    item: monitor.getItem() as DragItem | null,
    isDragging: monitor.isDragging(),
    currentOffset: monitor.getClientOffset(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    initialClientOffset: monitor.getInitialClientOffset(),
  }));

  if (
    !isDragging ||
    !item ||
    !currentOffset ||
    !initialOffset ||
    !initialClientOffset
  ) {
    return null;
  }

  const offsetX = initialClientOffset.x - initialOffset.x;
  const offsetY = initialClientOffset.y - initialOffset.y;

  return (
    <div
      style={{
        position: "fixed",
        pointerEvents: "none",
        zIndex: 100,
        left: currentOffset.x - offsetX,
        top: currentOffset.y - offsetY,
      }}
    >
      <div style={{ width: item.width, height: item.height }}>
        {item.children}
      </div>
    </div>
  );
}
