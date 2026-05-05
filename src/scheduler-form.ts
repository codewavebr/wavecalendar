import type { TEventColor } from "./scheduler-types";
import type { IEvent, IUser } from "./scheduler-interfaces";

export interface WaveCalendarTimeValue {
  hour: number;
  minute: number;
}

export interface WaveCalendarEventFormValues {
  user: string;
  title: string;
  description: string;
  startDate: Date;
  startTime: WaveCalendarTimeValue;
  endDate: Date;
  endTime: WaveCalendarTimeValue;
  color: TEventColor;
}

export const WAVE_CALENDAR_EVENT_COLORS: TEventColor[] = [
  "blue",
  "green",
  "red",
  "yellow",
  "purple",
  "orange",
  "gray",
];

export const WAVE_CALENDAR_EVENT_COLOR_OPTIONS: Array<{
  value: TEventColor;
  label: string;
  className: string;
}> = [
  { value: "blue", label: "Azul", className: "bg-blue-400" },
  { value: "green", label: "Verde", className: "bg-green-400" },
  { value: "red", label: "Vermelho", className: "bg-red-400" },
  { value: "yellow", label: "Amarelo", className: "bg-yellow-400" },
  { value: "purple", label: "Roxo", className: "bg-purple-400" },
  { value: "orange", label: "Laranja", className: "bg-orange-400" },
  { value: "gray", label: "Cinza", className: "bg-neutral-400" },
];

export function createDefaultEventFormValues({
  startDate,
  startTime,
}: {
  startDate?: Date;
  startTime?: WaveCalendarTimeValue;
} = {}): Partial<WaveCalendarEventFormValues> {
  return {
    user: "",
    title: "",
    description: "",
    startDate,
    startTime,
    endDate: startDate,
    endTime: startTime,
    color: "blue",
  };
}

export function eventToFormValues(event: IEvent): WaveCalendarEventFormValues {
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);

  return {
    user: event.user.id,
    title: event.title,
    description: event.description,
    startDate,
    startTime: {
      hour: startDate.getHours(),
      minute: startDate.getMinutes(),
    },
    endDate,
    endTime: {
      hour: endDate.getHours(),
      minute: endDate.getMinutes(),
    },
    color: event.color,
  };
}

export function formValuesToEvent(
  values: WaveCalendarEventFormValues,
  event: IEvent,
  user: IUser,
): IEvent {
  const startDate = new Date(values.startDate);
  startDate.setHours(values.startTime.hour, values.startTime.minute, 0, 0);

  const endDate = new Date(values.endDate);
  endDate.setHours(values.endTime.hour, values.endTime.minute, 0, 0);

  return {
    ...event,
    user,
    title: values.title,
    color: values.color,
    description: values.description,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  };
}
