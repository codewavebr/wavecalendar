import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo } from "react";

import {
  getEventsCount,
  navigateDate,
  rangeText,
} from "../scheduler-helpers";
import { useCalendar } from "../scheduler-context";

import type { IEvent } from "../scheduler-interfaces";

const capitalizeLongWords = (value: string) =>
  value
    .split(" ")
    .map((word) =>
      word.length > 2 ? word.charAt(0).toUpperCase() + word.slice(1) : word,
    )
    .join(" ");

export interface DateNavigatorProps {
  events: IEvent[];
}

export function DateNavigator({ events }: DateNavigatorProps) {
  const { selectedDate, setSelectedDate, view } = useCalendar();
  const month = format(selectedDate, "MMMM", { locale: ptBR });
  const year = selectedDate.getFullYear();
  const eventCount = useMemo(
    () => getEventsCount(events, selectedDate, view),
    [events, selectedDate, view],
  );

  const range = useMemo(() => {
    const [start, end] = rangeText(view, selectedDate).split(" - ");
    const parseDate = (value: string) => {
      const date = new Date(value);
      return Number.isNaN(date.getTime())
        ? value
        : capitalizeLongWords(
            format(date, "dd 'de' MMM',' yyyy", { locale: ptBR }),
          );
    };
    return end ? `${parseDate(start)} - ${parseDate(end)}` : parseDate(start);
  }, [selectedDate, view]);

  return (
    <div className="space-y-0.5">
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold capitalize">
          {month} {year}
        </span>
        <span className="inline-flex items-center rounded-md border px-1.5 py-0.5 text-xs font-semibold">
          {eventCount} evento{eventCount === 1 ? "" : "s"}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="inline-flex size-6.5 items-center justify-center rounded-md border bg-background hover:bg-accent [&_svg]:size-4.5"
          onClick={() => setSelectedDate(navigateDate(selectedDate, view, "previous"))}
          title="Anterior"
          type="button"
        >
          <ChevronLeft />
        </button>

        <p className="text-sm text-muted-foreground">{range}</p>

        <button
          className="inline-flex size-6.5 items-center justify-center rounded-md border bg-background hover:bg-accent [&_svg]:size-4.5"
          onClick={() => setSelectedDate(navigateDate(selectedDate, view, "next"))}
          title="Proximo"
          type="button"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
}
