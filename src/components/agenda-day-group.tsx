import { differenceInDays, format, parseISO, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";

import { AgendaEventCard } from "./agenda-event-card";

import type { IEvent } from "../scheduler-interfaces";

const capitalizeLongWords = (value: string) =>
  value
    .split(" ")
    .map((word) =>
      word.length > 2 ? word.charAt(0).toUpperCase() + word.slice(1) : word,
    )
    .join(" ");

export interface AgendaDayGroupProps {
  date: Date;
  events: IEvent[];
  multiDayEvents: IEvent[];
}

export function AgendaDayGroup({
  date,
  events,
  multiDayEvents,
}: AgendaDayGroupProps) {
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
  );

  return (
    <div className="space-y-4">
      <div className="sticky top-0 flex items-center gap-4 bg-card py-2">
        <p className="text-sm font-semibold">
          {capitalizeLongWords(
            format(date, "EEEE, d 'de' MMMM", { locale: ptBR }),
          )}
        </p>
      </div>

      <div className="space-y-2">
        {multiDayEvents.map((event) => {
          const eventStart = startOfDay(parseISO(event.startDate));
          const eventEnd = startOfDay(parseISO(event.endDate));
          const currentDate = startOfDay(date);
          const eventTotalDays = differenceInDays(eventEnd, eventStart) + 1;
          const eventCurrentDay = differenceInDays(currentDate, eventStart) + 1;

          return (
            <AgendaEventCard
              key={event.id}
              event={event}
              eventCurrentDay={eventCurrentDay}
              eventTotalDays={eventTotalDays}
            />
          );
        })}

        {sortedEvents.map((event) => (
          <AgendaEventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
