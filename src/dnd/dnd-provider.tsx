"use client";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { CustomDragLayer } from "./custom-drag-layer";

import type { ReactNode } from "react";

export function DndProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <DndProvider backend={HTML5Backend}>
      {children}
      <CustomDragLayer />
    </DndProvider>
  );
}
