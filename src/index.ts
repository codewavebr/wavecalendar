export * from "./scheduler-actions";
export * from "./adapter";
export * from "./components";
export * from "./scheduler-context";
export * from "./scheduler-form";
export * from "./scheduler-schema";
export * from "./scheduler-slots";
export * from "./dnd";
export * from "./scheduler-helpers";
export * from "./scheduler-interfaces";
export * from "./scheduler-mutations";
export * from "./provider";
export * from "./scheduler-types";

export type WaveCalendarEvent = {
  id: string | number;
  title: string;
  startDate: string;
  endDate: string;
  color?: string;
  description?: string;
  user?: unknown;
  metadata?: Record<string, unknown>;
};
